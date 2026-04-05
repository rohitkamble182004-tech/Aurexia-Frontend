'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useState, useRef } from 'react'

const STORY = [
  {
    title: 'Origins',
    text:
      'The House was born from a pursuit of timeless elegance. Rooted in culture and architecture, it reflects a vision shaped by restraint and intention.',
    image: '/images/about/the-house.jpg',
  },
  {
    title: 'Vision',
    text:
      'We design beyond seasons. Each collection is conceived as a chapter—meant to endure, evolve, and exist outside of trend.',
    image: '/images/about/coquette-aesthetic-style.jpg',
  },
  {
    title: 'Silhouette',
    text:
      'Form follows feeling. Clean lines, quiet strength, and a balance between structure and fluidity define our silhouettes.',
    image: '/images/about/cashmere.jpg',
  },
]

export default function HousePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1])

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0b0b0c] text-white"
    >
      
      {/* PROGRESS BAR */}
      <div className="fixed top-0 left-0 h-[2px] bg-white z-50"
        style={{
          width: `${((activeIndex + 1) / STORY.length) * 100}%`,
        }}
      />

      <div className="grid md:grid-cols-2 max-w-7xl mx-auto">

        {/* DESKTOP STICKY IMAGE */}
        <div className="hidden md:block sticky top-0 h-screen relative overflow-hidden">
          {STORY.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex === index ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <motion.div
                style={{ scale: imageScale }}
                className="w-full h-full"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/30 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* CONTENT */}
        <div>
          {STORY.map((item, index) => (
            <div
              key={item.title}
              className="min-h-screen flex flex-col justify-center px-6 md:px-8"
              onMouseEnter={() => setActiveIndex(index)}
            >

              {/* MOBILE IMAGE */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative w-full aspect-[4/5] mt-6 mb-10 md:hidden overflow-hidden rounded-xl"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-full h-full"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>

              {/* TEXT */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
              >
                <span className="text-xs uppercase tracking-[0.4em] text-neutral-500">
                  Chapter {index + 1}
                </span>

                <h2 className="mt-6 mb-8 font-serif text-4xl md:text-7xl leading-tight">
                  {item.title}
                </h2>

                <p className="max-w-xl text-lg text-neutral-400 leading-relaxed">
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