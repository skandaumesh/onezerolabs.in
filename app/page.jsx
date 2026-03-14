'use client'

import React from 'react'
import { Hero } from '@/components/ui/hero-1'
import { Syne } from 'next/font/google'

import VisionSection from '@/components/VisionSection'
import LuminaShowcase from '@/components/LuminaShowcase'
import DifferenceSection from '@/components/DifferenceSection'
import Testimonials from '@/components/Testimonials'
import CtaSection from '@/components/CtaSection'

// Configure the font
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen flex flex-col">

      {/* 1. Hero Section */}
      <div className={`relative z-10 ${syne.className}`}>
        <Hero
          eyebrow="A Modern Digital Atelier"
          title="Designing the Future of Digital Infrastructure"
          subtitle="Building scalable websites, intelligent applications, and AI systems for institutions and modern businesses."
          ctaLabel="Get Started"
          ctaHref="/contact"
        />
      </div>

      {/* 2. Text Reveal & Position Section */}
      <div className="relative z-10">
        <VisionSection image="/vision.jpg" />

      </div>

      {/* 3. Service Showcase */}
      <div id="showcase" className="relative z-30 bg-black">
        <LuminaShowcase />
      </div>

      {/* 4. Difference Section */}
      <div className="relative z-20 bg-black">
        <DifferenceSection />
      </div>

      {/* 5. Testimonials */}
      <div className="relative z-20 bg-black">
        <Testimonials />
      </div>

      {/* 6. CTA Section */}
      <div className="relative z-20 bg-black">
        <CtaSection />
      </div>



    </main>
  )
}