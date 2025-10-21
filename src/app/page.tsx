"use client";

import Link from "next/link";
import { Search, MapPin, Star, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    window.open(
      "https://docs.google.com/forms/d/1r04BOtkIROzUvmIM6PNXuP1NSeJoc0s05HrIT2C7qCU/edit",
      "_blank"
    );
  };

  // Mock data for top businesses
  const topBusinesses = [
    {
      id: 1,
      name: "Abyssinia Coffee",
      category: "Food & Beverage",
      location: "Addis Ababa",
      rating: 4.8,
      reviews: 124,
      views: 3450,
      image: "/placeholder.svg?height=80&width=80",
      duration: "5 years",
    },
    {
      id: 2,
      name: "Ethio Telecom",
      category: "Telecommunications",
      location: "Nationwide",
      rating: 4.2,
      reviews: 532,
      views: 12450,
      image: "/placeholder.svg?height=80&width=80",
      duration: "15 years",
    },
    {
      id: 3,
      name: "Dashen Bank",
      category: "Financial Services",
      location: "Multiple Locations",
      rating: 4.5,
      reviews: 321,
      views: 8760,
      image: "/placeholder.svg?height=80&width=80",
      duration: "8 years",
    },
    {
      id: 4,
      name: "Sheger Real Estate",
      category: "Real Estate",
      location: "Addis Ababa",
      rating: 4.7,
      reviews: 98,
      views: 2340,
      image: "/placeholder.svg?height=80&width=80",
      duration: "3 years",
    },
  ];

  // Mock data for sponsored businesses
  const sponsoredBusinesses = [
    {
      id: 5,
      name: "Habesha Breweries",
      category: "Manufacturing",
      location: "Debre Birhan",
      rating: 4.6,
      reviews: 210,
      views: 5670,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 6,
      name: "Ride Transportation",
      category: "Transportation",
      location: "Addis Ababa",
      rating: 4.3,
      reviews: 178,
      views: 4320,
      image: "/placeholder.svg?height=80&width=80",
    },
  ];

  // Categories for the dropdown
  const categories = [
    "Food & Beverage",
    "Retail",
    "Healthcare",
    "Education",
    "Technology",
    "Financial Services",
    "Transportation",
    "Real Estate",
    "Manufacturing",
    "Entertainment",
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="ml-2 text-xl font-bold text-green-700">
                Misikir
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem onClick={handleClick} key={category}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={handleClick}
              variant="ghost"
              className="flex items-center gap-1"
            >
              <MapPin className="h-4 w-4" /> Location
            </Button>
            <Button onClick={() => router.push("/login")} variant="outline">
              Login
            </Button>
            <Button
              onClick={() => router.push("/register-business")}
              className="bg-green-600 hover:bg-green-700"
            >
              Register Your Business
            </Button>
          </nav>

          <Button className="md:hidden" variant="ghost" size="icon">
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
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="bg-gradient-to-b from-green-50 to-white py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-green-800 sm:text-4xl md:text-5xl">
                Your Trusted Witness for Business Information
              </h1>
              <p className="mb-8 text-lg text-gray-600">
                Discover, review, and connect with trusted businesses in your
                area
              </p>
              <div className="relative mx-auto mb-6 max-w-2xl">
                <form onSubmit={handleClick} className="flex">
                  <Input
                    className="h-12 flex-1 rounded-l-md border-r-0 pl-10 pr-4"
                    placeholder="Search for businesses, services, or categories..."
                  />

                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        onClick={handleClick}
                        variant="outline"
                        className="h-12 rounded-l-none rounded-r-md border-l-0"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={handleClick}>
                        Category
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleClick}>
                        Subcategory
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleClick}>
                        Location
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleClick}>
                        Rating
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleClick}>
                        Number of Reviews
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleClick}>
                        Number of Views
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </form>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="bg-white">
                  Restaurants
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Hotels
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Healthcare
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Education
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Technology
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Top Rated Businesses */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 md:text-3xl">
              Top Rated Businesses
            </h2>
            <Tabs onClick={handleClick} defaultValue="all" className="mb-8">
              <TabsList className="mx-auto grid max-w-md grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="retail">Retail</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
              </TabsList>
            </Tabs>
            <div
              onClick={handleClick}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {topBusinesses.map((business) => (
                <Card
                  key={business.id}
                  className="overflow-hidden transition-all hover:shadow-lg"
                >
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage
                          src={business.image || "/placeholder.svg"}
                          alt={business.name}
                        />
                        <AvatarFallback className="rounded-md bg-green-100 text-green-800">
                          {business.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">
                          {business.rating}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="mt-2 line-clamp-1 text-lg">
                      {business.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">
                          Category:
                        </span>
                        <span className="ml-1">{business.category}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        <span>{business.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">
                          In service:
                        </span>
                        <span className="ml-1">{business.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-gray-50 p-4">
                    <div className="text-xs text-gray-500">
                      <span>{business.reviews} reviews</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>{business.views} views</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsored Businesses */}
        <section className="bg-gray-50 py-12">
          <div className="container px-4 md:px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Sponsored
              </h2>
              <Button variant="link" className="text-green-600">
                View All
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {sponsoredBusinesses.map((business) => (
                <Card
                  key={business.id}
                  className="overflow-hidden border-2 border-yellow-100 transition-all hover:shadow-lg"
                >
                  <div className="absolute right-2 top-2">
                    <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                      Sponsored
                    </Badge>
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-start">
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage
                          src={business.image || "/placeholder.svg"}
                          alt={business.name}
                        />
                        <AvatarFallback className="rounded-md bg-green-100 text-green-800">
                          {business.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <CardTitle className="line-clamp-1 text-lg">
                          {business.name}
                        </CardTitle>
                        <div className="mt-1 flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">
                            {business.rating}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({business.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">
                          Category:
                        </span>
                        <span className="ml-1">{business.category}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        <span>{business.location}</span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Premium business offering quality services with
                        excellent customer satisfaction.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-yellow-50 p-4">
                    <Button
                      onClick={handleClick}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 md:text-3xl">
              How Misikir Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Search</h3>
                <p className="text-gray-600">
                  Find businesses by category, location, or specific services
                  you need
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Review</h3>
                <p className="text-gray-600">
                  Share your experience and help others make informed decisions
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
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
                    className="h-8 w-8"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold">Connect</h3>
                <p className="text-gray-600">
                  Directly connect with businesses to inquire about their
                  services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Register Your Business CTA */}
        <section className="bg-green-700 py-16 text-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Grow Your Business with Misikir
              </h2>
              <p className="mb-8 text-lg text-green-100">
                Join thousands of businesses that are getting discovered by
                potential customers every day
              </p>
              <Button
                onClick={() => router.push("/register-business")}
                className="bg-white px-8 py-6 text-lg font-bold text-green-700 hover:bg-green-50"
              >
                Register Your Business
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="ml-2 text-xl font-bold text-green-700">
                  Misikir
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Your trusted witness for business information
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">
                For Users
              </h3>
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
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">
                For Businesses
              </h3>
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
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">
                Contact Us
              </h3>
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
            <p>
              &copy; {new Date().getFullYear()} Misikir. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
