"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, Edit, ExternalLink, Package, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { CompaniesService } from "@/services/api";
import { useState } from "react";
import type { CompanyList } from "@/types/api";

export default function MyCompaniesPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [companies, setCompanies] = useState<CompanyList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirect if not authenticated or not a company owner
        if (!authLoading && (!isAuthenticated || (user?.role !== "COMPANY_OWNER" && user?.role !== "ADMIN"))) {
            router.push("/login");
        }
    }, [user, isAuthenticated, authLoading, router]);

    useEffect(() => {
        const fetchMyCompanies = async () => {
            if (!isAuthenticated) return;

            try {
                setIsLoading(true);
                const data = await CompaniesService.getMyCompanies();
                setCompanies(data);
            } catch (err: any) {
                console.error("Failed to fetch companies:", err);
                setError(err.message || "Failed to load companies");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchMyCompanies();
        }
    }, [isAuthenticated]);

    if (authLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || (user?.role !== "COMPANY_OWNER" && user?.role !== "ADMIN")) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-muted/30">
                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">My Companies</h1>
                                <p className="text-muted-foreground mt-2">
                                    Manage your registered businesses
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push("/register-business")}
                                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Company
                            </Button>
                        </div>

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="overflow-hidden animate-pulse">
                                        <CardHeader className="p-6">
                                            <div className="h-12 w-12 rounded-md bg-muted mb-4"></div>
                                            <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                                            <div className="h-4 w-full bg-muted rounded"></div>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        ) : error ? (
                            <Card className="p-6">
                                <div className="text-center text-red-600 dark:text-red-400">
                                    <p className="font-semibold">Error loading companies</p>
                                    <p className="text-sm mt-2">{error}</p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => window.location.reload()}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            </Card>
                        ) : companies.length === 0 ? (
                            <Card className="p-12">
                                <div className="text-center">
                                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No companies yet</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Register your first business to get started
                                    </p>
                                    <Button
                                        onClick={() => router.push("/register-business")}
                                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Register Your Business
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {companies.map((company) => (
                                    <Card
                                        key={company.id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => router.push(`/business/${company.id}`)}
                                    >
                                        <CardHeader className="p-6">
                                            <div className="flex items-start gap-4">
                                                <Avatar className="h-16 w-16 rounded-lg">
                                                    <AvatarImage
                                                        src={company.logo_url || "/placeholder.svg"}
                                                        alt={company.name}
                                                    />
                                                    <AvatarFallback className="rounded-lg bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xl">
                                                        {company.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg line-clamp-1">
                                                        {company.name}
                                                    </CardTitle>
                                                    <CardDescription className="line-clamp-2 mt-1">
                                                        {company.description || "No description"}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-6 pb-4 space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Rating</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold">{company.misikir_score.toFixed(1)}</span>
                                                    <span className="text-yellow-500">★</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Reviews</span>
                                                <span className="font-semibold">{company.misikir_reviews_count}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {company.category_names.split(",").slice(0, 2).map((cat, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {cat.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="px-6 pb-6 gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/business/${company.id}/edit`);
                                                }}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/business/${company.id}`);
                                                }}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
