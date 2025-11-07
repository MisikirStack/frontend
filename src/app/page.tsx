"use client";

import Link from "next/link";
import { Search, MapPin, Star, Filter, ChevronDown, Heart, TrendingUp, Users, Building2, Map, Grid3x3 } from "lucide-react";
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
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useBusinesses, useStats, useFavorites, useCategories, useBusinessSearch } from "@/hooks/use-api";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>();
  const [minRating, setMinRating] = useState<number | undefined>();
  const [ordering, setOrdering] = useState<string>("misikir_score");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Refs for keyboard navigation
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Use API hooks (backend-ready)
  const { businesses, isLoading } = useBusinesses({
    category: selectedCategory,
    search: searchQuery,
    location: selectedLocation,
    minRating,
    ordering
  });
  const { stats, isLoading: statsLoading } = useStats();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { categories } = useCategories();

  // Search suggestions
  const { results: suggestions, isLoading: suggestionsLoading } = useBusinessSearch(searchQuery);

  // Featured/Sponsored businesses - using top rated businesses as featured
  const { businesses: featuredBusinesses, isLoading: featuredLoading } = useBusinesses({
    ordering: "-misikir_score",
    minRating: 4.5,
  });

  const handleSearchSelect = (businessName: string) => {
    setSearchQuery(businessName);
    setShowSuggestions(false);
  };

  // Keyboard navigation for autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          const selected = suggestions[selectedSuggestionIndex];
          handleSearchSelect(selected.name);
          router.push(`/business/${selected.id}`);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Reset suggestion index when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [suggestions]);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedSuggestionIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedSuggestionIndex]);

  return (
    <div className="flex min-h-screen flex-col transition-colors duration-300">
      {/* Navbar with Backend Integration */}
      <Navbar
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        onLocationSelect={setSelectedLocation}
        selectedLocation={selectedLocation}
      />

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

              {/* Stats Section - Moved above search */}
              <div className="mb-10 grid gap-6 md:grid-cols-3 animate-fade-in-up animation-delay-300">
                {statsLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center text-center space-y-2 animate-pulse">
                        <div className="rounded-full bg-muted h-12 w-12"></div>
                        <div className="h-8 w-16 bg-muted rounded"></div>
                        <div className="h-4 w-24 bg-muted rounded"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                        <Building2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                      </div>
                      <div className="text-3xl font-bold text-green-700 dark:text-green-500">{stats.totalBusinesses.toLocaleString()}+</div>
                      <div className="text-sm text-muted-foreground">Businesses Listed</div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-3">
                        <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                      </div>
                      <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-500">{stats.totalReviews.toLocaleString()}+</div>
                      <div className="text-sm text-muted-foreground">Reviews Posted</div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3">
                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                      </div>
                      <div className="text-3xl font-bold text-blue-700 dark:text-blue-500">{stats.totalUsers.toLocaleString()}+</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative mx-auto mb-6 max-w-2xl animate-fade-in-up animation-delay-400">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Search is already handled by the useBusinesses hook watching searchQuery
                }} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Input
                      ref={searchInputRef}
                      className="h-12 pl-10 pr-4"
                      placeholder="Search for businesses, services, or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="absolute left-3 top-3.5 text-muted-foreground">
                      <Search className="h-5 w-5" />
                    </div>

                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && searchQuery.length > 1 && (
                      <div
                        ref={suggestionsRef}
                        className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                      >
                        {suggestionsLoading ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            Searching...
                          </div>
                        ) : suggestions.length > 0 ? (
                          <div className="py-2">
                            {suggestions.slice(0, 8).map((business, index) => (
                              <div
                                key={business.id}
                                className={`px-4 py-2 hover:bg-accent cursor-pointer flex items-center gap-3 transition-colors ${index === selectedSuggestionIndex ? 'bg-accent' : ''
                                  }`}
                                onClick={() => {
                                  handleSearchSelect(business.name);
                                  router.push(`/business/${business.id}`);
                                }}
                              >
                                <Avatar className="h-10 w-10 rounded-md">
                                  <AvatarImage
                                    src={business.image}
                                    alt={business.name}
                                  />
                                  <AvatarFallback className="rounded-md bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    {business.name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left">
                                  <div className="font-medium text-sm">{business.name}</div>
                                  <div className="text-xs text-muted-foreground">{business.category}</div>
                                </div>
                                <div className="flex items-center text-xs">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  {business.rating}
                                </div>
                              </div>
                            ))}
                            <div className="px-4 py-2 text-xs text-muted-foreground border-t">
                              Use ↑↓ arrows to navigate, Enter to select, Esc to close
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No suggestions found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 px-6"
                        >
                          <Filter className="mr-2 h-4 w-4" />
                          Filters
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        <div className="p-2">
                          <div className="mb-3">
                            <label className="text-sm font-medium mb-1 block">Minimum Rating</label>
                            <select
                              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                              value={minRating || ""}
                              onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
                            >
                              <option value="">Any Rating</option>
                              <option value="4.5">4.5+ Stars</option>
                              <option value="4.0">4.0+ Stars</option>
                              <option value="3.5">3.5+ Stars</option>
                              <option value="3.0">3.0+ Stars</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="text-sm font-medium mb-1 block">Sort By</label>
                            <select
                              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                              value={ordering}
                              onChange={(e) => setOrdering(e.target.value)}
                            >
                              <option value="-misikir_score">Highest Rated</option>
                              <option value="misikir_score">Lowest Rated</option>
                              <option value="-misikir_reviews_count">Most Reviews</option>
                              <option value="misikir_reviews_count">Fewest Reviews</option>
                              <option value="-created_at">Newest</option>
                              <option value="created_at">Oldest</option>
                            </select>
                          </div>
                          {(minRating || ordering !== "misikir_score") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setMinRating(undefined);
                                setOrdering("misikir_score");
                              }}
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </form>
              </div>
              <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up animation-delay-600">
                {categories.slice(0, 5).map((category: string) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="bg-background hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10 dark:opacity-5">
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Top Rated Businesses */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-center text-2xl font-bold md:text-3xl animate-fade-in mb-4">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : selectedCategory || selectedLocation
                    ? `${selectedCategory ? selectedCategory : ""} ${selectedCategory && selectedLocation ? "in" : ""} ${selectedLocation ? selectedLocation : ""} Businesses`.trim()
                    : "Top Rated Businesses"}
              </h2>

              {/* Active Filters Display */}
              {(selectedCategory || selectedLocation || minRating || searchQuery || ordering !== "misikir_score") && (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {searchQuery && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Search: {searchQuery}
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Category: {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory(undefined)}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedLocation && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Location: {selectedLocation}
                      <button
                        onClick={() => setSelectedLocation(undefined)}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {minRating && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Rating: {minRating}+ Stars
                      <button
                        onClick={() => setMinRating(undefined)}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {ordering !== "misikir_score" && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Sort: {
                        ordering === "-misikir_score" ? "Highest Rated" :
                          ordering === "misikir_score" ? "Lowest Rated" :
                            ordering === "-misikir_reviews_count" ? "Most Reviews" :
                              ordering === "misikir_reviews_count" ? "Fewest Reviews" :
                                ordering === "-created_at" ? "Newest" :
                                  ordering === "created_at" ? "Oldest" : ordering
                      }
                      <button
                        onClick={() => setOrdering("misikir_score")}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(undefined);
                      setSelectedLocation(undefined);
                      setMinRating(undefined);
                      setOrdering("misikir_score");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* View Mode Toggle - Centered */}
              <div className="flex justify-center gap-2 mb-4">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-9"
                >
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="h-9"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>

              {/* Results Count - Centered */}
              {!isLoading && (
                <p className="text-center text-sm text-muted-foreground">
                  Found {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
                </p>
              )}
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
            ) : businesses.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto max-w-md">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">No businesses found</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    We couldn't find any businesses matching your search criteria.
                    Try adjusting your filters or search terms.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(undefined);
                      setSelectedLocation(undefined);
                      setMinRating(undefined);
                      setOrdering("misikir_score");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : viewMode === "grid" ? (
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
            ) : (
              /* Map View */
              <div className="flex gap-6">
                {/* Map Container */}
                <div className="flex-1 rounded-lg border bg-muted/30 overflow-hidden relative" style={{ minHeight: "600px" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <Map className="h-10 w-10 text-green-600 dark:text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Interactive Map View</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Map integration coming soon! Businesses will be displayed with interactive markers showing their locations across Ethiopia.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <Badge variant="outline" className="px-3 py-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {businesses.length} {businesses.length === 1 ? 'location' : 'locations'} to display
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar with business list */}
                <div className="w-80 space-y-4 max-h-[600px] overflow-y-auto">
                  <div className="sticky top-0 bg-background pb-2 z-10">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      {businesses.length} Businesses
                    </h3>
                  </div>
                  {businesses.map((business) => (
                    <Card
                      key={business.id}
                      className="group cursor-pointer transition-all hover:shadow-md hover:border-green-300 dark:hover:border-green-700"
                      onClick={() => router.push(`/business/${business.id}`)}
                    >
                      <CardHeader className="p-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 rounded-md">
                            <AvatarImage
                              src={business.image || "/placeholder.svg"}
                              alt={business.name}
                            />
                            <AvatarFallback className="rounded-md bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                              {business.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                              {business.name}
                            </h4>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{business.rating}</span>
                              <span className="text-xs text-muted-foreground">({business.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1">{business.location}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(business.id);
                            }}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 transition-colors ${isFavorite(business.id)
                                ? 'fill-red-500 text-red-500'
                                : ''
                                }`}
                            />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Featured Businesses */}
        <section className="py-12 border-t">
          <div className="container px-4 md:px-6">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold md:text-3xl mb-2">
                Featured Businesses
              </h2>
              <p className="text-sm text-muted-foreground">
                Top-rated businesses with exceptional service and reviews
              </p>
            </div>

            {featuredLoading ? (
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
            ) : featuredBusinesses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No featured businesses available at the moment.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredBusinesses.slice(0, 8).map((business, index) => (
                  <Card
                    key={business.id}
                    className="group relative overflow-hidden transition-all hover:shadow-lg hover:scale-105 cursor-pointer animate-fade-in border-green-200 dark:border-green-900/30"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => router.push(`/business/${business.id}`)}
                  >
                    {index < 3 && (
                      <div className="absolute right-2 top-2 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          ⭐ Featured
                        </Badge>
                      </div>
                    )}
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
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
                      <div className="text-xs text-muted-foreground">
                        <span>{business.reviews} reviews</span>
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-500 font-medium">
                        View Details →
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
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
