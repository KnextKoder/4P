"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const predefinedTopics = [
  "Porn",
  "Animals",
  "Nature",
  "Technologia",
  "Sports",
  "Food",
]

export default function FourPicsOneWordLanding() {
  const [customTopic, setCustomTopic] = useState("")
  const router = useRouter()

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customTopic.trim()) {
      router.push(`/topic?name=${encodeURIComponent(customTopic.trim())}`)
    }
  }

  const handlePredefinedClick = (topic: string) => {
    router.push(`/topic?name=${encodeURIComponent(topic)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white/80 rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">4 Pics 1 Word</h1>
        <form onSubmit={handleCustomSubmit} className="mb-6">
          <label htmlFor="custom-topic" className="block text-lg font-medium mb-2 text-gray-700">Enter a custom topic:</label>
          <div className="flex gap-2">
            <input
              id="custom-topic"
              type="text"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="e.g. Space, Movies, History"
            />
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded"
            >
              Start
            </button>
          </div>
        </form>
        <div className="mb-4 text-center text-gray-600 font-semibold">Or select a topic:</div>
        <div className="grid grid-cols-2 gap-3">
          {predefinedTopics.map(topic => (
            <button
              key={topic}
              onClick={() => handlePredefinedClick(topic)}
              className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 rounded shadow"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
