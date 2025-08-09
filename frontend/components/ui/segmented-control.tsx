"use client"

import React from "react"

type SegmentOption = {
  label: string
  value: string
  emoji?: string
}

interface SegmentedControlProps {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function SegmentedControl({ options, value, onChange, disabled, className }: SegmentedControlProps) {
  const activeIndex = Math.max(0, options.findIndex(o => o.value === value))

  return (
    <div
      className={
        `relative w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-md p-1 flex gap-1 ${className ?? ""}`
      }
      role="tablist"
      aria-label="Difficulty selector"
    >
      {/* Active indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm transition-transform duration-200 ease-out"
        style={{
          width: `calc(${100 / options.length}% - 0.25rem)`,
          transform: `translateX(calc(${activeIndex} * (100% + 0.25rem)))`,
        }}
        aria-hidden
      />
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={selected}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`relative z-10 flex-1 px-3 py-2 text-sm md:text-base font-medium rounded-md transition-colors
            ${selected ? "text-blue-900" : "text-white/80 hover:text-white"} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <span className="inline-flex items-center gap-1 justify-center">
              {opt.label}
              {opt.emoji ? <span aria-hidden>{opt.emoji}</span> : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
