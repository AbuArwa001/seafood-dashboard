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
import { Ship, Loader2 } from "lucide-react";

const shipmentSchema = z.object({
  country_origin: z.string().min(2, "Country of origin is required"),
  currency: z.string().uuid("Please select a currency"),
  status: z.enum(["CREATED", "IN_TRANSIT", "RECEIVED", "COMPLETED"]),
});

interface ShipmentFormProps {
  onSuccess?: () => void;
}

export function ShipmentForm({ onSuccess }: ShipmentFormProps) {
  const queryClient = useQueryClient();

  const { data: currencies } = useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CURRENCIES);
      return response.data.results || response.data;
    },
  });

  const form = useForm<z.infer<typeof shipmentSchema>>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      country_origin: "",
      currency: "",
      status: "CREATED",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof shipmentSchema>) => {
      // Backend requires 'items' field even if empty
      const payload = { ...values, items: [] };
      const response = await apiClient.post(API_ENDPOINTS.SHIPMENTS, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Shipment registered successfully");
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMessage = "Failed to register shipment";

      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          // Flatten nested DRF errors: { "items": ["This field is required."] }
          errorMessage = Object.entries(errorData)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
            .join(" | ");
        }
      }

      toast.error(errorMessage);
    },
  });

  function onSubmit(values: z.infer<typeof shipmentSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="country_origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-slate-700">
                Country of Origin
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Kenya, Oman, UAE"
                  {...field}
                  className="rounded-xl border-slate-200 focus:border-primary"
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
              <FormLabel className="font-bold text-slate-700">
                Currency
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  {currencies?.map((currency: any) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.code} ({currency.symbol})
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-slate-700">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  <SelectItem value="CREATED">Created</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="RECEIVED">Received</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
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
            <Ship className="mr-2 h-5 w-5" />
          )}
          REGISTER CARGO
        </Button>
      </form>
    </Form>
  );
}
