/**
 * API Type Definitions
 * Based on OpenAPI schema from backend
 */

// ==================== Enums ====================

export enum UserRole {
    ADMIN = 'ADMIN',
    COMPANY_OWNER = 'COMPANY_OWNER',
    USER = 'USER',
}

export enum Rating {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

// ==================== Authentication ====================

export interface User {
    name: string
    email: string
    phone?: string | null
    telegram_username?: string | null
    point: number
    profile_picture?: string | null
    role: UserRole
    is_active: boolean
    is_staff: boolean
    date_joined: string
    updated_at: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    user: User
    tokens: {
        access: string
        refresh: string
    }
}

export interface RegisterRequest {
    email: string
    name: string
    password: string
    role?: UserRole
    phone?: string | null
    telegram_username?: string | null
}

export interface TokenRefreshRequest {
    refresh: string
}

export interface TokenRefreshResponse {
    access: string
    refresh: string
}

export interface TokenVerifyRequest {
    token: string
}

// ==================== Company ====================

export interface Company {
    id: number
    owner: number
    owner_name: string
    name: string
    description?: string | null
    logo?: string | null
    categories: number[]
    category_names: string
    subcategories: number[]
    subcategory_names: string
    misikir_score: number
    misikir_reviews_count: number
    misikir_profile_url?: string | null
    created_at: string
    updated_at: string
}

export interface CompanyList {
    id: number
    name: string
    description?: string | null
    logo?: string | null
    logo_url: string
    category_names: string
    subcategory_names: string
    misikir_score: number
    misikir_reviews_count: number
    misikir_profile_url?: string | null
    created_at: string
}

export interface CompanyRequest {
    owner: number
    name: string
    description?: string | null
    logo?: File | null
    categories?: number[]
    subcategories?: number[]
}

// ==================== Address ====================

export interface Address {
    id: number
    company_name: string
    region_name: string
    subregion_name: string
    username: string
    is_primary: boolean
    created_at: string
    updated_at: string
    company: number
    user?: number | null
    region: number
    subregion: number
}

export interface AddressRequest {
    is_primary?: boolean
    company: number
    user?: number | null
    region: number
    subregion: number
}

// ==================== Contact Info ====================

export interface ContactInfo {
    id: number
    company_name: string
    phone?: string | null
    email?: string | null
    website?: string | null
    googleMapLink?: string | null
    created_at: string
    updated_at: string
    company: number
}

export interface ContactInfoRequest {
    phone?: string | null
    email?: string | null
    website?: string | null
    googleMapLink?: string | null
    company: number
}

// ==================== Product ====================

export interface Product {
    id: number
    company_name: string
    image?: string | null
    name: string
    description: string
    price: number
    price_unit: string
    created_at: string
    updated_at: string
    company: number
}

export interface ProductList {
    id: number
    company_name: string
    name: string
    description: string
    price: number
    price_unit: string
    image?: string | null
    image_url: string
    created_at: string
}

export interface ProductRequest {
    image?: File | null
    name: string
    description: string
    price: number
    price_unit: string
    company: number
}

// ==================== Service ====================

export interface Service {
    id: number
    company_name: string
    name: string
    description: string
    price: number
    price_unit: string
    created_at: string
    updated_at: string
    company: number
}

export interface ServiceList {
    id: number
    company_name: string
    name: string
    description: string
    price: number
    price_unit: string
    created_at: string
}

export interface ServiceRequest {
    name: string
    description: string
    price: number
    price_unit: string
    company: number
}

// ==================== Review ====================

export interface Review {
    id: number
    user: number
    username: string
    company: number
    company_name: string
    rating: Rating
    content: string
    image?: string | null
    date: string
    helpful_count: number
    not_helpful_count: number
}

export interface ReviewList {
    id: number
    username: string
    company_name: string
    rating: Rating
    content: string
    image?: string | null
    image_url: string
    date: string
    helpful_count: number
    not_helpful_count: number
}

export interface ReviewRequest {
    user: number
    company: number
    rating: Rating
    content: string
    image?: File | null
}

// ==================== Search & Pagination ====================

export interface PaginatedResponse<T> {
    count: number
    next?: string | null
    previous?: string | null
    results: T[]
}

export interface CompanySearchParams {
    search?: string
    category?: number
    subcategory?: number
    region?: number
    min_rating?: number
    ordering?: string // 'misikir_score' | '-misikir_score' | 'misikir_reviews_count' | '-misikir_reviews_count' | 'created_at' | '-created_at'
    page?: number
}

export interface ProductSearchParams {
    search?: string
    company?: number
    category?: number
    subcategory?: number
    region?: number
    min_price?: number
    max_price?: number
    ordering?: string // 'price' | '-price' | 'created_at' | '-created_at'
    page?: number
}

export interface ServiceSearchParams {
    search?: string
    company?: number
    category?: number
    subcategory?: number
    region?: number
    min_price?: number
    max_price?: number
    ordering?: string // 'price' | '-price' | 'created_at' | '-created_at'
    page?: number
}

// ==================== API Response Types ====================

export interface ApiErrorResponse {
    detail?: string
    message?: string
    errors?: Record<string, string[]>
}

export interface ApiSuccessResponse<T = any> {
    data: T
    message?: string
}
