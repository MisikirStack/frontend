import { apiClient } from "@/lib/api-client";
import type {
    Company,
    CompanyList,
    Product,
    Service,
    Address,
    ContactInfo,
    PaginatedResponse,
} from "@/types/api";

/**
 * Companies Service
 * Handles all company-related API operations
 */
export class CompaniesService {
    /**
     * Get company by ID
     */
    static async getCompanyById(id: number): Promise<Company> {
        return await apiClient.get<Company>(`/api/companies/${id}/`);
    }

    /**
     * Get user's companies
     */
    static async getMyCompanies(): Promise<CompanyList[]> {
        return await apiClient.get<CompanyList[]>("/api/companies/my-companies/", true);
    }

    /**
     * Create a new company
     * Accepts either JSON data or FormData (for logo upload)
     */
    static async createCompany(data: FormData | object): Promise<Company> {
        return await apiClient.post<Company>("/api/companies/create/", data, true);
    }

    /**
     * Update company
     */
    static async updateCompany(id: number, data: FormData): Promise<Company> {
        return await apiClient.put<Company>(`/api/companies/${id}/update/`, data, true);
    }

    /**
     * Delete company
     */
    static async deleteCompany(id: number): Promise<void> {
        await apiClient.delete(`/api/companies/${id}/`, true);
    }

    /**
     * Get company statistics
     */
    static async getCompanyStats(id: number): Promise<{
        total_reviews: number;
        average_rating: number;
        total_products: number;
        total_services: number;
        total_views: number;
    }> {
        return await apiClient.get(`/api/companies/${id}/stats/`);
    }

    /**
     * Get company products
     */
    static async getCompanyProducts(companyId: number): Promise<Product[]> {
        return await apiClient.get<Product[]>(`/api/companies/${companyId}/products/`, true);
    }

    /**
     * Create product for company
     */
    static async createProduct(companyId: number, data: FormData): Promise<Product> {
        return await apiClient.post<Product>(
            `/api/companies/${companyId}/products/create/`,
            data,
            true
        );
    }

    /**
     * Update product
     */
    static async updateProduct(id: number, data: FormData): Promise<Product> {
        return await apiClient.put<Product>(`/api/products/${id}/update/`, data, true);
    }

    /**
     * Delete product
     */
    static async deleteProduct(id: number): Promise<void> {
        await apiClient.delete(`/api/products/${id}/delete/`, true);
    }

    /**
     * Get company services
     */
    static async getCompanyServices(companyId: number): Promise<Service[]> {
        return await apiClient.get<Service[]>(`/api/companies/${companyId}/services/`, true);
    }

    /**
     * Create service for company
     */
    static async createService(companyId: number, data: FormData): Promise<Service> {
        return await apiClient.post<Service>(
            `/api/companies/${companyId}/services/create/`,
            data,
            true
        );
    }

    /**
     * Update service
     */
    static async updateService(id: number, data: FormData): Promise<Service> {
        return await apiClient.put<Service>(`/api/services/${id}/update/`, data, true);
    }

    /**
     * Delete service
     */
    static async deleteService(id: number): Promise<void> {
        await apiClient.delete(`/api/services/${id}/delete/`, true);
    }

    /**
     * Create address for company
     */
    static async createAddress(companyId: number, data: Partial<Address>): Promise<Address> {
        return await apiClient.post<Address>(
            `/api/companies/${companyId}/addresses/create/`,
            data,
            true
        );
    }

    /**
     * Update contact info for company
     */
    static async updateContactInfo(
        companyId: number,
        data: Partial<ContactInfo>
    ): Promise<ContactInfo> {
        return await apiClient.put<ContactInfo>(
            `/api/companies/${companyId}/contact-info/update/`,
            data,
            true
        );
    }
}
