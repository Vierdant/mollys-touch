import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isFakeAuthEnabled, isFakeAuthActive, getFakeAuthState, getSelectedProfileId, getSelectedProfile } from '$lib/config/testing';

export const GET: RequestHandler = async ({ locals, cookies }) => {
  const accessToken = cookies.get('access_token');
  const isFakeAuth = isFakeAuthEnabled();
  const isFakeActive = isFakeAuthActive(cookies);
  
  let user = locals.user;
  let isAuthenticated = !!locals.user;
  let selectedProfileId = null;
  let selectedProfile = null;
  
  // Get profile selection information (works for both fake and real auth)
  selectedProfileId = getSelectedProfileId(cookies);
  
  // If using fake auth and it's active, show as authenticated
  if (isFakeAuth && isFakeActive) {
    const fakeAuthState = getFakeAuthState();
    user = fakeAuthState.user;
    isAuthenticated = true;
    
    // Get selected profile data for fake auth
    selectedProfile = getSelectedProfile(cookies);
  } else if (locals.user) {
    // For real auth, get the selected profile from the user's characters
    if (selectedProfileId && locals.user.character) {
      selectedProfile = locals.user.character.find((char: any) => char.id === selectedProfileId);
    }
  }
  
  return json({
    hasToken: !!accessToken,
    hasUser: !!locals.user,
    user: user || null,
    isAuthenticated,
    isFakeAuth,
    isFakeActive,
    selectedProfileId,
    selectedProfile,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};
