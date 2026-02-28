"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";
import { RefreshCw, Loader2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const exchangeRateSchema = z.object({
    from_currency: z.string().uuid("Please select a base currency"),
    to_currency: z.string().uuid("Please select a target currency"),
    rate: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Rate must be a positive number",
    }),
    rate_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

interface ExchangeRateFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

export function ExchangeRateForm({ initialData, onSuccess }: ExchangeRateFormProps) {
    const queryClient = useQueryClient();
    const isEditing = !!initialData;

    const { data: currenciesData } = useQuery({
        queryKey: ["currencies", "all"],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.CURRENCIES, {
                params: { page_size: 100 },
            });
            return response.data.results || response.data;
        },
    });

    const currencies = Array.isArray(currenciesData) ? currenciesData : [];

    const form = useForm<z.infer<typeof exchangeRateSchema>>({
        resolver: zodResolver(exchangeRateSchema),
        defaultValues: {
            from_currency: typeof initialData?.from_currency === 'object' ? initialData.from_currency.id : initialData?.from_currency || "",
            to_currency: typeof initialData?.to_currency === 'object' ? initialData.to_currency.id : initialData?.to_currency || "",
            rate: initialData?.rate?.toString() || "",
            rate_date: initialData?.rate_date || format(new Date(), "yyyy-MM-dd"),
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof exchangeRateSchema>) => {
            if (isEditing) {
                const response = await apiClient.put(
                    `${API_ENDPOINTS.EXCHANGE_RATES}${initialData.id}/`,
                    values,
                );
                return response.data;
            } else {
                const response = await apiClient.post(API_ENDPOINTS.EXCHANGE_RATES, values);
                return response.data;
            }
        },
        onSuccess: () => {
            toast.success(isEditing ? "Exchange rate updated" : "Exchange rate recorded");
            queryClient.invalidateQueries({ queryKey: ["exchange-rates"] });
            queryClient.invalidateQueries({ queryKey: ["exchange-rate"] });
            form.reset();
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Something went wrong. Check for duplicate dates.");
        },
    });

    function onSubmit(values: z.infer<typeof exchangeRateSchema>) {
        if (values.from_currency === values.to_currency) {
            toast.error("Source and target currencies must be different");
            return;
        }
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="from_currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-slate-700">Base Currency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue placeholder="Select base" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-xl">
                                        {currencies.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.code} - {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="to_currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-slate-700">Target Currency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue placeholder="Select target" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-xl">
                                        {currencies.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.code} - {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-slate-700">Exchange Rate</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="0.000001"
                                            placeholder="1.000000"
                                            {...field}
                                            className="rounded-xl h-12 pr-12"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">
                                            VALUE
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rate_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-slate-700">Effective Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        className="rounded-xl h-12"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full rounded-2xl font-black shadow-xl shadow-primary/20 h-14 text-lg"
                >
                    {mutation.isPending ? (
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    ) : (
                        <RefreshCw className="mr-2 h-6 w-6" />
                    )}
                    {isEditing ? "UPDATE EXCHANGE RATE" : "SAVE EXCHANGE RATE"}
                </Button>
            </form>
        </Form>
    );
}
