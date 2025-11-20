"use client"

/**
 * Authentication Context
 * Manages global authentication state and provides auth utilities
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, tokenManager } from '@/lib/api-client'
import type { User, LoginRequest, RegisterRequest, LoginResponse } from '@/types/api'

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (credentials: LoginRequest) => Promise<void>
    loginWithTelegram: (telegramData: any) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
    updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    /**
     * Fetch current user profile
     */
    const fetchUserProfile = useCallback(async () => {
        if (!tokenManager.hasTokens()) {
            setIsLoading(false)
            return
        }

        try {
            const userData = await apiClient.get<any>('/api/auth/profile/', true)

            // Map user_id to id if needed (backend might return user_id instead of id)
            if (userData.user_id && !userData.id) {
                userData.id = userData.user_id
            }

            console.log('User profile loaded:', { email: userData.email, id: userData.id, hasId: !!userData.id })
            setUser(userData)
        } catch (error) {
            console.error('Failed to fetch user profile:', error)
            tokenManager.clearTokens()
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Initialize auth state on mount
     */
    useEffect(() => {
        fetchUserProfile()
    }, [fetchUserProfile])

    /**
     * Login user
     */
    const login = async (credentials: LoginRequest) => {
        try {
            const response = await apiClient.post<any>('/api/auth/login/', credentials)

            // Backend returns: { user: {...}, tokens: { access: "...", refresh: "..." } }
            if (response.tokens && response.tokens.access && response.tokens.refresh) {
                // Store tokens
                tokenManager.setTokens(response.tokens.access, response.tokens.refresh)

                // Set user from response
                if (response.user) {
                    // Map user_id to id if needed
                    if (response.user.user_id && !response.user.id) {
                        response.user.id = response.user.user_id
                    }
                    setUser(response.user)
                }

                return
            }

            // Fallback: Check for flat format { access, refresh, user }
            if (response.access && response.refresh) {
                tokenManager.setTokens(response.access, response.refresh)

                if (response.user) {
                    // Map user_id to id if needed
                    if (response.user.user_id && !response.user.id) {
                        response.user.id = response.user.user_id
                    }
                    setUser(response.user)
                } else {
                    await fetchUserProfile()
                }
                return
            }

            // If none of the formats match, throw error with details
            throw new Error(`Invalid login response format. Received keys: ${Object.keys(response).join(', ')}`)
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }

    /**
     * Login with Telegram
     */
    const loginWithTelegram = async (telegramData: any) => {
        try {
            // Call the Next.js API route which will verify and then call the backend
            const response = await fetch('/api/auth/telegram-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(telegramData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Telegram login failed');
            }

            const data = await response.json();

            // Handle nested format: { user: {...}, tokens: { access: "...", refresh: "..." } }
            if (data.tokens && data.tokens.access && data.tokens.refresh) {
                tokenManager.setTokens(data.tokens.access, data.tokens.refresh);
                if (data.user) {
                    if (data.user.user_id && !data.user.id) {
                        data.user.id = data.user.user_id;
                    }
                    setUser(data.user);
                } else {
                    await fetchUserProfile();
                }
                return;
            }
            
            // Handle flat format: { access, refresh, user }
            if (data.access && data.refresh) {
                tokenManager.setTokens(data.access, data.refresh);
                if (data.user) {
                     if (data.user.user_id && !data.user.id) {
                        data.user.id = data.user.user_id
                    }
                    setUser(data.user);
                } else {
                    await fetchUserProfile();
                }
                return;
            }

            throw new Error(`Invalid Telegram login response format. Received keys: ${Object.keys(data).join(', ')}`);
        } catch (error) {
            console.error('Telegram login failed:', error);
            throw error;
        }
    };

    /**
     * Register user
     */
    const register = async (data: RegisterRequest) => {
        try {
            const response = await apiClient.post<any>('/api/auth/register/', data)

            // Backend returns: { user: {...}, tokens: { access: "...", refresh: "..." } }
            if (response.tokens && response.tokens.access && response.tokens.refresh) {
                tokenManager.setTokens(response.tokens.access, response.tokens.refresh)

                if (response.user) {
                    // Map user_id to id if needed
                    if (response.user.user_id && !response.user.id) {
                        response.user.id = response.user.user_id
                    }
                    setUser(response.user)
                }
                return
            }

            // Fallback: Check for flat format
            if (response.access && response.refresh) {
                tokenManager.setTokens(response.access, response.refresh)
                await fetchUserProfile()
                return
            }

            throw new Error(`Invalid registration response format. Received keys: ${Object.keys(response).join(', ')}`)
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    }

    /**
     * Logout user
     */
    const logout = useCallback(() => {
        tokenManager.clearTokens()
        setUser(null)
        router.push('/')
    }, [router])

    /**
     * Refresh user profile
     */
    const refreshUser = async () => {
        await fetchUserProfile()
    }

    /**
     * Update user data locally (after profile update)
     */
    const updateUser = (userData: Partial<User>) => {
        setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null))
    }

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithTelegram,
        register,
        logout,
        refreshUser,
        updateUser,
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                loginWithTelegram,
                register,
                logout,
                refreshUser: fetchUserProfile,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

/**
 * Hook to use auth context
 */
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
