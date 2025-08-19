// Testing Configuration
export const TESTING_CONFIG = {
  // Set this to true to enable fake authentication for testing
  ENABLE_FAKE_AUTH: true,

  // Fake user data for testing
  FAKE_USER: {
    id: 1,
    username: "TestUser",
    confirmed: 1,
    role: {
      id: 585,
      user_id: 1,
      role_id: "Manager",
      server: 0,
    },
    character: [
      {
        id: 5442345,
        memberid: 1,
        firstname: "Johnny",
        lastname: "Parker",
      },
      {
        id: 24523534,
        memberid: 2,
        firstname: "Lester",
        lastname: "Dawson",
      },
      {
        id: 9355356,
        memberid: 3,
        firstname: "Angela",
        lastname: "Rosetti",
      },
      {
        id: 64364344,
        memberid: 4,
        firstname: "Justin",
        lastname: "Sanderson",
      },
      {
        id: 5436635,
        memberid: 5,
        firstname: "Spencer",
        lastname: "Simon",
      },
      {
        id: 1235162,
        memberid: 6,
        firstname: "Richard",
        lastname: "Watts",
      },
    ],
  },
};

// Helper function to check if fake auth is enabled
export function isFakeAuthEnabled(): boolean {
  return TESTING_CONFIG.ENABLE_FAKE_AUTH;
}

// Helper function to get fake user data
export function getFakeUser() {
  return TESTING_CONFIG.FAKE_USER;
}

// Helper function to check if fake auth is currently active
// This now checks cookies instead of in-memory state
export function isFakeAuthActive(cookies?: any): boolean {
  if (!isFakeAuthEnabled()) return false;
  
  // If cookies are provided (server-side), check for fake auth cookie
  if (cookies) {
    const fakeAuthCookie = cookies.get('fake_auth_active');
    return fakeAuthCookie === 'true';
  }
  
  // For client-side checks, we can't access cookies directly
  // This will be handled by the server-side functions
  return false;
}

// Client-side function to check if fake auth is active
export function isFakeAuthActiveClient(): boolean {
  if (!isFakeAuthEnabled()) return false;
  
  const fakeAuthCookie = clientCookies.get('fake_auth_active');
  return fakeAuthCookie === 'true';
}

// Helper function to get current fake auth state
export function getFakeAuthState() {
  if (isFakeAuthActiveClient()) {
    return {
      isAuthenticated: true,
      user: getFakeUser()
    };
  }
  
  return {
    isAuthenticated: false,
    user: null
  };
}

// Helper function to set fake authentication state
export function setFakeAuthState(isAuthenticated: boolean, user?: any, cookies?: any) {
  if (cookies) {
    if (isAuthenticated) {
      cookies.set('fake_auth_active', 'true', {
        path: '/',
        maxAge: 86400, // 24 hours
        httpOnly: false, // Allow client-side access
        secure: false, // Allow HTTP in development
        sameSite: 'lax'
      });
    } else {
      cookies.delete('fake_auth_active', { path: '/' });
      // Note: We don't clear profile selection when clearing fake auth
      // Profile selection is independent of authentication type
    }
  }
}

// Helper function to clear fake authentication
export function clearFakeAuth(cookies?: any) {
  if (cookies) {
    cookies.delete('fake_auth_active', { path: '/' });
    // Note: We don't clear profile selection when clearing fake auth
    // Profile selection is independent of authentication type
  }
}

// Profile selection functions - these work for BOTH fake and real auth
// Helper function to get the selected profile ID (server-side)
export function getSelectedProfileId(cookies?: any): number | null {
  if (!cookies) return null;
  
  const profileId = cookies.get('selected_profile_id');
  return profileId ? parseInt(profileId) : null;
}

// Helper function to set the selected profile ID (server-side)
export function setSelectedProfileId(profileId: number, cookies?: any) {
  if (cookies) {
    cookies.set('selected_profile_id', profileId.toString(), {
      path: '/',
      maxAge: 86400, // 24 hours
      httpOnly: false, // Allow client-side access
      secure: false, // Allow HTTP in development
      sameSite: 'lax'
    });
  }
}

// Helper function to clear the selected profile ID (server-side)
export function clearSelectedProfileId(cookies?: any) {
  if (cookies) {
    cookies.delete('selected_profile_id', { path: '/' });
  }
}

// Helper function to get the selected profile data (for fake auth only)
export function getSelectedProfile(cookies?: any) {
  if (!isFakeAuthActive(cookies)) return null;
  
  const selectedId = getSelectedProfileId(cookies);
  if (!selectedId) return null;
  
  const fakeUser = getFakeUser();
  return fakeUser.character.find(char => char.id === selectedId) || null;
}

// Client-side cookie utilities (for use in components and services)
export const clientCookies = {
  // Get a cookie value on the client side
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  },

  // Set a cookie value on the client side
  set(name: string, value: string, options: { 
    path?: string; 
    maxAge?: number; 
    secure?: boolean; 
    sameSite?: string; 
  } = {}) {
    if (typeof document === 'undefined') return;
    
    let cookie = `${name}=${value}`;
    
    if (options.path) cookie += `; path=${options.path}`;
    if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
    if (options.secure) cookie += `; secure`;
    if (options.sameSite) cookie += `; samesite=${options.sameSite}`;
    
    document.cookie = cookie;
  },

  // Delete a cookie on the client side
  delete(name: string, options: { path?: string } = {}) {
    if (typeof document === 'undefined') return;
    
    let cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    if (options.path) cookie += `; path=${options.path}`;
    
    document.cookie = cookie;
  }
};

// Client-side profile selection functions
export function getClientSelectedProfileId(): number | null {
  const profileId = clientCookies.get('selected_profile_id');
  return profileId ? parseInt(profileId) : null;
}

export function setClientSelectedProfileId(profileId: number) {
  clientCookies.set('selected_profile_id', profileId.toString(), {
    path: '/',
    maxAge: 86400, // 24 hours
    secure: false, // Allow HTTP in development
    sameSite: 'lax'
  });
  console.log("🔧 Set client selected profile ID:", profileId);
}

export function clearClientSelectedProfileId() {
  clientCookies.delete('selected_profile_id', { path: '/' });
}
