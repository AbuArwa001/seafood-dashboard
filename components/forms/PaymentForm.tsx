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
import { CreditCard, Loader2 } from "lucide-react";

const paymentSchema = z.object({
  sale: z.string().uuid("Please select a sale"),
  currency: z.string().uuid("Please select a currency"),
  buyer_name: z.string().min(2, "Buyer name is required"),
  amount_paid: z.string().min(1, "Amount is required"),
  expected_payment_date: z.string().min(1, "Expected date is required"),
  actual_payment_date: z.string().optional(),
});

interface PaymentFormProps {
  onSuccess?: () => void;
}

export function PaymentForm({ onSuccess }: PaymentFormProps) {
  const queryClient = useQueryClient();

  const { data: sales } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SALES, {
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

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      sale: "",
      currency: "",
      buyer_name: "",
      amount_paid: "",
      expected_payment_date: new Date().toISOString().split("T")[0],
      actual_payment_date: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof paymentSchema>) => {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS, {
        ...values,
        amount_paid: parseFloat(values.amount_paid),
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Payment recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMessage = "Failed to record payment";

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

  function onSubmit(values: z.infer<typeof paymentSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sale"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Target Sale
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                    <SelectValue placeholder="Select a sale transaction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  {sales?.map((sale: any) => (
                    <SelectItem
                      key={sale.id}
                      value={sale.id}
                      className="rounded-xl mt-1"
                    >
                      Sale {sale.id.slice(0, 8)} - {sale.total_sale_amount}{" "}
                      {sale.currency?.code}
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
          name="buyer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Buyer Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Global Seafoods Ltd"
                  {...field}
                  className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount_paid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Amount Paid
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

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Currency
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expected_payment_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Expected Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actual_payment_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Actual Date (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <CreditCard className="mr-2 h-5 w-5" />
          )}
          {mutation.isPending ? "RECORDING..." : "RECORD PAYMENT"}
        </Button>
      </form>
    </Form>
  );
}
