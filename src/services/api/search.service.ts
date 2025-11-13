import { apiClient } from "@/lib/api-client";
import type {
    CompanyList,
    PaginatedResponse,
    CompanySearchParams,
    Product,
    Service,
} from "@/types/api";

/**
 * Search Service
 * Handles all search-related API operations
 */
export class SearchService {
    /**
     * Search companies with filters
     */
    static async searchCompanies(
        params: CompanySearchParams
    ): Promise<PaginatedResponse<CompanyList>> {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append("search", params.search);
        if (params.category) queryParams.append("category", params.category.toString());
        if (params.subcategory) queryParams.append("subcategory", params.subcategory.toString());
        if (params.region) queryParams.append("region", params.region.toString());
        if (params.min_rating) queryParams.append("min_rating", params.min_rating.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.ordering) queryParams.append("ordering", params.ordering);
        if (params.is_featured !== undefined) queryParams.append("is_featured", params.is_featured.toString());

        return await apiClient.get<PaginatedResponse<CompanyList>>(
            `/api/search/companies/?${queryParams.toString()}`
        );
    }

    /**
     * Search products
     */
    static async searchProducts(params: {
        search?: string;
        company?: number;
        min_price?: number;
        max_price?: number;
        page?: number;
    }): Promise<PaginatedResponse<Product>> {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append("search", params.search);
        if (params.company) queryParams.append("company", params.company.toString());
        if (params.min_price) queryParams.append("min_price", params.min_price.toString());
        if (params.max_price) queryParams.append("max_price", params.max_price.toString());
        if (params.page) queryParams.append("page", params.page.toString());

        return await apiClient.get<PaginatedResponse<Product>>(
            `/api/search/products/?${queryParams.toString()}`
        );
    }

    /**
     * Search services
     */
    static async searchServices(params: {
        search?: string;
        company?: number;
        min_price?: number;
        max_price?: number;
        page?: number;
    }): Promise<PaginatedResponse<Service>> {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append("search", params.search);
        if (params.company) queryParams.append("company", params.company.toString());
        if (params.min_price) queryParams.append("min_price", params.min_price.toString());
        if (params.max_price) queryParams.append("max_price", params.max_price.toString());
        if (params.page) queryParams.append("page", params.page.toString());

        return await apiClient.get<PaginatedResponse<Service>>(
            `/api/search/services/?${queryParams.toString()}`
        );
    }
}
