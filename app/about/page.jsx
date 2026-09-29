'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import CtaSection from '@/components/CtaSection'
import { Band, BODY, GlassCard, HEADING, INK } from '@/components/ui/light-kit'
import { CLIENT_NAMES, listNames } from '@/lib/seo'

const founders = [
  { name: 'Skanda Umesh', role: 'Founder', img: '/founder.jpg' },
  { name: 'Praveen Kumar', role: 'Co-Founder', img: '/cofounder.jpg' },
  { name: 'Tanisha Karve', role: 'Operations & Strategy', img: '/lead.jpg' },
]

const H2 = `${HEADING} mb-7 text-4xl sm:text-5xl lg:text-[56px]`
const PROSE = `space-y-6 text-[17px] font-light leading-[1.8] sm:text-[19px] ${BODY}`
const STRONG = `font-medium ${INK}`

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-ozl-base text-ozl-ink">

      {/* One grey band from the manifesto down through the founders. */}
      <Band tone="grey" fadeTop fadeBottom className="px-4 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">

        {/* MANIFESTO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mx-auto w-full max-w-[1000px]"
        >
          <GlassCard innerClassName="px-6 py-10 sm:px-10 md:px-16 md:py-16 lg:px-24 lg:py-20">
            <div className="mb-10 flex justify-center md:mb-14">
              <div className="relative h-20 w-20 md:h-24 md:w-24">
                <Image src="/logo-print.png" alt="OneZeroLabs Logo" fill className="object-contain" />
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[800px] flex-col gap-20 text-center md:gap-28">

              <div className="w-full">
                {/* The page's one h1, styled like the section headings below. */}
                <h1 className={H2}>
                  Building the Infrastructure Behind Growth
                </h1>
                <div className={PROSE}>
                  <p>Organizations today don't struggle because they lack tools. They struggle because their systems are disconnected.</p>
                  <p>Marketing operates separately from operations. Data lives in multiple places. Teams rely on manual processes. Growth becomes difficult because the infrastructure supporting the business isn't designed to scale.</p>
                  <p>OneZeroLabs was founded to solve this problem. We help organizations build the systems, technology, and digital infrastructure required to operate efficiently, make better decisions, and grow with confidence.</p>
                </div>
              </div>

              <div className="w-full">
                <h2 className={H2}>
                  What We Do
                </h2>
                <div className={`${PROSE} flex flex-col items-center`}>
                  <p>OneZeroLabs works at the intersection of technology, operations, automation, and growth. We design and build:</p>
                  <div className="my-2 w-fit space-y-1 text-left">
                    <p>• Digital Platforms</p>
                    <p>• Business Websites</p>
                    <p>• Internal Systems</p>
                    <p>• AI & Automation Workflows</p>
                    <p>• Analytics Dashboards</p>
                    <p>• Operational Infrastructure</p>
                    <p>• Brand & Social Media</p>
                  </div>
                  <p>Our goal is simple: Create systems that help organizations work smarter, move faster, and scale sustainably.</p>
                </div>
              </div>

              <div className="w-full">
                <h2 className={H2}>
                  How We Think
                </h2>
                <div className={PROSE}>
                  <p>Technology alone doesn't solve problems.</p>
                  <p>A beautiful website won't fix broken processes. An AI tool won't improve operations without the right workflows. A dashboard won't create growth without meaningful insights.</p>
                  <p>That's why we focus on the entire system. Every solution we build is designed to support real business outcomes, not just deliver features.</p>
                </div>
              </div>

              <div className="w-full">
                <h2 className={H2}>
                  Our Approach
                </h2>
                <div className={PROSE}>
                  <p><strong className={STRONG}>Discover:</strong> Understand the organization, challenges, and opportunities.</p>
                  <p><strong className={STRONG}>Design:</strong> Create systems and strategies tailored to specific goals.</p>
                  <p><strong className={STRONG}>Build:</strong> Develop the technology, workflows, and infrastructure required.</p>
                  <p><strong className={STRONG}>Optimize:</strong> Continuously improve performance through data and iteration.</p>
                </div>
              </div>

              <div className="w-full">
                <h2 className={H2}>
                  Our Work
                </h2>
                <div className={`${PROSE} flex flex-col items-center`}>
                  <p>From educational institutions and startups to growing organizations, we help clients build the foundations that support long-term growth.</p>
                  <div className="my-2 w-fit space-y-1 text-left">
                    <p>• Educational Operations Platforms</p>
                    <p>• Parent & Student Portals</p>
                    <p>• Business Websites</p>
                    <p>• AI Automation Systems</p>
                    <p>• Analytics Platforms</p>
                    <p>• Operational Dashboards</p>
                    <p>• Community Platforms</p>
                  </div>
                  <p>
                    We have worked with {listNames(CLIENT_NAMES)}, from the attendance system
                    MLA Academy runs every working day to the websites that introduce Praasa
                    Consultancy and Samruddhi Pathway to their clients.
                  </p>
                </div>
              </div>

              <div className="w-full">
                <h2 className={H2}>
                  Our Vision & Mission
                </h2>
                <div className={PROSE}>
                  <p><strong className={STRONG}>Vision:</strong> To become the trusted infrastructure partner behind the next generation of ambitious organizations.</p>
                  <p><strong className={STRONG}>Mission:</strong> To help organizations build scalable systems that improve how they operate, grow, and serve their communities.</p>
                </div>
              </div>

              <div className="w-full">
                <h2 className={H2}>
                  Built by Builders
                </h2>
                <div className={PROSE}>
                  <p>OneZeroLabs is led by people who actively design, develop, and deploy the systems they recommend.</p>
                  <p>We believe the best solutions come from understanding both strategy and execution. Every project is approached with a focus on long-term value, operational clarity, and measurable impact.</p>
                </div>
              </div>

              <div className="w-full">
                <h2 className={H2}>
                  The Future
                </h2>
                <div className={PROSE}>
                  <p>As organizations become increasingly digital, the need for connected systems, intelligent workflows, and scalable infrastructure will only grow.</p>
                  <p>OneZeroLabs exists to help organizations navigate that future with confidence.</p>
                </div>
              </div>

            </div>
          </GlassCard>
        </motion.div>

        {/* FOUNDERS */}
        <div className="relative z-10 mx-auto mt-24 max-w-[1200px] md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12 px-4"
          >
            <h2 className={`${HEADING} text-center text-5xl md:text-6xl`}>
              The People Behind <span className="italic">OneZeroLabs</span>
            </h2>
          </motion.div>

          <div className="mx-auto grid max-w-[1050px] grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                // Rise only: a scale-in here would leave the photos rastered
                // soft, the same fault the SAAME console had.
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto w-full max-w-[340px] sm:max-w-none"
              >
                <GlassCard interactive innerClassName="p-2">
                  <div className="relative mb-5 aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#ECEFF4]">
                    <Image
                      src={f.img}
                      alt={f.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <p className={`px-4 pb-4 text-center font-[family-name:var(--font-instrument-serif)] text-2xl tracking-wide ${INK}`}>
                    {f.name}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Band>

      {/* FINAL CTA */}
      <CtaSection title="Build the future with OneZeroLabs." />
    </main>
  )
}
