"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Award, Calendar, Edit2, Save, X } from "lucide-react";
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
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/api";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        telegram_username: "",
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
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
        setError(null);
        setSuccess(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            if (formData.phone) formDataToSend.append("phone", formData.phone);
            if (formData.telegram_username) formDataToSend.append("telegram_username", formData.telegram_username);

            const updatedUser = await AuthService.updateProfile(formDataToSend);
            updateUser(updatedUser);
            setIsEditing(false);
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            console.error("Failed to update profile:", err);
            setError(err.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                telegram_username: user.telegram_username || "",
            });
        }
        setIsEditing(false);
        setError(null);
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
            <main className="flex-1 bg-muted/30">
                <section className="py-12">
                    <div className="container max-w-4xl px-4 md:px-6">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                            <p className="text-muted-foreground mt-2">
                                Manage your account information
                            </p>
                        </div>

                        {success && (
                            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6">
                            {/* Profile Overview Card */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Personal Information</CardTitle>
                                        {!isEditing ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                <Edit2 className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleCancel}
                                                    disabled={isSaving}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {isSaving ? "Saving..." : "Save"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage
                                                src={user.profile_picture || undefined}
                                                alt={user.name}
                                            />
                                            <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-2xl">
                                                {user.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-xl font-semibold">{user.name}</p>
                                            <Badge variant="outline" className="mt-1">
                                                {user.role.replace(/_/g, " ")}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Your full name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                value={user.email}
                                                disabled
                                                className="bg-muted"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Email cannot be changed
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="+251 (optional)"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="telegram_username">Telegram Username</Label>
                                            <Input
                                                id="telegram_username"
                                                name="telegram_username"
                                                value={formData.telegram_username}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="@username (optional)"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account Stats Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Statistics</CardTitle>
                                    <CardDescription>Your activity on Misikir</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                                <Award className="h-5 w-5 text-green-600 dark:text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                                                    {user.point}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Points</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Member Since</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(user.date_joined).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                                <User className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Status</p>
                                                <Badge
                                                    variant={user.is_active ? "default" : "secondary"}
                                                    className="mt-1"
                                                >
                                                    {user.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
