"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const predefinedTopics = [
  "Chemistry",
  "Animals",
  "Nature",
  "Technologia",
  "Sports",
  "Food",
]

const difficulties = [
  { label: "Easy", value: "easy", emoji: "🧊" },
  { label: "Medium", value: "medium", emoji: "🧊🧊" },
  { label: "Hard", value: "hard", emoji: "🧊🧊🧊" },
]

export default function FourPicsOneWordLanding() {
  const [customTopic, setCustomTopic] = useState("")
  const [difficulty, setDifficulty] = useState("easy")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const backendUrl = "http://127.0.0.1:5000"


  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customTopic.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${backendUrl}/generation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: customTopic.trim(),
          difficulty: difficulty
        }),
      })

      const data = await response.json()
      console.log("Response from backend:", data)
      
      if (data.answer && data.image_prompts) {
        // Store the game data in sessionStorage and navigate to game
        sessionStorage.setItem('gameData', JSON.stringify(data))
        router.push('/topic')
      }
    } catch (error) {
      console.error("Failed to submit topic:", error)
      alert("Failed to generate game. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePredefinedClick = async (topic: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${backendUrl}/generation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: topic,
          difficulty: difficulty
        }),
      })

      const data = await response.json()
      console.log("Response from backend:", data)
      
      if (data.answer && data.image_prompts) {
        // Store the game data in sessionStorage and navigate to game
        sessionStorage.setItem('gameData', JSON.stringify(data))
        router.push('/topic')
      }
    } catch (error) {
      console.error("Failed to submit topic:", error)
      alert("Failed to generate game. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-950 to-black flex items-center justify-center p-4">
      <div className="bg-white/80 rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">4 Pics 1 Word</h1>
        
        {isLoading && (
          <div className="text-center mb-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-purple-600 mt-2">Generating your puzzle...</p>
          </div>
        )}
        
        {/* Custom Topic Form */}
        <form onSubmit={handleCustomSubmit} className="mb-6">
          <label htmlFor="custom-topic" className="block text-lg font-medium mb-2 text-gray-700">Enter a custom topic:</label>
          <div className="flex gap-2">
            <input
              id="custom-topic"
              type="text"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-100"
              placeholder="e.g. Space, Movies, History"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-bold px-4 py-2 rounded"
            >
              {isLoading ? "Generating..." : "Start"}
            </button>
          </div>
          {/* Difficulty Selector */}
          <div className="mb-6">
            <label htmlFor="difficulty-select" className="block text-lg font-medium mt-2 text-gray-700">Choose Difficulty:</label>
            <select
              id="difficulty-select"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              disabled={isLoading}
              className="w-full mt-2 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg disabled:bg-gray-100"
            >
              {difficulties.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label} {d.emoji}
                </option>
              ))}
            </select>
          </div>
        </form>
        <div className="mb-4 text-center text-gray-600 font-semibold">Or select a topic:</div>
        <div className="grid grid-cols-2 gap-3">
          {predefinedTopics.map(topic => (
            <button
              key={topic}
              disabled={isLoading}
              onClick={() => handlePredefinedClick(topic)}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-bold py-2 rounded shadow"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
