# Backend Integration Plan for Misikir Frontend

**Backend API URL:** https://backend-production-8ca4.up.railway.app/

## 📋 Overview

This document outlines the step-by-step plan for integrating the Django REST API backend with the Next.js frontend. The integration will be done incrementally to ensure stability and maintainability.

---

## 🎯 Current State Analysis

### ✅ Frontend Components Ready:
- Login page (`/src/app/login/page.tsx`)
- Registration page (`/src/app/register-business/page.tsx`)
- Home page with search and filters (`/src/app/page.tsx`)
- Business detail page (`/src/app/business/[id]/page.tsx`)
- Review form component (`/src/components/review-form.tsx`)
- OAuth buttons (Google & Telegram) - UI ready
- Categories list (`/src/lib/categories.ts`)

### ⚠️ Current Issues:
- All data is **mock/placeholder**
- `use-api.ts` hooks return dummy data
- OAuth buttons don't connect to backend
- No authentication state management
- No API configuration or error handling
- Forms don't submit to backend
- Images use placeholder SVGs

---

## 📦 Backend API Endpoints Available

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (returns JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `POST /api/auth/token/verify/` - Verify token validity
- `GET /api/auth/profile/` - Get current user profile
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/social/google/` - Google OAuth
- `POST /api/auth/social/telegram/` - Telegram OAuth

### Company Management
- `POST /api/companies/create/` - Create company
- `GET /api/companies/my-companies/` - Get user's companies
- `PUT /api/companies/{id}/update/` - Update company
- `GET /api/companies/{id}/stats/` - Get company statistics
- `POST /api/companies/{company_id}/addresses/create/` - Add address
- `PUT /api/companies/{company_id}/contact-info/update/` - Update contact info

### Products & Services
- `GET /api/companies/{company_id}/products/` - List company products
- `POST /api/companies/{company_id}/products/create/` - Create product
- `PUT /api/products/{id}/update/` - Update product
- `DELETE /api/products/{id}/delete/` - Delete product
- `GET /api/companies/{company_id}/services/` - List company services
- `POST /api/companies/{company_id}/services/create/` - Create service
- `PUT /api/services/{id}/update/` - Update service
- `DELETE /api/services/{id}/delete/` - Delete service

### Reviews
- `POST /api/reviews/create/` - Submit review
- `GET /api/reviews/my-reviews/` - Get user's reviews
- `PUT /api/reviews/{id}/update/` - Update review
- `DELETE /api/reviews/{id}/delete/` - Delete review
- `POST /api/reviews/{id}/mark-helpful/` - Mark review helpful
- `POST /api/reviews/{id}/mark-not-helpful/` - Mark review not helpful

### Search
- `GET /api/search/companies/` - Search companies with filters
- `GET /api/search/products/` - Search products
- `GET /api/search/services/` - Search services

---

## 🚀 Integration Tasks Breakdown

### **Phase 1: Foundation Setup** (Priority: Critical)

#### Task 1: Setup API Configuration & Environment
**Files to create:**
- `/src/lib/api-client.ts` - Axios/Fetch configuration
- `/.env.local` - Environment variables

**Implementation:**
```typescript
// Environment variables needed
NEXT_PUBLIC_API_BASE_URL=https://backend-production-8ca4.up.railway.app
```

**What to do:**
- Create API client with interceptors
- Add JWT token injection to requests
- Add error handling interceptors
- Add request/response logging (dev mode)
- Handle CORS if needed

---

#### Task 2: Implement Authentication Context & State Management
**Files to create:**
- `/src/contexts/AuthContext.tsx`
- `/src/hooks/useAuth.tsx`

**What to do:**
- Create React Context for auth state
- Store JWT tokens in localStorage/httpOnly cookies
- Implement token refresh logic
- Add auth state persistence across page reloads
- Handle logout functionality

---

### **Phase 2: Authentication Integration** (Priority: High)

#### Task 3: Integrate Login & Registration Pages
**Files to modify:**
- `/src/app/login/page.tsx`
- `/src/app/register-business/page.tsx`

**API Endpoints:**
- `POST /api/auth/login/`
- `POST /api/auth/register/`

**What to do:**
- Connect login form to backend
- Connect registration form to backend
- Add form validation
- Handle success/error responses
- Store JWT tokens on success
- Redirect to dashboard/home after login

---

#### Task 4: Implement OAuth (Google & Telegram)
**Files to modify:**
- `/src/app/login/page.tsx`
- `/src/app/register-business/page.tsx`
- `/src/hooks/use-api.ts`

**API Endpoints:**
- `POST /api/auth/social/google/`
- `POST /api/auth/social/telegram/`

**What to do:**
- Implement OAuth flow with redirect URLs
- Handle OAuth callbacks
- Store OAuth tokens
- Update `useGoogleAuth` and `useTelegramAuth` hooks

---

### **Phase 3: Core API Services** (Priority: High)

#### Task 5: Create API Service Layer
**Files to create:**
- `/src/services/api/authentication.service.ts`
- `/src/services/api/companies.service.ts`
- `/src/services/api/reviews.service.ts`
- `/src/services/api/search.service.ts`
- `/src/services/api/products.service.ts`
- `/src/services/api/services.service.ts`

**What to do:**
- Create typed service functions for each API endpoint
- Add TypeScript interfaces for all API responses
- Implement error handling in each service
- Add JSDoc comments for documentation

---

### **Phase 4: Home Page Integration** (Priority: High)

#### Task 6: Update Home Page - Search & Companies
**Files to modify:**
- `/src/app/page.tsx`
- `/src/hooks/use-api.ts`

**API Endpoints:**
- `GET /api/search/companies/`

**What to do:**
- Replace mock data with real API calls
- Implement search functionality
- Add filter parameters (category, region, min_rating)
- Implement pagination
- Handle loading and error states
- Display real business data

---

#### Task 14: Implement Categories & Filters Integration
**Files to modify:**
- `/src/lib/categories.ts`
- `/src/app/page.tsx`

**What to do:**
- Verify backend category structure matches frontend
- Connect filters to API query parameters
- Implement subcategory filtering
- Add region/location filtering

---

#### Task 16: Implement Search Functionality
**Files to modify:**
- `/src/app/page.tsx`
- `/src/hooks/use-api.ts`

**API Endpoints:**
- `GET /api/search/companies/`
- `GET /api/search/products/`
- `GET /api/search/services/`

**What to do:**
- Implement debounced search
- Handle search query parameters
- Display search results
- Add "no results" state

---

#### Task 20: Implement Pagination & Infinite Scroll
**Files to modify:**
- `/src/app/page.tsx`
- `/src/components/ui/*` (if needed)

**What to do:**
- Add pagination controls
- Implement page parameter handling
- Add infinite scroll option
- Show total results count

---

### **Phase 5: Business Detail Page** (Priority: High)

#### Task 7: Integrate Business Detail Page
**Files to modify:**
- `/src/app/business/[id]/page.tsx`

**API Endpoints:**
- `GET /api/companies/{id}/` (may need to be created)
- `GET /api/companies/{company_id}/products/`
- `GET /api/companies/{company_id}/services/`

**What to do:**
- Fetch company by ID
- Load real reviews
- Fetch products and services
- Load contact info and addresses
- Display real company data

---

#### Task 8: Implement Review Submission
**Files to modify:**
- `/src/components/review-form.tsx`
- `/src/app/business/[id]/page.tsx`

**API Endpoints:**
- `POST /api/reviews/create/`

**What to do:**
- Connect ReviewForm to backend
- Handle review validation
- Upload review images (multipart/form-data)
- Show success/error messages
- Refresh reviews after submission
- Handle one-review-per-company constraint

---

#### Task 9: Implement Review Actions
**Files to modify:**
- `/src/app/business/[id]/page.tsx`

**API Endpoints:**
- `POST /api/reviews/{id}/mark-helpful/`
- `POST /api/reviews/{id}/mark-not-helpful/`
- `PUT /api/reviews/{id}/update/`
- `DELETE /api/reviews/{id}/delete/`

**What to do:**
- Implement helpful/not helpful buttons
- Add edit/delete buttons for owned reviews
- Show buttons conditionally based on ownership
- Handle optimistic UI updates

---

#### Task 21: Add Analytics & Statistics
**Files to modify:**
- `/src/app/business/[id]/page.tsx`

**API Endpoints:**
- `GET /api/companies/{id}/stats/`

**What to do:**
- Fetch and display company statistics
- Show view counts
- Display review metrics
- Add trending indicators

---

### **Phase 6: Company Management** (Priority: Medium)

#### Task 10: Create Company Management Pages
**Files to create:**
- `/src/app/dashboard/my-companies/page.tsx`
- `/src/app/dashboard/company/[id]/edit/page.tsx`
- `/src/app/dashboard/company/new/page.tsx`

**API Endpoints:**
- `GET /api/companies/my-companies/`
- `POST /api/companies/create/`
- `PUT /api/companies/{id}/update/`
- `POST /api/companies/{company_id}/addresses/create/`
- `PUT /api/companies/{company_id}/contact-info/update/`

**What to do:**
- Create company dashboard
- Implement company creation form with logo upload
- Implement company edit page
- Add address management
- Add contact info management

---

#### Task 11: Implement Products & Services Management
**Files to create:**
- `/src/app/dashboard/company/[id]/products/page.tsx`
- `/src/app/dashboard/company/[id]/services/page.tsx`

**API Endpoints:**
- `POST /api/companies/{company_id}/products/create/`
- `PUT /api/products/{id}/update/`
- `DELETE /api/products/{id}/delete/`
- `POST /api/companies/{company_id}/services/create/`
- `PUT /api/services/{id}/update/`
- `DELETE /api/services/{id}/delete/`

**What to do:**
- Create product management UI
- Create service management UI
- Handle image uploads for products
- Implement CRUD operations

---

#### Task 12: Add User Profile Management
**Files to create:**
- `/src/app/profile/page.tsx`

**API Endpoints:**
- `GET /api/auth/profile/`
- `PUT /api/auth/profile/`

**What to do:**
- Create profile page
- Display user info, points, role
- Implement profile edit form
- Handle profile picture upload
- Show user's review history

---

### **Phase 7: Security & Authorization** (Priority: High)

#### Task 13: Implement Protected Routes & Authorization
**Files to create:**
- `/src/middleware/auth-middleware.ts`
- `/src/components/ProtectedRoute.tsx`

**What to do:**
- Create route protection HOC
- Check authentication on route access
- Redirect to login if not authenticated
- Implement role-based access control
- Protect company management routes
- Protect admin routes

---

#### Task 17: Add Token Refresh & Session Management
**Files to modify:**
- `/src/lib/api-client.ts`
- `/src/contexts/AuthContext.tsx`

**API Endpoints:**
- `POST /api/auth/token/refresh/`
- `POST /api/auth/token/verify/`

**What to do:**
- Auto-refresh tokens before expiry
- Handle 401 errors globally
- Implement session timeout warning
- Handle concurrent request token refresh
- Clear tokens on logout

---

### **Phase 8: Media & File Handling** (Priority: Medium)

#### Task 15: Add Image Upload Handling
**Files to create:**
- `/src/utils/file-upload.ts`

**What to do:**
- Implement file upload utility
- Handle company logos (multipart/form-data)
- Handle product images
- Handle review images
- Handle profile pictures
- Add image preview
- Validate file size and type
- Update `next.config.ts` if needed

---

### **Phase 9: Polish & Optimization** (Priority: Medium)

#### Task 18: Update use-api.ts Hook
**Files to modify:**
- `/src/hooks/use-api.ts`

**What to do:**
- Remove ALL mock data
- Replace with real API calls
- Update all hook implementations
- Add proper TypeScript types
- Keep backward compatibility

---

#### Task 19: Add Loading & Error States
**Files to create:**
- `/src/components/LoadingSkeleton.tsx`
- `/src/components/ErrorBoundary.tsx`
- `/src/components/EmptyState.tsx`

**What to do:**
- Create loading skeletons for all pages
- Implement error boundary components
- Add toast notifications
- Create empty state components
- Add retry functionality
- Handle network errors gracefully

---

#### Task 23: Performance Optimization
**Files to modify:**
- Multiple files

**What to do:**
- Implement request caching
- Add optimistic UI updates
- Minimize re-renders
- Optimize image loading
- Add request deduplication
- Implement data prefetching

---

### **Phase 10: Testing & Deployment** (Priority: High)

#### Task 22: Testing & Bug Fixes
**What to do:**
- Test all authentication flows
- Verify all CRUD operations
- Test image uploads
- Verify error handling
- Test pagination and filters
- Check mobile responsiveness
- Fix discovered bugs

---

#### Task 24: Final Polish & Documentation
**Files to create:**
- Update `README.md`
- Create API documentation

**What to do:**
- Document environment variables
- Add setup instructions
- Document API integration
- Add code comments
- Prepare for deployment
- Update deployment config with production API URL

---

## 🔧 Technical Implementation Notes

### Required NPM Packages
```bash
# Might need to install:
npm install axios
npm install react-query  # For data fetching and caching
npm install react-toastify  # For notifications
npm install zustand  # Optional: for state management
```

### Environment Variables (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=https://backend-production-8ca4.up.railway.app
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_TELEGRAM_BOT_NAME=your_telegram_bot
```

### API Response Type Definitions
Will need to create TypeScript interfaces matching the OpenAPI schema for:
- User
- Company
- Review
- Product
- Service
- Address
- ContactInfo

---

## 📝 Recommended Implementation Order

1. **Start Here:** Task 1, 2, 5 (Foundation)
2. **Then:** Task 3, 4 (Authentication)
3. **Then:** Task 6, 14, 16, 20 (Home Page)
4. **Then:** Task 7, 8, 9 (Business Detail)
5. **Then:** Task 13, 17 (Security)
6. **Then:** Task 10, 11, 12 (Company Management)
7. **Then:** Task 15, 18, 19 (Polish)
8. **Then:** Task 21, 23 (Optimization)
9. **Finally:** Task 22, 24 (Testing & Deployment)

---

## ⚠️ Important Considerations

1. **CORS:** Backend must allow requests from frontend domain
2. **JWT Storage:** Consider httpOnly cookies for production security
3. **Image Upload:** Backend expects multipart/form-data for images
4. **Error Handling:** Backend returns specific error formats - need to handle
5. **Rate Limiting:** Backend may have rate limits - implement retry logic
6. **Pagination:** Backend uses page-based pagination - implement UI accordingly
7. **Role Permissions:** Respect USER, COMPANY_OWNER, ADMIN roles
8. **Mobile First:** Ensure all integrations work on mobile devices

---

## 📊 Success Metrics

- [ ] All mock data removed
- [ ] All authentication flows working
- [ ] All CRUD operations functional
- [ ] All images loading from backend
- [ ] Search and filters working
- [ ] Error handling in place
- [ ] Loading states on all API calls
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Production ready

---

## 🎯 Next Step

**Let's start with Phase 1, Task 1: Setup API Configuration & Environment**

This will create the foundation for all subsequent integrations.

Would you like to proceed with Task 1?
