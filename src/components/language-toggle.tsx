"use client"

import * as React from "react"
import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
    const [language, setLanguage] = React.useState<"en" | "am">("en")

    const handleLanguageChange = (lang: "en" | "am") => {
        setLanguage(lang)
        // TODO: Implement language change functionality
        // This will be implemented later with i18n
        console.log("Language changed to:", lang)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => handleLanguageChange("en")}
                    className={language === "en" ? "bg-accent" : ""}
                >
                    <span className="mr-2">🇺🇸</span>
                    <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleLanguageChange("am")}
                    className={language === "am" ? "bg-accent" : ""}
                >
                    <span className="mr-2">🇪🇹</span>
                    <span>አማርኛ (Amharic)</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
