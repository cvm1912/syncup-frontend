export interface Feed {
  id: string
  title: string
  description: string
  createdAt: string
}

export interface CreateFeedData {
  title: string
  description: string
}

// In-memory store for demo purposes (works without backend)
let mockFeeds: Feed[] = [
  {
    id: "1",
    title: "Welcome to the Feed",
    description: "This is a demo of the realtime feed application. New posts will appear here automatically.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    title: "Getting Started",
    description: "Navigate to /admin to create new feed posts. They will appear here in real-time.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

// Event listeners for real-time updates within the same browser
type FeedListener = (feed: Feed) => void
const listeners: FeedListener[] = []

export function subscribeToFeeds(callback: FeedListener) {
  listeners.push(callback)
  return () => {
    const index = listeners.indexOf(callback)
    if (index > -1) listeners.splice(index, 1)
  }
}

function notifyListeners(feed: Feed) {
  listeners.forEach((callback) => callback(feed))
}

export async function getFeeds(): Promise<Feed[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...mockFeeds]
}

export async function createFeed(data: CreateFeedData): Promise<Feed> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const newFeed: Feed = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
    createdAt: new Date().toISOString(),
  }
  
  mockFeeds = [newFeed, ...mockFeeds]
  
  // Notify all listeners (simulates socket.io broadcast)
  notifyListeners(newFeed)
  
  return newFeed
}
