# 4 Pics 1 Word - AI-Powered Game

A modern implementation of the classic "4 Pics 1 Word" puzzle game powered by AI-generated content and images.

## Features

- 🎮 **Dynamic Gameplay**: AI-generated words and image prompts for unlimited replay value
- 🖼️ **AI-Generated Images**: Custom images created for each puzzle using Google Gemini
- 📚 **Educational Content**: Learn interesting facts with each correct answer
- 🎯 **Customizable Difficulty**: Easy, Medium, and Hard difficulty levels
- 🎨 **Modern UI**: Beautiful, responsive design built with Next.js and TailwindCSS
- 📱 **Mobile-Friendly**: Optimized for all screen sizes

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **AI Services**:
  - Groq API (Llama 3.3 70B) for text generation
  - Google Gemini 2.0 for image generation
- **Styling**: TailwindCSS with custom components
- **Validation**: Zod for runtime type checking

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for Groq and Google AI

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KnextKoder/4dicks1word.git
   cd 4dicks1word/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your API keys:

   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

4. **Get API Keys**

   **Groq API Key:**
   - Visit [Groq Console](https://console.groq.com/)
   - Sign up/Login and create a new API key
   - Copy the key to your `.env.local` file

   **Google AI API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign up/Login and create a new API key
   - Copy the key to your `.env.local` file

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the game**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```md
frontend/
├── app/
│   ├── api/
│   │   └── generation/
│   │       └── route.ts          # Main API endpoint
│   ├── page.tsx                  # Landing page
│   └── topic/
│       └── page.tsx              # Game interface
├── components/
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── utils.ts                  # General utilities
│   └── game-utils.ts             # Game-specific utilities
└── public/
    └── generated_images/         # AI-generated game images
```

## Game Flow

1. **Topic Selection**: Choose from predefined topics or enter a custom topic
2. **Difficulty**: Select Easy, Medium, or Hard difficulty
3. **AI Generation**:
   - Groq generates a word and image prompts
   - Google Gemini creates 4 images based on the prompts
4. **Gameplay**: Guess the word using the provided letter pool
5. **Education**: Learn interesting facts about the correct answer

## API Endpoints

### POST `/api/generation`

Generates a new puzzle with AI-created content.

**Request Body:**

```json
{
  "topic": "string",
  "difficulty": "easy" | "medium" | "hard"
}
```

**Response:**

```json
{
  "answer": "string",
  "image_prompts": ["string[]"],
  "image_paths": ["string[]"],
  "educational_fact": "string"
}
```

## Development

### Adding New Features

1. **New Topics**: Modify the `predefinedTopics` array in `app/page.tsx`
2. **Difficulty Levels**: Adjust the prompt in `app/api/generation/route.ts`
3. **UI Components**: Add new components in `components/ui/`
4. **Game Logic**: Extend utilities in `lib/game-utils.ts`

### Deployment

The app is ready for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Any Node.js hosting service**

Remember to set environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

- Open an issue on GitHub
- Check the documentation
- Review the API documentation for Groq and Google AI

---

## Enjoy the game and happy learning! 🎮📚
