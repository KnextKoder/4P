"use client"

import React from "react"

export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-2">
      <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-white/40 border-t-white" />
      <p className="text-white/90 text-sm">{label}</p>
    </div>
  )
}

export default Loader
