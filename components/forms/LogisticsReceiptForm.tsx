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
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";
import { Truck, Loader2 } from "lucide-react";

const logisticsSchema = z.object({
  shipment: z.string().uuid("Please select a shipment"),
  net_received_kg: z.string().min(1, "Net weight is required"),
  transport_loss_kg: z.string().min(1, "Transport loss is required"),
  freezing_loss_kg: z.string().min(1, "Freezing loss is required"),
  facility_location: z.string().min(2, "Facility location is required"),
  notes: z.string().optional(),
});

interface LogisticsReceiptFormProps {
  onSuccess?: () => void;
}

export function LogisticsReceiptForm({ onSuccess }: LogisticsReceiptFormProps) {
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

  const form = useForm<z.infer<typeof logisticsSchema>>({
    resolver: zodResolver(logisticsSchema),
    defaultValues: {
      shipment: "",
      net_received_kg: "",
      transport_loss_kg: "0",
      freezing_loss_kg: "0",
      facility_location: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof logisticsSchema>) => {
      const response = await apiClient.post(API_ENDPOINTS.LOGISTICS, {
        ...values,
        net_received_kg: parseFloat(values.net_received_kg),
        transport_loss_kg: parseFloat(values.transport_loss_kg),
        freezing_loss_kg: parseFloat(values.freezing_loss_kg),
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Logistics receipt recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["logistics"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMessage = "Failed to record receipt";

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

  function onSubmit(values: z.infer<typeof logisticsSchema>) {
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
                Shipment Reference
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
                      {shipment.shipment_number} - {shipment.origin}
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
          name="facility_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Facility Location
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Freezer 04 - Nairobi"
                  {...field}
                  className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="net_received_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Net KG
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
            name="transport_loss_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Loss (T)
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
            name="freezing_loss_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Loss (F)
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

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Internal Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any discrepancies or quality notes..."
                  {...field}
                  className="min-h-[100px] rounded-xl border-slate-100 bg-slate-50/50 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-600/20 transition-all active:scale-[0.98]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Truck className="mr-2 h-5 w-5" />
          )}
          {mutation.isPending ? "RECORDING..." : "RECORD RECEIPT"}
        </Button>
      </form>
    </Form>
  );
}
