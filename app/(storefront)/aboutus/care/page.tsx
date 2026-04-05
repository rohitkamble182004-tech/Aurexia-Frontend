"use client"

import Image from "next/image"
import { Droplet, Cloud, Sparkles, MessageCircle, Shirt } from "lucide-react"

export default function CarePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">

      <main className="pb-32">

        {/* HERO SECTION */}
        <section className="relative h-[45vh] overflow-hidden flex items-center justify-center">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa6YoM2oWZ4PjmBjqYk2s40tI-ykAMBWihaMGUJDONrONEMHi0tGjmYVBnyjvEhEv5QddCRWtQAPeoFiI-EbPciJ11fNvZd0MShaIfz0HC0mcnENOD9FZa0iMZpsVN_V-MbIW4h7NJafwpHbv6TzZPd1QoGtwxOX_LSXRI_A-2qne-_agyeo-2BrtQJjZyuGSGihwf-IqPZ4SSEyU3oa9Ck1FyM0UIxszpi2zw8xBzn827TX200dh6L71vz2eOzPSuXADNG8RXWyg"
            alt="Luxury fabric details"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/80" />

          <div className="relative z-10 text-center px-6">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Care Instructions
            </h1>
            <p className="italic text-lg text-slate-600">
              Wear your Aurexia garments as often as you like.
              <br />
              Washing them is simple and considered.
            </p>
          </div>
        </section>

        {/* MATERIAL GUIDES */}
        <section className="mt-16 px-6 max-w-5xl mx-auto">

          <div className="flex items-center mb-12">
            <h3 className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Material Guides
            </h3>
            <div className="h-[1px] flex-grow ml-6 bg-slate-200" />
          </div>

          <div className="space-y-16">

            {/* SILK */}
            <article className="flex gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full">
                <Droplet className="w-5 h-5 text-slate-500" />
              </div>

              <div>
                <h4 className="font-serif text-2xl mb-4">Silk Care</h4>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Hand wash in cold water using a silk-specific detergent.
                  Avoid soaking for more than five minutes to preserve the integrity of the fiber.
                </p>

                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Air dry away from direct sunlight</li>
                  <li>• Steam or iron on the lowest setting</li>
                </ul>
              </div>
            </article>

            {/* CASHMERE */}
            <article className="flex gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full">
                <Cloud className="w-5 h-5 text-slate-500" />
              </div>

              <div>
                <h4 className="font-serif text-2xl mb-4">Cashmere Care</h4>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Cashmere thrives with gentle hand washing in lukewarm water.
                  Never wring. Instead, roll in a towel to remove excess moisture.
                </p>

                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Dry flat to maintain shape</li>
                  <li>• Store folded, never on hangers</li>
                </ul>
              </div>
            </article>

            {/* LEATHER */}
            <article className="flex gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full">
                <Sparkles className="w-5 h-5 text-slate-500" />
              </div>

              <div>
                <h4 className="font-serif text-2xl mb-4">Leather Care</h4>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Our leathers are designed to age beautifully. Spot clean with
                  a soft damp cloth and consult a leather specialist for deep cleaning.
                </p>

                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Store in a breathable garment bag</li>
                  <li>• Condition annually to preserve suppleness</li>
                </ul>
              </div>
            </article>

          </div>
        </section>
        {/* STEAMING & STORAGE */}
<section className="mt-24 px-6">
  <div className="max-w-3xl mx-auto text-center space-y-6">

    <Shirt className="mx-auto text-slate-400" size={32} />

    <h2 className="font-serif text-2xl">
      Steaming & Storage
    </h2>

    <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
      Steaming is the preferred method for removing wrinkles.
      Store your luxury pieces in a cool, dry environment using padded hangers
      for structured tailoring and folding knitwear to preserve shape and fiber integrity.
    </p>

  </div>
</section>

        {/* BESPOKE ADVICE SECTION */}
        <section className="mt-24 px-6">
          <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl py-16 px-8 text-center">
            <MessageCircle className="mx-auto mb-6 text-slate-400" size={40} />

            <h3 className="font-serif text-2xl mb-3">
              Need Bespoke Advice?
            </h3>

            <p className="text-slate-500 mb-8 text-sm max-w-md mx-auto">
              Our artisans are available to guide you through specific stain removal
              and long-term garment preservation techniques.
            </p>

            <button className="bg-slate-900 text-white px-10 py-4 rounded-full text-sm tracking-wide hover:bg-slate-800 transition">
              Contact Artisan
            </button>
          </div>
        </section>

      </main>
    </div>
  )
}