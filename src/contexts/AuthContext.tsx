"use client"

/**
 * Authentication Context
 * Manages global authentication state and provides auth utilities
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, tokenManager } from '@/lib/api-client'
import type { User, LoginRequest, RegisterRequest } from '@/types/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
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
      const userData = await apiClient.get<User>('/api/auth/profile/', true)
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
      
      // Store tokens
      if (response.access && response.refresh) {
        tokenManager.setTokens(response.access, response.refresh)
      }

      // Fetch user profile
      await fetchUserProfile()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiClient.post<any>('/api/auth/register/', data)
      
      // Store tokens if returned
      if (response.access && response.refresh) {
        tokenManager.setTokens(response.access, response.refresh)
      }

      // Fetch user profile
      await fetchUserProfile()
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
    router.push('/login')
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
    register,
    logout,
    refreshUser,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
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
