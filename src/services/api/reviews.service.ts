import { apiClient } from "@/lib/api-client";
import type { Review, PaginatedResponse } from "@/types/api";

/**
 * Reviews Service
 * Handles all review-related API operations
 */
export class ReviewsService {
    /**
     * Create a new review
     * Accepts FormData for image uploads or JSON object
     */
    static async createReview(data: FormData | {
        company: number;
        rating: number;
        content: string;
        title?: string;
    }): Promise<Review> {
        return await apiClient.post<Review>("/api/reviews/create/", data, true);
    }

    /**
     * Get user's reviews
     */
    static async getMyReviews(page?: number): Promise<PaginatedResponse<Review>> {
        const url = page ? `/api/reviews/my-reviews/?page=${page}` : "/api/reviews/my-reviews/";
        return await apiClient.get<PaginatedResponse<Review>>(url, true);
    }

    /**
     * Get reviews for a specific company
     * Note: Backend doesn't have a dedicated endpoint for this yet
     * TODO: Add proper endpoint when available
     */
    static async getCompanyReviews(companyId: number): Promise<Review[]> {
        // Placeholder: return empty array until backend adds the endpoint
        // The proper endpoint would be: `/api/companies/${companyId}/reviews/`
        return [];
    }

    /**
     * Update review
     */
    static async updateReview(id: number, data: Partial<{
        company: number;
        review_text: string;
        time: number;
        quality: number;
        quantity: number;
        trust: number;
        honesty: number;
        service: number;
    }>): Promise<Review> {
        return await apiClient.put<Review>(`/api/reviews/${id}/update/`, data, true);
    }

    /**
     * Delete review
     */
    static async deleteReview(id: number): Promise<void> {
        await apiClient.delete(`/api/reviews/${id}/delete/`, true);
    }

    /**
     * Mark review as helpful
     */
    static async markHelpful(id: number): Promise<{ helpful_count: number }> {
        return await apiClient.post<{ helpful_count: number }>(
            `/api/reviews/${id}/mark-helpful/`,
            null,
            true
        );
    }

    /**
     * Mark review as not helpful
     */
    static async markNotHelpful(id: number): Promise<{ not_helpful_count: number }> {
        return await apiClient.post<{ not_helpful_count: number }>(
            `/api/reviews/${id}/mark-not-helpful/`,
            null,
            true
        );
    }

    /**
     * Upload image for an existing review using the update endpoint
     * Note: Backend ReviewImageUploadView exists but URL pattern is not registered in urls.py
     * Fallback: Use regular update endpoint which supports multipart/form-data
     */
    static async uploadReviewImage(reviewId: number, image: File): Promise<Review> {
        const formData = new FormData();
        formData.append('image', image);
        // Use update endpoint since /image-upload/ is not registered in backend urls.py
        return await apiClient.put<Review>(`/api/reviews/${reviewId}/update/`, formData, true);
    }
}
