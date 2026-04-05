'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const CHAPTERS = [
  {
    title: 'Intention',
    text:
      'We begin with restraint. Each piece is designed with purpose — not trend — in mind, eliminating excess and elevating what matters.',
    image:
      '/images/about/bluelinen.jpg',
  },
  {
    title: 'Sourcing',
    text:
      'We work closely with heritage mills and trusted partners who share our commitment to ethics, sustainability, and quality.',
    image:
      '/images/about/heritage.jpg',
  },
  {
    title: 'Longevity',
    text:
      'Timelessness is our measure of sustainability. Every piece is built to last and grow more beautiful with time and care.',
    image:
      '/images/about/cream-linen-trouser.jpg',
  },
  {
    title: 'Returns & Exchanges',
    text:
      'We offer 14-day returns on all U.S. orders (excluding Final Sale). Items must be new, unworn, and returned with all tags, packaging, and receipt.',
    image:
      'https://images.unsplash.com/photo-1602551452472-c3ea9a4f8993?q=80&w=2000&auto=format&fit=crop',
  },
]

export default function ResponsibilityPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.resp-chapter')
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        ) {
          setActiveIndex(index)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative bg-[#f8f7f5] text-[#111]">
      <div className="grid md:grid-cols-2 max-w-7xl mx-auto">

        {/* Desktop Sticky Image */}
        <div className="hidden md:block sticky top-0 h-screen relative overflow-hidden">
          {CHAPTERS.map((item, index) => (
            <motion.div
              key={index}
              animate={{ opacity: activeIndex === index ? 1 : 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority={index === 0}
                className="object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div>
          {CHAPTERS.map((item, index) => (
            <div
              key={item.title}
              className="resp-chapter min-h-screen flex flex-col justify-center px-6 md:px-12"
              onMouseEnter={() => setActiveIndex(index)}
            >

              {/* Mobile Image */}
              <div className="relative w-full aspect-[4/5] mb-12 md:hidden overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 1 }}
              >
                <span className="text-xs uppercase tracking-[0.4em] text-neutral-500">
                  Chapter {index + 1}
                </span>

                <h2 className="mt-8 mb-8 font-serif text-4xl md:text-7xl font-light leading-tight">
                  {item.title}
                </h2>

                <p className="max-w-xl text-lg md:text-xl text-neutral-600 leading-relaxed">
                  {item.text}
                </p>

                {/* Extra content only for Returns chapter */}
                {item.title === 'Returns & Exchanges' && (
                  <div className="mt-8 space-y-4 text-neutral-600 text-base md:text-lg">
                    <p>• Click below to start a Return or Exchange.</p>
                    <p>• Neatly fold your items in clean, unworn condition.</p>
                    <p>• Include original packaging and receipt with reason noted.</p>
                    <p>• Drop off your return package within 7 days of request.</p>
                    <p>• Online orders cannot be returned in-store.</p>
                    <p>• Please allow 7–14 business days for processing once received.</p>

                    <button className="mt-6 px-8 py-3 border border-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition">
                      Start a Return or Exchange
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}