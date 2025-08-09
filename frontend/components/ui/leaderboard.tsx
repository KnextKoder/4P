"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Crown, Gift } from "lucide-react"

interface LeaderboardEntry {
  id: number
  name: string
  score: number
  wordsLearned: number
  streak: number
  avatar: string
}

// Dummy leaderboard data with Yoruba-inspired names
const dummyLeaderboard: LeaderboardEntry[] = [
  {
    id: 1,
    name: "Adunni Olatunji",
    score: 2450,
    wordsLearned: 87,
    streak: 12,
    avatar: "👑"
  },
  {
    id: 2,
    name: "Babatunde Adeyemi", 
    score: 2180,
    wordsLearned: 76,
    streak: 8,
    avatar: "🏆"
  },
  {
    id: 3,
    name: "Folake Ogundimu",
    score: 1950,
    wordsLearned: 65,
    streak: 15,
    avatar: "🥉"
  },
  {
    id: 4,
    name: "Kemi Adesanya",
    score: 1820,
    wordsLearned: 62,
    streak: 6,
    avatar: "⭐"
  },
  {
    id: 5,
    name: "Tunde Ogbonna",
    score: 1670,
    wordsLearned: 58,
    streak: 9,
    avatar: "🌟"
  },
  {
    id: 6,
    name: "Yemi Akintola",
    score: 1580,
    wordsLearned: 54,
    streak: 4,
    avatar: "💫"
  }
]

interface LeaderboardProps {
  className?: string
}

export function Leaderboard({ className = "" }: LeaderboardProps) {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-slate-400 font-bold text-sm">#{position}</span>
    }
  }

  const getRankBadge = (position: number) => {
    if (position <= 3) {
      return `bg-gradient-to-r ${
        position === 1 
          ? 'from-yellow-400/20 to-orange-400/20 border-yellow-400/30' 
          : position === 2
          ? 'from-gray-300/20 to-gray-400/20 border-gray-400/30'
          : 'from-amber-500/20 to-amber-600/20 border-amber-500/30'
      }`
    }
    return 'bg-slate-800/50 border-slate-600/30'
  }

  return (
    <Card className={`bg-orange-800/70 border-white/10 backdrop-blur-md h-full flex flex-col ${className}`}>
      <CardContent className="p-4 sm:p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Leaderboard</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-orange-400/50 to-transparent ml-2 sm:ml-4" />
        </div>

        {/* Prize Pool Section */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <h3 className="text-sm sm:text-base font-semibold text-yellow-100">Monthly Prize Pool</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-400/20">
              <div className="text-lg sm:text-xl">🥇</div>
              <div className="text-xs sm:text-sm font-bold text-yellow-200">0.002 BTC</div>
              <div className="text-xs text-yellow-300/80">1st Place</div>
            </div>
            <div className="bg-gray-500/10 rounded-lg p-2 border border-gray-400/20">
              <div className="text-lg sm:text-xl">🥈</div>
              <div className="text-xs sm:text-sm font-bold text-gray-200">0.001 BTC</div>
              <div className="text-xs text-gray-300/80">2nd Place</div>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-2 border border-amber-400/20">
              <div className="text-lg sm:text-xl">🥉</div>
              <div className="text-xs sm:text-sm font-bold text-amber-200">0.0005 BTC</div>
              <div className="text-xs text-amber-300/80">3rd Place</div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-yellow-300/80">Ends in 12 days • Sponsored by Yoruba Learning Foundation</p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 flex-1">
          {dummyLeaderboard.map((entry, index) => {
            const position = index + 1
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all hover:scale-[1.01] sm:hover:scale-[1.02] ${getRankBadge(position)}`}
              >
                {/* Rank Icon */}
                <div className="flex-shrink-0">
                  {getRankIcon(position)}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-lg sm:text-xl">
                  {entry.avatar}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate text-sm sm:text-base">{entry.name}</p>
                  <p className="text-xs sm:text-sm text-slate-300">
                    <span className="hidden sm:inline">{entry.wordsLearned} words learned • {entry.streak} day streak</span>
                    <span className="sm:hidden">{entry.wordsLearned} words • {entry.streak} days</span>
                  </p>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-orange-400 text-sm sm:text-lg">{entry.score.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">points</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 sm:mt-6 pb-0 pt-3 sm:pt-4 border-t border-white/10">
          <div className="text-center space-y-1">
            <p className="text-xs sm:text-sm text-slate-300">
              You&apos;re currently not ranked. Start learning to join the competition! 💪
            </p>
            <p className="text-xs text-orange-400 font-medium">
              Adunni is crushing it this month! Can you beat her streak? �
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
