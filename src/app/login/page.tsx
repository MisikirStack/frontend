"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { CompaniesService } from "@/services/api/companies.service";
import { getUserFriendlyErrorMessage } from "@/lib/error-messages";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleGoogleLogin = () => {
    window.open(
      "https://docs.google.com/forms/d/1r04BOtkIROzUvmIM6PNXuP1NSeJoc0s05HrIT2C7qCU/edit",
      "_blank"
    );
  };

  const handleTelegramLogin = () => {
    window.open(
      "https://docs.google.com/forms/d/1r04BOtkIROzUvmIM6PNXuP1NSeJoc0s05HrIT2C7qCU/edit",
      "_blank"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Login and wait for tokens to be stored
      await login({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });

      // Verify tokens are stored before proceeding
      const hasTokens = typeof window !== 'undefined' && localStorage.getItem('misikir_access_token');
      if (!hasTokens) {
        throw new Error('Authentication failed: No tokens received');
      }

      // Check if user has a company
      try {
        const companies = await CompaniesService.getMyCompanies();

        if (companies && companies.length > 0) {
          // User has company, redirect to company profile
          router.push(`/business/${companies[0].id}`);
        } else {
          // No company, show prompt and redirect to create company
          toast.info("Create your business profile", {
            description: "Let's set up your business profile to get started.",
            duration: 4000,
          });

          setTimeout(() => {
            router.push("/company/setup");
          }, 1500);
        }
      } catch (companyError) {
        // If there's an error fetching companies, just redirect to home silently
        // This is not a critical error - user is logged in successfully
        console.error("Error fetching companies:", companyError);
        router.push("/");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        const friendlyMessage = getUserFriendlyErrorMessage(err.message);
        setError(friendlyMessage);
        toast.error("Unable to log in", {
          description: friendlyMessage,
        });
      } else {
        const friendlyMessage = "We couldn't log you in. Please try again.";
        setError(friendlyMessage);
        toast.error("Unable to log in", {
          description: friendlyMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <Link href="/" className="mb-8 flex items-center">
        <Star className="h-8 w-8 text-yellow-500" />
        <span className="ml-2 text-2xl font-bold text-green-700 dark:text-green-500">Misikir</span>
      </Link>

      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                onClick={handleGoogleLogin}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                onClick={handleTelegramLogin}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="url(#telegram-gradient-login)" />
                  <path d="M8.93 11.5L16.07 8.93C16.38 8.82 16.65 9.03 16.55 9.53L16.56 9.52L15.09 16.73C14.98 17.18 14.73 17.29 14.38 17.08L12.23 15.46L11.2 16.45C11.09 16.56 10.99 16.66 10.77 16.66L10.92 14.47L14.84 10.93C15.01 10.78 14.8 10.69 14.57 10.84L9.68 13.88L7.56 13.2C7.13 13.07 7.12 12.79 7.66 12.58L8.93 11.5Z" fill="white" />
                  <defs>
                    <linearGradient id="telegram-gradient-login" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2AABEE" />
                      <stop offset="1" stopColor="#229ED9" />
                    </linearGradient>
                  </defs>
                </svg>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">or</span>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold dark:text-white">Welcome back</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-green-600 dark:text-green-500 hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required disabled={isLoading} />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
              <div className="text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
                <Link href="/register-business" className="text-green-600 dark:text-green-500 hover:underline font-medium">Sign Up</Link>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-green-600 dark:text-green-500 hover:underline">Terms of Service</Link>{" "}and{" "}
            <Link href="/privacy" className="text-green-600 dark:text-green-500 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
