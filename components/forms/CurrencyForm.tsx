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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";
import { Banknote, Loader2 } from "lucide-react";

const currencySchema = z.object({
  code: z.string().min(3, "ISO code must be 3 characters").max(3).toUpperCase(),
  name: z.string().min(2, "Name is required"),
  symbol: z.string().optional(),
});

interface CurrencyFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function CurrencyForm({ initialData, onSuccess }: CurrencyFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof currencySchema>>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      symbol: initialData?.symbol || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof currencySchema>) => {
      if (isEditing) {
        const response = await apiClient.put(
          `${API_ENDPOINTS.CURRENCIES}${initialData.id}/`,
          values,
        );
        return response.data;
      } else {
        const response = await apiClient.post(API_ENDPOINTS.CURRENCIES, values);
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? "Currency updated" : "Currency created");
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Something went wrong");
    },
  });

  function onSubmit(values: z.infer<typeof currencySchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">
                    ISO Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="USD"
                      {...field}
                      className="rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">
                    Currency Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="US Dollar"
                      {...field}
                      className="rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-slate-700">
                Symbol (Optional)
              </FormLabel>
              <FormControl>
                <Input placeholder="$" {...field} className="rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-xl font-black shadow-lg shadow-primary/25 h-12"
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Banknote className="mr-2 h-5 w-5" />
          )}
          {isEditing ? "UPDATE CURRENCY" : "CREATE CURRENCY"}
        </Button>
      </form>
    </Form>
  );
}
