"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Dynamic imports for icons to reduce initial load
const MenuIcon = dynamic(() => import("lucide-react").then((mod) => mod.Menu))
const CloseIcon = dynamic(() => import("lucide-react").then((mod) => mod.X))

import Logo from "@/assets/HeaderImages/logosaas.png"
import arrowRightUrl from "@/assets/HeaderImages/next (1).png"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const menuVariants = useMemo(() => ({
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
  }), [])

  const modalVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }), [])

  const headerSlideIn = useMemo(() => ({
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50, duration: 0.5 },
    },
  }), [])

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) {
      setIsMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  const handleEventClick = () => setIsModalOpen(true)
  const handleModalClose = () => setIsModalOpen(false)
  const handleContinue = () => {
    setIsModalOpen(false)
    router.push("/signup")
  }

  return (
    <header className="sticky top-0 z-20 bg-white/30 backdrop-blur-sm shadow-sm">
      <motion.div
        variants={headerSlideIn}
        initial="hidden"
        animate="visible"
        className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3"
      >
        <p className="text-white/60 hidden md:block">
          Explore CaviteVenture in a more Modern world
        </p>
        <Link href="/signup" className="inline-flex gap-1 items-center group">
          <motion.p
            whileHover={{ color: "#fae8b4" }}
            transition={{ duration: 0.2 }}
            className="font-bold uppercase"
          >
            Get Started for Free
          </motion.p>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src={arrowRightUrl}
              alt="Arrow right icon"
              height={16}
              width={16}
              className="h-4 w-4 inline-flex justify-center items-center group-hover:translate-x-1 transition-transform duration-300"
              priority
            />
          </motion.div>
        </Link>
      </motion.div>

      <div className="py-5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="Saas logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <span className="text-lg font-bold text-black">CAVITEVENTURE</span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-black hover:bg-gray-200 rounded-md transition-colors duration-200"
          >
            {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </button>

          <nav className="hidden md:flex gap-6 text-black/60 items-center">
            {['Home', 'About'].map((link) => (
              <motion.div key={link} variants={menuVariants} initial="hidden" animate="visible">
                <Link
                  href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  className="font-bold uppercase hover:text-[#fae8b4] transition-colors duration-300"
                >
                  {link}
                </Link>
              </motion.div>
            ))}
            <motion.button
              onClick={handleEventClick}
              className="font-bold uppercase text-black/60 hover:text-[#fae8b4] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Events
            </motion.button>
            <Link href="/signup">
              <button className="bg-black text-white px-4 py-2 rounded-lg font-bold uppercase hover:bg-black/80 transition-colors duration-200">
                Explore for Free
              </button>
            </Link>
          </nav>

          {isMenuOpen && (
            <AnimatePresence>
              <motion.div
                className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-30 md:hidden"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuVariants}
              >
                <div className="flex flex-col p-4 gap-4">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="self-end p-2 text-black hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    <CloseIcon className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </button>
                  {['Home', 'About'].map((link) => (
                    <Link
                      key={link}
                      href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                      className="font-bold uppercase hover:text-[#fae8b4] transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleEventClick()
                    }}
                    className="font-bold uppercase text-left hover:text-[#fae8b4] transition-colors duration-300"
                  >
                    Events
                  </button>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-black text-white px-4 py-2 rounded-lg font-bold uppercase hover:bg-black/80 transition-colors duration-200">
                      Explore for Free
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {isModalOpen && (
            <AnimatePresence>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
              >
                <motion.div
                  className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 sm:mx-auto"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold mb-4 uppercase text-center">Sign In Required</h2>
                  <p className="mb-6 font-semibold text-center">Only signed-in users can access the event page.</p>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      onClick={handleModalClose}
                      className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors duration-200 font-bold uppercase"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                    <motion.button
                      onClick={handleContinue}
                      className="px-4 py-2 bg-black text-white rounded hover:bg-black/80 transition-colors duration-200 font-bold uppercase"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </header>
  )
}
