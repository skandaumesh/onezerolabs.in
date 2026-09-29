'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { servicesData } from '@/data/servicesData'
import ServiceApproach from '@/components/ServiceApproach'
import ServiceCta from '@/components/ServiceCta'
import { Band, BODY, EYEBROW, GlassCard, HEADING, INK, SkyHero } from '@/components/ui/light-kit'

export default function ServicePage({ params }) {
  const slug = params.slug
  const data = servicesData[slug]

  if (!data) {
    return notFound()
  }

  return (
    <main className="min-h-screen bg-ozl-base text-ozl-ink">
      <SkyHero eyebrow="Services" title={data.title} />

      {/* Intro & Overview Section */}
      <Band className="px-6 py-14 md:px-12 md:py-20 lg:px-24">
        <div className="mx-auto w-full max-w-[1000px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 md:gap-10"
          >
            <h2 className={`${HEADING} text-4xl md:text-5xl lg:text-6xl`}>
              {data.hero.headline}
            </h2>

            <div className="flex flex-col gap-5 border-l border-[#0E1A33]/10 pl-6 md:pl-10">
              <p className={`text-xl font-light leading-relaxed md:text-2xl ${INK}`}>
                {data.hero.subheadline}
              </p>
              <p className={`text-lg leading-relaxed md:text-xl ${BODY}`}>
                {data.overview}
              </p>
            </div>
          </motion.div>
        </div>
      </Band>

      {/* Services List Section */}
      <Band tone="grey" fadeTop className="px-6 py-16 md:px-12 md:py-24 lg:px-24">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col">
          <div className="mb-10 md:mb-14">
            <h2 className={`${HEADING} text-4xl md:text-5xl lg:text-6xl`}>
              Core <span className="italic">Services.</span>
            </h2>
          </div>

          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {data.servicesList.map((service, index) => {
              const isLastOdd = index === data.servicesList.length - 1 && data.servicesList.length % 2 !== 0;

              return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className={isLastOdd ? "md:col-span-2 md:w-[calc(50%-12px)] md:justify-self-center" : "w-full"}
              >
                <GlassCard interactive className="h-full" innerClassName="flex flex-col p-7 md:p-9">
                  <span className={`${EYEBROW} mb-5`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3 className={`mb-3 font-[family-name:var(--font-instrument-serif)] text-3xl leading-tight tracking-wide md:text-4xl ${INK}`}>
                    {service.title}
                  </h3>

                  <p className={`mt-auto text-[15px] leading-relaxed md:text-[16px] ${BODY}`}>
                    {service.description}
                  </p>
                </GlassCard>
              </motion.div>
              )
            })}
          </div>
        </div>
      </Band>

      {/* Shared Approach Section */}
      <ServiceApproach />

      {/* CTA Section */}
      <ServiceCta text={data.ctaText} />
    </main>
  )
}
