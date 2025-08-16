import { auth } from "../stores/auth";
import { buildAuthorizationUrl } from "../config/oauth";
import { isFakeAuthEnabled, getFakeUser } from "../config/testing";
import { supabase } from "../supabase";

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
}

export class AuthService {
  static async signIn() {
    try {
      if (isFakeAuthEnabled()) {
        // Fake authentication for testing
        console.log("🔧 Using FAKE authentication for testing");
        
        // Simulate a delay to mimic real authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set fake user data
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
        const clientId = import.meta.env.VITE_CLIENT_ID || process.env.CLIENT_ID;
        const redirectUri = import.meta.env.VITE_REDIRECT_URI || process.env.REDIRECT_URI || `${window.location.origin}/auth/callback`;
        
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
      // Clear auth store and local storage
      auth.reset();
      
      // Clear any stored tokens
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
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
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          auth.setUser(userData);
          return { user: userData, profile: userData };
        } else {
          // Token is invalid, clear it
          this.logout();
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
      
      // Get existing profiles from Supabase
      const { data: existingProfiles, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', user.character.map(c => c.id));

      if (fetchError) {
        console.error('Error fetching profiles:', fetchError);
        throw fetchError;
      }

      console.log("🔧 Existing profiles from Supabase:", existingProfiles);

      // Create profiles array with existing data or defaults
      const profiles: CharacterProfile[] = user.character.map(char => {
        const existingProfile = existingProfiles?.find(p => p.id + "" === char.id + "");
        
        if (existingProfile) {
          console.log("🔧 Found existing profile for character:", char.firstname, char.lastname);
          // Return existing profile with is_active flag
          return {
            ...existingProfile,
            is_active: false // Will be set below
          };
        } else {
          console.log("🔧 Creating new profile for character:", char.firstname, char.lastname);
          // Create new profile in Supabase
          const newProfile = {
            id: char.id,
            username: `${char.firstname} ${char.lastname}`,
            phone_number: '',
            routing_number: '',
            address: '',
            discord: '',
            is_active: false
          };

          // Insert into Supabase
          this.createProfile(newProfile);
          
          return newProfile;
        }
      });

      // Set first character as active by default
      if (profiles.length > 0) {
        profiles[0].is_active = true;
        auth.setActiveProfile(profiles[0]);
      }

      // Store profiles in auth store for easy access
      auth.setProfiles(profiles);
      return profiles;
    } catch (error) {
      console.error('Error initializing profiles:', error);
      throw error;
    }
  }

  static async createProfile(profile: CharacterProfile) {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: profile.id,
          username: profile.username,
          phone_number: profile.phone_number || '',
          routing_number: profile.routing_number || '',
          address: profile.address || '',
          discord: profile.discord || ''
        });

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  static async updateProfile(profile: CharacterProfile) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          phone_number: profile.phone_number || '',
          routing_number: profile.routing_number || '',
          address: profile.address || '',
          discord: profile.discord || ''
        })
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static async getProfiles(characterIds: number[]) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', characterIds);

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  }

  static getAccessToken(): string | null {
    if (isFakeAuthEnabled()) {
      // Return a fake token for testing
      return "fake_token_for_testing";
    }
    
    // Get token from cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
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
    auth.subscribe(state => {
      currentUser = state.user;
    })();
    return currentUser;
  }
}
