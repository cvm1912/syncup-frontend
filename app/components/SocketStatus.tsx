"use client"

import { useEffect, useState } from "react"
import { getSocket } from "@/app/lib/socket"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"

type ConnectionStatus = "connected" | "reconnecting" | "offline"

export function SocketStatus() {
  const [status, setStatus] = useState<ConnectionStatus>("offline")

  useEffect(() => {
    const socket = getSocket()

    const handleConnect = () => setStatus("connected")
    const handleDisconnect = () => setStatus("offline")
    const handleReconnecting = () => setStatus("reconnecting")

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("reconnect_attempt", handleReconnecting)
    socket.on("reconnect", handleConnect)

    // Check initial status
    if (socket.connected) {
      setStatus("connected")
    }

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("reconnect_attempt", handleReconnecting)
      socket.off("reconnect", handleConnect)
    }
  }, [])

  const statusConfig = {
    connected: {
      icon: Wifi,
      text: "Connected",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    reconnecting: {
      icon: RefreshCw,
      text: "Reconnecting",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    offline: {
      icon: WifiOff,
      text: "Offline",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${config.className}`}
    >
      <Icon className={`w-4 h-4 ${status === "reconnecting" ? "animate-spin" : ""}`} />
      {config.text}
    </div>
  )
}
