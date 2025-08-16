<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { onMount } from "svelte";
  import { AuthService } from "$lib/services/auth";
  import { auth } from "$lib/stores/auth";

  let { children } = $props();

  onMount(async () => {
    // Check if user is returning from OAuth callback
    if (AuthService.isAuthenticated()) {
      try {
        // Get user data and set up profiles
        const { user } = await AuthService.getCurrentUser();
        
        if (user) {
          // Initialize profiles from Supabase
          const profiles = await AuthService.initializeProfiles(user);
          
          // Set profiles in the store
          auth.setProfiles(profiles);
          
          // Set active profile
          const activeProfile = profiles.find(p => p.is_active);
          if (activeProfile) {
            auth.setActiveProfile(activeProfile);
          }
        }
      } catch (error) {
        console.error('Failed to complete authentication:', error);
      }
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
