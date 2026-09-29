"use client"

import { motion } from "framer-motion"

/**
 * Staggered word reveal: each word rises into place a beat after the one
 * before it, once, when the block first scrolls into view.
 *
 * Written as .jsx rather than the source's .tsx -- this project has no
 * tsconfig.json, so a .tsx file here would not be type-checked by anything and
 * would just be the odd one out in a directory of .jsx.
 *
 * WHY WORDS AND NOT CHARACTERS: splitting on spaces keeps each word a single
 * inline-block, so the browser still line-breaks between them normally. Per
 * character you would have to reimplement wrapping yourself, and screen readers
 * read the result letter by letter.
 *
 * WHY NOT useInView: the upstream version drives this from the `useInView`
 * hook. This site runs Lenis smooth scrolling, and every reveal on the page that
 * fires reliably uses framer's `whileInView` with variants instead -- the doors
 * grid and the CTA card both do. Matching that puts this on the same proven path
 * rather than a second, differently-behaving mechanism.
 *
 * `fadeFrom`/`fadeTo` paint the tonal ramp per word instead of leaning on a
 * `background-clip: text` gradient on the parent. That matters here, it is not a
 * style preference: under background-clip the glyphs carry no colour of their
 * own, they are transparent and the ancestor's background shows through. As soon
 * as a word animates, its opacity and transform composite it into its own layer
 * and the ancestor's clip does not reach inside -- so the word is invisible for
 * the entire animation and only appears once the layer collapses at the end.
 * Giving each word a real colour keeps it painted the whole way up.
 */

// Straight per-channel interpolation between two hex colours. Good enough for a
// short ramp across a handful of words; nothing here needs a perceptual space.
function mixHex(from, to, t) {
  const parse = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [r1, g1, b1] = parse(from)
  const [r2, g2, b2] = parse(to)
  const ch = (a, b) => Math.round(a + (b - a) * t)
  return `rgb(${ch(r1, r2)}, ${ch(g1, g2)}, ${ch(b1, b2)})`
}

export function WordsPullUp({
  text,
  className = "",
  style,
  delayStep = 0.08,
  startDelay = 0,
  rise = 28,
  fadeFrom,
  fadeTo,
  showAsterisk = false,
  // "view"    -- reveal when scrolled into view (default, for mid-page blocks)
  // "mount"   -- reveal immediately (for a hero, which is already on screen;
  //              waiting for a viewport trigger there just risks never firing)
  // "inherit" -- take the state from an animating motion parent
  trigger = "view",
}) {
  const words = text.split(" ")

  // The stagger lives on the container, so the children carry no per-index
  // delay of their own and the timing stays in one place.
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: delayStep, delayChildren: startDelay },
    },
  }

  const item = {
    hidden: { y: rise, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <motion.span
      variants={container}
      // `inherit` drops this element's own trigger so framer propagates the
      // parent's variant state down instead. Use it when the block already sits
      // inside a motion parent that animates on view: two independent
      // viewport triggers on nested elements is the arrangement that kept
      // failing here, and one trigger driving the whole tree does not.
      {...(trigger === "inherit"
        ? {}
        : trigger === "mount"
        ? { initial: "hidden", animate: "visible" }
        : {
            initial: "hidden",
            whileInView: "visible",
            // once: the reveal is an entrance, not a scroll effect -- replaying
            // it every time the section re-enters the viewport reads as a glitch.
            viewport: { once: true, amount: 0.2 },
          })}
      className={`inline-flex flex-wrap ${className}`}
      style={style}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={item}
          className="relative inline-block"
          style={{
            // The space between words is a margin, because inline-block
            // collapses the whitespace that used to separate them.
            marginRight: i === words.length - 1 ? 0 : "0.25em",
            ...(fadeFrom && fadeTo
              ? {
                  color: mixHex(fadeFrom, fadeTo, words.length < 2 ? 0 : i / (words.length - 1)),
                  WebkitTextFillColor: "currentcolor",
                }
              : null),
          }}
        >
          {word}
          {/* Sized and placed in `em` so it tracks the heading it hangs off,
              whether that is 64px or 20vw. */}
          {showAsterisk && i === words.length - 1 && (
            <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
          )}
        </motion.span>
      ))}
    </motion.span>
  )
}
