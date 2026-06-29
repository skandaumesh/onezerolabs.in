"use client"

import { useRef } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"



export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#contact",
}) {
  const btnRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const xPercent = (x / rect.width) * 100
    btnRef.current.style.setProperty('--x', `${xPercent}%`)
  }

  return (
    <section
      id="hero"
      className="relative mx-auto w-full px-4 text-center md:px-8 
      min-h-screen overflow-hidden 
      flex flex-col items-center justify-center
      bg-[#080808] text-white pb-24 md:pb-32"
    >
      {/* 1. Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-80 h-full w-full 
        bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
        bg-[size:4rem_4rem] md:bg-[size:6rem_5rem] 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* 2. FILM GRAIN & ATMOSPHERE */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

      {/* 2. THE NEON PLANET */}

      {/* Ambient Cool White Glow (Perfect Center Shape) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
        {/* Wide Atmospheric Aura */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] 
          bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.12)_0%,rgba(148,163,184,0.08)_25%,transparent_60%)]"
        />
        {/* Focused Core Light */}
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] 
          bg-white blur-[120px] opacity-20 rounded-full mix-blend-overlay"
        />
      </div>

      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[50%] z-0 pointer-events-none">
        <div
          className="
            w-[250vw] h-[400px]
            md:w-[150vw] md:h-[350px]
            lg:w-[120vw] lg:h-[450px]
            
            rounded-[100%] bg-[#080808]
            
            /* Outer glow + Inner Rim Light (Extra Bright) */
            shadow-[0_0_160px_rgba(255,255,255,0.6),inset_0_0_60px_rgba(255,255,255,0.8)] 
            md:shadow-[0_0_160px_rgba(255,255,255,0.55),inset_0_0_80px_rgba(255,255,255,0.65)]
            lg:shadow-[0_0_200px_rgba(255,255,255,0.55),inset_0_0_100px_rgba(255,255,255,0.7)]

            bg-[radial-gradient(closest-side,#080808_80%,rgba(255,255,255,0.4))] 
            
            animate-fade-up
          "
        />
      </div>

      {/* 3. Content */}
      <div className="relative z-10 max-w-5xl flex flex-col items-center px-2 md:px-4">

        {/* Title */}
        <h1
          className="animate-fade-in text-balance 
          bg-gradient-to-br from-white to-white/40
          bg-clip-text py-2 
          text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl
          leading-[1.1] tracking-wide 
          text-transparent font-[family-name:var(--font-instrument-serif)]"
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in mt-6 mb-8 md:mb-12 text-balance 
          text-lg sm:text-lg md:text-xl 
          tracking-tight text-gray-400 
          max-w-xs sm:max-w-xl md:max-w-2xl"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          {subtitle}
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >


          <Button
            asChild
            className="w-full sm:w-fit md:min-w-[160px] h-12 px-8
            bg-transparent text-white border border-white/20 hover:bg-white/5 hover:border-white/40
            rounded-full transition-all duration-300
            font-medium font-[family-name:var(--font-geist-sans)] uppercase tracking-wide text-xs"
          >
            <a href="/contact">Start a Project</a>
          </Button>
        </div>
      </div>

      {/* 4. Bottom Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-24 w-full pointer-events-none
        bg-gradient-to-t from-black to-transparent"
      />
    </section>
  )
}