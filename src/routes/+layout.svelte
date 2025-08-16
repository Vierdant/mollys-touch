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
                  // Initialize profiles from API
        const profiles = await AuthService.initializeProfiles(user);
        
        // Profiles are already set in the store by initializeProfiles
        // The active profile is also set in the store
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
