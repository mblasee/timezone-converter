"use client"

import dynamic from 'next/dynamic'

const TimezoneConverter = dynamic(() => import('@/components/TimezoneConverter'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <TimezoneConverter />
    </main>
  )
}