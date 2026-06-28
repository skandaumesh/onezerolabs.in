'use client'

import React from 'react'
import { Hero } from '@/components/ui/hero-1'
import VisionSection from '@/components/VisionSection'
import ServicesSection from '@/components/ServicesSection'

import DifferenceSection from '@/components/DifferenceSection'

import Testimonials from '@/components/Testimonials'
import CtaSection from '@/components/CtaSection'

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">

      {/* 2. Hero Section */}
      <div className="relative z-10">
        <Hero
          title="Designing the Future of Digital Infrastructure"
          subtitle="A business infrastructure studio from Bengaluru. We build the brand, tech, and operational systems you need to scale without managing multiple vendors."
          ctaLabel=""
          ctaHref=""
        />
      </div>

      {/* 3. Vision Pillars */}
      <div className="relative z-10">
        <VisionSection image="/vision.jpg" />
      </div>

      {/* 4. Services Section */}
      <div className="relative z-20 bg-black">
        <ServicesSection />
      </div>



      {/* 6. The OZL Difference */}
      <div className="relative z-20 bg-black">
        <DifferenceSection />
      </div>


      {/* 8. Testimonials */}
      <div className="relative z-20 bg-black">
        <Testimonials />
      </div>





      {/* 11. CTA Section */}
      <div className="relative z-20 bg-black">
        <CtaSection />
      </div>

    </main>
  )
}