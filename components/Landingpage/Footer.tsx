"use client"

import React, { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const FacebookIcon = dynamic(() => import('lucide-react').then(mod => mod.Facebook))
const InstagramIcon = dynamic(() => import('lucide-react').then(mod => mod.Instagram))
const TwitterIcon = dynamic(() => import('lucide-react').then(mod => mod.Twitter))
const MailIcon = dynamic(() => import('lucide-react').then(mod => mod.Mail))
const PhoneIcon = dynamic(() => import('lucide-react').then(mod => mod.Phone))
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin))

const Footer = () => {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  const footerLinks = useMemo(() => [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Tours', href: '/tours' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ], [])

  const socialLinks = useMemo(() => [
    { name: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com/caviteventure' },
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/caviteventure' },
    { name: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com/caviteventure' },
  ], [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Cavite Venture</h2>
            <p className="mb-4">Discover the hidden gems of Cavite with us. Your journey into the heart of Philippine history and culture starts here.</p>
            <div className="flex space-x-4">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label={name}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map(({ name, href }) => (
                <li key={name}>
                  <Link 
                    href={href}
                    className={`hover:text-[#fae8b4] transition-colors duration-300 ${
                      pathname === href ? 'text-[#fae8b4]' : 'text-gray-400'
                    }`}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2" />
                <a href="mailto:info@caviteventure.com" className="hover:text-white transition-colors duration-300">
                  info@caviteventure.com
                </a>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <a href="tel:+639123456789" className="hover:text-white transition-colors duration-300">
                  +63 912 345 6789
                </a>
              </li>
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 mt-1" />
                <span>123 Adventure St., Kawit, Cavite, Philippines</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {currentYear} Cavite Venture. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
