"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SegmentedControl } from "@/components/ui/segmented-control"
import Loader from "@/components/ui/loader"
import { Leaderboard } from "@/components/ui/leaderboard"
import { Sparkles } from "lucide-react"

const predefinedTopics = [
  "Family",
  "Body Parts", 
  "Colors",
  "Animals",
  "Food",
  "Nature",
]

const difficulties = [
  { label: "Easy", value: "easy", emoji: "🌱" },
  { label: "Medium", value: "medium", emoji: "🌿" },
  { label: "Hard", value: "hard", emoji: "🌳" },
]

export default function FourPicsOneWordLanding() {
  const [customTopic, setCustomTopic] = useState("")
  const [difficulty, setDifficulty] = useState("easy")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customTopic.trim()) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generation', {
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
      } else {
        setError("Invalid response. Please try again.")
      }
    } catch (error) {
      console.error("Failed to submit topic:", error)
      setError("Failed to generate game. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePredefinedClick = async (topic: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generation', {
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
      } else {
        setError("Invalid response. Please try again.")
      }
    } catch (error) {
      console.error("Failed to submit topic:", error)
      setError("Failed to generate game. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px-56px)] relative p-4">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-orange-800 via-orange-950 to-black" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
        {/* Game Form */}
        <div className="relative bg-orange-950/70 border border-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-9 text-slate-100">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 mb-3">
              <Sparkles className="w-4 h-4 text-orange-300" />
              <span className="text-xs text-slate-100">Learn Yoruba with AI</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-1">Yoruba 4 Pics 1 Word</h1>
            <p className="text-slate-200 mb-5">Learn Yoruba vocabulary through visual puzzles!</p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-orange-300/30 to-transparent mb-4" />
          </div>

          {isLoading && (
            <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-sm grid place-items-center z-10">
              <Loader label="Generating your puzzle..." />
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 text-red-200 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {/* Custom Topic Form */}
          <form onSubmit={handleCustomSubmit} className="mb-6">
            <label htmlFor="custom-topic" className="block text-base font-medium mb-2 text-slate-100">Enter a learning topic</label>
            <div className="flex gap-2">
              <input
                id="custom-topic"
                type="text"
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
                placeholder="e.g. Family, Numbers, Greetings"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-lg shadow"
              >
                {isLoading ? "Generating..." : "Learn"}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-300">Choose topics that interest you to make learning more engaging!</p>
            
            {/* Difficulty Selector */}
            <div className="mt-4">
              <label className="block text-base font-medium mb-2 text-slate-100">Choose difficulty</label>
              <SegmentedControl
                options={difficulties}
                value={difficulty}
                onChange={setDifficulty}
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-slate-300">Higher difficulty may use longer words or subtler clues.</p>
            </div>
          </form>
          
          <div className="mb-3 text-center text-slate-200 font-medium">Or select a topic</div>
          <div className="grid grid-cols-2 gap-3">
            {predefinedTopics.map(topic => (
              <button
                key={topic}
                disabled={isLoading}
                onClick={() => handlePredefinedClick(topic)}
                className="group relative overflow-hidden rounded-lg border border-white/15 bg-slate-800/70 px-5 py-3 text-slate-100 font-semibold shadow transition hover:bg-slate-700/70 disabled:opacity-60"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-500/0 to-orange-600/0 group-hover:from-orange-600/15 group-hover:via-orange-500/10 group-hover:to-orange-600/15 transition-opacity" />
                <span className="relative">{topic}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 text-center text-xs text-slate-300">You can always change topic and difficulty from the home screen.</div>
        </div>

        {/* Leaderboard */}
        <div className="lg:sticky lg:top-4">
          <Leaderboard />
        </div>
      </div>
    </div>
  )
}
