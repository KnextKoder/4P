"use client"

import { useState } from "react"
import { Button } from "./button"
import { Wallet, Copy, CheckCircle } from "lucide-react"

export function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [copied, setCopied] = useState(false)

  // Dummy wallet address for simulation
  const dummyAddress = "0x742d35Cc6635C0532925a3b8D4750e8e4362e41D"

  const connectWallet = async () => {
    setIsConnecting(true)
    // Simulate MetaMask connection delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAddress(dummyAddress)
    setIsConnected(true)
    setIsConnecting(false)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        
        {/* Address Display */}
        <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 ring-1 ring-inset ring-white/15">
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
          <span className="text-xs sm:text-sm text-white font-mono">
            {formatAddress(address)}
          </span>
          <button
            onClick={copyAddress}
            className="ml-1 p-0.5 hover:bg-white/10 rounded transition-colors"
            title="Copy address"
          >
            {copied ? (
              <CheckCircle className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3 text-white/60 hover:text-white" />
            )}
          </button>
        </div>

        {/* Disconnect Button */}
        <Button
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs px-2 py-1"
        >
          <span className="hidden sm:inline">Disconnect</span>
          <span className="sm:hidden">•••</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
    >
      <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
      {isConnecting ? (
        <>
          <span className="hidden sm:inline">Connecting...</span>
          <span className="sm:hidden">...</span>
        </>
      ) : (
        <>
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </>
      )}
    </Button>
  )
}
