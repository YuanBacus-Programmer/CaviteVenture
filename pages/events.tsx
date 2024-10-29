'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Image from 'next/image'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

interface Event {
  _id: string
  image: string
  title: string
  location: string
  date: string
  description: string
  approved: boolean
}

export default function TimelineEventsPage() {
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  useEffect(() => {
    async function fetchApprovedEvents() {
      try {
        const response = await fetch('/api/approved-events')
        const data = await response.json()

        if (Array.isArray(data)) {
          setApprovedEvents(data)
        } else {
          throw new Error('Invalid data format')
        }
      } catch (err) {
        setError('Failed to fetch approved events')
        console.error(err)
      }
    }

    fetchApprovedEvents()
  }, [])

  const years = Array.from(new Set(approvedEvents.map(event => new Date(event.date).getFullYear()))).sort((a, b) => a - b)

  const filteredEvents = selectedYear
    ? approvedEvents.filter(event => new Date(event.date).getFullYear() === selectedYear)
    : approvedEvents

  if (error) {
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex">
      <div className="w-24 bg-gray-100 overflow-y-auto fixed h-full">
        <div className="py-4 px-2">
          {years.map(year => (
            <motion.button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`w-full text-left py-2 px-3 rounded-lg mb-2 ${
                selectedYear === year ? 'bg-[#fae8b4]' : 'hover:bg-[#fae8b4] hover:bg-opacity-50'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {year}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="flex-1 ml-24">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Event Timeline</h1>
          <div className="relative">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div key={event._id} className="mb-16 relative">
                  <div className="flex items-start">
                    <div 
                      className="text-7xl font-bold mr-8 sticky top-4 bg-gradient-to-b from-gray-800 to-[#fae8b4] bg-clip-text text-transparent"
                      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                      {format(new Date(event.date), 'yyyy')}
                    </div>
                    <div className="flex-grow bg-gradient-to-br from-white to-[#fae8b4] p-6 rounded-lg shadow-lg">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                        <div className="mb-4 md:mb-0 md:mr-6 flex-grow">
                          <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                          <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(event.date), 'MMMM d, yyyy')} at {format(new Date(event.date), 'h:mm a')}
                          </p>
                          <p className="mt-4 text-gray-700">{event.description}</p>
                        </div>
                        {event.image && (
                          <div className="w-full md:w-1/2 lg:w-2/5">
                            <Image
                              src={event.image}
                              alt={event.title}
                              width={500}
                              height={300}
                              className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < filteredEvents.length - 1 && (
                    <div className="absolute left-12 top-24 bottom-0 w-px bg-gradient-to-b from-gray-800 to-[#fae8b4]" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-xl">No approved events available for the selected year.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}