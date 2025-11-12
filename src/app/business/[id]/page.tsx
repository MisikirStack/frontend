"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star, MapPin, Phone, Mail, Globe, Clock, ChevronLeft, Share2, ThumbsUp, MessageSquare, Loader2, Edit2, Trash2, Building2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import ReviewForm from "@/components/review-form"
import { CompaniesService } from "@/services/api/companies.service"
import { ReviewsService } from "@/services/api/reviews.service"
import type { Company, Review, Product, Service } from "@/types/api"
import { toast } from "sonner"
import { getUserFriendlyErrorMessage } from "@/lib/error-messages"
import { useAuth } from "@/contexts/AuthContext"

export default function BusinessPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const companyId = parseInt(params.id as string)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [business, setBusiness] = useState<Company | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check if current user is the owner
  const isOwner = user && business && user.email === business.owner_email

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch company details
        const companyData = await CompaniesService.getCompanyById(companyId)
        setBusiness(companyData)

        // Fetch reviews, products, and services in parallel
        const [reviewsData, productsData, servicesData] = await Promise.allSettled([
          ReviewsService.getCompanyReviews(companyId).catch(() => []),
          CompaniesService.getCompanyProducts(companyId).catch(() => []),
          CompaniesService.getCompanyServices(companyId).catch(() => []),
        ])

        if (reviewsData.status === 'fulfilled') setReviews(reviewsData.value)
        if (productsData.status === 'fulfilled') setProducts(productsData.value)
        if (servicesData.status === 'fulfilled') setServices(servicesData.value)

      } catch (err: any) {
        const friendlyMessage = getUserFriendlyErrorMessage(err.message)
        setError(friendlyMessage)
        toast.error("Unable to load business", {
          description: friendlyMessage,
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) {
      fetchBusinessData()
    }
  }, [companyId])

  // Mock data for fallback (keeping structure)
  const mockBusiness = {
    id: 1,
    name: "Abyssinia Coffee",
    category: "Food, Beverages & Tobacco > Coffee & Tea",
    subcategory: "Coffee Shop",
    location: "Bole, Addis Ababa",
    address: "Bole Road, Near Friendship Building",
    rating: 8.4,
    reviewCount: 124,
    views: 3450,
    image: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=400&width=1200",
    duration: "5 years",
    description:
      "Abyssinia Coffee is a premium coffee shop offering authentic Ethiopian coffee experiences. We source our beans directly from Ethiopian farmers and roast them in-house to ensure the highest quality.",
    services: [
      "Ethiopian Coffee Varieties",
      "Espresso-based Drinks",
      "Traditional Coffee Ceremony",
      "Light Meals and Pastries",
      "Coffee Beans Retail",
    ],
    contact: {
      phone: "+251 91 234 5678",
      email: "info@abyssiniacoffee.com",
      website: "www.abyssiniacoffee.com",
      hours: "Monday-Saturday: 7:00 AM - 9:00 PM, Sunday: 8:00 AM - 8:00 PM",
    },
    reviews: [
      {
        id: 1,
        user: "Meron T.",
        rating: 9,
        date: "2 weeks ago",
        comment:
          "The best coffee in town! I love their traditional coffee ceremony and the atmosphere is so welcoming.",
        specific: {
          time: 8,
          quality: 10,
          quantity: 9,
          trust: 9,
          honesty: 10,
          service: 9,
        },
      },
      {
        id: 2,
        user: "Dawit H.",
        rating: 8,
        date: "1 month ago",
        comment: "Great service and excellent coffee. The pastries are also very good. Highly recommended!",
        specific: {
          time: 7,
          quality: 9,
          quantity: 8,
          trust: 8,
          honesty: 8,
          service: 8,
        },
      },
      {
        id: 3,
        user: "Sara A.",
        rating: 9,
        date: "2 months ago",
        comment:
          "I visit this place at least twice a week. The staff is friendly and the coffee is consistently excellent.",
        specific: {
          time: 9,
          quality: 9,
          quantity: 8,
          trust: 9,
          honesty: 9,
          service: 10,
        },
      },
    ],
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

  const handleSubmitReview = async (reviewData: any) => {
    try {
      const data = {
        company: companyId,
        rating: reviewData.rating,
        content: reviewData.comment,
        title: reviewData.title || 'Review'
      }

      await ReviewsService.createReview(data)

      toast.success("Review submitted!", {
        description: "Thank you for your feedback.",
      })

      setShowReviewForm(false)

      // Refresh reviews
      const updatedReviews = await ReviewsService.getCompanyReviews(companyId)
      setReviews(updatedReviews)
    } catch (err: any) {
      const friendlyMessage = getUserFriendlyErrorMessage(err.message)
      toast.error("Unable to submit review", {
        description: friendlyMessage,
      })
    }
  }

  const handleEdit = () => {
    router.push(`/company/setup?edit=${companyId}`)
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/business/${companyId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied!", {
        description: "Share link has been copied to clipboard"
      })
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!business) return
    
    setIsDeleting(true)
    try {
      await CompaniesService.deleteCompany(business.id)
      toast.success("Company deleted successfully")
      router.push('/profile')
    } catch (err: any) {
      console.error("Failed to delete company:", err)
      toast.error(err.message || "Failed to delete company")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading business information...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4 text-6xl">😕</div>
          <h2 className="text-2xl font-bold mb-2">Business Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The business you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to home
            </Link>

        {/* Business Cover Image */}
        <div className="relative mb-6 h-[200px] w-full overflow-hidden rounded-lg md:h-[300px] bg-gray-200 dark:bg-gray-800">
          {business.logo ? (
            <Image src={business.logo} alt={business.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Star className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Business Info Column */}
          <div className="md:col-span-2">
            {/* Owner Controls - Show only if user is the owner */}
            {isOwner && (
              <Card className="mb-6 border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-800 dark:text-green-300">You own this business</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Business
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteDialogOpen(true)}
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-6 border-green-200 dark:border-green-900/30">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                    {business.logo ? (
                      <Image src={business.logo} alt={business.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 md:text-3xl">{business.name}</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          {business.category_names && (
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                              {business.category_names}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-green-700 dark:text-green-400">{business.misikir_score}/10</span>
                            <span className="ml-1">({business.misikir_reviews_count} reviews)</span>
                            <span className="ml-1 text-xs">- {renderRatingLabel(business.misikir_score)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                          onClick={handleShare}
                        >
                          <Share2 className="mr-1 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="about" className="mb-6">
              <TabsList className="w-full justify-start bg-white dark:bg-gray-900 border-b">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card className="border-green-200 dark:border-green-900/30">
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">About {business.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">{business.description || 'No description available.'}</p>

                    <div>
                      <h3 className="mb-3 text-lg font-medium text-green-700 dark:text-green-400">Business Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {business.owner_email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium dark:text-white">Contact Email</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{business.owner_email}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium dark:text-white">Established</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(business.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {business.category_names && (
                    <div className="flex items-start gap-2 sm:col-span-2">
                      <Star className="mt-0.5 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium dark:text-white">Categories</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{business.category_names}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <ThumbsUp className="mt-0.5 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium dark:text-white">Misikir Score</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {business.misikir_score}/10 based on {business.misikir_reviews_count} reviews
                      </p>
                    </div>
                  </div>
                </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <Card className="border-green-200 dark:border-green-900/30">
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">Services Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                <h2 className="mb-4 text-xl font-semibold dark:text-white">Services Offered</h2>
                {services.length > 0 ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {services.map((service) => (
                      <li key={service.id} className="flex items-start gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium dark:text-white">{service.name}</span>
                          {service.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                          )}
                          {service.price && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">${service.price}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No services listed yet.</p>
                )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="border-green-200 dark:border-green-900/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-700 dark:text-green-400">Customer Reviews</CardTitle>
                      {!isOwner && (
                        <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" onClick={() => setShowReviewForm(true)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Write a Review
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b dark:border-gray-800 pb-6 sm:flex-row">
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <span className="text-5xl font-bold dark:text-white">{business.misikir_score}</span>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium dark:text-white">{renderRatingLabel(business.misikir_score)}</div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Based on {business.misikir_reviews_count} reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      <div className="grid gap-2">
                        {[10, 8, 6, 4, 2].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="w-4 text-xs">{rating}</span>
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full bg-yellow-400"
                                style={{
                                  width: `${rating === 10
                                      ? "60%"
                                      : rating === 8
                                        ? "25%"
                                        : rating === 6
                                          ? "10%"
                                          : rating === 4
                                            ? "3%"
                                            : "2%"
                                    }`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                {review.reviewer_name ? review.reviewer_name.charAt(0).toUpperCase() : 'A'}
                              </div>
                              <div>
                                <p className="font-medium dark:text-white">{review.reviewer_name || 'Anonymous'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(review.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium dark:text-white">{review.misikir_score}/10</span>
                              <span className="ml-1 text-xs dark:text-gray-400">- {renderRatingLabel(review.misikir_score)}</span>
                            </div>
                          </div>
                          <p className="mb-4 text-gray-700 dark:text-gray-300">{review.review_text}</p>

                          <div className="mt-2 grid grid-cols-2 gap-2 rounded-md bg-gray-50 dark:bg-gray-800 p-3 text-xs md:grid-cols-3">
                            <div>
                              <span className="font-medium dark:text-white">Time:</span> {review.time}/10
                            </div>
                            <div>
                              <span className="font-medium dark:text-white">Quality:</span> {review.quality}/10
                            </div>
                            <div>
                              <span className="font-medium dark:text-white">Quantity:</span> {review.quantity}/10
                            </div>
                            <div>
                              <span className="font-medium dark:text-white">Trust:</span> {review.trust}/10
                            </div>
                            <div>
                              <span className="font-medium dark:text-white">Honesty:</span> {review.honesty}/10
                            </div>
                            <div>
                              <span className="font-medium dark:text-white">Service:</span> {review.service}/10
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos" className="mt-6">
                <Card className="border-green-200 dark:border-green-900/30">
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">Photos</CardTitle>
                  </CardHeader>
                  <CardContent>
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {products.map((product) => (
                      <div key={product.id} className="group">
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Star className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-sm font-medium dark:text-white truncate">{product.name}</p>
                        {product.price && (
                          <p className="text-sm text-green-600 dark:text-green-400">${product.price}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : business.logo ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={business.logo}
                        alt={business.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No photos available yet.</p>
                )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-green-200 dark:border-green-900/30">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">
                  {isOwner ? "Manage Business" : `Contact ${business.name}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {!isOwner && business.owner_email && (
                    <Button variant="outline" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      {business.owner_email}
                    </Button>
                  )}
                  
                  {isOwner ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        onClick={handleEdit}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                      onClick={() => user ? setShowReviewForm(true) : router.push('/login')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Leave a Review
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-900/30">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">Business Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Misikir Score</span>
                  <span className="font-medium dark:text-white">{business.misikir_score}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</span>
                  <span className="font-medium dark:text-white">{business.misikir_reviews_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Services Offered</span>
                  <span className="font-medium dark:text-white">{services.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Products</span>
                  <span className="font-medium">{products.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-900/30">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">Joined Misikir</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {new Date(business.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Member for {Math.floor((Date.now() - new Date(business.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{business?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showReviewForm && (
        <ReviewForm
          businessName={business.name}
          onSubmit={handleSubmitReview}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  )
}
