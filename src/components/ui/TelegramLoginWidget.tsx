"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

interface TelegramLoginWidgetProps {
  botUsername: string;
}

export default function TelegramLoginWidget({ botUsername }: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loginWithTelegram } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "10");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    containerRef.current.appendChild(script);
  }, [botUsername]);

  useEffect(() => {
    (window as any).onTelegramAuth = async (user: any) => {
      try {
        // Use the AuthContext method
        await loginWithTelegram(user);
        
        toast.success(`Logged in as ${user.first_name} ${user.last_name}`);
        
        // Handle redirect logic similar to standard login
        const storedRedirect = localStorage.getItem('redirect_after_login');
        const targetRedirect = redirectTo || storedRedirect;

        if (storedRedirect) {
          localStorage.removeItem('redirect_after_login');
        }

        if (targetRedirect) {
          toast.success("Welcome back!", { description: "Taking you to write a review..." });
          router.push(targetRedirect);
        } else {
          toast.success("Welcome back!", { description: "You have successfully logged in." });
          router.push("/");
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Telegram login failed");
      }
    };

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [loginWithTelegram, router, redirectTo]);

  return <div ref={containerRef} className="w-full flex justify-center" />;
}
