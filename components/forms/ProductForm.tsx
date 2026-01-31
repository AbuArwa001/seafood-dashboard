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
import { Package, Loader2, Plus } from "lucide-react";
import { CategoryForm } from "./CategoryForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().uuid("Please select a category"),
  unit: z.string().uuid("Please select a unit of measure"),
  description: z.string().optional(),
});

interface ProductFormProps {
  onSuccess?: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
      return response.data.results || response.data;
    },
  });

  const { data: units } = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.UNITS);
      return response.data.results || response.data;
    },
  });

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      unit: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof productSchema>) => {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS, values);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to add product");
    },
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-slate-700">
                Product Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Red Snapper"
                  {...field}
                  className="rounded-xl border-slate-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-slate-700">
                    Category
                  </FormLabel>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
                      <div className="bg-emerald-600 p-6 text-white">
                        <DialogTitle className="text-2xl font-black flex items-center">
                          <Plus className="mr-3 h-6 w-6" /> Add Category
                        </DialogTitle>
                        <p className="text-emerald-50 text-sm font-bold mt-1 uppercase tracking-widest">
                          New product classification
                        </p>
                      </div>
                      <div className="p-8">
                        <CategoryForm />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
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
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    {units?.map((unit: any) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.code}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-slate-700">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional product details..."
                  {...field}
                  className="rounded-xl border-slate-200 min-h-[100px]"
                />
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
            <Package className="mr-2 h-5 w-5" />
          )}
          ADD TO INVENTORY
        </Button>
      </form>
    </Form>
  );
}
