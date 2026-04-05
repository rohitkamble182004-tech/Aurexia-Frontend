'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const CHAPTERS = [
  {
    title: 'Material',
    text:
      'Every garment begins with texture. Cashmere brushed by hand, silk chosen for weight, wool selected for structure. Material is not decoration — it is foundation.',
    image:
      '/images/about/material.jpg',
  },
  {
    title: 'Atelier',
    text:
      'Inside the atelier, proportion is studied in silence. Lines are refined. Shoulders softened. Movement tested. The process is deliberate, intimate, exacting.',
    image:
      '/images/about/outfit.jpg',
  },
  {
    title: 'Precision',
    text:
      'Details remain subtle — hidden stitching, invisible hems, balanced seams. True luxury is rarely loud; it is felt in construction.',
    image:
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2000&auto=format&fit=crop',
  },
  {
    title: 'Endurance',
    text:
      'Craftsmanship extends beyond season. Each piece is designed to age with elegance — strengthening in character, never losing relevance.',
    image:
      '/images/about/enduronce.jpg',
  },
]

export default function CraftsmanshipPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Scroll activation for mobile
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.craft-chapter')
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
    <section className="relative bg-[#f5f4f2] text-[#111]">
      <div className="grid md:grid-cols-2 max-w-7xl mx-auto">

        {/* Desktop Sticky Image Column */}
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

        {/* Content Column */}
        <div>
          {CHAPTERS.map((item, index) => (
            <div
              key={item.title}
              className="craft-chapter min-h-screen flex flex-col justify-center px-6 md:px-12"
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

                <h2 className="mt-8 mb-10 font-serif text-4xl md:text-7xl leading-tight font-light">
                  {item.title}
                </h2>

                <p className="max-w-xl text-lg md:text-xl text-neutral-600 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}