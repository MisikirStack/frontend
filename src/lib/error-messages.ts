/**
 * Error Message Utilities
 * Converts technical API error messages to user-friendly messages
 */

/**
 * Convert technical error messages to user-friendly messages
 */
export function getUserFriendlyErrorMessage(error: string | undefined): string {
    if (!error) {
        return "Something went wrong. Please try again.";
    }

    const lowerError = error.toLowerCase();

    // Authentication errors
    if (lowerError.includes("authentication credentials were not provided") ||
        lowerError.includes("not authenticated")) {
        return "Please log in to continue.";
    }

    if (lowerError.includes("invalid token") ||
        lowerError.includes("token expired")) {
        return "Your session has expired. Please log in again.";
    }

    if (lowerError.includes("invalid email or password") ||
        lowerError.includes("incorrect") ||
        lowerError.includes("invalid credentials")) {
        return "The email or password you entered is incorrect.";
    }

    // Registration errors
    if (lowerError.includes("email") && lowerError.includes("already")) {
        return "This email is already registered. Please try logging in instead.";
    }

    if (lowerError.includes("user") && lowerError.includes("already exists")) {
        return "An account with this email already exists.";
    }

    if (lowerError.includes("password") && (lowerError.includes("too short") || lowerError.includes("minimum"))) {
        return "Password must be at least 6 characters long.";
    }

    if (lowerError.includes("password") && lowerError.includes("too common")) {
        return "Please choose a stronger password.";
    }

    // Validation errors
    if (lowerError.includes("required") || lowerError.includes("this field")) {
        return "Please fill in all required fields.";
    }

    if (lowerError.includes("invalid email")) {
        return "Please enter a valid email address.";
    }

    // Permission errors
    if (lowerError.includes("permission denied") ||
        lowerError.includes("forbidden") ||
        lowerError.includes("not authorized")) {
        return "You don't have permission to perform this action.";
    }

    // Network errors
    if (lowerError.includes("network") ||
        lowerError.includes("connection") ||
        lowerError.includes("timeout")) {
        return "Connection issue. Please check your internet and try again.";
    }

    if (lowerError.includes("500") || lowerError.includes("server error")) {
        return "Server error. Please try again in a few moments.";
    }

    if (lowerError.includes("404") || lowerError.includes("not found")) {
        return "The requested information could not be found.";
    }

    // Default: Return cleaned up version of the original error
    // Remove technical jargon
    const cleaned = error
        .replace(/HTTP \d{3}:?\s*/gi, "")
        .replace(/ApiError:?\s*/gi, "")
        .replace(/Error:?\s*/gi, "")
        .trim();

    return cleaned || "Something went wrong. Please try again.";
}

/**
 * Get user-friendly title for error toasts
 */
export function getErrorTitle(error: string | undefined): string {
    if (!error) {
        return "Error";
    }

    const lowerError = error.toLowerCase();

    if (lowerError.includes("authentication") || lowerError.includes("login")) {
        return "Login Failed";
    }

    if (lowerError.includes("register") || lowerError.includes("signup")) {
        return "Registration Failed";
    }

    if (lowerError.includes("permission") || lowerError.includes("forbidden")) {
        return "Access Denied";
    }

    if (lowerError.includes("network") || lowerError.includes("connection")) {
        return "Connection Error";
    }

    if (lowerError.includes("500") || lowerError.includes("server")) {
        return "Server Error";
    }

    return "Error";
}
