'use client'

import { motion } from 'framer-motion'
import { Landmark, Sailboat, Mountain } from 'lucide-react'

export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#fae8b4] to-[#f0d78c]">
      <div className="relative w-64 h-64">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Landmark className="w-16 h-16 text-[#8b7b4b]" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border-4 border-[#8b7b4b] rounded-full border-t-transparent" />
        </motion.div>
        <motion.div
          className="absolute top-0 left-0"
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mountain className="w-8 h-8 text-[#4a6741]" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0"
          initial={{ x: 0 }}
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sailboat className="w-8 h-8 text-[#3a5a7c]" />
        </motion.div>
      </div>
      <motion.h2
        className="absolute bottom-10 text-2xl font-bold text-[#8b7b4b]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        CaviteVenture
      </motion.h2>
    </div>
  )
}