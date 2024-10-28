'use client'

import { useRef } from "react"
import Image from "next/image"
import Link from 'next/link'
import { motion, useScroll, useTransform } from "framer-motion"
import { Merriweather } from 'next/font/google'

import ArrowIcon from "@/assets/HeaderImages/next.png"
import cogImage from "@/assets/HeroImages/cog.png"
import cylinderImage from "@/assets/HeroImages/cylinder.png"
import noodleImage from "@/assets/HeroImages/noodle.png"

const merriweather = Merriweather({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start']
  })
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <section 
      ref={heroRef} 
      className={`pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#fae8b4,#EAEEFE_100%)] overflow-x-clip ${merriweather.className}`}
    >
      <div className="container px-4 mx-auto md:px-8 lg:px-16">
        <div className="md:flex items-center">
          <motion.div 
            className="md:w-[478px] mb-10 md:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
              CaviteVenture 2.0 is here
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text mt-6">
              Pathway to new modern Exhibit
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-[#010D3E] tracking-tight mt-6">
              Explore with the app design to trace your progress, motivate your efforts
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-[30px]">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="btn btn-primary w-full sm:w-auto">Explore for Free</button>
              </Link>
              <button className="btn btn-text gap-2 flex items-center w-full sm:w-auto justify-center sm:justify-start">
                <span>Learn More</span>
                <Image src={ArrowIcon} alt="Arrow icon" height={20} width={20} className="h-5 w-5"/>
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-10 md:mt-0 md:h-[648px] md:flex-1 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="md:absolute md:h-3/4 md:w-auto md:max-w-none md:-left-6 lg:left-0"
              variants={itemVariants}
              animate={{ 
                translateY: [-30, 30],
                transition: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 3,
                  ease: "easeInOut",
                }
              }}
            >
              <Image 
                src={cogImage} 
                alt="Cog Image - representing innovation" 
                className="rounded-lg"
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
            <motion.div 
              className="hidden md:block absolute -top-8 -left-32"
              variants={itemVariants}
              style={{ translateY }}
            >
              <Image 
                src={cylinderImage} 
                alt="Cylinder Image - symbolic art" 
                width={220} 
                height={220} 
                className="rounded-lg"
                placeholder="blur"
              />
            </motion.div>
            <motion.div 
              className="hidden lg:block absolute top-[524px] left-[448px]"
              variants={itemVariants}
              style={{
                translateY,
                rotate: 30,
              }}
            >
              <Image 
                src={noodleImage} 
                width={220} 
                height={220} 
                alt="Noodle Image - conceptual art" 
                className="rounded-lg" 
                placeholder="blur"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}