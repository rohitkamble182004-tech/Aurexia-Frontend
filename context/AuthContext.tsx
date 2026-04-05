"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

/* ================= TYPES ================= */

type AspNetJwtPayload = {
  email?: string;
  exp?: number;
  iss?: string;
  sub?: string;
  [key: string]: unknown;
};

type UserRole = "admin" | "user";

type User = {
  email: string;
  role: UserRole;
};

export type AuthContextType = {
  user: User | null;
  emailVerified: boolean;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;

  loginWithGoogle: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;

  logout: () => void;
  requireAuth: (action: () => void) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] =
    useState<(() => void) | null>(null);

  const router = useRouter();

  /* -------------------------
     Restore session (JWT)
  -------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as UserRole | null;
    const email = localStorage.getItem("email");

    if (token && role && email) {
      setUser({ email, role });
      setEmailVerified(true); // JWT only issued after verified login
    }

    setLoading(false);
  }, []);

  /* -------------------------
     LOGIN (Email / Password)
  -------------------------- */
  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!cred.user.emailVerified) {
        throw new Error("Please verify your email first");
      }

      setEmailVerified(true);

      const firebaseToken = await cred.user.getIdToken();

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
      });

      if (!res.ok) throw new Error("Login failed");

      const { token }: { token: string } = await res.json();

      const decoded = jwtDecode<AspNetJwtPayload>(token);
      const rawRole = decoded[ROLE_CLAIM];

      if (typeof rawRole !== "string") {
        throw new Error("Role missing");
      }

      const role = rawRole.toLowerCase() as UserRole;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      setUser({ email, role });

      window.dispatchEvent(new Event("auth-success"));

      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }

      if (role === "admin" && !pendingAction) {
        router.replace("/admin");
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     REGISTER
  -------------------------- */
  const register = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(cred.user);
      setEmailVerified(false);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     RESEND VERIFICATION
  -------------------------- */
  const resendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user");
    }

    await sendEmailVerification(auth.currentUser);
  };

  /* -------------------------
     GOOGLE LOGIN
  -------------------------- */
  const loginWithGoogle = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      setEmailVerified(true);

      const firebaseToken = await result.user.getIdToken();

      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
      });

      if (!res.ok) throw new Error("Google login failed");

      const { token, role }: { token: string; role: UserRole } =
        await res.json();

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", result.user.email!);

      setUser({
        email: result.user.email!,
        role,
      });

      window.dispatchEvent(new Event("auth-success"));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     FORGOT PASSWORD
  -------------------------- */
  const forgotPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  /* -------------------------
     LOGOUT
  -------------------------- */
  const logout = () => {
    localStorage.clear();
    auth.signOut();
    setUser(null);
    setEmailVerified(false);
    router.replace("/");
  };

  /* -------------------------
     REQUIRE AUTH
  -------------------------- */
  const requireAuth = (action: () => void) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      window.dispatchEvent(new Event("open-auth-modal"));
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        emailVerified,
        loading,
        login,
        register,
        loginWithGoogle,
        forgotPassword,
        resendVerificationEmail,
        logout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
