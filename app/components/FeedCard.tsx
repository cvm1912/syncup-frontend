"use client"

import { Feed } from "@/app/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface FeedCardProps {
  feed: Feed
}

export function FeedCard({ feed }: FeedCardProps) {
  const timeAgo = formatDistanceToNow(new Date(feed.createdAt), { addSuffix: true })

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-semibold">{feed.title}</CardTitle>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
        </div>
        <p className="text-xs text-muted-foreground">by {feed.author}</p>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{feed.content}</p>
      </CardContent>
    </Card>
  )
}
