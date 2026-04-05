"use client"

import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function NotesPage() {
  return (
    <div className="bg-[#f8f6f2] text-[#111]">

      {/* BACK LINK */}
      {/* <div className="px-6 pt-10 max-w-6xl mx-auto">
        <Link
          href="/aboutus"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-500 hover:text-black transition"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
      </div> */}

      {/* HERO */}
      <section className="mt-10 relative h-[80vh] w-full">
        <Image
          src="/images/about/the-house.jpg"
          alt="Aurexia The House"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center text-white px-6">
          <span className="text-xs uppercase tracking-[0.4em]">
            Issue No. 01 — Notes
          </span>

          <h1 className="mt-6 font-serif text-4xl md:text-6xl font-light leading-tight">
            The Creative Process
          </h1>
        </div>
      </section>

      {/* INTRO TEXT */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-xl md:text-2xl font-serif italic leading-relaxed text-neutral-700"
        >
          A quiet exploration of proportion, fabric, and atmosphere.
          Every collection begins not with trend, but with feeling.
        </motion.p>

        <div className="w-16 h-[1px] bg-neutral-300 mx-auto my-12" />

        <p className="text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
          In our studio, light guides silhouette.
          Linen moves before it is cut.
          Silk is studied in stillness.
          We design slowly — allowing texture and form to reveal intention.
        </p>
      </section>

      {/* CLOSING STATEMENT */}
      <section className="bg-[#6b7976] text-white py-28 text-center px-6">
        <p className="font-serif text-2xl md:text-3xl font-light leading-relaxed max-w-3xl mx-auto">
          Luxury is not excess.
          <br />
          It is restraint, balance, and permanence.
        </p>
      </section>

      {/* IMAGE GRID EDITORIAL */}
      <section className="mt-30 max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-8">

          <div className="relative aspect-[4/5]">
            <Image
              src="/images/about/bluelinen.jpg"
              alt="Blue linen shirt by the sea"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative aspect-[4/5]">
            <Image
              src="/images/about/white-linen.jpg"
              alt="Beige linen shirt"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative aspect-[4/5]">
            <Image
              src="/images/about/LinenShorts.jpg"
              alt="Linen shorts Riviera"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

    </div>
  )
}