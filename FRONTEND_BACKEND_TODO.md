# Frontend-Backend Integration TODO

**Last Updated**: November 14, 2025  
**Status**: Company registration working, Business pages functional with limitations

---

## 📋 Conversation Summary

### What We Built:

1. **Multi-Step Company Registration Form** (`/company/setup`)
   - Step 1: Basic Info (name, description)
   - Step 2: Contact Info (phone, email, website, Google Maps link)
   - Step 3: Additional Details (categories, regions - with graceful fallback)
   - Step 4: Review & Confirm (terms acceptance)

2. **Business Page Fixes** (`/business/[id]`)
   - Fixed rating system (1-10 Misikir Score vs 1-5 review rating)
   - Graceful handling of missing reviews endpoint
   - Proper review submission with image support
   - Owner controls (edit/delete)

3. **Authentication Flow**
   - "Register Business" button added to navbar (auth-protected)
   - All business registration routes check authentication
   - Proper redirects after login

4. **Metadata Service**
   - Created service for categories/subcategories/regions/subregions
   - Graceful fallback when endpoints don't exist

---

## 🔴 CRITICAL BACKEND ISSUES (Blocking Features)

### 1. **Missing Categories/Regions Endpoints**
**Problem**: Frontend can't fetch available categories and regions for dropdowns

**Impact**: Users can't select categories or regions during business registration

**Required Endpoints**:
```
GET /api/categories/
Response: [{ id: 1, name: "Food & Beverage" }, ...]

GET /api/subcategories/?category=<id>  (optional filter)
Response: [{ id: 1, name: "Coffee Shop", category: 1 }, ...]

GET /api/regions/
Response: [{ id: 1, name: "Addis Ababa" }, ...]

GET /api/subregions/?region=<id>  (optional filter)
Response: [{ id: 1, name: "Bole", region: 1 }, ...]
```

**Frontend Status**: ✅ Service created, gracefully shows fallback message when endpoints 404

---

### 2. **Missing Company Reviews Endpoint**
**Problem**: Can't fetch reviews for a specific company

**Impact**: Business pages can't display individual customer reviews

**Required Endpoint**:
```
GET /api/companies/{id}/reviews/
Response: {
  count: 10,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      username: "John Doe",
      rating: 4,  // 1-5
      content: "Great service!",
      image: "http://...",
      date: "2024-11-14T...",
      helpful_count: 5,
      not_helpful_count: 1
    },
    ...
  ]
}
```

**Frontend Status**: ✅ Shows review count and score, displays message that reviews will load when endpoint is added

---

### 3. **Missing Contact Info GET Endpoint**
**Problem**: Can't retrieve contact info after it's been set

**Impact**: Business pages can't display phone, email, website, Google Maps link

**Required Endpoint**:
```
GET /api/companies/{id}/contact-info/
Response: {
  id: 1,
  company: 1,
  company_name: "ABC Corp",
  phone: "+251911234567",
  email: "contact@abc.com",
  website: "https://abc.com",
  googleMapLink: "https://maps.google.com/...",
  created_at: "2024-11-14T...",
  updated_at: "2024-11-14T..."
}
```

**Current Workaround**: Using `owner_email` from company data

**Frontend Status**: ⚠️ Partial - shows owner email only

---

### 4. **Missing Address GET Endpoint**
**Problem**: Can't retrieve address after it's been set

**Impact**: Business pages can't display location information

**Required Endpoint**:
```
GET /api/companies/{id}/addresses/
Response: [
  {
    id: 1,
    company: 1,
    company_name: "ABC Corp",
    region_name: "Addis Ababa",
    subregion_name: "Bole",
    is_primary: true,
    created_at: "2024-11-14T...",
    updated_at: "2024-11-14T..."
  }
]
```

**Frontend Status**: ⚠️ Not implemented, waiting for endpoint

---

### 5. **Company Deletion Not Implemented**
**Problem**: DELETE endpoint returns 405 Method Not Allowed

**Impact**: Owners can't delete their businesses

**Required**: Enable `DELETE /api/companies/{id}/delete/` or `DELETE /api/companies/{id}/`

**Frontend Status**: ✅ UI ready, shows error message directing users to contact support

---

### 6. **Products/Services Require 5 Points**
**Problem**: Viewing products/services returns 402 Payment Required if user has < 5 points

**Impact**: Even admins and owners can't view their own products/services without points

**Recommendation**: 
- Option 1: Remove points requirement for owners viewing their own products/services
- Option 2: Remove points requirement for admin accounts
- Option 3: Make viewing free, require points only for special actions

**Frontend Status**: ✅ Gracefully handles 402 error, shows empty state instead of crashing

---

### 7. **Rating Distribution Data Missing**
**Problem**: No endpoint provides breakdown of how many reviews at each rating level

**Impact**: Can't show accurate rating distribution chart on business pages

**Suggested Endpoint**:
```
GET /api/companies/{id}/stats/
Response: {
  total_reviews: 124,
  average_rating: 8.4,
  rating_distribution: {
    "10": 45,
    "9": 30,
    "8": 25,
    "7": 15,
    "6": 5,
    "5": 3,
    "4": 1,
    "3": 0,
    "2": 0,
    "1": 0
  },
  total_products: 15,
  total_services: 8,
  total_views: 3450
}
```

**Frontend Status**: ✅ Shows mock distribution data until backend provides real data

---

## 🟡 BACKEND IMPROVEMENTS (Nice to Have)

### 8. **Bulk Category/Subcategory Management**
**Current**: Backend requires category/subcategory as arrays of IDs
**Issue**: Frontend doesn't know what IDs exist

**Options**:
- A) Add GET endpoints for categories/regions (see #1)
- B) Accept category/subcategory names as strings and auto-create/match on backend
- C) Seed database with predefined categories and provide documentation

**Recommendation**: Option A (GET endpoints) - most flexible

---

### 9. **Password Change Endpoint**
**Status**: Frontend UI implemented but disabled

**Required Endpoint**:
```
POST /api/auth/change-password/
Request: {
  old_password: "string",
  new_password: "string"
}
Response: {
  message: "Password changed successfully"
}
```

**Frontend Status**: ✅ UI complete, waiting for backend endpoint

---

### 10. **Search with Proper Filtering**
**Current**: Search works but category/location filtering is client-side

**Needed**: Backend support for:
```
GET /api/search/companies/?category_id=5&subcategory_id=12&region_id=3
```

**Frontend Status**: ✅ Implemented client-side filtering as temporary solution

---

### 11. **Review Image Upload**
**Status**: Works via FormData but dedicated endpoint not registered in urls.py

**Note**: `ReviewImageUploadView` exists but `/api/reviews/{id}/image-upload/` not in urls.py

**Frontend Status**: ✅ Uses update endpoint as workaround, works fine

---

### 12. **Logo Upload During Creation**
**Current**: Can only update logo after company creation

**Enhancement**: Support logo in `/api/companies/create/` via FormData

**Frontend Status**: ⏳ Not implemented, can add when backend supports it

---

## 🟢 FRONTEND IMPROVEMENTS (Can Do Now)

### 13. **Add Logo Upload to Company Registration**
**When**: After backend supports FormData in create endpoint (see #12)

**Implementation**:
```typescript
// Add to Step 1 or 2
<Input type="file" accept="image/*" onChange={handleLogoUpload} />

// On submit:
const formData = new FormData();
formData.append('name', name);
formData.append('description', description);
formData.append('logo', logoFile);
await CompaniesService.createCompany(formData);
```

---

### 14. **Products & Services Management**
**Status**: Backend APIs exist but not exposed in frontend

**Can Implement Now**:
- Add/Edit/Delete products on business page (owner only)
- Add/Edit/Delete services on business page (owner only)
- Image upload for products
- Price display with currency

**Required Changes**:
- Create product/service management UI
- Add forms for CRUD operations
- Integrate with existing `CompaniesService` methods

---

### 15. **Review Helpful/Not Helpful**
**Status**: Backend endpoints exist

**Can Implement Now**:
```typescript
// Add to business page review display
<button onClick={() => ReviewsService.markHelpful(review.id)}>
  👍 Helpful ({review.helpful_count})
</button>
<button onClick={() => ReviewsService.markNotHelpful(review.id)}>
  👎 Not Helpful ({review.not_helpful_count})
</button>
```

---

### 16. **My Reviews Page**
**Status**: Backend endpoint exists (`GET /api/reviews/my-reviews/`)

**Can Implement Now**:
- Create `/reviews` or `/profile/reviews` page
- List all user's reviews
- Edit/delete review functionality
- Link to reviewed companies

---

### 17. **Advanced Search Filters**
**Can Implement Now** (client-side until backend adds support):
- Filter by rating range
- Filter by review count
- Sort by newest/oldest/highest rated
- Featured businesses toggle

---

### 18. **Business Hours & Additional Info**
**When**: Backend adds fields to Company model

**Prepare Now**:
- Design UI for hours input (Mon-Sun, open/close times)
- Create reusable time picker component
- Plan for multiple location support

---

### 19. **Image Gallery for Businesses**
**Current**: Only logo is supported

**Can Prepare**:
- Design gallery UI (grid/carousel)
- Image upload/crop functionality
- Lightbox for viewing full-size images

**Needs Backend**:
- New `CompanyImage` model
- Upload/delete endpoints

---

### 20. **Social Sharing Improvements**
**Current**: Copy link to clipboard

**Can Add**:
- Share to Twitter/Facebook/LinkedIn
- Generate share image with business info
- QR code generation for physical sharing

---

## 🔄 WORKFLOW IMPROVEMENTS

### 21. **Better Error Handling**
**Can Implement Now**:
- Create error boundary components
- Add retry logic for failed API calls
- Better offline detection
- Network status indicator

---

### 22. **Loading States**
**Can Improve**:
- Skeleton loaders instead of spinners
- Progressive loading (show cached data first)
- Optimistic updates (update UI before backend confirms)

---

### 23. **Form Validation**
**Can Enhance**:
- Real-time validation (as user types)
- Better error messages
- Field-level validation with icons
- Prevent duplicate submissions

---

### 24. **Responsive Design**
**Can Improve**:
- Better mobile navigation
- Touch-friendly buttons (larger touch targets)
- Swipe gestures for image galleries
- Bottom sheet modals on mobile

---

## 📊 TESTING NEEDS

### Frontend Testing (Can Do Now):
- [ ] Unit tests for services
- [ ] Component tests with React Testing Library
- [ ] E2E tests with Playwright/Cypress
- [ ] Accessibility testing
- [ ] Performance testing (Lighthouse)

### Integration Testing (Needs Backend):
- [ ] Test with real backend in development
- [ ] Test error scenarios (404, 500, 401)
- [ ] Test concurrent operations
- [ ] Load testing

---

## 🎯 PRIORITY RECOMMENDATIONS

### **Phase 1: Critical** (Do First)
1. ✅ Categories/Regions GET endpoints (#1)
2. ✅ Company Reviews GET endpoint (#2)
3. ✅ Contact Info GET endpoint (#3)
4. ✅ Enable Company Deletion (#5)

### **Phase 2: High Priority** (Do Soon)
5. ⚠️ Fix Products/Services points requirement (#6)
6. ⚠️ Add Address GET endpoint (#4)
7. ⚠️ Add Rating Distribution to stats (#7)

### **Phase 3: Enhancements** (Nice to Have)
8. 📈 Password Change endpoint (#9)
9. 📈 Logo upload during creation (#12)
10. 📈 Search filtering backend support (#10)

### **Frontend Can Do Independently**:
- ✅ Review helpful/not helpful (#15)
- ✅ My Reviews page (#16)
- ✅ Products/Services management UI (#14)
- ✅ Better error handling (#21)
- ✅ Loading improvements (#22)
- ✅ Form validation enhancements (#23)

---

## 📝 API ENDPOINTS STATUS

### ✅ Working Endpoints:
```
POST   /api/auth/login/
POST   /api/auth/register/
GET    /api/auth/profile/
PUT    /api/auth/profile/
POST   /api/auth/token/refresh/
POST   /api/auth/social/google/
POST   /api/auth/social/telegram/

GET    /api/search/companies/
POST   /api/companies/create/
GET    /api/companies/my-companies/
GET    /api/companies/{id}/
PUT    /api/companies/{id}/update/
GET    /api/companies/{id}/stats/
PUT    /api/companies/{id}/contact-info/update/
POST   /api/companies/{id}/addresses/create/
GET    /api/companies/{id}/products/  (requires 5 points)
POST   /api/companies/{id}/products/create/
GET    /api/companies/{id}/services/  (requires 5 points)
POST   /api/companies/{id}/services/create/

POST   /api/reviews/create/
GET    /api/reviews/my-reviews/
PUT    /api/reviews/{id}/update/
DELETE /api/reviews/{id}/delete/
POST   /api/reviews/{id}/mark-helpful/
POST   /api/reviews/{id}/mark-not-helpful/
```

### ❌ Missing Endpoints:
```
GET    /api/categories/
GET    /api/subcategories/
GET    /api/regions/
GET    /api/subregions/
GET    /api/companies/{id}/reviews/
GET    /api/companies/{id}/contact-info/
GET    /api/companies/{id}/addresses/
DELETE /api/companies/{id}/delete/  (405 error)
POST   /api/auth/change-password/
```

---

## 🎨 DESIGN IMPROVEMENTS

### Can Implement Now:
- [ ] Onboarding tour for new users
- [ ] Empty state illustrations
- [ ] Success animations
- [ ] Micro-interactions
- [ ] Dark mode refinements
- [ ] Custom scrollbar styles
- [ ] Breadcrumb navigation
- [ ] Toast notification system improvements

---

## 🔐 SECURITY CONSIDERATIONS

### Can Implement Now:
- [ ] Rate limiting on client (prevent spam)
- [ ] Input sanitization
- [ ] XSS prevention
- [ ] CSRF token handling
- [ ] Secure image uploads (file type validation)

### Needs Backend:
- [ ] Rate limiting on server
- [ ] Image virus scanning
- [ ] SQL injection prevention
- [ ] Authentication token rotation
- [ ] Account security settings

---

## 📱 MOBILE APP PREPARATION

### Can Prepare Now:
- [ ] PWA configuration
- [ ] Service worker for offline support
- [ ] Add to home screen prompt
- [ ] Push notifications setup (client)
- [ ] Mobile-first design patterns

---

## 🚀 DEPLOYMENT CHECKLIST

### Frontend Ready:
- [x] Environment variables configured
- [x] API base URL set to production
- [x] Error boundaries implemented
- [x] Loading states added
- [x] SEO meta tags
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] Build optimization

### Needs Backend:
- [ ] CORS configured correctly
- [ ] SSL/TLS certificates
- [ ] Database migrations
- [ ] Static files serving
- [ ] Media files storage (S3/similar)

---

## 💡 BUSINESS FEATURES (Future)

### Can Design/Plan Now:
- Business verification badges
- Premium business listings
- Featured placement
- Analytics dashboard for business owners
- Customer messaging system
- Appointment booking
- Online ordering integration
- Payment processing
- Loyalty programs
- Business networking features
- Industry-specific templates
- Multi-language support
- Currency conversion
- Export data functionality

---

## 🏁 CONCLUSION

**Current State**: 
- ✅ Core functionality working (auth, company creation, basic display)
- ⚠️ Several features limited by missing backend endpoints
- ✅ Graceful fallbacks in place where endpoints don't exist
- ✅ Ready to scale when backend adds missing endpoints

**Next Steps**:
1. **Backend**: Implement critical missing endpoints (categories, reviews, contact info GET)
2. **Frontend**: Add helpful/not helpful, my reviews page, better loading states
3. **Testing**: Write comprehensive tests for existing features
4. **Polish**: Improve responsive design, animations, error messages

**Time Estimate**:
- Backend Critical Fixes: 2-3 days
- Frontend Enhancements: 1-2 weeks
- Full Feature Parity: 3-4 weeks

The foundation is solid! Most features are one endpoint away from working. 🎉
