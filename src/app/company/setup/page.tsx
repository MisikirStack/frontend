"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Building2, ArrowRight, ArrowLeft, Check, Phone, Mail, Globe, MapPin, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CompaniesService } from "@/services/api/companies.service";
import { MetadataService, type Category, type Subcategory, type Region, type Subregion } from "@/services/api";
import { ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { getUserFriendlyErrorMessage } from "@/lib/error-messages";

export default function CompanySetupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const isEditMode = Boolean(editId);
    const { user, isLoading: authLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Metadata states
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [subregions, setSubregions] = useState<Subregion[]>([]);
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        name: "",
        description: "",

        // Step 2: Contact Information
        phone: "",
        email: "",
        website: "",
        googleMapLink: "",

        // Step 3: Categories & Location (now using IDs)
        categoryId: null as number | null,
        subcategoryId: null as number | null,
        regionId: null as number | null,
        subregionId: null as number | null,

        // Step 4: Terms & Confirmation
        agreeToTerms: false,
        agreeToPrivacy: false,
    });

    const totalSteps = 4;

    // Check if user is authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            toast.info("Please log in first", {
                description: "You need to be logged in to create a business profile.",
            });
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Fetch metadata (categories and regions) on mount
    useEffect(() => {
        const fetchMetadata = async () => {
            setIsLoadingMetadata(true);
            try {
                // Try to fetch categories and regions
                // Note: These endpoints may not exist yet in the backend
                const results = await Promise.allSettled([
                    MetadataService.getCategories(),
                    MetadataService.getRegions(),
                ]);

                // Handle categories result
                if (results[0].status === 'fulfilled') {
                    setCategories(results[0].value);
                } else {
                    console.warn("Categories endpoint not available:", results[0].reason);
                }

                // Handle regions result
                if (results[1].status === 'fulfilled') {
                    setRegions(results[1].value);
                } else {
                    console.warn("Regions endpoint not available:", results[1].reason);
                }

                // Show info if both failed
                if (results[0].status === 'rejected' && results[1].status === 'rejected') {
                    console.info("Categories and regions endpoints not available. These fields will be hidden.");
                }
            } catch (err) {
                console.error("Error fetching metadata:", err);
            } finally {
                setIsLoadingMetadata(false);
            }
        };

        fetchMetadata();
    }, []);

    // Load existing company data if in edit mode
    useEffect(() => {
        const loadCompanyData = async () => {
            if (editId && user) {
                setIsLoadingData(true);
                try {
                    const company = await CompaniesService.getCompanyById(parseInt(editId));
                    // Check if user is the owner
                    if (company.owner_email !== user.email) {
                        toast.error("Access denied", {
                            description: "You can only edit your own businesses.",
                        });
                        router.push(`/business/${editId}`);
                        return;
                    }
                    // Populate form with existing data
                    setFormData(prev => ({
                        ...prev,
                        name: company.name,
                        description: company.description || "",
                    }));
                } catch (err) {
                    console.error("Error loading company:", err);
                    toast.error("Failed to load business data");
                    router.push("/profile");
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        if (!authLoading && user) {
            loadCompanyData();
        }
    }, [editId, user, authLoading, router]);

    // Removed auto-redirect check - users can have multiple companies

    const validateStep1 = () => {
        if (!formData.name.trim()) {
            setError("Business name is required");
            toast.error("Please enter your business name");
            return false;
        }
        if (formData.name.trim().length < 3) {
            setError("Business name must be at least 3 characters");
            toast.error("Business name is too short");
            return false;
        }
        if (!formData.description.trim()) {
            setError("Business description is required");
            toast.error("Please enter a business description");
            return false;
        }
        if (formData.description.trim().length < 20) {
            setError("Business description must be at least 20 characters");
            toast.error("Please provide a more detailed description (minimum 20 characters)");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        // Email is mandatory
        if (!formData.email.trim()) {
            setError("Email address is required");
            toast.error("Please enter your business email");
            return false;
        }
        if (!formData.email.includes('@')) {
            setError("Please enter a valid email address");
            toast.error("Invalid email format");
            return false;
        }
        if (formData.website && !formData.website.startsWith('http')) {
            setError("Website URL must start with http:// or https://");
            toast.error("Invalid website URL");
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        // Categories and location are optional for now
        return true;
    };

    const validateStep4 = () => {
        if (!formData.agreeToTerms) {
            setError("You must agree to the Terms & Conditions");
            toast.error("Please accept the Terms & Conditions");
            return false;
        }
        if (!formData.agreeToPrivacy) {
            setError("You must agree to the Privacy Policy");
            toast.error("Please accept the Privacy Policy");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError(null);

        // Validate current step
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;
        if (currentStep === 3 && !validateStep3()) return;

        // Move to next step
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setError(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate all steps
        if (!validateStep1() || !validateStep2() || !validateStep3() || !validateStep4()) {
            return;
        }

        setIsLoading(true);

        try {
            // Prepare company data for backend
            const companyData: any = {
                name: formData.name,
                description: formData.description,
            };

            // Add categories if selected (backend expects arrays of IDs)
            // Only include if we have valid IDs
            if (formData.categoryId !== null) {
                companyData.categories = [formData.categoryId];
            }
            if (formData.subcategoryId !== null) {
                companyData.subcategories = [formData.subcategoryId];
            }

            // Create the company
            const company = await CompaniesService.createCompany(companyData);

            // Create contact info
            try {
                await CompaniesService.updateContactInfo(company.id, {
                    phone: formData.phone || null,
                    email: formData.email,
                    website: formData.website || null,
                    googleMapLink: formData.googleMapLink || null,
                    company: company.id,
                });
            } catch (err) {
                console.error("Error creating contact info:", err);
                // Don't fail the whole process if contact info fails
            }

            // Create address if region is selected
            if (formData.regionId && formData.subregionId) {
                try {
                    await CompaniesService.createAddress(company.id, {
                        company: company.id,
                        region: formData.regionId,
                        subregion: formData.subregionId,
                        is_primary: true,
                    });
                } catch (err) {
                    console.error("Error creating address:", err);
                    // Don't fail the whole process if address creation fails
                }
            }

            toast.success("Business created successfully!", {
                description: "Your business profile has been created. You can now add more details.",
                duration: 4000,
            });

            // Clear localStorage
            localStorage.removeItem('pendingCompanyData');

            // Redirect to the company page
            setTimeout(() => {
                router.push(`/business/${company.id}`);
            }, 1000);

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

    if (authLoading || isLoadingData) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">{isLoadingData ? "Loading business data..." : "Loading..."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                        <Star className="h-6 w-6 text-yellow-500 animate-pulse" />
                        <span className="text-xl font-bold text-green-700 dark:text-green-500">
                            Misikir
                        </span>
                    </Link>
                </div>
            </div>

            <div className="container flex flex-col items-center justify-center py-12 px-4 md:px-6">
                {/* Progress Indicator */}
                <div className="w-full max-w-3xl mb-8">
                    <div className="flex items-center justify-center mb-2">
                        {[1, 2, 3, 4].map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-all font-semibold ${currentStep > step ? 'bg-green-600 text-white' :
                                            currentStep === step ? 'bg-green-600 text-white' :
                                                'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}>
                                        {currentStep > step ? <Check className="h-6 w-6" /> : step}
                                    </div>
                                    <span className={`text-sm font-medium whitespace-nowrap ${currentStep >= step ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                                        }`}>
                                        {step === 1 ? 'Basic Info' : step === 2 ? 'Contact' : step === 3 ? 'Details' : 'Confirm'}
                                    </span>
                                </div>
                                {index < 3 && (
                                    <div className="h-1 w-20 mx-3 bg-gray-200 dark:bg-gray-700 rounded">
                                        <div
                                            className="h-full bg-green-600 rounded transition-all duration-300"
                                            style={{ width: currentStep > step ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <Badge variant="outline" className="bg-background px-4 py-1.5 text-sm">
                            Step {currentStep} of {totalSteps}
                        </Badge>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="w-full max-w-3xl border-green-200 dark:border-green-900/30 shadow-xl">
                    <CardHeader className="text-center pb-6 bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 shadow-lg">
                            <Building2 className="h-8 w-8 text-white" />
                        </div>
                        {currentStep === 1 ? (
                            <>
                                <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-400">
                                    {isEditMode ? "Edit Your Business Profile" : "Register Your Business"}
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    {isEditMode
                                        ? "Update your business information on Misikir"
                                        : "Join thousands of businesses on Misikir and start building your online presence"
                                    }
                                </CardDescription>
                            </>
                        ) : (
                            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-400">
                                {currentStep === 2 && "Contact Information"}
                                {currentStep === 3 && "Additional Details"}
                                {currentStep === 4 && "Review & Confirm"}
                            </CardTitle>
                        )}
                    </CardHeader>

                    <CardContent className="pt-6">
                        {error && (
                            <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-base font-semibold">
                                            Business Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="e.g., Sunrise Coffee Shop"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
                                            className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            This is how your business will appear on Misikir
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-base font-semibold">
                                            Business Description <span className="text-red-500">*</span>
                                        </Label>
                                        <textarea
                                            id="description"
                                            placeholder="Tell customers about your business, what makes you unique, and what you offer..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
                                            rows={6}
                                            className="flex w-full rounded-md border border-gray-300 dark:border-gray-600 bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                        />
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                Help customers understand what your business is all about.
                                            </p>
                                            <p className={`text-sm font-medium ${formData.description.length < 20
                                                    ? 'text-red-500'
                                                    : 'text-green-600 dark:text-green-400'
                                                }`}>
                                                {formData.description.length} / 20 min
                                            </p>
                                        </div>
                                    </div>

                                    {!isEditMode && (
                                        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                                        i
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">
                                                        What's next?
                                                    </p>
                                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                                        Next, you'll add contact information so customers can reach you easily.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Contact & Location */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
                                            Contact Information
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Help customers get in touch with you (all fields are optional)
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="e.g., +251911234567"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Your business phone number for customer inquiries
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="e.g., contact@yourbusiness.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
                                            className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Business email for professional correspondence (required)
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website" className="text-base font-semibold flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            Website
                                        </Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            placeholder="e.g., https://www.yourbusiness.com"
                                            value={formData.website}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Your business website or social media profile (must start with http:// or https://)
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="googleMapLink" className="text-base font-semibold flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Google Maps Link
                                        </Label>
                                        <Input
                                            id="googleMapLink"
                                            type="url"
                                            placeholder="e.g., https://maps.google.com/?q=..."
                                            value={formData.googleMapLink}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Link to your business location on Google Maps
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 mt-6">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-800 dark:text-green-300 font-medium mb-1">
                                                    Great progress!
                                                </p>
                                                <p className="text-sm text-green-700 dark:text-green-400">
                                                    Next, add categories and location details for your business.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Categories & Location */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
                                            Additional Details
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Help customers find your business (all fields are optional)
                                        </p>
                                    </div>

                                    {isLoadingMetadata ? (
                                        <div className="text-center py-8">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
                                            <p className="text-sm text-muted-foreground">Loading additional fields...</p>
                                        </div>
                                    ) : categories.length === 0 && regions.length === 0 ? (
                                        /* Show message when no metadata available */
                                        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6">
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0">
                                                    <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                                                        Additional Details - Coming Soon
                                                    </p>
                                                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                                                        Categories and location fields will be available soon. For now, you can complete your business registration with just the basic information.
                                                    </p>
                                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                                        After creating your business, you'll be able to add these details from your business profile page:
                                                    </p>
                                                    <ul className="text-sm text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1 mt-2">
                                                        <li>Business categories and subcategories</li>
                                                        <li>Location (region and city)</li>
                                                        <li>Business logo and photos</li>
                                                        <li>Products and services</li>
                                                        <li>Business hours</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Category Selection */}
                                            <div className="space-y-2">
                                                <Label htmlFor="categoryId" className="text-base font-semibold">
                                                    Main Category
                                                </Label>
                                                <select
                                                    id="categoryId"
                                                    value={formData.categoryId || ""}
                                                    onChange={async (e) => {
                                                        const value = e.target.value ? parseInt(e.target.value) : null;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            categoryId: value,
                                                            subcategoryId: null // Reset subcategory when main category changes
                                                        }));

                                                        // Fetch subcategories for selected category
                                                        if (value) {
                                                            try {
                                                                const subcats = await MetadataService.getSubcategories(value);
                                                                setSubcategories(subcats);
                                                            } catch (err) {
                                                                console.error("Error fetching subcategories:", err);
                                                                setSubcategories([]);
                                                            }
                                                        } else {
                                                            setSubcategories([]);
                                                        }
                                                    }}
                                                    disabled={isLoading || categories.length === 0}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50"
                                                >
                                                    <option value="">Select a category...</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Choose the main category that best describes your business
                                                </p>
                                            </div>

                                            {/* Subcategory Selection - Only shown if main category is selected */}
                                            {formData.categoryId && subcategories.length > 0 && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="subcategoryId" className="text-base font-semibold">
                                                        Subcategory
                                                    </Label>
                                                    <select
                                                        id="subcategoryId"
                                                        value={formData.subcategoryId || ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseInt(e.target.value) : null;
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                subcategoryId: value
                                                            }));
                                                        }}
                                                        disabled={isLoading}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                                                    >
                                                        <option value="">Select a subcategory...</option>
                                                        {subcategories.map((subcategory) => (
                                                            <option key={subcategory.id} value={subcategory.id}>
                                                                {subcategory.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Narrow down your business type (optional)
                                                    </p>
                                                </div>
                                            )}

                                            {/* Region Selection */}
                                            <div className="space-y-2">
                                                <Label htmlFor="regionId" className="text-base font-semibold flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    Region
                                                </Label>
                                                <select
                                                    id="regionId"
                                                    value={formData.regionId || ""}
                                                    onChange={async (e) => {
                                                        const value = e.target.value ? parseInt(e.target.value) : null;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            regionId: value,
                                                            subregionId: null // Reset subregion when region changes
                                                        }));

                                                        // Fetch subregions for selected region
                                                        if (value) {
                                                            try {
                                                                const subregs = await MetadataService.getSubregions(value);
                                                                setSubregions(subregs);
                                                            } catch (err) {
                                                                console.error("Error fetching subregions:", err);
                                                                setSubregions([]);
                                                            }
                                                        } else {
                                                            setSubregions([]);
                                                        }
                                                    }}
                                                    disabled={isLoading || regions.length === 0}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50"
                                                >
                                                    <option value="">Select a region...</option>
                                                    {regions.map((region) => (
                                                        <option key={region.id} value={region.id}>
                                                            {region.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Select the region where your business is located
                                                </p>
                                            </div>

                                            {/* Subregion Selection - Only shown if region is selected and has subregions */}
                                            {formData.regionId && subregions.length > 0 && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="subregionId" className="text-base font-semibold">
                                                        City/Subregion
                                                    </Label>
                                                    <select
                                                        id="subregionId"
                                                        value={formData.subregionId || ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseInt(e.target.value) : null;
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                subregionId: value
                                                            }));
                                                        }}
                                                        disabled={isLoading}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                                                    >
                                                        <option value="">Select a city/subregion...</option>
                                                        {subregions.map((subregion) => (
                                                            <option key={subregion.id} value={subregion.id}>
                                                                {subregion.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Select the specific city or area
                                                    </p>
                                                </div>
                                            )}

                                            {/* Info Box - What can be added later */}
                                            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">
                                                            Add More Details Later
                                                        </p>
                                                        <p className="text-sm text-blue-700 dark:text-blue-400">
                                                            After creating your business, you can edit your profile to add: business logo, photos, products & services, business hours, and more.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 mt-6">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-800 dark:text-green-300 font-medium mb-1">
                                                    Almost there!
                                                </p>
                                                <p className="text-sm text-green-700 dark:text-green-400">
                                                    One final step to confirm and create your business profile.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Terms & Confirmation */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
                                            Review & Confirm
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Please review your information and accept our terms
                                        </p>
                                    </div>

                                    {/* Summary */}
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                                        <h4 className="font-semibold text-lg">Business Summary</h4>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Business Name</p>
                                                <p className="font-medium">{formData.name}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-muted-foreground">Description</p>
                                                <p className="text-sm">{formData.description}</p>
                                            </div>

                                            {(formData.categoryId || formData.regionId) && (
                                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm font-medium mb-2">Business Details</p>
                                                    {formData.categoryId && (
                                                        <p className="text-sm">
                                                            <span className="text-muted-foreground">Category:</span>{" "}
                                                            {categories.find(c => c.id === formData.categoryId)?.name || "N/A"}
                                                            {formData.subcategoryId && (
                                                                <> → {subcategories.find(s => s.id === formData.subcategoryId)?.name}</>
                                                            )}
                                                        </p>
                                                    )}
                                                    {formData.regionId && (
                                                        <p className="text-sm">
                                                            <span className="text-muted-foreground">Location:</span>{" "}
                                                            {regions.find(r => r.id === formData.regionId)?.name || "N/A"}
                                                            {formData.subregionId && (
                                                                <>, {subregions.find(s => s.id === formData.subregionId)?.name}</>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {(formData.phone || formData.email || formData.website || formData.googleMapLink) && (
                                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm font-medium mb-2">Contact Information</p>
                                                    {formData.phone && (
                                                        <p className="text-sm flex items-center gap-2">
                                                            <Phone className="h-3 w-3" /> {formData.phone}
                                                        </p>
                                                    )}
                                                    {formData.email && (
                                                        <p className="text-sm flex items-center gap-2">
                                                            <Mail className="h-3 w-3" /> {formData.email}
                                                        </p>
                                                    )}
                                                    {formData.website && (
                                                        <p className="text-sm flex items-center gap-2">
                                                            <Globe className="h-3 w-3" /> {formData.website}
                                                        </p>
                                                    )}
                                                    {formData.googleMapLink && (
                                                        <p className="text-sm flex items-center gap-2">
                                                            <MapPin className="h-3 w-3" /> Google Maps
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Terms & Privacy */}
                                    <div className="space-y-4 pt-4">
                                        <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                            <Checkbox
                                                id="terms"
                                                checked={formData.agreeToTerms}
                                                onCheckedChange={(checked: boolean) =>
                                                    setFormData(prev => ({ ...prev, agreeToTerms: checked }))
                                                }
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <label
                                                    htmlFor="terms"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    I agree to the{" "}
                                                    <Link href="/terms" target="_blank" className="text-green-600 dark:text-green-400 hover:underline">
                                                        Terms & Conditions
                                                    </Link>
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    By checking this box, you agree to abide by our terms of service
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                            <Checkbox
                                                id="privacy"
                                                checked={formData.agreeToPrivacy}
                                                onCheckedChange={(checked: boolean) =>
                                                    setFormData(prev => ({ ...prev, agreeToPrivacy: checked }))
                                                }
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <label
                                                    htmlFor="privacy"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    I agree to the{" "}
                                                    <Link href="/privacy" target="_blank" className="text-green-600 dark:text-green-400 hover:underline">
                                                        Privacy Policy
                                                    </Link>
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    We respect your privacy and protect your personal information
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-12 border-gray-300 dark:border-gray-600"
                                    onClick={() => {
                                        if (currentStep === 1) {
                                            isEditMode ? router.push(`/business/${editId}`) : router.push("/");
                                        } else {
                                            handleBack();
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    {currentStep === 1 ? (
                                        isEditMode ? "Cancel" : "Cancel"
                                    ) : (
                                        <>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </>
                                    )}
                                </Button>

                                {currentStep < totalSteps ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-base font-semibold"
                                        disabled={isLoading || !formData.name.trim() || !formData.description.trim()}
                                    >
                                        Next Step
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-base font-semibold"
                                        disabled={isLoading || !formData.name.trim() || !formData.description.trim()}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                                {isEditMode ? "Saving..." : "Saving..."}
                                            </>
                                        ) : (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                {isEditMode ? "Save Changes" : "Save & Continue"}
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>
                        Need help?{" "}
                        <Link href="/help" className="text-green-600 dark:text-green-500 hover:underline font-medium">
                            Visit our help center
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

