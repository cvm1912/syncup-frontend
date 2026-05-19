"use client"

import { useEffect, useState, useCallback } from "react"
import { Feed, getFeeds } from "@/app/lib/api"
import { getSocket, disconnectSocket } from "@/app/lib/socket"
import { FeedCard } from "./FeedCard"
import { Loader2, AlertCircle, Inbox } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function FeedList() {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeeds = useCallback(async () => {
    try {
      setError(null)
      const data = await getFeeds()
      setFeeds(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (err) {
      setError("Failed to load feeds. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeeds()
  }, [fetchFeeds])

  useEffect(() => {
    const socket = getSocket()

    socket.on("feed:created", (feed: Feed) => {
      setFeeds((prev) => {
        if (prev.some((f) => f.id === feed.id)) return prev
        return [feed, ...prev]
      })
    })

    socket.on("feed:updated", ({ id, data }: { id: number; data: Partial<Feed> }) => {
      setFeeds((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)))
    })

    socket.on("feed:deleted", ({ id }: { id: number }) => {
      setFeeds((prev) => prev.filter((f) => f.id !== id))
    })

    return () => {
      socket.off("feed:created")
      socket.off("feed:updated")
      socket.off("feed:deleted")
      disconnectSocket()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (feeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">No feeds available</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Check back later or create a new feed from the admin page.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feeds.map((feed) => (
        <FeedCard key={feed.id} feed={feed} />
      ))}
    </div>
  )
}
