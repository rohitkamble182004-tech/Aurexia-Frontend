"use client";

import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";

type Mode = "soft" | "hard" | null;

export default function AuthModalController() {
  const [mode, setMode] = useState<Mode>(null);

  /* -------------------------
     HARD AUTH (checkout)
  -------------------------- */
  useEffect(() => {
    const openHard = () => setMode("hard");
    window.addEventListener(
      "open-auth-modal",
      openHard
    );
    return () =>
      window.removeEventListener(
        "open-auth-modal",
        openHard
      );
  }, []);

  /* -------------------------
     SOFT AUTH (homepage)
  -------------------------- */
  useEffect(() => {
    const openSoft = () => setMode("soft");
    window.addEventListener(
      "open-soft-auth-modal",
      openSoft
    );
    return () =>
      window.removeEventListener(
        "open-soft-auth-modal",
        openSoft
      );
  }, []);

  /* -------------------------
     CLOSE ON AUTH SUCCESS
  -------------------------- */
  useEffect(() => {
    const close = () => setMode(null);
    window.addEventListener("auth-success", close);
    return () =>
      window.removeEventListener(
        "auth-success",
        close
      );
  }, []);

  if (!mode) return null;

  return (
    <AuthModal
      isOpen
      mandatory={mode === "hard"}
      onClose={() => {
        if (mode === "soft") {
          sessionStorage.setItem(
            "soft-auth-dismissed",
            "1"
          );
        }
        setMode(null);
      }}
    />
  );
}
