import { io, Socket } from "socket.io-client"

const SOCKET_URL = "https://coaching-feed-l78m.onrender.com"

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (typeof window === "undefined") throw new Error("Socket is only available in the browser")
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
