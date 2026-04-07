"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";
import { ResetPasswordVisual } from "./_components/ResetPasswordVisual";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <img src="/logo.png" alt="SeaFood" className="h-12 w-auto object-contain mb-8" />
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
              Set new password
            </h1>
            <p className="text-slate-500 font-medium">
              Your new password must be different from previous ones.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a365d] border-t-transparent" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>

          <footer className="mt-24 text-slate-400 text-sm">
            <p>&copy; 2026 SeaFood Logistics. All rights reserved.</p>
          </footer>
        </motion.div>
      </div>

      <ResetPasswordVisual />
    </div>
  );
}
