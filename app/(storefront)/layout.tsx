// app/(storefront)/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AuthModalController from "@/components/AuthModalController";
import AurexiaChat from "@/components/AurexiaChat";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />

          <AuthGate>
            <main className="flex-1">{children}</main>
            <AurexiaChat />
          </AuthGate>

          <Footer />
          <AuthModalController />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
