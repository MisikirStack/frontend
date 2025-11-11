"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
    const { theme } = useTheme();

    return (
        <Sonner
            theme={theme as "light" | "dark" | "system"}
            position="top-center"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-gray-900 group-[.toaster]:text-gray-950 group-[.toaster]:dark:text-gray-50 group-[.toaster]:border-gray-200 group-[.toaster]:dark:border-gray-800 group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-gray-500 group-[.toast]:dark:text-gray-400",
                    actionButton: "group-[.toast]:bg-green-600 group-[.toast]:text-white",
                    cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:dark:bg-gray-800 group-[.toast]:text-gray-500",
                    success: "group-[.toaster]:bg-green-50 group-[.toaster]:dark:bg-green-950 group-[.toaster]:text-green-900 group-[.toaster]:dark:text-green-50 group-[.toaster]:border-green-200 group-[.toaster]:dark:border-green-800",
                    error: "group-[.toaster]:bg-red-50 group-[.toaster]:dark:bg-red-950 group-[.toaster]:text-red-900 group-[.toaster]:dark:text-red-50 group-[.toaster]:border-red-200 group-[.toaster]:dark:border-red-800",
                },
            }}
        />
    );
}
