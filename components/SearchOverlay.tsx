"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 🔥 Auto focus + keyboard open
  useEffect(() => {
    if (open) {
      // small delay ensures focus works on mobile
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(
      `/products?search=${encodeURIComponent(query)}`
    );
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-6 py-6"
      >
        <div className="flex items-center gap-4">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="flex-1 border-b border-black text-lg outline-none py-2"
          />

          <button
            type="button"
            onClick={onClose}
            className="text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
