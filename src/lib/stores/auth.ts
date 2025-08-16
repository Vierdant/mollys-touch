import { writable } from "svelte/store";
import type { User, CharacterProfile } from "../services/auth";

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
        isAuthenticated: !!user 
      }));
    },
    setProfiles: (profiles: CharacterProfile[]) => {
      update((state) => ({ ...state, profiles }));
    },
    setActiveProfile: (profile: CharacterProfile | null) => {
      update((state) => ({ ...state, activeProfile: profile }));
    },
    updateProfile: (updatedProfile: CharacterProfile) => {
      update((state) => {
        const updatedProfiles = state.profiles.map(p => 
          p.id === updatedProfile.id ? updatedProfile : p
        );
        
        let newActiveProfile = state.activeProfile;
        if (state.activeProfile?.id === updatedProfile.id) {
          newActiveProfile = updatedProfile;
        }
        
        return { 
          ...state, 
          profiles: updatedProfiles,
          activeProfile: newActiveProfile
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
      set({ user: null, profiles: [], activeProfile: null, loading: false, isAuthenticated: false });
    },
  };
}

export const auth = createAuthStore();
