"use client";

import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function AdminAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  // ⛔ Block render until auth resolved
  if (loading) return null;

  // 🔐 Not logged in or not admin → force login modal
  if (!user || user.role !== "admin") {
    return (
      <AuthModal
        isOpen={true}
        mandatory={true}
      />
    );
  }

  // ✅ Admin allowed
  return <>{children}</>;
}
