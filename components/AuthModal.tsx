"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  isOpen: boolean;
  mandatory?: boolean;
  onClose?: () => void;
};

export default function AuthModal({
  isOpen,
  mandatory,
  onClose,
}: Props) {
  const {
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    resendVerificationEmail,
    emailVerified,
    loading,
    user,
  } = useAuth();

  const [mode, setMode] =
    useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  /* ---------------------------------
     ✅ Close modal ONLY when verified
  ---------------------------------- */
  
 useEffect(() => {
   if (emailVerified && isOpen) {
     onClose?.();
   }
 }, [emailVerified, isOpen, onClose]);


  /* ---------------------------------
     Submit
  ---------------------------------- */
  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setInfo(null);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, confirmPassword);
        setInfo(
          "Verification email sent. Please check your inbox."
        );
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
  };

  /* ---------------------------------
     Forgot password
  ---------------------------------- */
  const handleForgotPassword = async () => {
    setError(null);
    setInfo(null);

    if (!email) {
      setError("Please enter your email first");
      return;
    }

    try {
      await forgotPassword(email);
      setInfo(
        "Password reset email sent. Please check your inbox."
      );
    } catch {
      setError("Failed to send reset email");
    }
  };

  const isSubmitDisabled =
    loading ||
    !email ||
    !password ||
    (mode === "register" &&
      password !== confirmPassword);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md rounded-xl p-6 relative"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
          >
            {/* Close */}
            {!mandatory && mode === "login" && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500"
              >
                ✕
              </button>
            )}

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-4">
              {mode === "login"
                ? mandatory
                  ? "Login required"
                  : "Welcome back"
                : "Create your account"}
            </h2>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg px-4 py-2 mb-3"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-2 mb-3"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            {/* Confirm password */}
            {mode === "register" && (
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border rounded-lg px-4 py-2 mb-3"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />
            )}

            {/* Forgot password */}
            {mode === "login" && (
              <div className="text-right mb-3">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 mb-3">
                {error}
              </p>
            )}

            {/* Info */}
            {info && (
              <p className="text-sm text-green-600 mb-2">
                {info}
              </p>
            )}

            {/* Resend verification */}
            {mode === "register" && info && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await resendVerificationEmail();
                    setInfo(
                      "Verification email sent again."
                    );
                  } catch {
                    setError(
                      "Failed to resend verification email."
                    );
                  }
                }}
                className="text-sm text-gray-600 underline mb-3"
              >
                Resend verification email
              </button>
            )}

            {/* Submit */}
            <button
              type="button"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
              className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Register"}
            </button>

            {/* Google Login */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">
                  OR
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={loginWithGoogle}
                className="w-full border flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
            </div>

            {/* Mode switch */}
            <div className="mt-4 text-sm text-center text-gray-600">
              {mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className="text-black font-medium"
                    onClick={() =>
                      setMode("register")
                    }
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-black font-medium"
                    onClick={() =>
                      setMode("login")
                    }
                  >
                    Login
                  </button>
                </>
              )}
            </div>

            {/* Guest */}
            {!mandatory && mode === "login" && (
              <button
                type="button"
                onClick={onClose}
                className="w-full mt-3 text-sm text-gray-500"
              >
                Continue as guest
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
