"use client"

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const from = searchParams?.get('from')

  const handleBack = () => {
    if (from) {
      // navigate explicitly to the originating route
      router.push(from)
      return
    }

    // fallback to history back if available
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-lightblue-600 border-lightblue-600 hover:bg-lightblue-50 border"
      aria-label="Return to previous page"
    >
      Return
    </button>
  )
}
