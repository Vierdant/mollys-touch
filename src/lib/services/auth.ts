import { auth } from "../stores/auth";
import { buildAuthorizationUrl } from "../config/oauth";
import { isFakeAuthEnabled, getFakeUser, clearClientSelectedProfileId, isFakeAuthActiveClient, clientCookies } from "../config/testing";

export interface Character {
  id: number;
  memberid: number;
  firstname: string;
  lastname: string;
}

export interface User {
  id: number;
  username: string;
  confirmed: number;
  character: Character[];
}

export interface CharacterProfile {
  id: number; // This will be the character ID
  username: string; // First + Last name
  phone_number?: string;
  routing_number?: string;
  address?: string;
  discord?: string;
  is_active?: boolean; // This is local state, not stored in Supabase
  is_admin?: boolean;
}

export class AuthService {
  static async signIn() {
    try {
      if (isFakeAuthEnabled()) {
        // Fake authentication for testing
        console.log("🔧 Using FAKE authentication for testing");

        // Simulate a delay to mimic real authentication
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Set fake authentication state via API
        const response = await fetch('/api/auth/fake-signin', { method: 'POST' });
        if (!response.ok) {
          throw new Error('Failed to activate fake authentication');
        }

        // Also set the client-side cookie for immediate access
        clientCookies.set('fake_auth_active', 'true', {
          path: '/',
          maxAge: 86400, // 24 hours
          secure: false, // Allow HTTP in development
          sameSite: 'lax'
        });

        // Set fake user data in auth store
        const fakeUser = getFakeUser();
        auth.setUser(fakeUser);

        // Create or load profiles from Supabase
        await this.initializeProfiles(fakeUser);

        // For fake auth, don't redirect - let the calling component handle navigation
        // This preserves the auth store state
        console.log("🔧 Fake authentication complete, user state set");

        return { success: true, fake: true, redirect: "/" };
      } else {
        // Real OAuth authentication
        console.log("🚀 Using REAL OAuth authentication");

        // Redirect to OAuth authorization endpoint
        const clientId =
          import.meta.env.VITE_CLIENT_ID || process.env.CLIENT_ID;
        const redirectUri =
          import.meta.env.VITE_REDIRECT_URI ||
          process.env.REDIRECT_URI ||
          `${window.location.origin}/auth/callback`;

        const authUrl = buildAuthorizationUrl(clientId, redirectUri);

        window.location.href = authUrl;

        return { success: true, redirecting: true };
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }

  static async logout() {
    try {
      auth.reset();
      if (isFakeAuthEnabled()) {
        const response = await fetch('/api/auth/fake-logout', { method: 'POST' });
        if (response.ok) {
          console.log("🔧 Fake authentication cleared");
          // Also clear the client-side cookie
          clientCookies.delete('fake_auth_active', { path: '/' });
        } else {
          console.warn("🔧 Failed to clear fake authentication via API");
        }
      } else {
        await fetch('/api/auth/logout', { method: 'POST' });
      }
      
      // Clear profile selection cookie on logout
      clearClientSelectedProfileId();
      
      return { success: true };
    } catch (error) {
      console.error("Error during logout:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: errorMessage };
    }
  }

  static async getCurrentUser() {
    try {
      if (isFakeAuthEnabled()) {
        // Return fake user data for testing
        const fakeUser = getFakeUser();
        return { user: fakeUser, profile: fakeUser };
      } else {
        // Check if we have an access token in cookies
        const token = this.getAccessToken();

        if (!token) {
          return { user: null, profile: null };
        }

        // Fetch user data from the API using the token
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          auth.setUser(userData);
          return { user: userData, profile: userData };
        } else {
          // Token is invalid, clear it
          await this.logout();
          return { user: null, profile: null };
        }
      }
    } catch (error) {
      console.error("Get current user error:", error);
      return { user: null, profile: null };
    }
  }

  static async initializeProfiles(user: User) {
    try {
      console.log("🔧 Initializing profiles for user:", user.username);

      // Get existing profiles from API
      const characterIds = user.character.map((c) => c.id).join(",");
      const response = await fetch(
        `/api/profiles?characterIds=${characterIds}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const { profiles: existingProfiles } = await response.json();
      console.log("🔧 Existing profiles from API:", existingProfiles);

      // Create profiles array with existing data or defaults
      const profiles: CharacterProfile[] = user.character.map((char) => {
        const existingProfile = existingProfiles?.find(
          (p: any) => p.id + "" === char.id + "",
        );

        if (existingProfile) {
          console.log(
            "🔧 Found existing profile for character:",
            char.firstname,
            char.lastname,
          );
          // Return existing profile with is_active flag
          return {
            ...existingProfile,
            is_active: false, // Will be set below
          };
        } else {
          console.log(
            "🔧 Creating new profile for character:",
            char.firstname,
            char.lastname,
          );
          // Create new profile via API
          const newProfile = {
            id: char.id,
            username: `${char.firstname} ${char.lastname}`,
            phone_number: "",
            routing_number: "",
            address: "",
            discord: "",
            is_active: false,
          };

          // Insert via API
          this.createProfile(newProfile);

          return newProfile;
        }
      });

      // Check if we have a previously selected profile (for fake auth)
      if (isFakeAuthEnabled()) {
        // For fake auth, we'll set the active profile based on cookies
        // This will be handled by the layout component
        console.log("🔧 Using fake auth - profile selection will be handled by layout");
      } else {
        // For real auth, profile selection will also be handled by the layout component
        // This ensures consistent behavior across both authentication types
        console.log("Real auth - profile selection will be handled by layout");
      }

      // Store profiles in auth store for easy access
      auth.setProfiles(profiles);
      return profiles;
    } catch (error) {
      console.error("Error initializing profiles:", error);
      throw error;
    }
  }

  static async createProfile(profile: CharacterProfile) {
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create profile");
      }

      return { success: true };
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  }

  static async updateProfile(profile: CharacterProfile) {
    try {
      const response = await fetch("/api/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  static async getProfiles(characterIds: number[]) {
    try {
      const ids = characterIds.join(",");
      const response = await fetch(`/api/profiles?characterIds=${ids}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch profiles");
      }

      const { profiles } = await response.json();
      return profiles || [];
    } catch (error) {
      console.error("Error fetching profiles:", error);
      throw error;
    }
  }

  static getAccessToken(): string | null {
    if (isFakeAuthEnabled()) {
      // Return a fake token for testing
      return "fake_token_for_testing";
    }

    // Get token from cookies
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("access_token="),
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }

  static isAuthenticated(): boolean {
    if (isFakeAuthEnabled()) {
      // Check if we have a fake user in the store
      const currentUser = this.getCurrentUserFromStore();
      return !!currentUser;
    }

    return !!this.getAccessToken();
  }

  // Helper function to get current user from store
  static getCurrentUserFromStore() {
    let currentUser: User | null = null;
    auth.subscribe((state) => {
      currentUser = state.user;
    })();
    return currentUser;
  }

  // New method to check authentication status from server
  static async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: User }> {
    try {
      // Check for fake authentication first - only when actually active
      if (isFakeAuthEnabled()) {
        // For client-side, we need to check the server to see if fake auth is active
        // The server will check the cookies and return the appropriate state
        const response = await fetch('/api/auth/status');
        
        if (response.ok) {
          const text = await response.text();
          if (text) {
            try {
              const data = JSON.parse(text);
              return { isAuthenticated: data.isAuthenticated, user: data.user };
            } catch (parseError) {
              console.error('Failed to parse auth status response:', parseError);
            }
          }
        }
      }
      
      const response = await fetch('/api/auth/status');
      
      if (!response.ok) {
        console.warn('Auth status check failed with status:', response.status);
        return { isAuthenticated: false };
      }
      
      // Check if response has content before parsing
      const text = await response.text();
      if (!text) {
        console.warn('Auth status response is empty');
        return { isAuthenticated: false };
      }
      
      try {
        const data = JSON.parse(text);
        return { isAuthenticated: data.isAuthenticated, user: data.user };
      } catch (parseError) {
        console.error('Failed to parse auth status response:', parseError, 'Response text:', text);
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      return { isAuthenticated: false };
    }
  }
}
