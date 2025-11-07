// API Hooks for Backend Integration
import { useState, useEffect } from 'react'
import { SearchService, AuthService, CompaniesService } from '@/services/api'
import type { CompanyList, UserRole } from '@/types/api'

// Types
export interface Business {
    id: number
    name: string
    category: string
    location: string
    rating: number
    reviews: number
    views: number
    image: string
    duration?: string
    description?: string
}

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    provider: 'google' | 'telegram'
}

// ==================== AUTH HOOKS ====================

/**
 * Hook for login with email/password
 */
export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await AuthService.login({ email, password })
            return response
        } catch (err: any) {
            const errorMsg = err.message || 'Login failed'
            setError(errorMsg)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { login, isLoading, error }
}

/**
 * Hook for user registration
 */
export function useRegister() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const register = async (data: {
        email: string
        name: string
        password: string
        role?: UserRole
        phone?: string
        telegram_username?: string
    }) => {
        setIsLoading(true)
        setError(null)

        try {
            const user = await AuthService.register(data)
            return user
        } catch (err: any) {
            const errorMsg = err.message || 'Registration failed'
            setError(errorMsg)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { register, isLoading, error }
}

/**
 * Hook for getting current user profile
 */
export function useUser() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            if (!AuthService.isAuthenticated()) {
                setIsLoading(false)
                return
            }

            try {
                const userData = await AuthService.getProfile()
                setUser(userData)
            } catch (err: any) {
                console.error('Failed to fetch user:', err)
                setError(err.message)
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [])

    const logout = () => {
        AuthService.logout()
        setUser(null)
    }

    return { user, isLoading, error, logout, isAuthenticated: !!user }
}

/**
 * Hook for Google OAuth authentication
 */
export function useGoogleAuth() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const signInWithGoogle = async (token: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await AuthService.loginWithGoogle(token)
            return response
        } catch (err: any) {
            const errorMsg = err.message || 'Google authentication failed'
            setError(errorMsg)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { signInWithGoogle, isLoading, error }
}

/**
 * Hook for Telegram OAuth authentication
 */
export function useTelegramAuth() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const signInWithTelegram = async (authData: any) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await AuthService.loginWithTelegram(authData)
            return response
        } catch (err: any) {
            const errorMsg = err.message || 'Telegram authentication failed'
            setError(errorMsg)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { signInWithTelegram, isLoading, error }
}

// ==================== BUSINESS DATA HOOKS ====================

/**
 * Hook to fetch businesses with optional filters
 * Connected to backend API
 */
export function useBusinesses(filters?: {
    category?: string
    location?: string
    search?: string
    page?: number
}) {
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBusinesses = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await SearchService.searchCompanies({
                    search: filters?.search,
                    page: filters?.page || 1,
                    // Note: Backend might not support category/location filters by name yet
                    // May need to convert these to IDs or update backend API
                })

                // Transform API response to match Business interface
                const transformedBusinesses: Business[] = response.results.map((company: CompanyList) => ({
                    id: company.id,
                    name: company.name,
                    category: company.category_names || 'Uncategorized',
                    location: 'Ethiopia', // TODO: Add location field to API
                    rating: company.misikir_score || 0,
                    reviews: company.misikir_reviews_count || 0,
                    views: 0, // TODO: Add views field to API
                    image: company.logo_url || '/placeholder.svg?height=80&width=80',
                    description: company.description || undefined,
                }))

                // Client-side filtering for category and location (temporary until backend supports it)
                let filteredBusinesses = transformedBusinesses;

                if (filters?.category) {
                    filteredBusinesses = filteredBusinesses.filter(business =>
                        business.category.toLowerCase().includes(filters.category!.toLowerCase())
                    );
                }

                if (filters?.location) {
                    filteredBusinesses = filteredBusinesses.filter(business =>
                        business.location.toLowerCase().includes(filters.location!.toLowerCase())
                    );
                }

                setBusinesses(filteredBusinesses)
            } catch (err) {
                console.error('Error fetching businesses:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch businesses')
                // Set empty array on error
                setBusinesses([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchBusinesses()
    }, [filters?.category, filters?.location, filters?.search, filters?.page])

    return { businesses, isLoading, error }
}

/**
 * Hook to search businesses
 * Connected to backend API
 */
export function useBusinessSearch(query: string) {
    const [results, setResults] = useState<Business[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([])
            return
        }

        const searchBusinesses = async () => {
            setIsLoading(true)

            try {
                const response = await SearchService.searchCompanies({ search: query })

                const transformedResults: Business[] = response.results.map((company: CompanyList) => ({
                    id: company.id,
                    name: company.name,
                    category: company.category_names || 'Uncategorized',
                    location: 'Ethiopia',
                    rating: company.misikir_score || 0,
                    reviews: company.misikir_reviews_count || 0,
                    views: 0,
                    image: company.logo_url || '/placeholder.svg?height=80&width=80',
                    description: company.description || undefined,
                }))

                setResults(transformedResults)
            } catch (err) {
                console.error('Search error:', err)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        const debounceTimer = setTimeout(searchBusinesses, 300)
        return () => clearTimeout(debounceTimer)
    }, [query])

    return { results, isLoading }
}

// ==================== FAVORITES HOOKS ====================

/**
 * Hook to manage favorite businesses
 * TODO: Connect to your backend favorites endpoint
 */
export function useFavorites() {
    const [favorites, setFavorites] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // TODO: Fetch user's favorites from backend
        // fetch('/api/favorites').then(res => res.json()).then(data => setFavorites(data.favorites))
    }, [])

    const toggleFavorite = async (businessId: number) => {
        setIsLoading(true)

        try {
            const isFavorite = favorites.includes(businessId)

            // TODO: Call backend API
            // await fetch(`/api/favorites/${businessId}`, {
            //   method: isFavorite ? 'DELETE' : 'POST'
            // })

            console.log(`${isFavorite ? '❌ Removing' : '⭐ Adding'} favorite:`, businessId)

            // Update local state
            setFavorites(prev =>
                isFavorite
                    ? prev.filter(id => id !== businessId)
                    : [...prev, businessId]
            )

        } catch (err) {
            console.error('Failed to toggle favorite:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const isFavorite = (businessId: number) => favorites.includes(businessId)

    return { favorites, toggleFavorite, isFavorite, isLoading }
}

// ==================== CATEGORIES HOOK ====================

/**
 * Hook to fetch available categories
 * TODO: Connect to your backend categories endpoint
 */
export function useCategories() {
    const [categories, setCategories] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // TODO: Fetch categories from backend
        // fetch('/api/categories').then(res => res.json()).then(data => setCategories(data.categories))

        // Mock categories for now
        const mockCategories = [
            "Food & Beverage",
            "Retail",
            "Healthcare",
            "Education",
            "Technology",
            "Financial Services",
            "Transportation",
            "Real Estate",
            "Manufacturing",
            "Entertainment",
        ]

        setTimeout(() => {
            setCategories(mockCategories)
            setIsLoading(false)
        }, 300)
    }, [])

    return { categories, isLoading }
}

// ==================== STATISTICS HOOK ====================

/**
 * Hook to fetch platform statistics
 * Aggregates data from search results as backend doesn't have a dedicated stats endpoint
 */
export function useStats() {
    const [stats, setStats] = useState({
        totalBusinesses: 0,
        totalReviews: 0,
        totalUsers: 0,
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch first page to get total count
                const companiesResponse = await SearchService.searchCompanies({ page: 1 })

                // Calculate aggregated stats from the response
                const totalBusinesses = companiesResponse.count || 0
                const totalReviews = companiesResponse.results.reduce(
                    (sum, company) => sum + (company.misikir_reviews_count || 0),
                    0
                )

                setStats({
                    totalBusinesses,
                    totalReviews,
                    totalUsers: Math.floor(totalBusinesses * 2.5), // Estimated based on business count
                })
            } catch (error) {
                console.error('Failed to fetch stats:', error)
                // Fallback to default values
                setStats({
                    totalBusinesses: 0,
                    totalReviews: 0,
                    totalUsers: 0,
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    return { stats, isLoading }
}
