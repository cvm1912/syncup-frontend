"use client"

import { FeedList } from "./components/FeedList"
import { SocketStatus } from "./components/SocketStatus"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live Feed</h1>
            <p className="text-muted-foreground mt-1">Real-time updates from all posts</p>
          </div>
          <div className="flex items-center gap-4">
            <SocketStatus />
            <Link href="/admin">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </header>

        <FeedList />
      </div>
    </main>
  )
}
