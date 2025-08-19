import { redirect, type Handle } from '@sveltejs/kit';
import { OAUTH_CONFIG } from '$lib/config/oauth';
import { isFakeAuthEnabled, isFakeAuthActive, getFakeAuthState } from '$lib/config/testing';

export const handle: Handle = async ({ event, resolve }) => {
  // Get the access token from cookies
  const accessToken = event.cookies.get('access_token');
  
  // Check if this is an API route that needs authentication
  const isApiRoute = event.url.pathname.startsWith('/api/');
  const isAuthRoute = event.url.pathname.startsWith('/auth/');
  const isPublicRoute = event.url.pathname === '/' || 
                       event.url.pathname === '/login' || 
                       event.url.pathname === '/signup';
  
  console.log('Server hook:', {
    pathname: event.url.pathname,
    hasToken: !!accessToken,
    isApiRoute,
    isAuthRoute,
    isPublicRoute,
    isFakeAuthEnabled: isFakeAuthEnabled(),
    isFakeAuthActive: isFakeAuthActive(event.cookies)
  });
  
  // Handle fake authentication for testing environment - only when actually active
  if (isFakeAuthEnabled() && isFakeAuthActive(event.cookies)) {
    console.log('Using fake authentication in server hook');
    const fakeAuthState = getFakeAuthState(event.cookies);
    event.locals.user = fakeAuthState.user;
    event.locals.accessToken = 'fake_token_for_testing';
    
    // For fake auth, we're always authenticated
    const response = await resolve(event);
    return response;
  }
  
  // If it's an API route and we have a token, validate it
  if (isApiRoute && accessToken) {
    try {
      console.log('Validating token for API route:', event.url.pathname);
      
      // Validate the token by making a request to the OAuth provider
      const response = await fetch(OAUTH_CONFIG.USER_INFO_URL, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        // Token is invalid, clear it but don't redirect on API routes
        console.log('Token validation failed, clearing cookie');
        event.cookies.delete('access_token', { path: '/' });
        // For API routes, just continue without user data
        // The API endpoint will handle the unauthenticated state
      } else {
        // Token is valid, add user info to the event locals
        console.log('Token validation successful, setting user in locals');
        const userData = await response.json();
        event.locals.user = userData;
        event.locals.accessToken = accessToken;
      }
    } catch (error) {
      // If validation fails, clear the token but don't redirect on API routes
      console.error('Token validation error:', error);
      event.cookies.delete('access_token', { path: '/' });
    }
  }
  
  // Only redirect to login for non-API, non-public routes
  if (!isPublicRoute && !isAuthRoute && !isApiRoute && !accessToken) {
    console.log('Redirecting to login for protected route:', event.url.pathname);
    throw redirect(302, '/login');
  }
  
  const response = await resolve(event);
  return response;
};
