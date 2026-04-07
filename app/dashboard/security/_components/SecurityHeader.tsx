import { motion } from "framer-motion";

interface SecurityHeaderProps {
  itemVariants: any;
}

export function SecurityHeader({ itemVariants }: SecurityHeaderProps) {
  return (
    <motion.header variants={itemVariants} className="flex flex-col gap-2">
      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
        Security &amp; <span className="text-indigo-600 italic">Access</span>
      </h2>
      <p className="text-slate-500 font-semibold mt-1 text-lg">
        Your account credentials and{" "}
        <span className="text-indigo-500 font-black underline decoration-indigo-400/20 decoration-4 underline-offset-4">
          role permissions
        </span>
        .
      </p>
    </motion.header>
  );
}
