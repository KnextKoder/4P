"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, RotateCcw, Trophy } from "lucide-react"
import Image from "next/image"

// Sample puzzle data
const puzzles = [
  {
    id: 1,
    images: [
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
    ],
    answer: "NATURE",
    letters: ["N", "A", "T", "U", "R", "E", "S", "P", "L", "M", "K", "F"],
  },
  {
    id: 2,
    images: [
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
    ],
    answer: "WATER",
    letters: ["W", "A", "T", "E", "R", "S", "N", "L", "M", "K", "P", "D"],
  },
  {
    id: 3,
    images: [
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
    ],
    answer: "HEAT",
    letters: ["H", "E", "A", "T", "S", "N", "L", "M", "K", "P", "R", "D"],
  },
  {
    id: 4,
    images: [
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
    ],
    answer: "SPEED",
    letters: ["S", "P", "E", "E", "D", "N", "L", "M", "K", "R", "T", "A"],
  },
  {
    id: 5,
    images: [
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
      "/placeholder.svg?height=150&width=150",
    ],
    answer: "MONEY",
    letters: ["M", "O", "N", "E", "Y", "S", "L", "P", "K", "R", "T", "A"],
  },
]

export default function FourPicsOneWord() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([])
  const [availableLetters, setAvailableLetters] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState("")

  const currentPuzzle = puzzles[currentLevel]
  const resetLevel = useCallback(() => {
    setSelectedAnswer(new Array(currentPuzzle.answer.length).fill(""))
    setAvailableLetters([...currentPuzzle.letters])
    setIsCorrect(false)
    setShowHint(false)
    setIsWrong(false)
    setWrongAnswer("")
  }, [currentPuzzle.answer.length, currentPuzzle.letters])

  useEffect(() => {
    resetLevel()
  }, [currentLevel, resetLevel])


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
    const answer = selectedAnswer.join("")
    if (answer === currentPuzzle.answer) {
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

  const nextLevel = () => {
    if (currentLevel < puzzles.length - 1) {
      setCurrentLevel(currentLevel + 1)
    }
  }

  const useHint = () => {
    if (score >= 50) {
      setShowHint(true)
      setScore(score - 50)

      // Fill in the first empty letter
      const firstEmptyIndex = selectedAnswer.findIndex((slot) => slot === "")
      if (firstEmptyIndex !== -1) {
        const correctLetter = currentPuzzle.answer[firstEmptyIndex]
        const letterIndex = availableLetters.findIndex((letter) => letter === correctLetter)
        if (letterIndex !== -1) {
          selectLetter(correctLetter, letterIndex)
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <span className="text-white font-bold text-xl">{score}</span>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Level {currentLevel + 1} / {puzzles.length}
          </Badge>
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
          {currentPuzzle.images.map((image, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <Image src={image || "/placeholder.svg"} width={150} height={150} alt={`Clue ${index + 1}`} className="w-full h-40 object-cover" />
              </CardContent>
            </Card>
          ))}
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
          <Card className="bg-green-100 border-green-300 mb-6">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Correct! 🎉</h2>
              <p className="text-green-700 mb-4">
                The answer was <strong>{currentPuzzle.answer}</strong>
              </p>
              {currentLevel < puzzles.length - 1 ? (
                <Button onClick={nextLevel} className="bg-green-600 hover:bg-green-700">
                  Next Level
                </Button>
              ) : (
                <div>
                  <p className="text-green-800 font-bold mb-2">🏆 Congratulations!</p>
                  <p className="text-green-700">You&apos;ve completed all levels!</p>
                </div>
              )}
            </CardContent>
          </Card>
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
