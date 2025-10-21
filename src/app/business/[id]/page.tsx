"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Phone, Mail, Globe, Clock, ChevronLeft, Share2, ThumbsUp, MessageSquare } from "lucide-react"
import ReviewForm from "@/components/review-form"

export default function BusinessPage() {
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Mock business data
  const business = {
    id: 1,
    name: "Abyssinia Coffee",
    category: "Food, Beverages & Tobacco > Coffee & Tea",
    subcategory: "Coffee Shop",
    location: "Bole, Addis Ababa",
    address: "Bole Road, Near Friendship Building",
    rating: 8.4,
    reviews: 124,
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

  const handleSubmitReview = (review: any) => {
    console.log("Review submitted:", review)
    // In a real app, this would send the review to the server
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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center">
            <Star className="h-6 w-6 text-yellow-500" />
            <span className="ml-2 text-xl font-bold text-green-700">Misikir</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline">Login</Button>
            <Button className="bg-green-600 hover:bg-green-700">Register Your Business</Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Link href="/" className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-green-600">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to search results
        </Link>

        {/* Business Cover Image */}
        <div className="relative mb-6 h-[200px] w-full overflow-hidden rounded-lg md:h-[300px]">
          <Image src={business.coverImage || "/placeholder.svg"} alt={business.name} fill className="object-cover" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Business Info Column */}
          <div className="md:col-span-2">
            <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                <Image src={business.image || "/placeholder.svg"} alt={business.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{business.name}</h1>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <Share2 className="mr-1 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      Like
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <Badge variant="outline" className="bg-green-50">
                    {business.category}
                  </Badge>
                  <div className="flex items-center">
                    <span className="font-medium">{business.rating}/10</span>
                    <span className="ml-1">({business.reviews} reviews)</span>
                    <span className="ml-1 text-xs">- {renderRatingLabel(business.rating)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {business.location}
                  </div>
                  <div>
                    <span className="font-medium">In service:</span> {business.duration}
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="about" className="mb-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">About {business.name}</h2>
                <p className="mb-6 text-gray-700">{business.description}</p>

                <h3 className="mb-3 text-lg font-medium">Business Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-gray-600">{business.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{business.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">{business.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="mt-0.5 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Website</p>
                      <p className="text-sm text-gray-600">{business.contact.website}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <Clock className="mt-0.5 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-gray-600">{business.contact.hours}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services" className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Services Offered</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {business.services.map((service, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
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
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Customer Reviews</h2>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowReviewForm(true)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Write a Review
                  </Button>
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b pb-6 sm:flex-row">
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <span className="text-5xl font-bold">{business.rating}</span>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium">{renderRatingLabel(business.rating)}</div>
                          <span className="text-sm text-gray-500">Based on {business.reviews} reviews</span>
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
                                  width: `${
                                    rating === 10
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
                    {business.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                              {review.user.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{review.user}</p>
                              <p className="text-xs text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">{review.rating}/10</span>
                            <span className="ml-1 text-xs">- {renderRatingLabel(review.rating)}</span>
                          </div>
                        </div>
                        <p className="mb-4 text-gray-700">{review.comment}</p>

                        {review.specific && (
                          <div className="mt-2 grid grid-cols-2 gap-2 rounded-md bg-gray-50 p-3 text-xs md:grid-cols-3">
                            <div>
                              <span className="font-medium">Time:</span> {review.specific.time}/10
                            </div>
                            <div>
                              <span className="font-medium">Quality:</span> {review.specific.quality}/10
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span> {review.specific.quantity}/10
                            </div>
                            <div>
                              <span className="font-medium">Trust:</span> {review.specific.trust}/10
                            </div>
                            <div>
                              <span className="font-medium">Honesty:</span> {review.specific.honesty}/10
                            </div>
                            <div>
                              <span className="font-medium">Service:</span> {review.specific.service}/10
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="photos" className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Photos</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={`/placeholder.svg?height=200&width=200&text=Photo ${i + 1}`}
                        alt={`Business photo ${i + 1}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Contact {business.name}</h2>
              <div className="space-y-4">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Business Location</h2>
              <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-200">
                {/* This would be a Google Map in a real implementation */}
                <div className="flex h-full items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <p className="mb-2 text-sm font-medium">{business.address}</p>
              <Button variant="outline" size="sm" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Business Hours</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span>7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday</span>
                  <span>7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday</span>
                  <span>7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Thursday</span>
                  <span>7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span>7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>8:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Similar Businesses</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={`/placeholder.svg?height=50&width=50&text=${i}`}
                        alt={`Similar business ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Coffee House {i}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>
                          {8.5 - i * 0.3}/10 ({50 - i * 10} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="ml-2 text-xl font-bold text-green-700">Misikir</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">Your trusted witness for business information</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">For Users</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-green-600">
                    Write a Review
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-green-600">
                    Browse Categories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-green-600">
                    Search Businesses
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">For Businesses</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-green-600">
                    Register Your Business
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-green-600">
                    Business Login
              
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-green-600">
                    Advertising Options
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-green-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-green-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-green-600">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Misikir. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
