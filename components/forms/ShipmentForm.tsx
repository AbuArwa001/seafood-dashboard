"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
  items: z.array(z.object({
    product: z.string().uuid("Product is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price_at_shipping: z.number().min(0, "Price must be positive"),
  })).min(1, "At least one item is required"),
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

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS);
      return response.data.results || response.data;
    },
  });

  const form = useForm<z.infer<typeof shipmentSchema>>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      country_origin: "",
      currency: "",
      status: "CREATED",
      items: [{ product: "", quantity: 1, price_at_shipping: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof shipmentSchema>) => {
      const response = await apiClient.post(API_ENDPOINTS.SHIPMENTS, values);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="rounded-xl border-slate-200 focus:border-primary h-12 shadow-sm"
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
                    <SelectTrigger className="rounded-xl border-slate-200 h-12 shadow-sm">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl shadow-2xl border-none p-2">
                    {currencies?.map((currency: any) => (
                      <SelectItem
                        key={currency.id}
                        value={currency.id}
                        className="rounded-lg py-3 focus:bg-slate-50"
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Package className="h-4 w-4" /> Cargo Items
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ product: "", quantity: 1, price_at_shipping: 0 })}
              className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-bold gap-2"
            >
              <Plus className="h-4 w-4" /> ADD ITEM
            </Button>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4 relative group hover:border-slate-200 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6">
                    <FormField
                      control={form.control}
                      name={`items.${index}.product`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-slate-200 bg-white shadow-sm">
                                <SelectValue placeholder="Select Product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl shadow-2xl border-none p-2">
                              {products?.map((product: any) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id}
                                  className="rounded-lg py-3 focus:bg-slate-50 font-semibold"
                                >
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Qty"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="rounded-xl border-slate-200 bg-white shadow-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.price_at_shipping`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Price"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="rounded-xl border-slate-200 bg-white shadow-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white border border-slate-100 shadow-sm text-red-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {form.formState.errors.items?.message && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.items.message}</p>
          )}
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-slate-700">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl border-slate-200 h-12 shadow-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl shadow-2xl border-none p-2">
                  <SelectItem value="CREATED" className="rounded-lg py-3 focus:bg-slate-50">Created</SelectItem>
                  <SelectItem value="IN_TRANSIT" className="rounded-lg py-3 focus:bg-slate-50">In Transit</SelectItem>
                  <SelectItem value="RECEIVED" className="rounded-lg py-3 focus:bg-slate-50">Received</SelectItem>
                  <SelectItem value="COMPLETED" className="rounded-lg py-3 focus:bg-slate-50">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-2xl font-black bg-[#1a365d] hover:bg-[#2c5282] shadow-xl shadow-[#1a365d]/20 h-14 transition-all active:scale-[0.98]"
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
