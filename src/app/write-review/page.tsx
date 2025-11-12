"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Search, ChevronDown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navbar } from "@/components/navbar";
import { useBusinesses } from "@/hooks/use-api";
import { ReviewsService } from "@/services/api/reviews.service";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { getUserFriendlyErrorMessage } from "@/lib/error-messages";
import { useAuth } from "@/contexts/AuthContext";

export default function WriteReviewPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { businesses, isLoading } = useBusinesses({});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);

    // Filter businesses based on search
    const filteredBusinesses = businesses.filter((business) =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            toast.error("Please log in to write a review", {
                description: "You need to be logged in to share your experience.",
            });
            // Redirect to login page after short delay
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBusiness) {
            toast.error("Please select a business");
            return;
        }

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        if (!reviewTitle.trim()) {
            toast.error("Please enter a review title");
            return;
        }

        if (!reviewText.trim()) {
            toast.error("Please write your review");
            return;
        }

        if (wouldRecommend === null) {
            toast.error("Please indicate if you would recommend this business");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create review data with the exact field names the backend expects
            const reviewData = {
                company: selectedBusiness.id,
                rating: rating, // Backend expects 'rating' field (1-5 scale)
                content: reviewText.trim(), // Backend expects 'content' field
                title: reviewTitle.trim(), // Include title if backend accepts it
            };

            // Submit review to backend
            await ReviewsService.createReview(reviewData);

            toast.success("Review submitted successfully!", {
                description: "Thank you for sharing your experience.",
            });

            // Redirect to home page after short delay
            setTimeout(() => {
                router.push("/");
            }, 1500);
        } catch (err) {
            if (err instanceof ApiError) {
                // Check if it's an authentication error
                if (err.message.includes("Authentication") || err.message.includes("credentials")) {
                    toast.error("Session expired", {
                        description: "Please log in again to submit your review.",
                    });
                    setTimeout(() => {
                        router.push("/login");
                    }, 2000);
                } else {
                    const friendlyMessage = getUserFriendlyErrorMessage(err.message);
                    toast.error("Unable to submit review", {
                        description: friendlyMessage,
                    });
                }
            } else {
                toast.error("Unable to submit review", {
                    description: "Please try again later.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push("/");
    };

    // Show loading state while checking auth
    if (authLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </main>
            </div>
        );
    }

    // Show login prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
                    <Card className="max-w-md mx-4 shadow-lg">
                        <CardHeader className="text-center">
                            <div className="mb-4 inline-block mx-auto">
                                <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-4">
                                    <Lock className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl">Login Required</CardTitle>
                            <CardDescription className="text-base">
                                You need to be logged in to write a review
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground text-center">
                                Please log in to share your experience and help others make informed decisions.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.push("/")}
                                >
                                    Go Back
                                </Button>
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                    onClick={() => router.push("/login")}
                                >
                                    Log In
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1 bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 py-12 min-h-[calc(100vh-4rem)]">
                <div className="container mx-auto max-w-2xl px-4 md:px-6">
                    {/* Page Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-block">
                            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-3">
                                <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-green-800 dark:text-green-400">
                            Write a Review
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Share your experience with a business
                        </p>
                    </div>

                    {/* Review Form Card */}
                    <Card className="shadow-lg border-green-200 dark:border-green-900/30 mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl text-green-700 dark:text-green-400">Business Review</CardTitle>
                            <CardDescription className="text-base">
                                Help others by sharing your honest opinion
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 md:px-10 pb-8">
                            <form onSubmit={handleSubmit} className="space-y-7">
                                {/* Find a Business */}
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">
                                        Find a Business
                                    </Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-between h-12 text-left font-normal"
                                                type="button"
                                            >
                                                {selectedBusiness ? (
                                                    <span className="flex items-center gap-2">
                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                        {selectedBusiness.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        Search for a business to review
                                                    </span>
                                                )}
                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full max-w-md p-0">
                                            <div className="p-2 border-b sticky top-0 bg-background">
                                                <div className="relative">
                                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Search businesses..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="pl-8"
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-72 overflow-y-auto">
                                                {isLoading ? (
                                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                                        Loading businesses...
                                                    </div>
                                                ) : filteredBusinesses.length > 0 ? (
                                                    filteredBusinesses.map((business) => (
                                                        <DropdownMenuItem
                                                            key={business.id}
                                                            onClick={() => {
                                                                setSelectedBusiness(business);
                                                                setSearchQuery("");
                                                            }}
                                                            className="cursor-pointer p-3 flex items-center gap-3"
                                                        >
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-700 dark:text-green-400 font-semibold">
                                                                    {business.name.substring(0, 2).toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium truncate">
                                                                    {business.name}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                                    <span>{business.category}</span>
                                                                    <span>•</span>
                                                                    <span className="flex items-center">
                                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                                                        {business.rating}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                                        No businesses found
                                                    </div>
                                                )}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Selected Business Display */}
                                {selectedBusiness && (
                                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-900/50">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-semibold text-lg shadow-sm">
                                                    {selectedBusiness.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-green-800 dark:text-green-300">
                                                    {selectedBusiness.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedBusiness.category} • {selectedBusiness.location}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-xs font-medium">{selectedBusiness.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Your Rating */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Your Rating</Label>
                                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 p-4 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoveredRating(star)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded p-1"
                                                >
                                                    <Star
                                                        className={`h-10 w-10 transition-colors ${star <= (hoveredRating || rating)
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300 dark:text-gray-600"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium">
                                            {rating > 0 ? (
                                                <span className="text-foreground">
                                                    {rating === 1 && "Poor"}
                                                    {rating === 2 && "Fair"}
                                                    {rating === 3 && "Good"}
                                                    {rating === 4 && "Very Good"}
                                                    {rating === 5 && "Excellent"}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">Select rating</span>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Review Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="review-title" className="text-base font-semibold">
                                        Review Title
                                    </Label>
                                    <Input
                                        id="review-title"
                                        placeholder="Summarize your experience"
                                        value={reviewTitle}
                                        onChange={(e) => setReviewTitle(e.target.value)}
                                        className="h-12 text-base"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Your Review */}
                                <div className="space-y-2">
                                    <Label htmlFor="review-text" className="text-base font-semibold">
                                        Your Review
                                    </Label>
                                    <Textarea
                                        id="review-text"
                                        placeholder="Tell others about your experience with this business"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        className="min-h-[180px] text-base resize-none"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {reviewText.length} characters • Minimum 10 characters recommended
                                    </p>
                                </div>

                                {/* Would you recommend */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">
                                        Would you recommend this business?
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            type="button"
                                            variant={wouldRecommend === true ? "default" : "outline"}
                                            className={`h-16 text-base font-semibold ${wouldRecommend === true
                                                    ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                                    : "hover:border-green-600 hover:text-green-600 dark:hover:border-green-500 dark:hover:text-green-500"
                                                }`}
                                            onClick={() => setWouldRecommend(true)}
                                            disabled={isSubmitting}
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={wouldRecommend === false ? "default" : "outline"}
                                            className={`h-16 text-base font-semibold ${wouldRecommend === false
                                                    ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                                                    : "hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-500"
                                                }`}
                                            onClick={() => setWouldRecommend(false)}
                                            disabled={isSubmitting}
                                        >
                                            No
                                        </Button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 h-12"
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 font-semibold"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Review"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Your review helps others make informed decisions. Please be honest and respectful.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
