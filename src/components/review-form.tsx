"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"

export default function ReviewForm({
    businessName,
    onSubmit,
    onClose,
}: {
    businessName: string
    onSubmit: (review: any) => void
    onClose: () => void
}) {
    const [rating, setRating] = useState<number>(0) // 1-5 stars (integer only)
    const [comment, setComment] = useState("")
    const [image, setImage] = useState<File | null>(null)

    const handleSubmit = () => {
        if (rating === 0) {
            alert("Please select a rating.")
            return
        }
        if (comment.trim().length < 10) {
            alert("Please provide a more detailed review (at least 10 characters).")
            return
        }
        onSubmit({
            rating,
            comment: comment.trim(),
            image
        })
        onClose()
    }

    const getRatingLabel = (rating: number) => {
        if (rating === 0) return "Not rated"
        if (rating === 1) return "Poor"
        if (rating === 2) return "Fair"
        if (rating === 3) return "Good"
        if (rating === 4) return "Very Good"
        return "Excellent"
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Review {businessName}</DialogTitle>
                    <DialogDescription>Share your honest experience to help others make informed decisions</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Rating - 1-5 Stars */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Your Rating (Required)</Label>
                        <div className="flex flex-col items-center gap-3 p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded p-1"
                                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                    >
                                        <Star
                                            className={`h-12 w-12 transition-colors ${star <= rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300 dark:text-gray-600 hover:text-yellow-200 dark:hover:text-yellow-600"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="text-center">
                                {rating > 0 ? (
                                    <>
                                        <span className="text-xl font-bold text-foreground block">
                                            {getRatingLabel(rating)}
                                        </span>
                                        <span className="text-sm text-muted-foreground">{rating} out of 5 stars</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-muted-foreground">Click to rate</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Review Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment" className="text-base font-semibold">
                            Your Review (Required)
                        </Label>
                        <Textarea
                            id="comment"
                            placeholder="Tell others about your experience with this business. What did you like or dislike?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[150px] text-base resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {comment.length} characters • Minimum 10 characters required
                        </p>
                    </div>

                    {/* Optional Image Upload - DISABLED: Backend endpoint not configured
                    ReviewImageUploadView exists in backend views.py but NOT registered in urls.py
                    <div className="space-y-2">
                        <Label htmlFor="image" className="text-base font-semibold">
                            Add Photo (Optional)
                        </Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setImage(file)
                                }
                            }}
                            className="h-12 cursor-pointer"
                        />
                        {image && (
                            <p className="text-sm text-muted-foreground">
                                Selected: {image.name}
                            </p>
                        )}
                    </div>
                    */}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    >
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
