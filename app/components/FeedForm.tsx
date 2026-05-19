"use client"

import { useState } from "react"
import { createFeed } from "@/app/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function FeedForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [author, setAuthor] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = () => {
    if (!title.trim()) {
      setError("Title is required")
      return false
    }
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters")
      return false
    }
    if (!description.trim()) {
      setError("Description is required")
      return false
    }
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters")
      return false
    }
    if (!author.trim()) {
      setError("Author is required")
      return false
    }
    if (author.trim().length < 2) {
      setError("Author must be at least 2 characters")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await createFeed({
        title: title.trim(),
        description: description.trim(),
        author: author.trim(),
      })
      setSuccess(true)
      setTitle("")
      setDescription("")
      setAuthor("")
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to create feed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
        <CardDescription>Add a new post that will be visible to all users in realtime.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Post added successfully!</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Enter your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description / Content</Label>
            <Textarea
              id="description"
              placeholder="Enter post description or content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={5}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
