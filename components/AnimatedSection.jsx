'use client'

import { motion } from 'framer-motion'

export default function AnimatedSection({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
  className = '',
  ...props
}) {
  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    fadeDown: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    fadeOut: {
      hidden: { opacity: 1 },
      visible: { opacity: 0 },
    },
    slideInLeft: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 },
    },
    slideInRight: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 },
    },
    slideInUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    },
    slideInDown: {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
    scaleOut: {
      hidden: { opacity: 1, scale: 1 },
      visible: { opacity: 0, scale: 0.9 },
    },
    rotateIn: {
      hidden: { opacity: 0, rotate: -10 },
      visible: { opacity: 1, rotate: 0 },
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    zoomOut: {
      hidden: { opacity: 1, scale: 1.2 },
      visible: { opacity: 1, scale: 1 },
    },
    flipX: {
      hidden: { opacity: 0, rotateX: -90 },
      visible: { opacity: 1, rotateX: 0 },
    },
    flipY: {
      hidden: { opacity: 0, rotateY: -90 },
      visible: { opacity: 1, rotateY: 0 },
    },
    blur: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
    bounceIn: {
      hidden: { opacity: 0, scale: 0.3 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }
      },
    },
  }

  // Get the selected variant or fallback to fadeUp
  const selectedVariant = variants[variant] || variants.fadeUp

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once, 
        amount,
        margin: '-50px'
      }}
      variants={selectedVariant}
      transition={{ 
        duration,
        delay,
        ease: [0.6, 0.05, 0.01, 0.9]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}