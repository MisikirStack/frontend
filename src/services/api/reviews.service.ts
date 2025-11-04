import { apiClient } from "@/lib/api-client";
import type { Review, PaginatedResponse } from "@/types/api";

/**
 * Reviews Service
 * Handles all review-related API operations
 */
export class ReviewsService {
  /**
   * Create a new review
   */
  static async createReview(data: FormData): Promise<Review> {
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
   * Update review
   */
  static async updateReview(id: number, data: FormData): Promise<Review> {
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
}
