'use client'

import React from 'react'
import { Hero } from '@/components/ui/hero-1'
import ClientMarquee from '@/components/ClientMarquee'
import SaameShowcase from '@/components/SaameShowcase'
import DoorsSection from '@/components/DoorsSection'
import HowWeWork from '@/components/HowWeWork'
import WhyUs from '@/components/WhyUs'
import Testimonials from '@/components/Testimonials'
import Faq from '@/components/Faq'
import CtaSection from '@/components/CtaSection'

export default function HomePage() {
  return (
    <main className="relative bg-ozl-base min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">

      {/* 1. Hero + proof strip share the first screen: the strip sits at the
             foot and the hero flexes to fill the rest, with its content centred
             in that space. `svh` is the height with the phone's address bar
             showing, so the strip is never pushed below the fold on mobile. */}
      <div className="relative z-10 flex min-h-svh flex-col">
        <div className="flex flex-1 flex-col">
        <Hero
          eyebrow="BENGALURU · SINCE 2025"
          title={
            <>
              Designing the Future of{' '}
              <span className="italic">Digital Infrastructure</span>
            </>
          }
          subtitle="Websites, software, and brand systems for schools, businesses, and founders. Built properly, and kept running after launch."
          primaryAction={{ label: "Explore Services", href: "/services" }}
          secondaryAction={{ label: "Contact Us", href: "/contact" }}
        />
        </div>
        <div className="shrink-0">
          <ClientMarquee />
        </div>
      </div>

      {/* 2. SAAME Product Showcase (Interactive Dashboard) */}
      <div className="relative z-20 bg-ozl-base">
        <SaameShowcase />
      </div>

      {/* 3. The four doors */}
      <div className="relative z-20 bg-ozl-base">
        <DoorsSection />
      </div>

      {/* 4. How we work */}
      <div className="relative z-20 bg-ozl-base">
        <HowWeWork />
      </div>

      {/* 5. Why us */}
      <div className="relative z-20 bg-ozl-base">
        <WhyUs />
      </div>

      {/* 6. Testimonials */}
      <div className="relative z-20 bg-ozl-base">
        <Testimonials />
      </div>

      {/* 7. FAQ */}
      <div className="relative z-20 bg-ozl-base">
        <Faq />
      </div>

      {/* 8. Close */}
      <div className="relative z-20 bg-ozl-base">
        <CtaSection />
      </div>

    </main>
  )
}
