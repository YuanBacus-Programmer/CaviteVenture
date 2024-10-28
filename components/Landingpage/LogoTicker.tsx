'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'

import acmeLogo from '@/assets/LogoTickerImages/logo-acme.png'
import quantumLogo from '@/assets/LogoTickerImages/logo-quantum.png'
import echoLogo from '@/assets/LogoTickerImages/logo-echo.png'
import celestialLogo from '@/assets/LogoTickerImages/logo-celestial.png'

const logos = [
  { src: acmeLogo, alt: 'Acme Logo' },
  { src: quantumLogo, alt: 'Quantum Logo' },
  { src: echoLogo, alt: 'Echo Logo' },
  { src: celestialLogo, alt: 'Celestial Logo' },
]

export default function LogoTicker() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const totalWidth = scrollContainer.scrollWidth

    let currentScroll = 0
    let animationFrameId: number

    const animate = () => {
      currentScroll += 1
      if (currentScroll >= totalWidth / 2) {
        currentScroll = 0
      }
      scrollContainer.style.transform = `translateX(-${currentScroll}px)`
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div className="py-8 md:py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)]">
          <div 
            ref={scrollRef}
            className="flex gap-8 sm:gap-10 md:gap-14 lg:gap-20"
            style={{ width: 'max-content' }}
          >
            {[...logos, ...logos, ...logos].map((logo, index) => (
              <div key={index} className="flex-shrink-0">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  className="w-20 h-auto sm:w-24 md:w-28 lg:w-32 object-contain"
                  width={128}
                  height={85}
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                  priority={index < 4}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}