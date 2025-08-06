"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, RotateCcw, Trophy, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface GameData {
  answer: string
  image_prompts: string[]
  image_paths: string[]
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

  // Generate random letters including the correct answer letters
  const generateRandomLetters = (answer: string) => {
    const answerLetters = answer.toUpperCase().split('')
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    
    // Calculate how many extra letters we need to reach 12 total
    const extraLettersNeeded = 12 - answerLetters.length
    
    // Get letters that aren't in the answer
    const availableExtraLetters = allLetters.filter(letter => !answerLetters.includes(letter))
    
    // Randomly select the needed extra letters
    const extraLetters = availableExtraLetters
      .sort(() => Math.random() - 0.5)
      .slice(0, extraLettersNeeded)
    
    // Combine answer letters with extra letters and shuffle
    const finalLetters = [...answerLetters, ...extraLetters].sort(() => Math.random() - 0.5)
    
    // Ensure we always have exactly 12 letters
    if (finalLetters.length !== 12) {
      console.warn(`Expected 12 letters, but got ${finalLetters.length}. Answer: "${answer}"`)
    }
    
    return finalLetters
  }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-950 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading your game...</div>
      </div>
    )
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-950 to-black flex items-center justify-center">
        <div className="text-white text-2xl">No game data found. Please start a new game.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-950 to-black p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <span className="text-white font-bold text-xl">{score}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={useHint}
            disabled={score < 50}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Hint (50)
          </Button>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {gameData.image_paths && gameData.image_paths.length > 0 ? (
            gameData.image_paths.map((filename, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <Image 
                    src={`/generated_images/${filename}`} 
                    width={150} 
                    height={150} 
                    alt={`Clue ${index + 1}`} 
                    className="w-full h-40 object-cover" 
                  />
                </CardContent>
              </Card>
            ))
          ) : (
            // Fallback if no images are generated yet
            Array.from({ length: 4 }, (_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0 flex items-center justify-center h-40 bg-gray-200">
                  <div className="text-gray-500 text-center p-2">
                    {gameData.image_prompts[index]?.substring(0, 50)}...
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Answer Slots */}
        <div className={`flex justify-center gap-2 mb-8 ${isWrong ? "animate-bounce" : ""}`}>
          {selectedAnswer.map((letter, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-12 h-12 text-xl font-bold border-2 hover:bg-gray-50 ${
                isWrong ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-300"
              }`}
              onClick={() => removeLetter(index)}
            >
              {letter}
            </Button>
          ))}
        </div>

        {/* Available Letters */}
        <div className="grid grid-cols-6 gap-2 mb-8">
          {availableLetters.map((letter, index) => (
            <Button
              key={index}
              variant="secondary"
              className="h-12 text-lg font-bold bg-white/90 hover:bg-white border border-gray-200"
              onClick={() => selectLetter(letter, index)}
            >
              {letter}
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <Button
            onClick={checkAnswer}
            disabled={selectedAnswer.includes("") || isCorrect}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
          >
            Check Answer
          </Button>
          <Button
            variant="outline"
            onClick={resetLevel}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 px-6 py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Success Message */}
        {isCorrect && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-3xl bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="bg-green-100 border-green-300 max-w-md w-full mx-auto">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold text-green-800 mb-3">Correct! 🎉</h2>
                <p className="text-green-700 mb-4">
                  The answer was <strong>{gameData.answer.toUpperCase()}</strong>
                </p>
                {gameData.educational_fact && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="text-blue-800 font-semibold mb-2 flex items-center justify-center">
                      💡 Did you know?
                    </h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      {gameData.educational_fact}
                    </p>
                  </div>
                )}
                <Button onClick={playAgain} className="bg-green-600 hover:bg-green-700">
                  Play Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Message */}
        {isWrong && (
          <Card className="bg-red-100 border-red-300 mb-6 animate-pulse">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold text-red-800 mb-2">Wrong Answer! ❌</h2>
              <p className="text-red-700 mb-2">
                <strong>&quot;{wrongAnswer}&quot;</strong> is not correct.
              </p>
              <p className="text-red-600 text-sm">Try again! Look more carefully at the images.</p>
            </CardContent>
          </Card>
        )}

        {/* Hint Display */}
        {showHint && (
          <Card className="bg-blue-100 border-blue-300 mb-6">
            <CardContent className="p-4 text-center">
              <p className="text-blue-800">💡 Hint: Think about what all four images have in common!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
