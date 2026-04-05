"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function HomeClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  const showLoginPopup = !user && !dismissed;

  return (
    <>
    {/* LOGIN POPUP OVERLAY */}
      <AuthModal
        isOpen={showLoginPopup}
        onClose={() => setDismissed(true)}
      />  

      {/* HOMEPAGE CONTENT (UNCHANGED) */}
      {children}
    </>
  );
}
