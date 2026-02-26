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
import { Receipt, Loader2 } from "lucide-react";

const costCategories = [
  "Transport",
  "Freezing",
  "Cold Storage",
  "Packing Materials",
  "Labor",
  "Commissions",
  "Export Fees",
  "Fuel",
  "Accommodation",
  "Meals",
  "Miscellaneous",
];

const costSchema = z.object({
  shipment: z.string().uuid("Please select a shipment"),
  currency: z.string().uuid("Please select a currency"),
  cost_category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  other_category: z.string().optional(),
});

interface CostFormProps {
  onSuccess?: () => void;
}

export function CostForm({ onSuccess }: CostFormProps) {
  const queryClient = useQueryClient();

  const { data: shipments } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS, {
        params: { page_size: 100 },
      });
      return response.data.results || response.data;
    },
  });

  const { data: currencies } = useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CURRENCIES);
      return response.data.results || response.data;
    },
  });

  const form = useForm<z.infer<typeof costSchema>>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      shipment: "",
      currency: "",
      cost_category: "",
      amount: "",
      other_category: "",
    },
  });

  const selectedCategory = form.watch("cost_category");

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof costSchema>) => {
      const response = await apiClient.post(API_ENDPOINTS.COSTS, {
        ...values,
        amount: parseFloat(values.amount),
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cost record added successfully");
      queryClient.invalidateQueries({ queryKey: ["costs"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMessage = "Failed to add cost record";

      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          errorMessage = Object.entries(errorData)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
            .join(" | ");
        }
      }

      toast.error(errorMessage);
    },
  });

  function onSubmit(values: z.infer<typeof costSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="shipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Target Shipment
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                    <SelectValue placeholder="Select a shipment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  {shipments?.map((shipment: any) => (
                    <SelectItem
                      key={shipment.id}
                      value={shipment.id}
                      className="rounded-xl mt-1"
                    >
                      Shipment {shipment.id.substring(0, 8).toUpperCase()} - {shipment.country_origin} (
                      {shipment.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cost_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Category
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {costCategories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="rounded-xl mt-1"
                      >
                        {category}
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Amount
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedCategory === "Miscellaneous" && (
          <FormField
            control={form.control}
            name="other_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Specify Category
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter cost description"
                    {...field}
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Currency
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  {currencies?.map((currency: any) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id}
                      className="rounded-xl mt-1"
                    >
                      {currency.code} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Receipt className="mr-2 h-5 w-5" />
          )}
          {mutation.isPending ? "ADDING..." : "ADD COST RECORD"}
        </Button>
      </form>
    </Form>
  );
}
