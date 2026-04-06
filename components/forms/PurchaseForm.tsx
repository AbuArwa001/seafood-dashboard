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
import { ShoppingCart, Loader2 } from "lucide-react";

const purchaseSchema = z.object({
  shipment: z.string().uuid("Please select a shipment"),
  currency: z.string().uuid("Please select a currency"),
  kg_purchased: z.string().min(1, "Quantity is required"),
  image_urls: z.any().optional(),
});

interface PurchaseFormProps {
  onSuccess?: () => void;
}

export function PurchaseForm({ onSuccess }: PurchaseFormProps) {
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

  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      shipment: "",
      currency: "",
      kg_purchased: "",
      image_urls: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof purchaseSchema>) => {
      const formData = new FormData();
      formData.append("shipment", values.shipment);
      formData.append("currency", values.currency);
      formData.append("kg_purchased", values.kg_purchased);
      if (values.image_urls) {
        // If it's a FileList or array of files, append each one
        const files = Array.from(values.image_urls as Iterable<File>);
        files.forEach((file) => {
          formData.append("image_files", file);
        });
      }

      const response = await apiClient.post(API_ENDPOINTS.PURCHASES, formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Purchase recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMessage = "Failed to record purchase";

      if (errorData) {
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          errorMessage = Object.entries(errorData)
            .map(
              ([field, msgs]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`,
            )
            .join(" | ");
        }
      }

      toast.error(errorMessage);
    },
  });

  function onSubmit(values: z.infer<typeof purchaseSchema>) {
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
                  <SelectTrigger className="h-12 rounded-lg border-slate-100 bg-slate-50/50">
                    <SelectValue placeholder="Select a shipment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  {shipments?.map((shipment: any) => (
                    <SelectItem
                      key={shipment.id}
                      value={shipment.id}
                      className="rounded-lg mt-1"
                    >
                      Shipment {shipment.id.substring(0, 8).toUpperCase()} -{" "}
                      {shipment.country_origin} ({shipment.status})
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
            name="kg_purchased"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Quantity (KG)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    className="h-12 rounded-lg border-slate-100 bg-slate-50/50"
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
                    <SelectTrigger className="h-12 rounded-lg border-slate-100 bg-slate-50/50">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {currencies?.map((currency: any) => (
                      <SelectItem
                        key={currency.id}
                        value={currency.id}
                        className="rounded-lg mt-1"
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

        <FormField
          control={form.control}
          name="image_urls"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Receipt Images (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  {...fieldProps}
                  onChange={(event) => onChange(event.target.files)}
                  className="h-12 rounded-lg border-slate-100 bg-slate-50/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-14 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-5 w-5" />
          )}
          {mutation.isPending ? "RECORDING..." : "NEW PURCHASE"}
        </Button>
      </form>
    </Form>
  );
}
