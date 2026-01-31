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
import { Layers, Loader2 } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
});

interface CategoryFormProps {
  onSuccess?: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof categorySchema>) => {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES, values);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to create category");
    },
  });

  function onSubmit(values: z.infer<typeof categorySchema>) {
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
                Category Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Shellfish, Pelagic Fish"
                  {...field}
                  className="rounded-xl border-slate-200"
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
            <Layers className="mr-2 h-5 w-5" />
          )}
          CREATE CATEGORY
        </Button>
      </form>
    </Form>
  );
}
