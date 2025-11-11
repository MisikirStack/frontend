"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Building2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CompaniesService } from "@/services/api/companies.service";
import { ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { getUserFriendlyErrorMessage } from "@/lib/error-messages";

export default function CompanySetupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    // Check if user is authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            toast.info("Please log in first", {
                description: "You need to be logged in to create a business profile.",
            });
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Check if user already has a company
    useEffect(() => {
        const checkExistingCompany = async () => {
            if (user) {
                try {
                    const companies = await CompaniesService.getMyCompanies();
                    if (companies && companies.length > 0) {
                        // User already has a company, redirect to it
                        router.push(`/business/${companies[0].id}`);
                    }
                } catch (err) {
                    console.error("Error checking existing company:", err);
                }
            }
        };

        if (user) {
            checkExistingCompany();
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Note: The backend should automatically set the owner from the authenticated user
            // Categories and subcategories can be added later through the update endpoint
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            if (formData.description) {
                formDataToSend.append("description", formData.description);
            }

            const company = await CompaniesService.createCompany(formDataToSend);

            toast.success("Business profile created!", {
                description: "Your business profile has been created successfully.",
            });

            // Redirect to the new company page
            router.push(`/business/${company.id}`);
        } catch (err) {
            if (err instanceof ApiError) {
                const friendlyMessage = getUserFriendlyErrorMessage(err.message);
                setError(friendlyMessage);
                toast.error("Unable to create business profile", {
                    description: friendlyMessage,
                });
            } else {
                const friendlyMessage = "We couldn't create your business profile. Please try again.";
                setError(friendlyMessage);
                toast.error("Unable to create business profile", {
                    description: friendlyMessage,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container flex min-h-screen w-full flex-col items-center justify-center py-8">
            <Link href="/" className="mb-8 flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <span className="ml-2 text-2xl font-bold text-green-700 dark:text-green-500">
                    Misikir
                </span>
            </Link>

            <div className="mx-auto w-full max-w-2xl space-y-6 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 p-8 shadow-lg">
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold dark:text-white mb-2">
                        Create Your Business Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Let's get started by setting up your business on Misikir
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Business Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your business name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Business Description</Label>
                            <textarea
                                id="description"
                                placeholder="Tell us about your business..."
                                value={formData.description}
                                onChange={handleChange}
                                disabled={isLoading}
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Note:</strong> After creating your business profile, you'll be able to add more details like categories, contact information, products, and services.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push("/")}
                            disabled={isLoading}
                        >
                            Skip for now
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={isLoading || !formData.name.trim()}
                        >
                            {isLoading ? (
                                "Creating..."
                            ) : (
                                <>
                                    Create Profile
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        Need help?{" "}
                        <Link href="/help" className="text-green-600 dark:text-green-500 hover:underline">
                            Visit our help center
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
