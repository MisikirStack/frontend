"use client";

import Link from "next/link";
import { Search, MapPin, Star, Filter, ChevronDown, Heart, TrendingUp, Users, Building2 } from "lucide-react";
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
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBusinesses, useStats, useFavorites } from "@/hooks/use-api";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  // Use API hooks (backend-ready)
  const { businesses, isLoading } = useBusinesses({ category: selectedCategory, search: searchQuery });
  const { stats } = useStats();
  const { toggleFavorite, isFavorite } = useFavorites();

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
    <div className="flex min-h-screen flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <Star className="h-6 w-6 text-yellow-500 animate-pulse" />
              <span className="ml-2 text-xl font-bold text-green-700 dark:text-green-500">
                Misikir
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory(category)}
                    key={category}
                    className="cursor-pointer"
                  >
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
            <ThemeToggle />
            <Button onClick={() => router.push("/login")} variant="outline">
              Login
            </Button>
            <Button
              onClick={() => router.push("/register-business")}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              Register Your Business
            </Button>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
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
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-block animate-fade-in">
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  🎉 Discover trusted businesses in your area
                </Badge>
              </div>
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-green-800 dark:text-green-400 sm:text-4xl md:text-5xl animate-fade-in-up">
                Your Trusted Witness for Business Information
              </h1>
              <p className="mb-8 text-lg text-muted-foreground animate-fade-in-up animation-delay-200">
                Discover, review, and connect with trusted businesses in your
                area
              </p>
              <div className="relative mx-auto mb-6 max-w-2xl animate-fade-in-up animation-delay-400">
                <form onSubmit={(e) => { e.preventDefault(); }} className="flex">
                  <div className="relative flex-1">
                    <Input
                      className="h-12 pl-10 pr-4 rounded-r-none border-r-0"
                      placeholder="Search for businesses, services, or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-3 top-3.5 text-muted-foreground">
                      <Search className="h-5 w-5" />
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 rounded-l-none"
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
              <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up animation-delay-600">
                <Badge variant="outline" className="bg-background hover:bg-accent cursor-pointer transition-colors">
                  Restaurants
                </Badge>
                <Badge variant="outline" className="bg-background hover:bg-accent cursor-pointer transition-colors">
                  Hotels
                </Badge>
                <Badge variant="outline" className="bg-background hover:bg-accent cursor-pointer transition-colors">
                  Healthcare
                </Badge>
                <Badge variant="outline" className="bg-background hover:bg-accent cursor-pointer transition-colors">
                  Education
                </Badge>
                <Badge variant="outline" className="bg-background hover:bg-accent cursor-pointer transition-colors">
                  Technology
                </Badge>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10 dark:opacity-5">
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/50 py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-2 animate-fade-in">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                  <Building2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-500">{stats.totalBusinesses.toLocaleString()}+</div>
                <div className="text-sm text-muted-foreground">Businesses Listed</div>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 animate-fade-in animation-delay-200">
                <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-3">
                  <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-500">{stats.totalReviews.toLocaleString()}+</div>
                <div className="text-sm text-muted-foreground">Reviews Posted</div>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 animate-fade-in animation-delay-400">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-500">{stats.totalUsers.toLocaleString()}+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Rated Businesses */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl animate-fade-in">
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

            {/* Loading State */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 rounded-md bg-muted"></div>
                        <div className="h-4 w-12 bg-muted rounded"></div>
                      </div>
                      <div className="mt-2 h-6 w-3/4 bg-muted rounded"></div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-2/3 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {businesses.map((business, index) => (
                  <Card
                    key={business.id}
                    className="group overflow-hidden transition-all hover:shadow-lg hover:scale-105 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => router.push(`/business/${business.id}`)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <Avatar className="h-12 w-12 rounded-md">
                          <AvatarImage
                            src={business.image || "/placeholder.svg"}
                            alt={business.name}
                          />
                          <AvatarFallback className="rounded-md bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            {business.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(business.id);
                            }}
                          >
                            <Heart
                              className={`h-4 w-4 transition-colors ${isFavorite(business.id)
                                  ? 'fill-red-500 text-red-500'
                                  : ''
                                }`}
                            />
                          </Button>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm font-medium">
                              {business.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardTitle className="mt-2 line-clamp-1 text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {business.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <span className="font-medium text-foreground">
                            Category:
                          </span>
                          <span className="ml-1">{business.category}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          <span>{business.location}</span>
                        </div>
                        {business.duration && (
                          <div className="flex items-center">
                            <span className="font-medium text-foreground">
                              In service:
                            </span>
                            <span className="ml-1">{business.duration}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
                      <div className="text-xs text-muted-foreground">
                        <span>{business.reviews} reviews</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span>{business.views} views</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sponsored Businesses */}
        <section className="bg-muted/30 py-12">
          <div className="container px-4 md:px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold md:text-3xl">
                Sponsored
              </h2>
              <Button variant="link" className="text-green-600 dark:text-green-500">
                View All
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {sponsoredBusinesses.map((business) => (
                <Card
                  key={business.id}
                  className="group overflow-hidden border-2 border-yellow-100 dark:border-yellow-900/30 transition-all hover:shadow-lg cursor-pointer"
                  onClick={() => router.push(`/business/${business.id}`)}
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
                        <AvatarFallback className="rounded-md bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {business.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <CardTitle className="line-clamp-1 text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {business.name}
                        </CardTitle>
                        <div className="mt-1 flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">
                            {business.rating}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({business.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <span className="font-medium text-foreground">
                          Category:
                        </span>
                        <span className="ml-1">{business.category}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        <span>{business.location}</span>
                      </div>
                      <p className="mt-2 text-foreground">
                        Premium business offering quality services with
                        excellent customer satisfaction.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-yellow-50 dark:bg-yellow-950/20 p-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/business/${business.id}`);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
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
            <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
              How Misikir Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center animate-fade-in">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 transition-transform hover:scale-110">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Search</h3>
                <p className="text-muted-foreground">
                  Find businesses by category, location, or specific services
                  you need
                </p>
              </div>
              <div className="flex flex-col items-center text-center animate-fade-in animation-delay-200">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 transition-transform hover:scale-110">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Review</h3>
                <p className="text-muted-foreground">
                  Share your experience and help others make informed decisions
                </p>
              </div>
              <div className="flex flex-col items-center text-center animate-fade-in animation-delay-400">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 transition-transform hover:scale-110">
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
                <p className="text-muted-foreground">
                  Directly connect with businesses to inquire about their
                  services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Register Your Business CTA */}
        <section className="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 py-16 text-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <TrendingUp className="mx-auto mb-4 h-12 w-12 animate-bounce" />
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
                size="lg"
              >
                Register Your Business
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="ml-2 text-xl font-bold text-green-700 dark:text-green-500">
                  Misikir
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Your trusted witness for business information
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">
                For Users
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    Write a Review
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    Browse Categories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    Search Businesses
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">
                For Businesses
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/register-business" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    Register Your Business
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    Business Login
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    Advertising Options
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">
                Contact Us
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Misikir. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
