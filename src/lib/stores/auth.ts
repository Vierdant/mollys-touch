import { writable } from "svelte/store";
import type { User, CharacterProfile } from "../services/auth";
import { setClientSelectedProfileId } from "$lib/config/testing";

interface AuthState {
  user: User | null;
  profiles: CharacterProfile[];
  activeProfile: CharacterProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    profiles: [],
    activeProfile: null,
    loading: true,
    isAuthenticated: false,
  });

  return {
    subscribe,
    setUser: (user: User | null) => {
      update((state) => ({
        ...state,
        user,
        loading: false,
        isAuthenticated: !!user,
      }));
    },
    setProfiles: (profiles: CharacterProfile[]) => {
      update((state) => ({ ...state, profiles }));
    },
    setActiveProfile: (profile: CharacterProfile | null) => {
      update((state) => ({ ...state, activeProfile: profile }));
    },

    // New method to switch profiles and persist the selection
    switchProfile: async (profileId: number) => {
      try {
        // Call the API to switch profiles
        const response = await fetch('/api/auth/switch-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileId }),
        });

        if (!response.ok) {
          throw new Error('Failed to switch profile');
        }

        // Find the profile in the current state
        update((state) => {
          const newActiveProfile = state.profiles.find(p => p.id === profileId);
          if (newActiveProfile) {
            // Update the active profile
            return { ...state, activeProfile: newActiveProfile };
          }
          return state;
        });

        // Also set the profile selection in client-side cookies for immediate persistence
        setClientSelectedProfileId(profileId);

        return { success: true };
      } catch (error) {
        console.error('Error switching profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { success: false, error: errorMessage };
      }
    },
    updateProfile: (updatedProfile: CharacterProfile) => {
      update((state) => {
        const updatedProfiles = state.profiles.map((p) =>
          p.id === updatedProfile.id ? updatedProfile : p,
        );

        let newActiveProfile = state.activeProfile;
        if (state.activeProfile?.id === updatedProfile.id) {
          newActiveProfile = updatedProfile;
        }

        return {
          ...state,
          profiles: updatedProfiles,
          activeProfile: newActiveProfile,
        };
      });
    },
    setLoading: (loading: boolean) => {
      update((state) => ({ ...state, loading }));
    },
    setAuthenticated: (isAuthenticated: boolean) => {
      update((state) => ({ ...state, isAuthenticated }));
    },
    reset: () => {
      set({
        user: null,
        profiles: [],
        activeProfile: null,
        loading: false,
        isAuthenticated: false,
      });
    },
  };
}

export const auth = createAuthStore();
