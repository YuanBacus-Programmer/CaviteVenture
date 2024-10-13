"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Image, Calendar, User, Menu, X, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/exhibit', label: 'Exhibit', icon: Image },
  { href: '/admin/event', label: 'Event', icon: Calendar },
  { href: '/admin/profile', label: 'Profile', icon: User },
]

const Navbar = () => {
  const { signOut } = useAuth() // useAuth for logout logic
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    darkModeMediaQuery.addEventListener('change', handleChange)

    return () => darkModeMediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <nav className="bg-[#fae8b4] text-gray-800 shadow-md rounded-full mx-4 my-4 p-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex-shrink-0">
              <span className="text-xl font-bold">Admin</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-[#f5d697] text-gray-900'  // Active link styling
                        : 'hover:bg-[#f5d697] hover:text-gray-900'
                    } transition-colors duration-200`}
                  >
                    <motion.div
                      className="flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
                {/* Dark Mode Toggle */}
                <motion.button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isDarkMode ? (
                    <Sun size={18} className="text-yellow-400" />
                  ) : (
                    <Moon size={18} className="text-gray-800" />
                  )}
                  <span className="sr-only">Toggle dark mode</span>
                </motion.button>
                {/* Logout Button for Desktop */}
                <motion.button
                  onClick={signOut}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white bg-[#f5d697] text-gray-900 hover:bg-[#f4c571] transition-colors duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-900 hover:bg-[#f5d697] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-700"
              aria-controls="mobile-menu" aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            id="mobile-menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? 'bg-[#f5d697] text-gray-900'
                      : 'hover:bg-[#f5d697] hover:text-gray-900'
                  } transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              {/* Logout Button for Mobile */}
              <button
                onClick={() => {
                  setIsOpen(false)
                  signOut()
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-[#f5d697] text-gray-900 hover:bg-[#f4c571] transition-colors duration-200 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
