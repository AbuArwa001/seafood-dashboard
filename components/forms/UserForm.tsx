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
import { UserPlus, Loader2 } from "lucide-react";

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Full name is required"),
  location: z.string().min(2, "Location is required"),
  role: z.string().uuid("Please select a role"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface UserFormProps {
  onSuccess?: () => void;
}

export function UserForm({ onSuccess }: UserFormProps) {
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
      email: "",
      full_name: "",
      location: "",
      role: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof userSchema>) => {
      const response = await apiClient.post(API_ENDPOINTS.USERS, values);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User provisioned successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to provision user");
    },
  });

  function onSubmit(values: z.infer<typeof userSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="john@example.com"
                  type="email"
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nairobi"
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                  System Role
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {roles?.map((role: any) => (
                      <SelectItem
                        key={role.id}
                        value={role.id}
                        className="rounded-xl mt-1"
                      >
                        {role.role_name}
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-5 w-5" />
          )}
          {mutation.isPending ? "PROVISIONING..." : "PROVISION USER"}
        </Button>
      </form>
    </Form>
  );
}
