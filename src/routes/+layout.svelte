<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { onMount } from "svelte";
  import { AuthService } from "$lib/services/auth";
  import { auth } from "$lib/stores/auth";
  import { isFakeAuthEnabled, isFakeAuthActiveClient, getFakeAuthState, getClientSelectedProfileId, setClientSelectedProfileId } from "$lib/config/testing";

  let { children } = $props();

  onMount(async () => {
    try {

      console.log(isFakeAuthEnabled(), isFakeAuthActiveClient());
      // Check if we're using fake authentication and it's active
      if (isFakeAuthEnabled() && isFakeAuthActiveClient()) {
        console.log("🔧 Using fake authentication in layout");
        const fakeAuthState = getFakeAuthState();
        auth.setUser(fakeAuthState.user);
        
        try {
          // Initialize profiles from API even in fake mode
          if (fakeAuthState.user) {
            const profiles = await AuthService.initializeProfiles(fakeAuthState.user);
            console.log("🔧 Fake auth profiles initialized:", profiles);
            
            // Set the active profile based on cookies or default to first
            const selectedProfileId = getClientSelectedProfileId();
            console.log("🔧 Selected profile ID:", selectedProfileId);
            let activeProfile = null;
            
            if (selectedProfileId) {
              // Find the profile that was previously selected
              activeProfile = profiles.find(p => p.id + "" === selectedProfileId + "");
              console.log("🔧 Restored previously selected profile:", activeProfile?.username);
            }
            
            // If no previously selected profile, use the first one and save it
            if (!activeProfile && profiles.length > 0) {
              activeProfile = profiles[0];
              setClientSelectedProfileId(activeProfile.id);
              console.log("🔧 Set default profile as active:", activeProfile.username);
            }
            
            // Set the active profile in the store
            if (activeProfile) {
              auth.setActiveProfile(activeProfile);
              console.log("🔧 Active profile set:", activeProfile.username);
            }
          }
          
        } catch (profileError) {
          console.error("Failed to initialize fake auth profiles:", profileError);
          // Don't fail the entire auth process if profiles fail
        }
        
        auth.setLoading(false);
        return;
      }
      
      // Check authentication status from server for real auth
      const { isAuthenticated, user } = await AuthService.checkAuthStatus();
      
      if (isAuthenticated && user) {
        // Set user in auth store
        auth.setUser(user);
        
        try {
          // Initialize profiles from API
          const profiles = await AuthService.initializeProfiles(user);
          
          // Set the active profile based on cookies or default to first
          const selectedProfileId = getClientSelectedProfileId();
          let activeProfile = null;
          
          if (selectedProfileId) {
            // Find the profile that was previously selected
            activeProfile = profiles.find(p => p.id + "" === selectedProfileId + "");
            console.log("Restored previously selected profile:", activeProfile?.username);
          }
          
          // If no previously selected profile, use the first one and save it
          if (!activeProfile && profiles.length > 0) {
            activeProfile = profiles[0];
            setClientSelectedProfileId(activeProfile.id);
            console.log("Set default profile as active:", activeProfile.username);
          }
          
          // Set the active profile in the store
          if (activeProfile) {
            auth.setActiveProfile(activeProfile);
            console.log("Active profile set:", activeProfile.username);
          }
          
        } catch (profileError) {
          console.error("Failed to initialize profiles:", profileError);
          // Don't fail the entire auth process if profiles fail
        }
      } else {
        // User is not authenticated, ensure store is in correct state
        auth.setLoading(false);
      }
    } catch (error) {
      console.error("Failed to check authentication status:", error);
      // Set loading to false and continue with unauthenticated state
      auth.setLoading(false);
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
