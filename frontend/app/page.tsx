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

const difficulties = [
  { label: "Easy", value: "easy", emoji: "🧊" },
  { label: "Medium", value: "medium", emoji: "🧊🧊" },
  { label: "Hard", value: "hard", emoji: "🧊🧊🧊" },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const llmPrompt = (topic: string, difficulty: string, contextSnippet: string = "") => `
# 4 Pics 1 Word Puzzle Generation

## Context
Topic: **${topic}**
Difficulty: **${difficulty}**
${contextSnippet ? `\nAdditional context:\n${contextSnippet}\n` : ""}

## Instructions
- Think of a single English word related to the topic and difficulty above.
- Output a JSON object with:
  - \`answer\`: the one word answer (uppercase, no spaces)
  - \`image_prompts\`: an array of 4 descriptive and creative prompts for generating images that represent the answer, but do not directly show or write the word itself. Each prompt should be clear and visually distinct, and should not mention the answer word, only subtly hint to the word, like the classic game.

## Output Format
\`\`\`json
{
  "answer": "EXAMPLE",
  "image_prompts": [
    "Prompt for image 1",
    "Prompt for image 2",
    "Prompt for image 3",
    "Prompt for image 4"
  ]
}
\`\`\`
`

export default function FourPicsOneWordLanding() {
  const [customTopic, setCustomTopic] = useState("")
  const [difficulty, setDifficulty] = useState("easy")
  const router = useRouter()

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customTopic.trim()) {
      // PRE-LLM
      router.push(`/topic?name=${encodeURIComponent(customTopic.trim())}&difficulty=${difficulty}`)
    }
  }

  const handlePredefinedClick = (topic: string) => {
    router.push(`/topic?name=${encodeURIComponent(topic)}&difficulty=${difficulty}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-950 to-black flex items-center justify-center p-4">
      <div className="bg-white/80 rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">4 Pics 1 Word</h1>
        {/* Custom Topic Form */}
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
          {/* Difficulty Selector */}
          <div className="mb-6">
            <label htmlFor="difficulty-select" className="block text-lg font-medium mt-2 text-gray-700">Choose Difficulty:</label>
            <select
              id="difficulty-select"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
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
