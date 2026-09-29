'use client'

import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { productsData } from '@/data/productsData'
import ServiceCta from '@/components/ServiceCta'
import SaameProduct from '@/components/SaameProduct'
import { Band, BODY, EYEBROW, GlassCard, HEADING, INK, MUTED, SkyHero } from '@/components/ui/light-kit'

export default function ProductPage({ params }) {
  const data = productsData[params.slug];
  const scrollRef = useRef(null);
  const dragMoved = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Declared before the early returns below: a hook after a conditional
  // return breaks React's rule that hooks run in the same order every render.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  if (!data) {
    notFound();
  }

  /* SAAME has its own page, built from components/SaameProduct.jsx. Every
     other product uses the template below. */
  if (params.slug === 'saame') {
    return <SaameProduct />;
  }

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragMoved.current = false;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 6) dragMoved.current = true;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const openLightbox = (shot) => {
    if (dragMoved.current) return; // ignore clicks that were drags
    setLightbox(shot);
  };

  return (
    <main className="min-h-screen bg-ozl-base text-ozl-ink">
      {/* 1. Hero Section */}
      <SkyHero eyebrow="Product" title={data.hero.headline}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-3xl text-lg font-light leading-relaxed text-white/90 md:text-xl"
          style={{ textShadow: "0 1px 16px rgba(12,40,90,0.3)" }}
        >
          {data.hero.subheadline}
        </motion.p>

        {data.hero.badge && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 rounded-full border border-white/60 bg-white/25 px-6 py-3 text-sm text-white backdrop-blur-sm md:text-base"
          >
            {data.hero.badge}
          </motion.div>
        )}
      </SkyHero>

      {/* 2. Metrics Bar */}
      {data.metrics && data.metrics.length > 0 && (
        <Band className="px-6 pb-16 md:px-12 lg:px-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid w-full grid-cols-2 gap-8 border-t border-[#0E1A33]/10 pt-12 md:grid-cols-4 md:gap-12">
              {data.metrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <span className={`${HEADING} mb-2 text-4xl md:text-5xl`}>
                    {metric.value}
                  </span>
                  <span className={`mb-2 text-base font-medium md:text-lg ${INK}`}>
                    {metric.label}
                  </span>
                  <span className={`text-sm md:text-[15px] ${MUTED}`}>
                    {metric.description}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Band>
      )}

      {/* 3. The Problem Section */}
      {data.problem && (
        <Band tone="grey" fadeTop fadeBottom className="px-6 py-24 md:px-12 md:py-32 lg:px-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-16 md:flex-row">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex w-full flex-col gap-6 md:w-1/2"
            >
              <span className={EYEBROW}>The problem</span>
              <h2 className={`${HEADING} text-4xl md:text-5xl lg:text-6xl`}>
                {data.problem.headline}
              </h2>
              <p className={`text-xl font-light ${BODY}`}>
                {data.problem.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {data.problem.painPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-lg text-rose-500/80">✕</span>
                    <span className={BODY}>{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2"
            >
              <GlassCard innerClassName="p-8 md:p-10">
                <h3 className={`mb-6 font-[family-name:var(--font-instrument-serif)] text-2xl ${INK}`}>This Creates:</h3>
                <div className="mb-10 flex flex-col gap-3">
                  {data.problem.consequences.map((cons, idx) => (
                    <div key={idx} className={`flex items-center gap-3 rounded-xl border border-white bg-white/60 p-4 ${BODY}`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0E1A33]/30" />
                      {cons}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-white bg-white/80 p-6">
                  <p className={`text-lg font-medium leading-relaxed ${INK}`}>
                    {data.problem.solution}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </Band>
      )}

      {/* 4. The Ecosystem Apps */}
      {data.ecosystemApps && data.ecosystemApps.length > 0 && (
        <Band className="px-6 py-24 md:px-12 md:py-32 lg:px-24">
          <div className="mx-auto w-full max-w-6xl">
            {data.ecosystemIntro && (
              <div className="mb-16 text-center md:mb-20">
                <h2 className={`${HEADING} mb-6 text-5xl md:text-6xl`}>
                  {data.ecosystemIntro.headline}
                </h2>
                <p className={`mx-auto max-w-2xl text-xl font-light ${BODY}`}>
                  {data.ecosystemIntro.subheadline}
                </p>
              </div>
            )}

            <div className="flex w-full flex-col gap-10">
              {data.ecosystemApps.map((app, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                >
                  <GlassCard innerClassName="flex flex-col items-center gap-12 p-8 md:flex-row md:gap-20 md:p-12 lg:p-16">
                    <div className="flex w-full flex-col md:w-5/12">
                      <span className={`${EYEBROW} mb-4`}>
                        {app.title}
                      </span>
                      <h3 className={`mb-6 font-[family-name:var(--font-instrument-serif)] text-4xl leading-tight lg:text-5xl ${INK}`}>
                        {app.tagline}
                      </h3>
                      <p className={`mb-8 text-lg leading-relaxed ${BODY}`}>
                        {app.description}
                      </p>
                      <div className="rounded-2xl border border-white bg-white/70 p-6">
                        <p className={`text-base italic ${BODY}`}>
                          "{app.benefits}"
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-7/12">
                      <h4 className={`${EYEBROW} mb-6`}>Features</h4>
                      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                        {app.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0E1A33]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className={BODY}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </Band>
      )}

      {/* 5. Screenshots Gallery */}
      {data.screenshots && data.screenshots.length > 0 && (
        <Band tone="grey" fadeTop fadeBottom className="overflow-hidden py-20">
          <div className="mx-auto mb-12 max-w-7xl px-6 md:px-12 lg:px-24">
            <h2 className={`${HEADING} text-4xl md:text-5xl`}>
              See {data.title} in Action
            </h2>
          </div>
          {/* Horizontal scrolling gallery setup */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`hide-scrollbar flex items-center gap-6 overflow-x-auto px-6 pb-8 md:px-12 lg:px-24 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab snap-x snap-mandatory scroll-smooth'}`}
          >
            {data.screenshots.map((shot, idx) => {
              const isDesktop = shot.type === 'desktop' || idx === 0; // Fallback to desktop for first if type is missing

              return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-shrink-0 snap-center flex-col gap-4"
              >
                <div
                  onClick={() => shot.image && openLightbox(shot)}
                  onKeyDown={(e) => {
                    if (shot.image && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      setLightbox(shot)
                    }
                  }}
                  role={shot.image ? 'button' : undefined}
                  tabIndex={shot.image ? 0 : undefined}
                  aria-label={shot.image ? `View ${shot.label} full size` : undefined}
                  className={`h-[300px] md:h-[370px] lg:h-[420px] ${shot.image ? 'w-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1A33]/40' : isDesktop ? 'aspect-[16/10]' : 'aspect-[9/16]'} relative flex select-none items-center justify-center overflow-hidden rounded-2xl border border-white bg-white/70 shadow-[0_16px_36px_-20px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1`}
                >
                  {shot.image ? (
                    <img
                      src={shot.image}
                      alt={shot.label}
                      className="pointer-events-none h-full w-auto object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div className={`font-mono text-sm uppercase tracking-widest ${MUTED}`}>
                      [UI: {shot.label}]
                    </div>
                  )}
                </div>
                <span className={`text-center text-sm uppercase tracking-wider ${MUTED}`}>
                  {shot.label}
                </span>
              </motion.div>
            )})}
          </div>
        </Band>
      )}

      {/* Lightbox / full-size image viewer (portaled to body to escape stacking
          context). A dark backdrop on purpose: it's a viewer, not a page. */}
      {mounted && lightbox && createPortal(
        <div
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.label} preview`}
          className="fixed inset-0 z-[300] flex cursor-zoom-out flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-3xl leading-none text-white/60 hover:text-white"
          >
            ×
          </button>
          <img
            src={lightbox.image}
            alt={lightbox.label}
            onClick={(e) => e.stopPropagation()}
            className="h-auto max-h-[85vh] w-auto max-w-full cursor-default rounded-xl object-contain"
          />
          <span className="mt-4 text-sm uppercase tracking-wider text-neutral-300">
            {lightbox.label}
          </span>
        </div>,
        document.body
      )}

      {/* 6. Capabilities */}
      {data.capabilities && data.capabilities.length > 0 && (
        <Band tone="grey" fadeTop fadeBottom className="px-6 py-24 md:px-12 md:py-32 lg:px-24">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className={`${HEADING} text-4xl md:text-5xl lg:text-6xl`}>
                {data.capabilitiesHeadline || "Core Capabilities"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {data.capabilities.map((cap, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="h-full"
                >
                  <GlassCard interactive className="h-full" innerClassName="p-8">
                    <h3 className={`mb-4 font-[family-name:var(--font-instrument-serif)] text-2xl ${INK}`}>
                      {cap.title}
                    </h3>
                    <p className={`leading-relaxed ${BODY}`}>
                      {cap.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </Band>
      )}

      {/* 7. Why Choose */}
      {data.whyChoose && data.whyChoose.length > 0 && (
        <Band className="px-6 py-24 md:px-12 lg:px-24">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-14 md:mb-16">
              <span className={`${EYEBROW} mb-4`}>The difference</span>
              <h2 className={`${HEADING} text-4xl md:text-5xl lg:text-6xl`}>
                Why Institutions Choose {data.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {data.whyChoose.map((reason, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col gap-4"
                >
                  <h3 className={`font-[family-name:var(--font-instrument-serif)] text-3xl ${INK}`}>
                    {reason.title}
                  </h3>
                  <p className={`text-lg leading-relaxed ${BODY}`}>
                    {reason.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Band>
      )}

      {/* 8. Implementation Process */}
      {data.implementation && data.implementation.length > 0 && (
        <Band tone="grey" fadeTop fadeBottom className="px-6 py-24 md:px-12 md:py-32 lg:px-24">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-16 text-center md:mb-20">
              <h2 className={`${HEADING} text-4xl md:text-5xl lg:text-6xl`}>
                How Implementation Works
              </h2>
            </div>

            <div className="relative flex flex-col gap-6">
              <div className="absolute bottom-0 left-6 top-0 w-px bg-[#0E1A33]/10 md:left-[3.25rem]" />
              {data.implementation.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative z-10 flex items-center gap-6 md:gap-10"
                >
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white bg-white font-mono text-sm font-bold shadow-[0_4px_12px_-6px_rgba(15,23,42,0.3)] md:h-14 md:w-14 md:text-base ${INK}`}>
                    {idx + 1}
                  </div>
                  <GlassCard className="w-full" innerClassName="flex flex-col gap-2 p-6 md:flex-row md:items-center md:gap-6">
                    <h3 className={`font-[family-name:var(--font-instrument-serif)] text-2xl md:w-1/3 ${INK}`}>
                      {step.title}
                    </h3>
                    <p className={`md:w-2/3 ${BODY}`}>
                      {step.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </Band>
      )}

      {/* 9. Trust Section */}
      {data.trust && (
        <Band className="px-6 py-24 text-center md:px-12 lg:px-24">
          <div className="mx-auto w-full max-w-4xl">
            <h2 className={`${HEADING} mb-8 text-3xl md:text-4xl lg:text-5xl`}>
              {data.trust.headline}
            </h2>
            <p className={`text-xl font-light leading-relaxed ${BODY}`}>
              {data.trust.description}
            </p>
          </div>
        </Band>
      )}

      {/* 10. Perfect For */}
      {data.perfectFor && data.perfectFor.length > 0 && (
        <Band className="px-6 py-24 md:px-12 md:py-32 lg:px-24">
          <div className="mx-auto w-full max-w-5xl text-center">
            <span className={`${EYEBROW} mb-12`}>Perfect for</span>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-8">
              {data.perfectFor.map((audience, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`cursor-default font-[family-name:var(--font-instrument-serif)] text-3xl transition-colors hover:text-[#0E1A33] md:text-5xl lg:text-6xl ${BODY}`}
                >
                  {audience}
                  {idx !== data.perfectFor.length - 1 && (
                    <span className={`ml-6 font-sans text-2xl font-light opacity-50 md:ml-10 md:text-4xl ${MUTED}`}>/</span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>
        </Band>
      )}

      {/* 11. The Future */}
      {data.future && (
        <Band className="border-t border-[#0E1A33]/10 px-6 py-24 md:px-12 md:py-32 lg:px-24">
          <div className="mx-auto w-full max-w-4xl">
            <h2 className={`${HEADING} mb-10 text-4xl md:text-5xl lg:text-6xl`}>
              {data.future.headline}
            </h2>
            <div className="flex flex-col gap-6 border-l border-[#0E1A33]/10 pl-6 md:pl-10">
              {data.future.paragraphs.map((para, idx) => (
                <p key={idx} className={`text-xl font-light leading-relaxed md:text-2xl ${BODY}`}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Band>
      )}

      {/* 12. CTA Section. This passed `title`, which ServiceCta doesn't take,
          so the button rendered with no label. */}
      <ServiceCta text={data.ctaText} />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
