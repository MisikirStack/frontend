import { apiClient, tokenManager } from "@/lib/api-client";
import type {
    User,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    TokenRefreshRequest,
    TokenRefreshResponse,
} from "@/types/api";

/**
 * Authentication Service
 * Handles all authentication-related API operations
 */
export class AuthService {
    /**
     * Login with email and password
     */
    static async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            "/api/auth/login/",
            credentials
        );

        // Store tokens
        if (response.access && response.refresh) {
            tokenManager.setTokens(response.access, response.refresh);
        }

        return response;
    }

    /**
     * Register a new user
     */
    static async register(data: RegisterRequest): Promise<User> {
        const response = await apiClient.post<User>("/api/auth/register/", data);
        return response;
    }

    /**
     * Get current user profile
     */
    static async getProfile(): Promise<User> {
        return await apiClient.get<User>("/api/auth/profile/", true);
    }

    /**
     * Update user profile
     */
    static async updateProfile(data: FormData): Promise<User> {
        return await apiClient.put<User>("/api/auth/profile/", data, true);
    }

    /**
     * Refresh access token
     */
    static async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
        return await apiClient.post<TokenRefreshResponse>("/api/auth/token/refresh/", {
            refresh: refreshToken,
        });
    }

    /**
     * Verify token
     */
    static async verifyToken(token: string): Promise<void> {
        await apiClient.post("/api/auth/token/verify/", { token });
    }

    /**
     * Logout user
     */
    static logout(): void {
        tokenManager.clearTokens();
        // Redirect to login or home page
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    }

    /**
     * Check if user is authenticated
     */
    static isAuthenticated(): boolean {
        return tokenManager.hasTokens();
    }

    /**
     * Google OAuth login
     */
    static async loginWithGoogle(token: string): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            "/api/auth/social/google/",
            { token }
        );

        // Store tokens
        if (response.access && response.refresh) {
            tokenManager.setTokens(response.access, response.refresh);
        }

        return response;
    }

    /**
     * Telegram OAuth login
     */
    static async loginWithTelegram(authData: any): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            "/api/auth/social/telegram/",
            authData
        );

        // Store tokens
        if (response.access && response.refresh) {
            tokenManager.setTokens(response.access, response.refresh);
        }

        return response;
    }
}
