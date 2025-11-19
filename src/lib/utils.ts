import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getValidProfilePictureUrl(url: string | null | undefined): string | undefined {
    if (!url) {
        return undefined;
    }

    let correctedUrl = url;

    // Case 1: Backend returns the incorrect format: /media/https%3A/t.me/...
    if (correctedUrl.startsWith('/media/https%3A')) {
        // Strip '/media/' and decode the rest of the URL
        try {
            correctedUrl = decodeURIComponent(correctedUrl.substring('/media/'.length));
        } catch (e) {
            console.error("Failed to decode profile picture URL:", e);
            return undefined;
        }
    }

    // Now, check for the missing slashes, which can happen after decoding
    if (correctedUrl.startsWith('https:/')) {
        correctedUrl = correctedUrl.replace('https:/', 'https://');
    }

    // Case 2: Backend returns a full, valid URL
    if (correctedUrl.startsWith('http')) {
        return correctedUrl;
    }
    
    // Case 3: Backend returns a relative path like /media/profile_pics/image.jpg
    // Prepend the base API URL.
    if (correctedUrl.startsWith('/media/')) {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://victorious-nourishment-production-e8b9.up.railway.app';
        return `${baseUrl}${correctedUrl}`;
    }

    // Return undefined if it doesn't match known patterns
    return undefined;
}
