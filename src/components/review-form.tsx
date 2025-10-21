"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ThumbsUp, Package, Shield, Award, Heart } from "lucide-react"

export default function ReviewForm({
  businessName,
  onSubmit,
  onClose,
}: {
  businessName: string
  onSubmit: (review: any) => void
  onClose: () => void
}) {
  const [step, setStep] = useState<"general" | "specific" | "summary">("general")
  const [generalReview, setGeneralReview] = useState({
    rating: 7,
    comment: "",
  })
  const [specificReviews, setSpecificReviews] = useState({
    time: 7,
    quality: 7,
    quantity: 7,
    trust: 7,
    honesty: 7,
    service: 7,
    timeComment: "",
    qualityComment: "",
    quantityComment: "",
    trustComment: "",
    honestyComment: "",
    serviceComment: "",
  })

  const handleGeneralSubmit = () => {
    if (generalReview.comment.trim().length < 10) {
      alert("Please provide a more detailed review (at least 10 characters).")
      return
    }
    setStep("specific")
  }

  const handleSpecificSubmit = () => {
    setStep("summary")
  }

  const handleFinalSubmit = () => {
    onSubmit({
      general: generalReview,
      specific: specificReviews,
      overallRating: Math.round(
        (generalReview.rating +
          specificReviews.time +
          specificReviews.quality +
          specificReviews.quantity +
          specificReviews.trust +
          specificReviews.honesty +
          specificReviews.service) /
          7,
      ),
    })
    onClose()
  }

  const handleSliderChange = (value: number[], field: string) => {
    if (step === "general") {
      setGeneralReview({
        ...generalReview,
        rating: value[0],
      })
    } else {
      setSpecificReviews({
        ...specificReviews,
        [field]: value[0],
      })
    }
  }

  const renderRatingLabel = (rating: number) => {
    if (rating === 0) return "Very Poor"
    if (rating <= 2) return "Poor"
    if (rating <= 4) return "Below Average"
    if (rating <= 6) return "Average"
    if (rating <= 8) return "Good"
    if (rating <= 9) return "Very Good"
    return "Excellent"
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review {businessName}</DialogTitle>
          <DialogDescription>Share your experience to help others make informed decisions</DialogDescription>
        </DialogHeader>

        {step === "general" && (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base">How would you rate your overall experience?</Label>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">0</span>
                    <span className="text-center text-sm font-medium">
                      {generalReview.rating} - {renderRatingLabel(generalReview.rating)}
                    </span>
                    <span className="text-sm text-muted-foreground">10</span>
                  </div>
                  <Slider
                    defaultValue={[generalReview.rating]}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange(value, "rating")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="general-comment">Tell us about your overall experience</Label>
                <Textarea
                  id="general-comment"
                  placeholder="What did you like or dislike? What stood out about this business?"
                  value={generalReview.comment}
                  onChange={(e) => setGeneralReview({ ...generalReview, comment: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>
        )}

        {step === "specific" && (
          <div className="py-4">
            <Tabs defaultValue="time" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="time">Time</TabsTrigger>
                <TabsTrigger value="quality">Quality</TabsTrigger>
                <TabsTrigger value="quantity">Quantity</TabsTrigger>
                <TabsTrigger value="trust">Trust</TabsTrigger>
                <TabsTrigger value="honesty">Honesty</TabsTrigger>
                <TabsTrigger value="service">Service</TabsTrigger>
              </TabsList>

              <TabsContent value="time" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Timeliness</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  How would you rate the business's punctuality and respect for your time?
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">0</span>
                    <span className="text-center text-sm font-medium">
                      {specificReviews.time} - {renderRatingLabel(specificReviews.time)}
                    </span>
                    <span className="text-sm text-muted-foreground">10</span>
                  </div>
                  <Slider
                    defaultValue={[specificReviews.time]}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange(value, "time")}
                  />
                </div>
                <Textarea
                  placeholder="Comments about timeliness (optional)"
                  value={specificReviews.timeComment}
                  onChange={(e) => setSpecificReviews({ ...specificReviews, timeComment: e.target.value })}
                />
              </TabsContent>

              <TabsContent value="quality" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Quality</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  How would you rate the quality of products or services provided?
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">0</span>
                    <span className="text-center text-sm font-medium">
                      {specificReviews.quality} - {renderRatingLabel(specificReviews.quality)}
                    </span>
                    <span className="text-sm text-muted-foreground">10</span>
                  </div>
                  <Slider
                    defaultValue={[specificReviews.quality]}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange(value, "quality")}
                  />
                </div>
                <Textarea
                  placeholder="Comments about quality (optional)"
                  value={specificReviews.qualityComment}
                  onChange={(e) => setSpecificReviews({ ...specificReviews, qualityComment: e.target.value })}
                />
              </TabsContent>

              <TabsContent value="quantity" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Quantity/Value</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  How would you rate the value for money and quantity provided?
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">0</span>
                    <span className="text-center text-sm font-medium">
                      {specificReviews.quantity} - {renderRatingLabel(specificReviews.quantity)}
                    </span>
                    <span className="text-sm text-muted-foreground">10</span>
                  </div>
                  <Slider
                    defaultValue={[specificReviews.quantity]}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange(value, "quantity")}
                  />
                </div>
                <Textarea
                  placeholder="Comments about value/quantity (optional)"
                  value={specificReviews.quantityComment}
                  onChange={(e) => setSpecificReviews({ ...specificReviews, quantityComment: e.target.value })}
                />
              </TabsContent>

              <TabsContent value="trust" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Trust</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  How would you rate your level of trust in this business?
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">0</span>
                    <span className="text-center text-sm font-medium">
                      {specificReviews.trust} - {renderRatingLabel(specificReviews.trust)}
                    </span>
                    <span className="text-sm text-muted-foreground">10</span>
                  </div>
                  <Slider
                    defaultValue={[specificReviews.trust]}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange(value, "trust")}
                  />
                </div>
                <Textarea
                  placeholder="Comments about trustworthiness (optional)"
                  value={specificReviews.trustComment}
                  onChange={(e) => setSpecificReviews({ ...specificReviews, trustComment: e.target.value })}
                />
              </TabsContent>

              <TabsContent value="honesty" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Honesty</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  How would you rate the business's honesty and transparency?
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">0</span>
                    <span className="text-center text-sm font-medium">
                      {specificReviews.honesty} - {renderRatingLabel(specificReviews.honesty)}
                    </span>
                    <span className="text-sm text-muted-foreground">10</span>
                  </div>
                  <Slider
                    defaultValue={[specificReviews.honesty]}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange(value, "honesty")}
                  />
                </div>
                <Textarea
                  placeholder="Comments about honesty (optional)"
                  value={specificReviews.honestyComment}
                  onChange={(e) => setSpecificReviews({ ...specificReviews, honestyComment: e.target.value })}
                />
              </TabsContent>

              <TabsContent value="service" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Service Authenticity</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  How would you rate the authenticity of the service provided?
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">0</span>
                    <span className="text-center text-sm font-medium">
                      {specificReviews.service} - {renderRatingLabel(specificReviews.service)}
                    </span>
                    <span className="text-sm text-muted-foreground">10</span>
                  </div>
                  <Slider
                    defaultValue={[specificReviews.service]}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange(value, "service")}
                  />
                </div>
                <Textarea
                  placeholder="Comments about service authenticity (optional)"
                  value={specificReviews.serviceComment}
                  onChange={(e) => setSpecificReviews({ ...specificReviews, serviceComment: e.target.value })}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {step === "summary" && (
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Review Summary</CardTitle>
                <CardDescription>Here's a summary of your review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Overall Rating</h3>
                  <div className="mt-1 flex items-center">
                    <span className="text-2xl font-bold">
                      {Math.round(
                        (generalReview.rating +
                          specificReviews.time +
                          specificReviews.quality +
                          specificReviews.quantity +
                          specificReviews.trust +
                          specificReviews.honesty +
                          specificReviews.service) /
                          7,
                      )}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">out of 10</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">General Experience</h3>
                  <p className="mt-1 text-sm">{generalReview.comment}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium">Time: {specificReviews.time}/10</h3>
                    {specificReviews.timeComment && (
                      <p className="text-xs text-muted-foreground">{specificReviews.timeComment}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Quality: {specificReviews.quality}/10</h3>
                    {specificReviews.qualityComment && (
                      <p className="text-xs text-muted-foreground">{specificReviews.qualityComment}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Quantity: {specificReviews.quantity}/10</h3>
                    {specificReviews.quantityComment && (
                      <p className="text-xs text-muted-foreground">{specificReviews.quantityComment}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Trust: {specificReviews.trust}/10</h3>
                    {specificReviews.trustComment && (
                      <p className="text-xs text-muted-foreground">{specificReviews.trustComment}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Honesty: {specificReviews.honesty}/10</h3>
                    {specificReviews.honestyComment && (
                      <p className="text-xs text-muted-foreground">{specificReviews.honestyComment}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Service Authenticity: {specificReviews.service}/10</h3>
                    {specificReviews.serviceComment && (
                      <p className="text-xs text-muted-foreground">{specificReviews.serviceComment}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          {step !== "general" && (
            <Button variant="outline" onClick={() => setStep(step === "specific" ? "general" : "specific")}>
              Back
            </Button>
          )}
          {step === "general" && <Button onClick={handleGeneralSubmit}>Continue to Specific Ratings</Button>}
          {step === "specific" && <Button onClick={handleSpecificSubmit}>Review Summary</Button>}
          {step === "summary" && <Button onClick={handleFinalSubmit}>Submit Review</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
