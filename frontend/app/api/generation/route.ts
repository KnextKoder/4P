  import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Groq from "groq-sdk";
import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize Google GenAI client
const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY
});

  // Request validation schema
  const GenerationRequest = z.object({
    topic: z.string().min(1, "Topic is required"),
    difficulty: z.enum(["easy", "medium", "hard"])
  })

// Response type
interface GeneratedResponse {
  answer: string
  english_word: string
  image_prompts: string[]
  image_paths: string[]
  image_data: string[] // Base64 image data for serverless compatibility
  educational_fact: string
  pronunciation: string
}  export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      console.log("Received request for generation")
      console.log("Received data:", body)

      // Validate request
      const validatedData = GenerationRequest.parse(body)
      const { topic, difficulty } = validatedData

      console.log("Sending request to Groq model")

      const prompt = `You are helping with a Yoruba language learning game that uses the 4-Pics-1-Word format.
        Think of a common English word relating to the topic '${topic}' and difficulty '${difficulty}'.
        Then provide the Yoruba translation of that word (this will be the answer users need to guess).
        Generate four very distinct image prompts that clearly show the concept/object, making it easy to understand what the word represents.
        Also provide the pronunciation guide for the Yoruba word and an interesting fact about the word or concept.

        Difficulty levels:
        - easy: Basic everyday words (family, body parts, colors, numbers 1-10)
        - medium: Common objects, actions, and concepts
        - hard: More complex vocabulary, cultural concepts, or advanced terms

        Produce an output JSON Object format ; for example:
        {"answer": "omi", "english_word": "water", "pronunciation": "oh-mee", "image_prompts": ["A clear glass of drinking water", "A flowing river with clean water", "Rain drops falling from clouds", "A water bottle on a table"], "educational_fact": "Water (omi) is considered sacred in Yoruba culture and plays important roles in traditional ceremonies and rituals."}`
      
      // Call Groq API using SDK
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an AI assistant helping with a 4-Pics-1-Word-type game."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "moonshotai/kimi-k2-instruct",
        response_format: {
          type: "json_object"
        }
      })

      console.log("Received response from Groq model")
      
      const content = chatCompletion.choices[0]?.message?.content
      if (!content) {
        return NextResponse.json(
          { error: "No content returned from model" },
          { status: 500 }
        )
      }

      console.log("Response content:", content)

      // Parse the model's response
      type RawModel = {
        answer?: string
        english_word?: string
        pronunciation?: string
        image_prompts?: string[]
        educational_fact?: string
      }
      let rawResult: RawModel
      try {
        rawResult = JSON.parse(content) as RawModel
      } catch (e) {
        console.error("Error parsing model response as JSON:", e)
        return NextResponse.json(
          { error: "Failed to parse model response as JSON", raw_response: content },
          { status: 500 }
        )
      }

      // Validate the response structure
      if (!rawResult.answer || !rawResult.english_word || !rawResult.image_prompts || !Array.isArray(rawResult.image_prompts)) {
        return NextResponse.json(
          { error: "Invalid response format from model" },
          { status: 500 }
        )
      }

      // Generate images in parallel using the image generation function
      console.log("Generating images for prompts...")
      const imageGenerationPromises = rawResult.image_prompts.map(async (imagePrompt: string, index: number) => {
        try {
          const imageData = await generateImage(imagePrompt, index)
          if (imageData) {
            console.log(`Generated image for prompt: ${imagePrompt.substring(0, 50)}...`)
            return imageData
          } else {
            console.log(`Failed to generate image for prompt: ${imagePrompt.substring(0, 50)}...`)
            return null
          }
        } catch (error) {
          console.error(`Error generating image for prompt '${imagePrompt.substring(0, 50)}...':`, error)
          return null
        }
      })

      const imageResults = await Promise.all(imageGenerationPromises)
      const imageDataArray = imageResults.filter(data => data !== null) as string[]

      const result: GeneratedResponse = {
        answer: rawResult.answer!,
        english_word: rawResult.english_word || "unknown",
        pronunciation: rawResult.pronunciation || "",
        image_prompts: rawResult.image_prompts!,
        image_paths: [], // Empty for serverless compatibility
        image_data: imageDataArray, // Base64 image data
        educational_fact: rawResult.educational_fact || `${rawResult.answer} is an interesting Yoruba word to learn!`
      }

      console.log("Final result:", JSON.stringify(result, null, 2))

      return NextResponse.json(result)

    } catch (error) {
      console.error("Internal server error:", error)
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }

  // Image generation function using Google Gemini - returns base64 data for serverless compatibility
  async function generateImage(prompt: string, index: number): Promise<string | null> {
    try {
      if (!process.env.GOOGLE_AI_API_KEY) {
        console.error("Google AI API key not found")
        return null
      }
      
      console.log(`Generating image ${index + 1} for prompt: ${prompt.substring(0, 50)}...`)
      
      // Generate image using Google GenAI
      const response = await genai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      })

      // Process the response to extract the base64 image data
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            console.log(`Image generation text response: ${part.text}`)
          } else if (part.inlineData && part.inlineData.data) {
            const imageData = part.inlineData.data
            if (typeof imageData === 'string') {
              console.log(`Image ${index + 1} generated successfully`)
              return imageData // Return base64 data directly
            } else {
              console.log("Image data is not a string")
            }
          }
        }
      }

      console.log("No image data found in response")
      return null

    } catch (error) {
      console.error("Error in image generation:", error)
      return null
    }
  }

