"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function AccountButton({ className, children }: Props) {
  const { requireAuth } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    requireAuth(() => {
      router.push("/account");
    });
  };

  return (
    <button onClick={handleClick} className={className}>
      {children ?? "Account"}
    </button>
  );
}
