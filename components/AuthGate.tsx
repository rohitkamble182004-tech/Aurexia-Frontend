"use client";

import { useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

type AuthGateProps = {
  children?: ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();

  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("auth-dismissed") === "1";
  });

  const shouldShowAuth = !loading && !user && !dismissed;

  return (
    <>
      {/* ✅ Render children ONLY if provided */}
      {children}

      {/* ✅ Global auth modal controller */}
      <AuthModal
        isOpen={shouldShowAuth}
        mandatory={false}
        onClose={() => {
          sessionStorage.setItem("auth-dismissed", "1");
          setDismissed(true);
        }}
      />
    </>
  );
}
