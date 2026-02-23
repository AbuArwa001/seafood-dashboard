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
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";
import { Users, Loader2, Save } from "lucide-react";

const userSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  // Allow empty string when editing (means "don't change password")
  // Require ≥6 chars only when a value is actually provided
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
  role_id: z.string().uuid("Please select a role"),
  location: z.string().min(2, "Location is required"),
  is_active: z.boolean(),
});

interface UserFormProps {
  onSuccess?: () => void;
  user?: any;
}

export function UserForm({ onSuccess, user }: UserFormProps) {
  const queryClient = useQueryClient();

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ROLES);
      return response.data.results || response.data;
    },
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
      password: "",
      role_id: user?.role?.id || "",
      location: user?.location || "Headquarters",
      is_active: user?.is_active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof userSchema>) => {
      const payload = { ...values };
      if (user && !payload.password) {
        delete payload.password;
      }

      if (user) {
        const response = await apiClient.put(`${API_ENDPOINTS.USERS}${user.id}/`, payload);
        return response.data;
      } else {
        const response = await apiClient.post(API_ENDPOINTS.USERS, payload);
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(user ? "User updated successfully" : "User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMessage = "Failed to save user";

      if (errorData) {
        errorMessage = Object.entries(errorData)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join(" | ");
      }

      toast.error(errorMessage);
    },
  });

  function onSubmit(values: z.infer<typeof userSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="rounded-xl border-slate-200" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} className="rounded-xl border-slate-200" disabled={!!user} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!user && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Initial Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} className="rounded-xl border-slate-200" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">System Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    {roles?.map((role: any) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.role_name}
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Operational Location</FormLabel>
                <FormControl>
                  <Input placeholder="Headquarters" {...field} className="rounded-xl border-slate-200" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50/30">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-bold text-slate-900">Active Status</FormLabel>
                <p className="text-xs text-slate-500 font-medium">Allow this user to sign in to the platform.</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
            <Save className="mr-2 h-5 w-5" />
          )}
          {user ? "UPDATE ACCOUNT" : "CREATE ACCOUNT"}
        </Button>
      </form>
    </Form>
  );
}
