"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleClick = () => {
    window.open(
      "https://docs.google.com/forms/d/1r04BOtkIROzUvmIM6PNXuP1NSeJoc0s05HrIT2C7qCU/edit",
      "_blank"
    );
  };

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <Link href="/" className="mb-8 flex items-center">
        <Star className="h-8 w-8 text-yellow-500" />
        <span className="ml-2 text-2xl font-bold text-green-700">Misikir</span>
      </Link>

      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-white p-6 shadow-lg">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger onClick={() => router.push("/login")} value="login">
              Login
            </TabsTrigger>
            <TabsTrigger
              onClick={() => router.push("/register-business")}
              value="register"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6 space-y-4">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-gray-500">
                Enter your credentials to access your account
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Phone Number</Label>
                <Input id="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-xs text-green-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Login
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="mt-6 space-y-4">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-sm text-gray-500">
                Enter your details to create your account
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-phone">Phone Number</Label>
                <Input
                  id="register-phone"
                  placeholder="+251 91 234 5678"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input id="register-password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Create Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <Link href="#" className="text-green-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-green-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
