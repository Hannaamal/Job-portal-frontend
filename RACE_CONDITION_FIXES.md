# Race Condition Fixes for Job Portal Frontend

This document outlines the race condition issues that were identified and fixed in the Next.js frontend application when running on Vercel.

## Issues Identified

### 1. **Authentication Token Missing in API Requests**
**Problem**: The API interceptor for adding authentication tokens was commented out, causing requests to fail silently.
**Location**: `src/lib/api.ts`
**Impact**: API requests would fail with 401 errors, especially noticeable on Vercel due to serverless function cold starts.

### 2. **Concurrent State Initialization Race**
**Problem**: Multiple components were fetching data simultaneously without coordination:
- AuthContext fetching user data
- Navbar fetching notifications, saved jobs, and profile
- homeContent fetching jobs and refreshing auth
- ProfilePage fetching profile and skills

**Impact**: Race conditions where data could be overwritten or requests could conflict.

### 3. **SSR/Hydration Mismatches**
**Problem**: Components had client-only state that could cause hydration issues on Vercel's server-side rendering.
**Impact**: Hydration errors and inconsistent UI state between server and client.

### 4. **Missing Request Deduplication**
**Problem**: No mechanism to prevent duplicate concurrent requests for the same data.
**Impact**: Unnecessary API calls, potential data inconsistencies, and increased server load.

### 5. **Poor Error Handling**
**Problem**: Limited error boundaries and error handling for Vercel-specific issues.
**Impact**: Application crashes and poor user experience when errors occur.

## Solutions Implemented

### 1. **Fixed Authentication Token Issue**
```typescript
// src/lib/api.ts
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

### 2. **Implemented Request Coordination in AuthContext**
```typescript
// src/Context/AuthContext.tsx
const refreshUser = useCallback(async () => {
  if (isRefreshing) return; // Prevent concurrent refreshes
  
  setIsRefreshing(true);
  try {
    // First, fetch user authentication status
    const userData = await dispatch(fetchMe()).unwrap();
    
    // Only fetch additional data if user is authenticated
    if (userData && userData._id) {
      // Fetch all user-related data sequentially to prevent race conditions
      await Promise.all([
        dispatch(fetchNotifications()).unwrap(),
        dispatch(fetchSavedJobs()).unwrap(),
        dispatch(fetchMyProfile()).unwrap()
      ]);
    }
  } catch (error) {
    console.error('Auth refresh failed:', error);
  } finally {
    setIsRefreshing(false);
    setInitialized(true);
  }
}, [dispatch]);
```

### 3. **Removed Redundant Data Fetching**
- Removed duplicate data fetching from Navbar component
- Centralized data fetching in AuthContext to prevent conflicts
- Ensured single source of truth for authentication state

### 4. **Enhanced API Manager with Request Deduplication**
```typescript
// src/lib/apiManager.ts
const requestCache = new Map<string, Promise<any>>();

export const apiRequest = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const key = createRequestKey(url, params);
    
    // Return cached promise if request is already in progress
    if (requestCache.has(key)) {
      return requestCache.get(key);
    }

    // Create new request promise
    const requestPromise = api.get<T>(url, { params }).then(response => response.data);
    
    // Cache the promise
    requestCache.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Remove from cache when request completes (success or failure)
      requestCache.delete(key);
    }
  }
};
```

### 5. **Added Comprehensive Error Boundary**
```typescript
// src/components/common/ErrorBoundary.tsx
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
}
```

### 6. **Improved Loading States and Error Handling**
- Added proper loading states in homeContent component
- Enhanced error handling with try-catch blocks
- Added client-side flags to prevent hydration mismatches

### 7. **Updated Redux Slices for Better Type Safety**
- Updated authSlice to use the new API manager
- Added proper TypeScript type annotations
- Improved error handling in async thunks

## Vercel-Specific Optimizations

### 1. **Environment Variable Handling**
- Ensured proper handling of `NEXT_PUBLIC_BACKEND_URL`
- Added timeout configuration for API requests (10 seconds)

### 2. **Cookie Management**
- Improved cookie handling for serverless environment
- Added proper cookie cleanup on authentication errors

### 3. **Error Tracking**
- Added development mode error details
- Placeholder for production error tracking service integration

## Files Modified

1. `src/lib/api.ts` - Fixed authentication token interceptor
2. `src/Context/AuthContext.tsx` - Implemented request coordination
3. `src/components/Navbar.tsx` - Removed redundant data fetching
4. `src/components/homeContent.tsx` - Improved error handling
5. `src/redux/authSlice.ts` - Updated to use new API manager
6. `src/lib/apiManager.ts` - New file with request deduplication
7. `src/components/common/ErrorBoundary.tsx` - New error boundary component
8. `src/app/layout.tsx` - Wrapped application with error boundary

## Testing Recommendations

1. **Test Authentication Flow**:
   - Login/logout cycles
   - Session expiration handling
   - Token refresh scenarios

2. **Test Concurrent Requests**:
   - Rapid navigation between pages
   - Multiple API calls simultaneously
   - Network latency simulation

3. **Test Vercel Deployment**:
   - Cold start scenarios
   - Server-side rendering consistency
   - Hydration error detection

4. **Test Error Scenarios**:
   - Network failures
   - API timeouts
   - Invalid authentication states

## Performance Improvements

- **Request Deduplication**: Prevents duplicate API calls for the same data
- **Sequential Loading**: Coordinates data fetching to prevent race conditions
- **Proper Loading States**: Reduces UI flickering and improves user experience
- **Error Boundaries**: Prevents application crashes from unhandled errors

## Future Considerations

1. **Consider Redux Toolkit Query**: For even better caching and request management
2. **Implement Service Worker**: For offline support and better caching
3. **Add Monitoring**: Integrate with error tracking services like Sentry
4. **Optimize Bundle Size**: Review bundle size for faster Vercel deployments

## Conclusion

These fixes address the core race condition issues that were causing problems on Vercel. The application should now have:
- Consistent authentication state
- Proper request coordination
- Better error handling
- Improved performance on serverless infrastructure
