// components/storefront/Footer.tsx
import Link from "next/link";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import AccountButton from "./AccountButton";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

        {/* Brand + Social */}
        <div>
          <p className="text-white text-lg font-semibold tracking-wide">
            AUREXIA
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <FaFacebookF size={16} />
            </a>
          </div>
          <div className = "flex gap-4 mt-6">
            <AccountButton className="text-sm text-gray-200">
  My Account
</AccountButton>

          </div>
        </div>

        {/* Contact Us */}
        <div>
          <p className="text-white font-medium tracking-wide mb-4">
            CONTACT US
          </p>

          <p className="mb-3">
            Questions? We are here for you<br />
            Mon to Fri, 9am–5pm ET
          </p>

          <p className="mb-3">
            <span className="uppercase text-xs tracking-wider">Email</span><br />
            <a
              href="mailto:hello@aurexia.com"
              className="hover:text-white transition"
            >
              hello@aurexia.com
            </a>
          </p>

          <p className="hover:text-white transition cursor-pointer">
            Live Chat
          </p>
        </div>

        {/* Customer Care */}
        <div>
          <p className="text-white font-medium tracking-wide mb-4">
            CUSTOMER CARE
          </p>

          <ul className="space-y-2">
            <li>
              <Link href="/returns" className="hover:text-white transition">
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link href="/size-guide" className="hover:text-white transition">
                Size Guide
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-white transition">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/aboutus/care" className="hover:text-white transition">
                Care Instructions
              </Link>
            </li>
            <li>
              <Link href="/aboutus/the-house" className="hover:text-white transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Email Signup */}
        <div>
          <p className="text-white font-medium tracking-wide mb-4">
            SIGN UP FOR AUREXIA INSIDER
          </p>

          <p className="mb-4">
            Be the first to know about new drops and exclusive releases
          </p>

          <div className="flex items-center border border-neutral-600 px-3 py-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none text-sm w-full placeholder-neutral-400"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-700 py-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} AUREXIA. All rights reserved.
      </div>
    </footer>
  );
}
