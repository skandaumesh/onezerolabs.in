'use client'

import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { solutionsData } from '@/data/solutionsData'
import ServiceCta from '@/components/ServiceCta'
import { Band, BODY, EYEBROW, GlassCard, HEADING, INK, MUTED, SkyHero } from '@/components/ui/light-kit'

export default function SolutionPage({ params }) {
  const data = solutionsData[params.slug];

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-ozl-base text-ozl-ink">
      <SkyHero eyebrow="Solutions" title={data.title} />

      {/* Intro Section */}
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

            <div className="flex flex-col gap-6 border-l border-[#0E1A33]/10 pl-6 md:pl-10">
              <p className={`text-xl font-light leading-relaxed md:text-2xl ${INK}`}>
                {data.hero.subheadline}
              </p>
            </div>
          </motion.div>
        </div>
      </Band>

      {/* One grey band from the challenges down through what we build, the
          way the homepage runs its card sections together. */}
      <Band tone="grey" fadeTop fadeBottom className="px-6 pb-16 pt-16 md:px-12 md:pb-24 md:pt-24 lg:px-24">
        {/* Common Challenges */}
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 md:mb-12">
            <span className={`${EYEBROW} mb-4`}>The friction</span>
            <h2 className={`${HEADING} text-4xl md:text-5xl`}>
              Common Challenges
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.commonChallenges.map((challenge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <GlassCard className="h-full" innerClassName="flex items-start gap-4 p-6 md:p-7">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0E1A33]/30" />
                  <p className={`text-lg leading-relaxed ${BODY}`}>
                    {challenge}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How We Help */}
        <div className="mx-auto mt-20 w-full max-w-6xl md:mt-28">
          <div className="mb-10 md:mb-12">
            <span className={`${EYEBROW} mb-4`}>Our expertise</span>
            <h2 className={`${HEADING} text-4xl md:text-5xl`}>
              How We Help
            </h2>
          </div>

          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {data.howWeHelp.map((service, index) => {
              const isLastOdd = index === data.howWeHelp.length - 1 && data.howWeHelp.length % 2 !== 0;

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
                  <span className={`${EYEBROW} mb-4`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`mb-4 font-[family-name:var(--font-instrument-serif)] text-3xl leading-none tracking-wide md:text-4xl ${INK}`}>
                    {service.title}
                  </h3>
                  <p className={`mt-auto text-lg font-light leading-relaxed ${BODY}`}>
                    {service.description}
                  </p>
                </GlassCard>
              </motion.div>
              )
            })}
          </div>
        </div>

        {/* What We Build (Checkmarks) */}
        <div className="mx-auto mt-20 w-full max-w-5xl md:mt-28">
          <div className="mb-10 text-center md:mb-12">
            <h2 className={`${HEADING} mb-5 text-4xl md:text-5xl`}>
              What We Build
            </h2>
            <p className={`mx-auto max-w-2xl text-xl ${BODY}`}>
              Tangible deliverables tailored precisely for {data.title.toLowerCase()}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-3 md:grid-cols-2">
            {data.deliverables.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-white/60"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white bg-white/70 shadow-[0_2px_6px_rgba(15,23,42,0.06)]">
                  <svg className="h-4 w-4 text-[#0E1A33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`text-lg font-medium md:text-xl ${INK}`}>
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Band>

      {/* Ideal Clients */}
      <Band className="px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <div className="mx-auto w-full max-w-4xl text-center">
          <span className={`${EYEBROW} mb-8`}>Who we work with</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6">
            {data.idealClients.map((client, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`cursor-default font-[family-name:var(--font-instrument-serif)] text-2xl transition-colors hover:text-[#0E1A33] md:text-4xl ${BODY}`}
              >
                {client}
                {idx !== data.idealClients.length - 1 && (
                  <span className={`ml-6 font-sans font-light md:ml-10 ${MUTED} opacity-50`}>/</span>
                )}
              </motion.span>
            ))}
          </div>
        </div>
      </Band>

      {/* CTA Section. This passed `title`, which ServiceCta doesn't take, so
          the button rendered with no label. */}
      <ServiceCta text={data.ctaText} />
    </main>
  );
}
