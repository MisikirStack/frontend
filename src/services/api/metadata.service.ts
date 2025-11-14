import { apiClient } from "@/lib/api-client";

/**
 * Category Interface
 */
export interface Category {
    id: number;
    name: string;
}

/**
 * Subcategory Interface
 */
export interface Subcategory {
    id: number;
    name: string;
    category: number; // Parent category ID
}

/**
 * Region Interface
 */
export interface Region {
    id: number;
    name: string;
}

/**
 * Subregion Interface
 */
export interface Subregion {
    id: number;
    name: string;
    region: number; // Parent region ID
}

/**
 * Metadata Service
 * Handles fetching categories, subcategories, regions, and subregions
 */
export class MetadataService {
    /**
     * Get all categories
     */
    static async getCategories(): Promise<Category[]> {
        return await apiClient.get<Category[]>("/api/categories/");
    }

    /**
     * Get all subcategories (optionally filtered by category ID)
     */
    static async getSubcategories(categoryId?: number): Promise<Subcategory[]> {
        const url = categoryId
            ? `/api/subcategories/?category=${categoryId}`
            : "/api/subcategories/";
        return await apiClient.get<Subcategory[]>(url);
    }

    /**
     * Get all regions
     */
    static async getRegions(): Promise<Region[]> {
        return await apiClient.get<Region[]>("/api/regions/");
    }

    /**
     * Get all subregions (optionally filtered by region ID)
     */
    static async getSubregions(regionId?: number): Promise<Subregion[]> {
        const url = regionId
            ? `/api/subregions/?region=${regionId}`
            : "/api/subregions/";
        return await apiClient.get<Subregion[]>(url);
    }
}
