"use client";

import { useLoginLogic } from "./_hooks/useLoginLogic";
import { LoginForm } from "./_components/LoginForm";
import { LoginVisuals } from "./_components/LoginVisuals";

export default function LoginPage() {
  const logic = useLoginLogic();

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      <LoginForm
        email={logic.email} setEmail={logic.setEmail}
        password={logic.password} setPassword={logic.setPassword}
        showPassword={logic.showPassword} setShowPassword={logic.setShowPassword}
        isLoading={logic.isLoading} handleLogin={logic.handleLogin}
      />
      <LoginVisuals />
    </div>
  );
}
