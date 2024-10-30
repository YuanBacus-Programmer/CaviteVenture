'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, LayoutDashboard, Image, Calendar, User, Menu, X } from 'lucide-react'
import Confetti from 'react-confetti'

interface NavItemProps {
  href: string
  label: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItemProps[] = [
  { href: '/home', label: 'Home', icon: LayoutDashboard },
  { href: '/exhibit', label: 'Exhibit', icon: Image },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const pathname = usePathname() ?? ''
  const router = useRouter() // Access router to navigate
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const signOut = () => {
    console.log('Signing out...')
    // Clear tokens and other stored data
    localStorage.removeItem('authToken')
    localStorage.clear() // Optionally clear all local storage data

    // Trigger confetti and redirect after delay
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      router.push('/signin') // Navigate to /signin
    }, 3000)
  }

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <motion.nav
        className="bg-[#fae8b4] text-[#574a24] shadow-lg rounded-lg mx-4 my-4 p-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/home" className="flex-shrink-0">
              <motion.span
                className="text-xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cavite Venture
              </motion.span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {NAV_ITEMS.map((item) => (
                  <NavItem key={item.href} item={item} pathname={pathname} />
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <motion.button
                onClick={signOut}
                className="px-4 py-2 rounded-lg text-sm font-bold text-[#fae8b4] bg-[#574a24] hover:bg-[#80775c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cbbd93] transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </motion.button>
            </div>
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#574a24] hover:text-[#80775c] hover:bg-[#cbbd93] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#80775c]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {NAV_ITEMS.map((item) => (
                  <NavItem key={item.href} item={item} pathname={pathname} mobile />
                ))}
                <motion.button
                  onClick={signOut}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-bold text-[#fae8b4] bg-[#574a24] hover:bg-[#80775c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cbbd93] transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

interface NavItemComponentProps {
  item: NavItemProps
  pathname: string
  mobile?: boolean
}

function NavItem({ item, pathname, mobile = false }: NavItemComponentProps) {
  const isActive = pathname === item.href

  const baseClasses = `${
    mobile ? 'block' : 'inline-flex'
  } px-3 py-2 rounded-lg text-sm font-bold transition-colors duration-200`

  const activeClasses = isActive
    ? 'bg-[#cbbd93] text-[#574a24]'
    : 'text-[#574a24] hover:bg-[#cbbd93] hover:text-[#80775c]'

  return (
    <Link href={item.href} className={`${baseClasses} ${activeClasses}`}>
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <item.icon className="w-4 h-4" />
        <span>{item.label}</span>
      </motion.div>
    </Link>
  )
}
