"use client"

import { useEffect, useState, useCallback } from "react"
import { Feed, getFeeds, subscribeToFeeds } from "@/app/lib/api"
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
      // Sort by newest first
      const sortedFeeds = data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setFeeds(sortedFeeds)
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
    // Subscribe to new feeds (works without socket.io for demo)
    const unsubscribe = subscribeToFeeds((newFeed: Feed) => {
      setFeeds((prevFeeds) => {
        // Prevent duplicates
        if (prevFeeds.some((feed) => feed.id === newFeed.id)) {
          return prevFeeds
        }
        // Add new feed at the top
        return [newFeed, ...prevFeeds]
      })
    })

    return () => {
      unsubscribe()
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
