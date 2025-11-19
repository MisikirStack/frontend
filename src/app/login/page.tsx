"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { getUserFriendlyErrorMessage } from "@/lib/error-messages";
import TelegramLoginWidget from "@/components/ui/TelegramLoginWidget"; 

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleGoogleLogin = () => {
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
      const storedRedirect = typeof window !== 'undefined' ? localStorage.getItem('redirect_after_login') : null;
      const targetRedirect = redirectTo || storedRedirect;

      await login({
        email: formData.email,
        password: formData.password,
      });

      if (typeof window !== 'undefined' && storedRedirect) {
        localStorage.removeItem('redirect_after_login');
      }

      if (targetRedirect) {
        setShouldRedirect(true);
        toast.success("Welcome back!", { description: "Taking you to write a review..." });
        router.push(targetRedirect);
        return;
      }

      toast.success("Welcome back!", { description: "You have successfully logged in." });
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        const friendlyMessage = getUserFriendlyErrorMessage(err.message);
        setError(friendlyMessage);
        toast.error("Unable to log in", { description: friendlyMessage });
      } else {
        const friendlyMessage = "We couldn't log you in. Please try again.";
        setError(friendlyMessage);
        toast.error("Unable to log in", { description: friendlyMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center bg-background">
      <Link href="/" className="mb-8 flex items-center">
        <Star className="h-8 w-8 text-yellow-500" />
        <span className="ml-2 text-2xl font-bold text-green-700 dark:text-green-400">Misikir</span>
      </Link>

      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Login buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="w-full h-12" onClick={handleGoogleLogin}>
                Login with Google
              </Button>

              {/* Telegram Login Widget */}
             <TelegramLoginWidget
                botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "noname_here_bot"}
                onLoginSuccess={() => {
                  toast.success("Redirecting after Telegram login...");
                  router.push(redirectTo || "/");
                }}
              />

            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-950/50 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">{error}</div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-green-600 dark:text-green-400 hover:underline">Forgot password?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link
                  href={redirectTo ? `/register-business?redirect=${redirectTo}` : "/register-business"}
                  className="text-green-600 dark:text-green-400 hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-green-600 dark:text-green-400 hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-green-600 dark:text-green-400 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
