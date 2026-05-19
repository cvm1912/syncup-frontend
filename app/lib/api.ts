const BASE_URL = "https://coaching-feed-l78m.onrender.com/api/v1"

export interface Feed {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
}

export interface CreateFeedData {
  title: string
  content: string
  author: string
}

export interface UpdateFeedData {
  title?: string
  content?: string
  author?: string
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json()
  if (!res.ok) throw new Error(json?.ErrorResponse?.message ?? "Request failed")
  return json.SuccessResponse.data
}

export async function getFeeds(): Promise<Feed[]> {
  const res = await fetch(`${BASE_URL}/feeds`, { cache: "no-store" })
  return handleResponse<Feed[]>(res)
}

export async function getFeedById(id: number): Promise<Feed> {
  const res = await fetch(`${BASE_URL}/feeds/${id}`, { cache: "no-store" })
  return handleResponse<Feed>(res)
}

export async function createFeed(data: CreateFeedData): Promise<Feed> {
  const res = await fetch(`${BASE_URL}/feeds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<Feed>(res)
}

export async function updateFeed(id: number, data: UpdateFeedData): Promise<void> {
  const res = await fetch(`${BASE_URL}/feeds/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  await handleResponse(res)
}

export async function deleteFeed(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/feeds/${id}`, { method: "DELETE" })
  await handleResponse(res)
}
