import { motion } from "framer-motion";

export function ResetPasswordVisual() {
  return (
    <div className="hidden lg:flex flex-1 relative bg-[#1a365d] flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-20 text-center px-12"
      >
        <img
          src="/logo01.png" alt="SeaFood Logo"
          className="h-32 w-auto object-contain mx-auto mb-10 filter drop-shadow-2xl"
        />
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Account Security, <br />
          <span className="text-blue-300">Reinforced.</span>
        </h2>
        <p className="text-blue-100 text-lg font-medium max-w-md mx-auto opacity-80">
          We use industry-standard encryption to ensure your new password is
          kept safe and private.
        </p>
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -right-24 w-96 h-96 border-[40px] border-white/5 rounded-full z-10"
      />
    </div>
  );
}
