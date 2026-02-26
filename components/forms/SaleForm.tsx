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
import { Activity, Loader2 } from "lucide-react";

const saleSchema = z.object({
  shipment: z.string().uuid("Please select a shipment"),
  currency: z.string().uuid("Please select a currency"),
  kg_sold: z.string().min(1, "Total KG is required"),
  quantity_sold: z.string().min(1, "Quantity is required"),
  selling_price: z.string().min(1, "Price is required"),
});

interface SaleFormProps {
  onSuccess?: () => void;
}

export function SaleForm({ onSuccess }: SaleFormProps) {
  const queryClient = useQueryClient();

  const { data: shipments } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS);
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

  const form = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      shipment: "",
      currency: "",
      kg_sold: "",
      quantity_sold: "",
      selling_price: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof saleSchema>) => {
      // Note: Backend handles exchange rates and total calculations in .save()
      const response = await apiClient.post(API_ENDPOINTS.SALES, values);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Sale recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMessage = "Failed to record sale";

      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          // Flatten nested DRF errors: { "shipment": ["error..."] }
          errorMessage = Object.entries(errorData)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
            .join(" | ");
        }
      }

      toast.error(errorMessage);
    },
  });

  function onSubmit(values: z.infer<typeof saleSchema>) {
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
              <FormLabel className="font-bold text-slate-700">
                Associated Shipment
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Select shipment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  {shipments?.map((shp: any) => (
                    <SelectItem key={shp.id} value={shp.id}>
                      Shipment {shp.id.substring(0, 8).toUpperCase()} - {shp.country_origin} ({shp.status})
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
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">
                  Currency
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    {currencies?.map((curr: any) => (
                      <SelectItem key={curr.id} value={curr.id}>
                        {curr.code}
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
            name="selling_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">
                  Unit Price
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    className="rounded-xl border-slate-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="kg_sold"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">
                  Total KG
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    className="rounded-xl border-slate-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity_sold"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">
                  Pcs/Ctns
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder="0"
                    {...field}
                    className="rounded-xl border-slate-200"
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
          className="w-full rounded-xl font-black shadow-lg shadow-secondary/25 h-12 bg-secondary hover:bg-secondary/90"
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Activity className="mr-2 h-5 w-5" />
          )}
          RECORD TRANSACTION
        </Button>
      </form>
    </Form>
  );
}
