"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import AuthModal from "@/components/AuthModal";
import { CartItem } from "@/context/CartContext"; // Import the CartItem type

export default function CheckoutPage() {
  // All hooks must be called at the top level
  const { user } = useAuth();
  const { items, subtotal, clearCart, removeFromCart } = useCart(); // Fixed: removeItem -> removeFromCart

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidItems, setInvalidItems] = useState<CartItem[]>([]); // Fixed: Using CartItem type instead of any
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });

  // Check for invalid items whenever items change
  useEffect(() => {
    const invalid = items.filter(
      item => !item.variantId || item.variantId === '00000000-0000-0000-0000-000000000000'
    );
    setInvalidItems(invalid);
  }, [items]); // Fixed: Using useEffect instead of useState for side effects

  // Handle shipping form changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  // Check if shipping form is valid
  const isShippingValid = () => {
    return Object.values(shippingInfo).every(value => value.trim() !== "");
  };

  // Handle removing invalid item
  const handleRemoveInvalidItem = (itemId: string, variantId: string) => {
    removeFromCart(itemId, variantId); // Fixed: Using removeFromCart with correct parameters
  };

  // If user is not logged in, show AuthModal
  if (!user) {
    return <AuthModal isOpen mandatory />;
  }

  // Currency Conversion
  const USD_TO_INR = 90;
  const totalUsd = subtotal;
  const totalInr = totalUsd * USD_TO_INR;

  // Mock Payment
  const mockPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in to complete your purchase");
      }

      if (items.length === 0) {
        throw new Error("Your cart is empty");
      }

      // Check for invalid items
      if (invalidItems.length > 0) {
        throw new Error("Some items in your cart have invalid product variants. Please remove them and try again.");
      }

      const orderItems = items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price
      }));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            items: orderItems,
            totalAmount: totalUsd,
            currency: "USD",
            shippingAddress: shippingInfo
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error details:", data);
        
        if (data.message?.includes("variant not found")) {
          throw new Error("One or more products are no longer available. Please review your cart.");
        }
        
        throw new Error(data.message || "Failed to create order. Please try again.");
      }

      clearCart();
      alert(`Order placed successfully! Order ID: ${data.id}`);

    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-2 gap-16">
      {/* LEFT SIDE */}
      <div>
        <h1 className="text-3xl font-semibold mb-10">Checkout</h1>

        {/* Show invalid items warning if any */}
        {invalidItems.length > 0 && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-3">
              Items with Issues
            </h3>
            <p className="text-sm text-yellow-700 mb-4">
              The following items have invalid product variants and need to be removed:
            </p>
            <div className="space-y-3">
              {invalidItems.map((item) => (
                <div key={`${item.id}-${item.variantId}`} className="flex items-center justify-between bg-white p-3 rounded border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveInvalidItem(item.id, item.variantId)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping */}
        <section className="mb-12">
          <h2 className="text-lg font-medium mb-4">
            Shipping Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="border border-neutral-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
              name="firstName"
              value={shippingInfo.firstName}
              onChange={handleShippingChange}
              placeholder="First name"
              required
            />
            <input 
              className="border border-neutral-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
              name="lastName"
              value={shippingInfo.lastName}
              onChange={handleShippingChange}
              placeholder="Last name"
              required
            />
            <input
              className="border border-neutral-300 rounded-md px-4 py-2 w-full md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
              placeholder="Address"
              required
            />
            <input 
              className="border border-neutral-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingChange}
              placeholder="City"
              required
            />
            <input
              className="border border-neutral-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
              name="postalCode"
              value={shippingInfo.postalCode}
              onChange={handleShippingChange}
              placeholder="Postal Code"
              required
            />
            <input 
              className="border border-neutral-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
              name="country"
              value={shippingInfo.country}
              onChange={handleShippingChange}
              placeholder="Country"
              required
            />
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-lg font-medium mb-4">Payment</h2>

          <div className="border border-neutral-300 rounded-lg p-6 text-sm text-neutral-700 space-y-2">
            <p className="font-medium text-black">
              Mock Payment Mode
            </p>
            <p>
              USD is displayed for reference. INR is the payable
              amount.
            </p>
            <p className="text-neutral-500 text-xs">
              (Razorpay will be enabled later)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={mockPayment}
            disabled={loading || items.length === 0 || !isShippingValid() || invalidItems.length > 0}
            className="mt-8 w-full bg-black text-white py-4 text-sm tracking-wide hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Complete Purchase (Mock)"
            )}
          </button>
        </section>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-neutral-50 p-8 rounded-xl">
        <h2 className="text-lg font-medium mb-6">
          Order Summary
        </h2>

        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={`${item.id}-${item.variantId}`} className="flex gap-4">
              <div className="relative w-20 h-24 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover rounded"
                  priority={index === 0} // Only first image gets priority
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-neutral-500">
                  Qty {item.quantity}
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <p className="text-xs text-neutral-400 truncate">
                    Variant ID: {item.variantId || 'MISSING'}
                  </p>
                )}
              </div>

              <p className="font-medium whitespace-nowrap">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal (USD)</span>
            <span>${totalUsd.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="flex justify-between font-medium text-base pt-4">
            <span>Total (USD)</span>
            <span>${totalUsd.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-medium text-base">
            <span>Payable (INR)</span>
            <span>₹{totalInr.toFixed(2)}</span>
          </div>
        </div>

        {items.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-neutral-500 mb-4">Your cart is empty</p>
            <Link 
              href="/products" 
              className="inline-block bg-black text-white px-6 py-3 text-sm hover:bg-neutral-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}