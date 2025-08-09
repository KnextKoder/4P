"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, RotateCcw, Trophy, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { generateRandomLetters } from "@/lib/game-utils"

interface GameData {
  answer: string
  english_word: string
  pronunciation: string
  image_prompts: string[]
  image_paths: string[]
  image_data: string[] // Base64 image data for serverless compatibility
  educational_fact: string
}

export default function FourPicsOneWord() {
  const router = useRouter()
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([])
  const [availableLetters, setAvailableLetters] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState("")
  const [loading, setLoading] = useState(true)
  // keyboard typing visual state removed (unused)

  // Generate random letters including the correct answer letters
  const resetLevel = useCallback(() => {
    if (!gameData) return
    setSelectedAnswer(new Array(gameData.answer.length).fill(""))
    setAvailableLetters(generateRandomLetters(gameData.answer))
    setIsCorrect(false)
    setShowHint(false)
    setIsWrong(false)
    setWrongAnswer("")
  }, [gameData])

  useEffect(() => {
    // Load game data from sessionStorage
    const storedData = sessionStorage.getItem('gameData')
    if (storedData) {
      const data = JSON.parse(storedData)
      setGameData(data)
      setLoading(false)
    } else {
      // No game data, redirect to home
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    if (gameData) {
      resetLevel()
    }
  }, [gameData, resetLevel])

  // Keyboard input handlers: letters to fill slots, backspace remove, enter check
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!gameData || isCorrect) return
      const key = e.key
      if (/^[a-zA-Z]$/.test(key)) {
        const letter = key.toUpperCase()
        const idx = availableLetters.findIndex(l => l === letter)
        if (idx !== -1) {
          e.preventDefault()
          selectLetter(letter, idx)
        }
      } else if (key === 'Backspace') {
        e.preventDefault()
        const lastFilled = [...selectedAnswer].map((l, i) => ({ l, i })).filter(x => x.l !== "").pop()
        if (lastFilled) removeLetter(lastFilled.i)
      } else if (key === 'Enter') {
        if (!selectedAnswer.includes("")) checkAnswer()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gameData, availableLetters, selectedAnswer, isCorrect])


  const selectLetter = (letter: string, index: number) => {
    const firstEmptyIndex = selectedAnswer.findIndex((slot) => slot === "")
    if (firstEmptyIndex !== -1) {
      const newAnswer = [...selectedAnswer]
      newAnswer[firstEmptyIndex] = letter
      setSelectedAnswer(newAnswer)

      const newAvailable = [...availableLetters]
      newAvailable.splice(index, 1)
      setAvailableLetters(newAvailable)
    }
  }

  const removeLetter = (index: number) => {
    if (selectedAnswer[index] !== "") {
      const letter = selectedAnswer[index]
      const newAnswer = [...selectedAnswer]
      newAnswer[index] = ""
      setSelectedAnswer(newAnswer)

      setAvailableLetters([...availableLetters, letter])
    }
  }

  const checkAnswer = () => {
    if (!gameData) return
    const answer = selectedAnswer.join("")
    if (answer === gameData.answer.toUpperCase()) {
      setIsCorrect(true)
      setScore(score + 100)
      setIsWrong(false)
    } else {
      setIsWrong(true)
      setWrongAnswer(answer)
      // Clear wrong answer after 2 seconds
      setTimeout(() => {
        setIsWrong(false)
        setWrongAnswer("")
      }, 2000)
    }
  }

  const playAgain = () => {
    router.push('/')
  }

  const useHint = () => {
    if (!gameData || score < 50) return
    
    if (score >= 50) {
      setShowHint(true)
      setScore(score - 50)

      // Fill in the first empty letter
      const firstEmptyIndex = selectedAnswer.findIndex((slot) => slot === "")
      if (firstEmptyIndex !== -1) {
        const correctLetter = gameData.answer.toUpperCase()[firstEmptyIndex]
        const letterIndex = availableLetters.findIndex((letter) => letter === correctLetter)
        if (letterIndex !== -1) {
          selectLetter(correctLetter, letterIndex)
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px-56px)] relative flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/40 via-slate-950 to-black" />
        <div className="text-white/90 text-2xl">Loading your game...</div>
      </div>
    )
  }

  if (!gameData) {
    return (
      <div className="min-h-[calc(100vh-56px-56px)] flex items-center justify-center">
        <div className="text-white text-2xl">No game data found. Please start a new game.</div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-56px-56px)] relative p-4">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/40 via-slate-950 to-black" />
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 rounded-full bg-yellow-400/10 ring-1 ring-yellow-300/30 px-3 py-1.5">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold text-lg leading-none">{score}</span>
          </div>
          {gameData?.answer && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-100 ring-1 ring-inset ring-orange-300/30">
                {gameData.answer.length} letters
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={useHint}
            disabled={score < 50}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
          >
            <Lightbulb className="w-4 h-4 mr-1 text-yellow-300" />
            Hint
            <span className="ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80 ring-1 ring-white/15">-50</span>
          </Button>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {gameData.image_data && gameData.image_data.length > 0 ? (
            // Use base64 image data (serverless-compatible)
            gameData.image_data.map((base64Data, index) => (
              <Card key={index} className="group overflow-hidden border-white/10 bg-white/5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_38px_-12px_rgba(0,0,0,0.6)] transition-shadow">
                <CardContent className="p-0">
                  <Image
                    src={`data:image/png;base64,${base64Data}`}
                    width={400}
                    height={300}
                    alt={`Clue ${index + 1}`}
                    className="w-full aspect-square md:aspect-[4/3] object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                  />
                </CardContent>
              </Card>
            ))
          ) : gameData.image_paths && gameData.image_paths.length > 0 ? (
            // Fallback to file paths (local development)
            gameData.image_paths.map((filename, index) => (
              <Card key={index} className="group overflow-hidden border-white/10 bg-white/5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_38px_-12px_rgba(0,0,0,0.6)] transition-shadow">
                <CardContent className="p-0">
                  <Image
                    src={`/generated_images/${filename}`}
                    width={400}
                    height={300}
                    alt={`Clue ${index + 1}`}
                    className="w-full aspect-square md:aspect-[4/3] object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                  />
                </CardContent>
              </Card>
            ))
          ) : (
            // Fallback if no images are generated yet
            Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="rounded-lg border border-white/10 bg-white/5 h-40 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/0 animate-[shimmer_1.2s_infinite]" />
              </div>
            ))
          )}
        </div>

        {/* Answer Slots */}
    <div className={`flex justify-center gap-2.5 mb-6 ${isWrong ? "animate-shake" : ""}`}>
          {selectedAnswer.map((letter, index) => (
            <Button
              key={index}
              variant="outline"
      className={`w-14 h-14 text-2xl font-bold border-2 rounded-md shadow-sm transition-colors ${
                isWrong
                  ? "bg-red-100/20 border-red-300/60 text-red-100"
                  : letter
                  ? "bg-white text-slate-900 border-white hover:bg-white/90"
                  : "bg-white/5 text-white/70 border-white/20 hover:bg-white/10"
              }`}
              onClick={() => removeLetter(index)}
            >
              {letter}
            </Button>
          ))}
        </div>

        {/* Available Letters */}
    <div className="grid grid-cols-6 gap-2.5 mb-24">
          {availableLetters.map((letter, index) => (
            <Button
              key={index}
              variant="secondary"
      className="h-14 text-xl font-bold bg-white text-slate-900 hover:bg-white/90 active:translate-y-[1px] border border-white shadow-sm"
              onClick={() => selectLetter(letter, index)}
            >
              {letter}
            </Button>
          ))}
        </div>

        {/* Action Buttons - sticky on mobile */}
        <div className="fixed left-0 right-0 bottom-16 md:static md:bottom-auto md:mb-6 flex gap-4 justify-center px-4 py-3 bg-slate-900/60 supports-[backdrop-filter]:bg-slate-900/30 backdrop-blur border-t border-white/10">
          <Button
            onClick={checkAnswer}
            disabled={selectedAnswer.includes("") || isCorrect}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg border border-white/10 shadow"
          >
            Check Answer
          </Button>
          <Button
            variant="outline"
            onClick={resetLevel}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Success Message */}
        {isCorrect && (
          <div className="fixed inset-0 bg-orange-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Confetti */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="confetti-piece" />
              ))}
            </div>
            <Card className="max-w-md w-full mx-auto border-white/20 bg-orange-500/20 text-white shadow-2xl">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Ẹ kú se! 🎉</h2>
                <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-100 mb-2">
                      <span className="text-2xl">{gameData.answer}</span>
                    </p>
                    <p className="text-orange-200 text-sm mb-1">
                      Pronunciation: <span className="font-semibold">{gameData.pronunciation || 'Not available'}</span>
                    </p>
                    <p className="text-orange-200 text-sm">
                      English: <span className="font-semibold">{gameData.english_word || 'Not available'}</span>
                    </p>
                  </div>
                </div>
                {gameData.educational_fact && (
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-4 text-left">
                    <h3 className="text-blue-200 font-semibold mb-2 flex items-center">
                      <span className="mr-2">💡</span> Did you know?
                    </h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {gameData.educational_fact}
                    </p>
                  </div>
                )}
                <div className="flex justify-center">
                  <Button onClick={playAgain} className="bg-orange-600 hover:bg-orange-700 text-white">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Message */}
        {isWrong && (
          <Card className="bg-red-500/10 border-red-400/40 mb-6 animate-pulse">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold text-red-200 mb-2">Wrong Answer! ❌</h2>
              <p className="text-red-200/90 mb-2">
                <strong>&quot;{wrongAnswer}&quot;</strong> is not correct.
              </p>
              <p className="text-red-200/80 text-sm">Try again! Look carefully at the images.</p>
            </CardContent>
          </Card>
        )}

        {/* Hint Display */}
        {showHint && (
          <Card className="bg-blue-500/10 border-blue-400/30 mb-6">
            <CardContent className="p-4 text-center">
              <p className="text-blue-100">💡 Hint: Think about what all four images have in common!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
