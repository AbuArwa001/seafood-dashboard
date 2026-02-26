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
import { Loader2, Percent, Check } from "lucide-react";

const marginSchema = z.object({
    from_currency: z.string().uuid("Please select a base currency"),
    to_currency: z.string().uuid("Please select a target currency"),
    margin_percentage: z.number().min(0, "Margin must be at least 0"),
    is_active: z.boolean().default(true),
});

interface MarginFormProps {
    onSuccess?: () => void;
    initialData?: any;
}

export function MarginForm({ onSuccess, initialData }: MarginFormProps) {
    const queryClient = useQueryClient();

    const { data: currencies } = useQuery({
        queryKey: ["currencies"],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.CURRENCIES, {
                params: { page_size: 100 },
            });
            return response.data.results || response.data;
        },
    });

    const form = useForm<z.infer<typeof marginSchema>>({
        resolver: zodResolver(marginSchema),
        defaultValues: {
            from_currency: initialData?.from_currency || "",
            to_currency: initialData?.to_currency || "",
            margin_percentage: initialData ? parseFloat(initialData.margin_percentage) : 2.0,
            is_active: initialData ? initialData.is_active : true,
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof marginSchema>) => {
            if (initialData?.id) {
                const response = await apiClient.put(`${API_ENDPOINTS.MARGINS}${initialData.id}/`, values);
                return response.data;
            } else {
                const response = await apiClient.post(API_ENDPOINTS.MARGINS, values);
                return response.data;
            }
        },
        onSuccess: () => {
            toast.success(initialData ? "Margin updated" : "Margin configured successfully");
            queryClient.invalidateQueries({ queryKey: ["currency-margins"] });
            form.reset();
            onSuccess?.();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.detail || "Failed to save margin configuration";
            toast.error(errorMessage);
        },
    });

    function onSubmit(values: z.infer<typeof marginSchema>) {
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialData}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue placeholder="Select base" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-xl">
                                        {currencies?.map((currency: any) => (
                                            <SelectItem key={currency.id} value={currency.id}>
                                                {currency.code} ({currency.name})
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialData}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue placeholder="Select target" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-xl">
                                        {currencies?.map((currency: any) => (
                                            <SelectItem key={currency.id} value={currency.id}>
                                                {currency.code} ({currency.name})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="margin_percentage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-slate-700">Margin Percentage (%)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g. 2.50"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        className="rounded-xl h-12 pr-10"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Percent className="h-4 w-4" />
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 bg-slate-50 rounded-2xl cursor-pointer"
                            onClick={() => field.onChange(!field.value)}
                        >
                            <FormControl>
                                <div className={`h-5 w-5 rounded flex items-center justify-center border-2 transition-colors ${field.value ? 'bg-primary border-primary' : 'bg-white border-slate-300'}`}>
                                    {field.value && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={field.value}
                                        onChange={() => field.onChange(!field.value)}
                                    />
                                </div>
                            </FormControl>
                            <div className="space-y-1 leading-none select-none">
                                <FormLabel className="font-bold text-slate-700 cursor-pointer">Active</FormLabel>
                                <p className="text-xs text-slate-500 font-medium">
                                    Apply this margin to all future conversions for this pair.
                                </p>
                            </div>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full rounded-2xl font-black bg-primary h-14 shadow-xl transition-all active:scale-[0.98]"
                >
                    {mutation.isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Check className="mr-2 h-5 w-5" />
                    )}
                    {initialData ? "UPDATE CONFIGURATION" : "SAVE CONFIGURATION"}
                </Button>
            </form>
        </Form>
    );
}
