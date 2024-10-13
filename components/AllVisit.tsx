"use client"

import React, { useEffect, useState } from 'react'
import { Eye, ArrowUp } from "lucide-react"
import ReactGA from 'react-ga4'

// Initialize Google Analytics
const TRACKING_ID = "G-CYXR77JX4L"; // Replace with your GA4 Measurement ID
ReactGA.initialize(TRACKING_ID)

// Custom Card components
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
)

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
)

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
)

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
)

export default function VisitCounter() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Page view tracking for Google Analytics
    try {
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to send pageview to Google Analytics:', err)
      setError('Failed to send pageview to Google Analytics')
      setIsLoading(false);
    }
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
        <Eye className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <>
            <div className="text-2xl font-bold">Tracked via Google Analytics</div>
            <p className="text-xs text-gray-500">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                <ArrowUp className="mr-1 h-3 w-3" />
                Live
              </span>
              Monitored with Google Analytics
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
