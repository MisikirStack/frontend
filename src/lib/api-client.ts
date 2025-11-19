/**
 * API Client Configuration
 * Centralized API client with interceptors for authentication and error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://victorious-nourishment-production-e8b9.up.railway.app'

// Token storage keys
const ACCESS_TOKEN_KEY = 'misikir_access_token'
const REFRESH_TOKEN_KEY = 'misikir_refresh_token'

/**
 * Token management utilities
 */
export const tokenManager = {
    getAccessToken: (): string | null => {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(ACCESS_TOKEN_KEY)
    },

    getRefreshToken: (): string | null => {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    },

    setTokens: (accessToken: string, refreshToken: string): void => {
        if (typeof window === 'undefined') return
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    },

    clearTokens: (): void => {
        if (typeof window === 'undefined') return
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
    },

    hasTokens: (): boolean => {
        return !!tokenManager.getAccessToken()
    },
}

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

/**
 * Request configuration interface
 */
interface RequestConfig extends RequestInit {
    requiresAuth?: boolean
    skipContentTypeHeader?: boolean
}

/**
 * Main API client class
 */
class ApiClient {
    private baseURL: string
    private isRefreshing = false
    private refreshSubscribers: ((token: string) => void)[] = []

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    /**
     * Subscribe to token refresh
     */
    private subscribeTokenRefresh(callback: (token: string) => void) {
        this.refreshSubscribers.push(callback)
    }

    /**
     * Notify all subscribers when token is refreshed
     */
    private onTokenRefreshed(token: string) {
        this.refreshSubscribers.forEach((callback) => callback(token))
        this.refreshSubscribers = []
    }

    /**
     * Refresh access token using refresh token
     */
    private async refreshAccessToken(): Promise<string | null> {
        const refreshToken = tokenManager.getRefreshToken()
        if (!refreshToken) {
            tokenManager.clearTokens()
            return null
        }

        try {
            const response = await fetch(`${this.baseURL}/api/auth/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            })

            if (!response.ok) {
                throw new Error('Token refresh failed')
            }

            const data = await response.json()
            const newAccessToken = data.access

            // Update only the access token
            if (typeof window !== 'undefined') {
                localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
            }

            return newAccessToken
        } catch (error) {
            console.error('Token refresh error:', error)
            tokenManager.clearTokens()
            // Redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
            return null
        }
    }

    /**
     * Build headers for the request
     */
    private buildHeaders(requiresAuth: boolean = false, customHeaders: HeadersInit = {}, skipContentTypeHeader: boolean = false): HeadersInit {
        const headers: Record<string, string> = {
            ...(customHeaders as Record<string, string>),
        }

        // Don't set Content-Type for FormData (browser will set it with boundary)
        if (!skipContentTypeHeader && !(customHeaders instanceof Headers) && !('Content-Type' in customHeaders)) {
            headers['Content-Type'] = 'application/json'
        }

        if (requiresAuth) {
            const token = tokenManager.getAccessToken()
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }

        return headers
    }

    /**
     * Make an API request
     */
    async request<T = any>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<T> {
        const { requiresAuth = false, skipContentTypeHeader = false, headers: customHeaders = {}, ...restConfig } = config
        const url = `${this.baseURL}${endpoint}`

        const headers = this.buildHeaders(requiresAuth, customHeaders, skipContentTypeHeader)

        try {
            let response = await fetch(url, {
                ...restConfig,
                headers,
            })

            // Handle 401 (Unauthorized) - try to refresh token
            if (response.status === 401 && requiresAuth) {
                if (!this.isRefreshing) {
                    this.isRefreshing = true
                    const newToken = await this.refreshAccessToken()
                    this.isRefreshing = false

                    if (newToken) {
                        this.onTokenRefreshed(newToken)

                        // Retry the original request with new token
                        const newHeaders = this.buildHeaders(true, customHeaders, skipContentTypeHeader)
                        response = await fetch(url, {
                            ...restConfig,
                            headers: newHeaders,
                        })
                    }
                } else {
                    // Wait for token refresh to complete
                    return new Promise((resolve, reject) => {
                        this.subscribeTokenRefresh(async (token: string) => {
                            try {
                                const newHeaders = this.buildHeaders(true, customHeaders, skipContentTypeHeader)
                                const retryResponse = await fetch(url, {
                                    ...restConfig,
                                    headers: newHeaders,
                                })
                                const data = await this.handleResponse<T>(retryResponse)
                                resolve(data)
                            } catch (error) {
                                reject(error)
                            }
                        })
                    })
                }
            }

            return await this.handleResponse<T>(response)
        } catch (error) {
            // Only log if it's not an ApiError (which are expected operational errors)
            if (!(error instanceof ApiError)) {
                console.error('API request error:', error)
            }
            throw error
        }
    }

    /**
     * Handle API response
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        // Handle 204 No Content
        if (response.status === 204) {
            return {} as T
        }

        const contentType = response.headers.get('content-type')
        const isJson = contentType?.includes('application/json')

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`
            let errorData: any = null

            if (isJson) {
                try {
                    errorData = await response.json()
                    // Only log in development
                    if (process.env.NODE_ENV === 'development') {
                        console.log('API Error Response:', errorData)
                    }

                    // Handle different error response formats
                    if (typeof errorData === 'string') {
                        errorMessage = errorData
                    } else if (errorData && typeof errorData === 'object') {
                        if (errorData.detail) {
                            errorMessage = errorData.detail
                        } else if (errorData.message) {
                            errorMessage = errorData.message
                        } else if (errorData.error) {
                            errorMessage = errorData.error
                        } else {
                            // Check for field-specific errors (e.g., { email: ["This field is required"] })
                            const fieldErrors = Object.keys(errorData)
                                .filter(key => Array.isArray(errorData[key]))
                                .map(key => `${key}: ${errorData[key].join(', ')}`)

                            if (fieldErrors.length > 0) {
                                errorMessage = fieldErrors.join('; ')
                            }
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse error JSON:', e)
                }
            }

            throw new ApiError(response.status, errorMessage, errorData)
        }

        if (isJson) {
            return await response.json()
        }

        return {} as T
    }

    /**
     * Convenience methods
     */
    async get<T = any>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', requiresAuth })
    }

    async post<T = any>(
        endpoint: string,
        data?: any,
        requiresAuth: boolean = false
    ): Promise<T> {
        const isFormData = data instanceof FormData

        return this.request<T>(endpoint, {
            method: 'POST',
            requiresAuth,
            skipContentTypeHeader: isFormData,
            body: isFormData ? data : JSON.stringify(data),
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        })
    }

    async put<T = any>(
        endpoint: string,
        data?: any,
        requiresAuth: boolean = false
    ): Promise<T> {
        const isFormData = data instanceof FormData

        return this.request<T>(endpoint, {
            method: 'PUT',
            requiresAuth,
            skipContentTypeHeader: isFormData,
            body: isFormData ? data : JSON.stringify(data),
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        })
    }

    async patch<T = any>(
        endpoint: string,
        data?: any,
        requiresAuth: boolean = false
    ): Promise<T> {
        const isFormData = data instanceof FormData

        return this.request<T>(endpoint, {
            method: 'PATCH',
            requiresAuth,
            skipContentTypeHeader: isFormData,
            body: isFormData ? data : JSON.stringify(data),
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        })
    }

    async delete<T = any>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', requiresAuth })
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export base URL for direct access if needed
export { API_BASE_URL }
