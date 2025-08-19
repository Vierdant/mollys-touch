import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isFakeAuthEnabled, isFakeAuthActive, getFakeAuthState } from '$lib/config/testing';

export const GET: RequestHandler = async ({ locals, cookies }) => {
  try {
    // Check if we have an access token cookie
    const accessToken = cookies.get('access_token');
    
    console.log('Auth status check:', {
      hasToken: !!accessToken,
      hasUser: !!locals.user,
      pathname: 'auth/status',
      isFakeAuthEnabled: isFakeAuthEnabled(),
      isFakeAuthActive: isFakeAuthActive(cookies)
    });
    
    // Check for fake authentication in testing environment - only when actually active
    if (isFakeAuthEnabled() && isFakeAuthActive(cookies)) {
      console.log('Using fake authentication for testing');
      const fakeAuthState = getFakeAuthState(cookies);
      return json({ 
        isAuthenticated: true, 
        user: fakeAuthState.user 
      });
    }
    
    if (!accessToken) {
      console.log('No access token found');
      return json({ 
        isAuthenticated: false, 
        user: null 
      });
    }
    
    // The user data is already validated and available in locals from the hook
    if (locals.user) {
      console.log('User found in locals:', locals.user.username);
      return json({ 
        isAuthenticated: true, 
        user: locals.user 
      });
    }
    
    // If we have a token but no user in locals, the token might be invalid
    // Return unauthenticated so the frontend can handle it
    console.log('Token exists but no user in locals');
    return json({ 
      isAuthenticated: false, 
      user: null 
    });
  } catch (error) {
    console.error('Error in auth status endpoint:', error);
    return json({ 
      isAuthenticated: false, 
      user: null,
      error: 'Failed to check authentication status'
    });
  }
};
