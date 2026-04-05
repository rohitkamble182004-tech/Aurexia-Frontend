"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantId: string;
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, variantId: string) => void;
  updateQuantity: (id: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

/* -------------------------
   Lazy initializer
-------------------------- */
function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("cart");
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);

  /* -------------------------
     Persist cart
  -------------------------- */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  /* -------------------------
     Add to Cart
  -------------------------- */
  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.variantId === item.variantId
      );

      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, item];
    });
  };

  /* -------------------------
     Remove Item
  -------------------------- */
  const removeFromCart = (id: string, variantId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.variantId === variantId))
    );
  };

  /* -------------------------
     Update Quantity
  -------------------------- */
  const updateQuantity = (
    id: string,
    variantId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(id, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.variantId === variantId
          ? { ...i, quantity }
          : i
      )
    );
  };

  /* -------------------------
     Clear Cart
  -------------------------- */
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  /* -------------------------
     Subtotal
  -------------------------- */
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}