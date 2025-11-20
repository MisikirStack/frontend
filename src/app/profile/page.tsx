"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Award, Calendar, Edit2, Save, X, Building2, Trash2, Plus, Star, MapPin, Settings, Lock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService, CompaniesService, SearchService } from "@/services/api";
import { toast } from "sonner";
import type { CompanyList, UserRole } from "@/types/api";
import { getValidProfilePictureUrl } from "@/lib/utils";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("profile");

    // Companies state
    const [companies, setCompanies] = useState<CompanyList[]>([]);
    const [allCompanies, setAllCompanies] = useState<CompanyList[]>([]); // For admin
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
    const [isLoadingAllCompanies, setIsLoadingAllCompanies] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<CompanyList | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [companiesSubTab, setCompaniesSubTab] = useState<"owned" | "all">("owned");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        telegram_username: "",
    });

    // Password change state
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    // Check if user is admin (hardcoded for admin@ex.com)
    const isAdmin = user?.email === "admin@ex.com";

    // Load user's companies when companies tab is active
    useEffect(() => {
        if (activeTab === "companies" && isAuthenticated) {
            if (isAdmin && companiesSubTab === "all") {
                loadAllCompanies();
            } else {
                loadCompanies();
            }
        }
    }, [activeTab, isAuthenticated, isAdmin, companiesSubTab]);

    const loadCompanies = async () => {
        setIsLoadingCompanies(true);
        try {
            const data = await CompaniesService.getMyCompanies();
            setCompanies(data);
        } catch (err) {
            toast.error("Failed to load companies");
            console.error(err);
        } finally {
            setIsLoadingCompanies(false);
        }
    };

    const loadAllCompanies = async () => {
        setIsLoadingAllCompanies(true);
        try {
            // Get all companies (admin view)
            const response = await SearchService.searchCompanies({});
            setAllCompanies(response.results || []);
        } catch (err) {
            toast.error("Failed to load all companies");
            console.error(err);
        } finally {
            setIsLoadingAllCompanies(false);
        }
    };

    const handleFeatureToggle = async (companyId: number, currentStatus: boolean) => {
        try {
            await CompaniesService.toggleFeatured(companyId, !currentStatus);
            toast.success(`Company ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
            if (companiesSubTab === "all") {
                loadAllCompanies();
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to update featured status");
        }
    };

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                telegram_username: user.telegram_username || "",
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError("");
        setSuccess("");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            
            // Only send email if it has changed and is not empty
            const currentEmail = user?.email || "";
            const newEmail = formData.email.trim();
            
            if (newEmail && newEmail !== currentEmail) {
                formDataToSend.append("email", newEmail);
            }
            
            if (formData.phone) formDataToSend.append("phone", formData.phone);
            if (formData.telegram_username) formDataToSend.append("telegram_username", formData.telegram_username);

            const updatedUser = await AuthService.updateProfile(formDataToSend);
            updateUser(updatedUser);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            // console.error("Failed to update profile:", err); // Suppress console error as we handle it in UI
            let message = err.message || "Failed to update profile";
            if (message.toLowerCase().includes("email") && message.toLowerCase().includes("exists")) {
                message = "This email address is already in use by another account.";
            }
            setError(message);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                telegram_username: user.telegram_username || "",
            });
        }
        setIsEditing(false);
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = async () => {
        setIsChangingPassword(true);
        setError("");
        setSuccess("");

        try {
            // Validation
            if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
                toast.error("All password fields are required");
                setIsChangingPassword(false);
                return;
            }

            if (passwordData.new_password.length < 6) {
                toast.error("New password must be at least 6 characters long");
                setIsChangingPassword(false);
                return;
            }

            if (passwordData.new_password !== passwordData.confirm_password) {
                toast.error("New passwords do not match");
                setIsChangingPassword(false);
                return;
            }

            await AuthService.changePassword(passwordData);
            toast.success("Password changed successfully!");
            
            // Clear password fields
            setPasswordData({
                old_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (err: any) {
            console.error("Failed to change password:", err);
            toast.error(err.message || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleDeleteClick = (company: CompanyList) => {
        setCompanyToDelete(company);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!companyToDelete) return;

        setIsDeleting(true);
        try {
            await CompaniesService.deleteCompany(companyToDelete.id);
            toast.success("Company deleted successfully");
            setDeleteDialogOpen(false);
            setCompanyToDelete(null);
            // Reload companies list
            if (companiesSubTab === "all") {
                loadAllCompanies();
            } else {
                loadCompanies();
            }
        } catch (err: any) {
            console.error("Failed to delete company:", err);
            toast.error(err.message || "Failed to delete company", {
                description: "This feature is not available yet. Please contact support to delete a company."
            });
        } finally {
            setIsDeleting(false);
        }
    };

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

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
                <section className="py-12">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto">
                            {/* Page Header */}
                            <div className="mb-8 text-center">
                                <div className="mb-4 inline-block">
                                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                                        <AvatarImage
                                            src={getValidProfilePictureUrl(user.profile_picture) || undefined}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-3xl">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400">
                                    {user.name}
                                </h1>
                                <p className="text-muted-foreground mt-2 text-lg">
                                    {user.email}
                                </p>
                                <div className="mt-3 flex justify-center gap-2">
                                    <Badge variant="outline" className="text-sm">
                                        {isAdmin ? "Admin" : user.role.replace(/_/g, " ")}
                                    </Badge>
                                    <Badge
                                        variant={user.is_active ? "default" : "secondary"}
                                        className="text-sm bg-green-600"
                                    >
                                        {user.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Tabs */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
                                    <TabsTrigger value="profile">Profile</TabsTrigger>
                                    <TabsTrigger value="companies">
                                        {isAdmin ? "Companies" : "My Companies"}
                                        {companies.length > 0 && !isAdmin && (
                                            <Badge variant="secondary" className="ml-2">
                                                {companies.length}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </TabsTrigger>
                                </TabsList>

                                {/* Profile Tab */}
                                <TabsContent value="profile" className="space-y-6">
                                    {/* Personal Information Card */}
                                    <Card className="border-green-200 dark:border-green-900/30">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-green-700 dark:text-green-400">Personal Information</CardTitle>
                                                    <CardDescription>View your account details</CardDescription>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setActiveTab("settings")}
                                                >
                                                    <Edit2 className="mr-2 h-4 w-4" />
                                                    Edit Profile
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <p className="text-base font-medium">{user.name}</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <p className="text-base font-medium">{user.email}</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Phone Number</Label>
                                                <p className="text-base font-medium">
                                                    {user.phone || <span className="text-muted-foreground">Not provided</span>}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Telegram Username</Label>
                                                <p className="text-base font-medium">
                                                    {user.telegram_username || <span className="text-muted-foreground">Not provided</span>}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Account Stats Card */}
                                    <Card className="border-green-200 dark:border-green-900/30">
                                        <CardHeader>
                                            <CardTitle className="text-green-700 dark:text-green-400">Account Statistics</CardTitle>
                                            <CardDescription>Your activity on Misikir</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={`grid gap-4 ${isAdmin ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                                                {!isAdmin && (
                                                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900/50">
                                                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                            <Award className="h-6 w-6 text-green-600 dark:text-green-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-3xl font-bold text-green-700 dark:text-green-500">
                                                                {user.point}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">Points Earned</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
                                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                        <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold">Member Since</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(user.date_joined).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                year: "numeric"
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900/50">
                                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                        <User className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold">Role</p>
                                                        <p className="text-xs text-muted-foreground capitalize">
                                                            {isAdmin ? "Admin" : user.role.replace(/_/g, " ").toLowerCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Companies Tab */}
                                <TabsContent value="companies" className="space-y-6">
                                    {isAdmin ? (
                                        <>
                                            {/* Admin View */}
                                            <div>
                                                <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">Companies Management</h2>
                                                <p className="text-muted-foreground">Manage all companies on the platform</p>
                                            </div>

                                            {/* Sub-tabs for Admin */}
                                            <Tabs value={companiesSubTab} onValueChange={(value) => setCompaniesSubTab(value as "owned" | "all")} className="space-y-4">
                                                <TabsList>
                                                    <TabsTrigger value="owned">
                                                        Owned by You
                                                        {companies.length > 0 && (
                                                            <Badge variant="secondary" className="ml-2">
                                                                {companies.length}
                                                            </Badge>
                                                        )}
                                                    </TabsTrigger>
                                                    <TabsTrigger value="all">
                                                        All Companies
                                                        {allCompanies.length > 0 && (
                                                            <Badge variant="secondary" className="ml-2">
                                                                {allCompanies.length}
                                                            </Badge>
                                                        )}
                                                    </TabsTrigger>
                                                </TabsList>

                                                {/* Owned by You Tab */}
                                                <TabsContent value="owned" className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-sm text-muted-foreground">Companies you own</p>
                                                        <Button
                                                            onClick={() => {
                                                                if (user) {
                                                                    router.push("/company/setup");
                                                                } else {
                                                                    router.push("/login?redirect=/company/setup");
                                                                }
                                                            }}
                                                            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add Company
                                                        </Button>
                                                    </div>

                                                    {isLoadingCompanies ? (
                                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                            {[1, 2, 3].map((i) => (
                                                                <Card key={i} className="animate-pulse">
                                                                    <CardHeader className="pb-4">
                                                                        <div className="h-12 w-12 rounded-md bg-muted mb-2"></div>
                                                                        <div className="h-6 w-3/4 bg-muted rounded"></div>
                                                                    </CardHeader>
                                                                    <CardContent>
                                                                        <div className="space-y-2">
                                                                            <div className="h-4 w-full bg-muted rounded"></div>
                                                                            <div className="h-4 w-2/3 bg-muted rounded"></div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    ) : companies.length === 0 ? (
                                                        <Card className="border-2 border-dashed">
                                                            <CardContent className="flex flex-col items-center justify-center py-12">
                                                                <div className="rounded-full bg-muted p-6 mb-4">
                                                                    <Building2 className="h-12 w-12 text-muted-foreground" />
                                                                </div>
                                                                <h3 className="text-lg font-semibold mb-2">No companies yet</h3>
                                                                <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
                                                                    Register your first business to start building your presence on Misikir
                                                                </p>
                                                                <Button
                                                                    onClick={() => {
                                                                        if (user) {
                                                                            router.push("/company/setup");
                                                                        } else {
                                                                            router.push("/login?redirect=/company/setup");
                                                                        }
                                                                    }}
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Register Your First Business
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    ) : (
                                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                            {companies.map((company) => (
                                                                <Card
                                                                    key={company.id}
                                                                    className="hover:shadow-lg transition-all cursor-pointer border-green-200 dark:border-green-900/30 group"
                                                                >
                                                                    <CardHeader className="pb-4">
                                                                        <div className="flex items-start justify-between">
                                                                            <div
                                                                                className="flex-1"
                                                                                onClick={() => router.push(`/business/${company.id}`)}
                                                                            >
                                                                                {company.logo_url ? (
                                                                                    <img
                                                                                        src={company.logo_url}
                                                                                        alt={company.name}
                                                                                        className="h-12 w-12 rounded-md object-cover mb-2"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="h-12 w-12 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-700 dark:text-green-400 font-semibold mb-2">
                                                                                        {company.name.substring(0, 2).toUpperCase()}
                                                                                    </div>
                                                                                )}
                                                                                <CardTitle className="line-clamp-1 text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                                                                    {company.name}
                                                                                </CardTitle>
                                                                            </div>
                                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={() => router.push(`/business/${company.id}`)}
                                                                                    className="h-8 w-8"
                                                                                >
                                                                                    <Edit2 className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleDeleteClick(company);
                                                                                    }}
                                                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </CardHeader>
                                                                    <CardContent
                                                                        className="space-y-3"
                                                                        onClick={() => router.push(`/business/${company.id}`)}
                                                                    >
                                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {company.category_names}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="flex items-center justify-between text-sm">
                                                                            <div className="flex items-center gap-1">
                                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                                <span className="font-medium">{company.misikir_score}</span>
                                                                            </div>
                                                                            <span className="text-muted-foreground">
                                                                                {company.misikir_reviews_count} {company.misikir_reviews_count === 1 ? "review" : "reviews"}
                                                                            </span>
                                                                        </div>
                                                                        {company.description && (
                                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                                {company.description}
                                                                            </p>
                                                                        )}
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    )}
                                                </TabsContent>

                                                {/* All Companies Tab (Admin Only) */}
                                                <TabsContent value="all" className="space-y-4">
                                                    <p className="text-sm text-muted-foreground">All companies registered on the platform</p>

                                                    {isLoadingAllCompanies ? (
                                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                                <Card key={i} className="animate-pulse">
                                                                    <CardHeader className="pb-4">
                                                                        <div className="h-12 w-12 rounded-md bg-muted mb-2"></div>
                                                                        <div className="h-6 w-3/4 bg-muted rounded"></div>
                                                                    </CardHeader>
                                                                    <CardContent>
                                                                        <div className="space-y-2">
                                                                            <div className="h-4 w-full bg-muted rounded"></div>
                                                                            <div className="h-4 w-2/3 bg-muted rounded"></div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    ) : allCompanies.length === 0 ? (
                                                        <Card className="border-2 border-dashed">
                                                            <CardContent className="flex flex-col items-center justify-center py-12">
                                                                <div className="rounded-full bg-muted p-6 mb-4">
                                                                    <Building2 className="h-12 w-12 text-muted-foreground" />
                                                                </div>
                                                                <h3 className="text-lg font-semibold mb-2">No companies found</h3>
                                                                <p className="text-sm text-muted-foreground text-center">
                                                                    No companies are registered on the platform yet.
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    ) : (
                                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                            {allCompanies.map((company) => (
                                                                <Card
                                                                    key={company.id}
                                                                    className="hover:shadow-lg transition-all border-green-200 dark:border-green-900/30 group"
                                                                >
                                                                    <CardHeader className="pb-4">
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-1">
                                                                                {company.logo_url ? (
                                                                                    <img
                                                                                        src={company.logo_url}
                                                                                        alt={company.name}
                                                                                        className="h-12 w-12 rounded-md object-cover mb-2"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="h-12 w-12 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-700 dark:text-green-400 font-semibold mb-2">
                                                                                        {company.name.substring(0, 2).toUpperCase()}
                                                                                    </div>
                                                                                )}
                                                                                <CardTitle className="line-clamp-1 text-lg">
                                                                                    {company.name}
                                                                                </CardTitle>
                                                                                {company.is_featured && (
                                                                                    <Badge className="mt-1 bg-yellow-500 hover:bg-yellow-600">
                                                                                        Featured
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={() => router.push(`/business/${company.id}`)}
                                                                                    className="h-8 w-8"
                                                                                    title="View/Edit"
                                                                                >
                                                                                    <Edit2 className="h-4 w-4" />
                                                                                </Button>
                                                                                {isAdmin && (
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleFeatureToggle(company.id, company.is_featured);
                                                                                        }}
                                                                                        className="h-8 w-8"
                                                                                        title={company.is_featured ? "Unfeature" : "Feature"}
                                                                                    >
                                                                                        {company.is_featured ? (
                                                                                            <XCircle className="h-4 w-4 text-orange-600" />
                                                                                        ) : (
                                                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                                                        )}
                                                                                    </Button>
                                                                                )}
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleDeleteClick(company);
                                                                                    }}
                                                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                                                    title="Delete"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </CardHeader>
                                                                    <CardContent className="space-y-3">
                                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {company.category_names}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="flex items-center justify-between text-sm">
                                                                            <div className="flex items-center gap-1">
                                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                                <span className="font-medium">{company.misikir_score}</span>
                                                                            </div>
                                                                            <span className="text-muted-foreground">
                                                                                {company.misikir_reviews_count} {company.misikir_reviews_count === 1 ? "review" : "reviews"}
                                                                            </span>
                                                                        </div>
                                                                        {company.description && (
                                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                                {company.description}
                                                                            </p>
                                                                        )}
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    )}
                                                </TabsContent>
                                            </Tabs>
                                        </>
                                    ) : (
                                        <>
                                            {/* Regular User View */}
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">My Companies</h2>
                                                    <p className="text-muted-foreground">Manage your registered businesses</p>
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        if (user) {
                                                            router.push("/company/setup");
                                                        } else {
                                                            router.push("/login?redirect=/company/setup");
                                                        }
                                                    }}
                                                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Company
                                                </Button>
                                            </div>

                                            {isLoadingCompanies ? (
                                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                    {[1, 2, 3].map((i) => (
                                                        <Card key={i} className="animate-pulse">
                                                            <CardHeader className="pb-4">
                                                                <div className="h-12 w-12 rounded-md bg-muted mb-2"></div>
                                                                <div className="h-6 w-3/4 bg-muted rounded"></div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <div className="space-y-2">
                                                                    <div className="h-4 w-full bg-muted rounded"></div>
                                                                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : companies.length === 0 ? (
                                                <Card className="border-2 border-dashed">
                                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                                        <div className="rounded-full bg-muted p-6 mb-4">
                                                            <Building2 className="h-12 w-12 text-muted-foreground" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold mb-2">No companies yet</h3>
                                                        <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
                                                            Register your first business to start building your presence on Misikir
                                                        </p>
                                                        <Button
                                                            onClick={() => {
                                                                if (user) {
                                                                    router.push("/company/setup");
                                                                } else {
                                                                    router.push("/login?redirect=/company/setup");
                                                                }
                                                            }}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Register Your First Business
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ) : (
                                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                    {companies.map((company) => (
                                                        <Card
                                                            key={company.id}
                                                            className="hover:shadow-lg transition-all cursor-pointer border-green-200 dark:border-green-900/30 group"
                                                        >
                                                            <CardHeader className="pb-4">
                                                                <div className="flex items-start justify-between">
                                                                    <div
                                                                        className="flex-1"
                                                                        onClick={() => router.push(`/business/${company.id}`)}
                                                                    >
                                                                        {company.logo_url ? (
                                                                            <img
                                                                                src={company.logo_url}
                                                                                alt={company.name}
                                                                                className="h-12 w-12 rounded-md object-cover mb-2"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-12 w-12 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-700 dark:text-green-400 font-semibold mb-2">
                                                                                {company.name.substring(0, 2).toUpperCase()}
                                                                            </div>
                                                                        )}
                                                                        <CardTitle className="line-clamp-1 text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                                                            {company.name}
                                                                        </CardTitle>
                                                                    </div>
                                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => router.push(`/business/${company.id}`)}
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <Edit2 className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteClick(company);
                                                                            }}
                                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent
                                                                className="space-y-3"
                                                                onClick={() => router.push(`/business/${company.id}`)}
                                                            >
                                                                <div className="flex items-center text-sm text-muted-foreground">
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {company.category_names}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <div className="flex items-center gap-1">
                                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                        <span className="font-medium">{company.misikir_score}</span>
                                                                    </div>
                                                                    <span className="text-muted-foreground">
                                                                        {company.misikir_reviews_count} {company.misikir_reviews_count === 1 ? "review" : "reviews"}
                                                                    </span>
                                                                </div>
                                                                {company.description && (
                                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                                        {company.description}
                                                                    </p>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </TabsContent>

                                {/* Settings Tab */}
                                <TabsContent value="settings" className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">Account Settings</h2>
                                        <p className="text-muted-foreground">Manage your profile information and security</p>
                                    </div>

                                    {/* Edit Profile Section */}
                                    <Card className="border-green-200 dark:border-green-900/30">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-green-700 dark:text-green-400">Edit Profile</CardTitle>
                                                    <CardDescription>Update your personal information</CardDescription>
                                                </div>
                                                {!isEditing ? (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        <Edit2 className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={handleCancel}
                                                            disabled={isSaving}
                                                        >
                                                            <X className="mr-2 h-4 w-4" />
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={handleSave}
                                                            disabled={isSaving}
                                                            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                                        >
                                                            <Save className="mr-2 h-4 w-4" />
                                                            {isSaving ? "Saving..." : "Save"}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {error && (
                                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-md text-sm flex items-center gap-2">
                                                    <XCircle className="h-4 w-4" />
                                                    {error}
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <Label htmlFor="name-settings">Full Name</Label>
                                                <Input
                                                    id="name-settings"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    placeholder="Your full name"
                                                    className="h-12"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email-settings">Email</Label>
                                                <Input
                                                    id="email-settings"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="h-12"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone-settings">Phone Number</Label>
                                                <Input
                                                    id="phone-settings"
                                                    name="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    placeholder="+251 (optional)"
                                                    className="h-12"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="telegram-settings">Telegram Username</Label>
                                                <Input
                                                    id="telegram-settings"
                                                    name="telegram_username"
                                                    value={formData.telegram_username}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    placeholder="@username (optional)"
                                                    className="h-12"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Change Password Section */}
                                    <Card className="border-green-200 dark:border-green-900/30">
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <Lock className="h-5 w-5 text-green-600 dark:text-green-500" />
                                                <div>
                                                    <CardTitle className="text-green-700 dark:text-green-400">Change Password</CardTitle>
                                                    <CardDescription>Update your account password</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="old_password">Current Password</Label>
                                                <Input
                                                    id="old_password"
                                                    name="old_password"
                                                    type="password"
                                                    value={passwordData.old_password}
                                                    onChange={handlePasswordInputChange}
                                                    placeholder="Enter current password"
                                                    className="h-12"
                                                    disabled={isChangingPassword}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="new_password">New Password</Label>
                                                <Input
                                                    id="new_password"
                                                    name="new_password"
                                                    type="password"
                                                    value={passwordData.new_password}
                                                    onChange={handlePasswordInputChange}
                                                    placeholder="Enter new password (min 6 characters)"
                                                    className="h-12"
                                                    disabled={isChangingPassword}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="confirm_password">Confirm New Password</Label>
                                                <Input
                                                    id="confirm_password"
                                                    name="confirm_password"
                                                    type="password"
                                                    value={passwordData.confirm_password}
                                                    onChange={handlePasswordInputChange}
                                                    placeholder="Confirm new password"
                                                    className="h-12"
                                                    disabled={isChangingPassword}
                                                />
                                            </div>

                                            <Button
                                                onClick={handlePasswordChange}
                                                disabled={isChangingPassword}
                                                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 w-full"
                                            >
                                                <Lock className="mr-2 h-4 w-4" />
                                                {isChangingPassword ? "Changing Password..." : "Change Password"}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </section>
            </main>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Company</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{companyToDelete?.name}</strong>? This action cannot be undone.
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
        </div>
    );
}
