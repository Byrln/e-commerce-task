"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WriteReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  onReviewSubmit?: (review: {
    id: string
    productId: string
    userName: string
    rating: number
    comment: string
    date: string
  }) => void
}

export default function WriteReviewModal({ isOpen, onClose, productId, productName, onReviewSubmit }: WriteReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Үнэлгээ шаардлагатай",
        description: "Бүтээгдэхүүнийг үнэлнэ үү.",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Сэтгэгдэл шаардлагатай",
        description: "Сэтгэгдлээ оруулна уу.",
        variant: "destructive",
      })
      return
    }

    if (!name.trim()) {
      toast({
        title: "Нэр шаардлагатай",
        description: "Нэрээ оруулна уу.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Create a new review object
    const newReview = {
      id: Date.now().toString(), // Generate a unique ID
      productId,
      userName: name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    }

    // Simulate API call
    setTimeout(() => {
      // Call the onReviewSubmit callback if provided
      if (onReviewSubmit) {
        onReviewSubmit(newReview)
      }

      toast({
        title: "Сэтгэгдэл амжилттай илгээгдлээ",
        description: "Таны сэтгэгдэл нэмэгдлээ.",
      })
      setIsSubmitting(false)
      setRating(0)
      setComment("")
      setName("")
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{productName}-д сэтгэгдэл бичих</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Үнэлгээ</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl focus:outline-none"
                >
                  <Star
                    size={28}
                    className={`${
                      star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Таны нэр</Label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Нэрээ оруулна уу"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Таны сэтгэгдэл</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Энэ бүтээгдэхүүний талаар таны бодол..."
              className="min-h-[120px]"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Цуцлах
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Илгээж байна..." : "Сэтгэгдэл илгээх"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
