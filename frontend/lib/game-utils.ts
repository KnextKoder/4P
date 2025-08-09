// Utility functions for the 4 Pics 1 Word game

export interface GameData {
  answer: string
  image_prompts: string[]
  image_paths: string[]
  educational_fact: string
}

export interface GenerationRequest {
  topic: string
  difficulty: "easy" | "medium" | "hard"
}

export async function generateGameData(request: GenerationRequest): Promise<GameData> {
  const response = await fetch('/api/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to generate game data')
  }

  return response.json()
}

export function generateRandomLetters(answer: string): string[] {
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
