<script lang="ts">
  import { goto } from "$app/navigation";
  import { AuthService } from "../../lib/services/auth";
  import { isFakeAuthEnabled } from "../../lib/config/testing";
    import { onMount } from "svelte";
    import { theme } from "../../lib/stores/theme";
    import { auth } from "../../lib/stores/auth";

  let loading = false;
  let error = "";

  onMount(async () => {  

    if ($auth.isAuthenticated) {
      goto("/");
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme.set(savedTheme as "light" | "dark");
    }
  });

  async function handleSignIn() {
    loading = true;
    error = "";

    try {
      const result = await AuthService.signIn();
      
      // Handle fake authentication result
      if (result.fake && result.redirect) {
        // Use SvelteKit navigation to preserve auth state
        goto(result.redirect);
      }
      // Real OAuth will handle its own redirect
    } catch (err: any) {
      error = err.message || "Sign in failed. Please try again.";
      loading = false;
    }
  }

  function goHome() {
    window.location.href = "/";
  }
</script>

<svelte:head>
  <title>Sign In - Molly's Touch</title>
</svelte:head>

<div
  class="min-h-screen bg-bg-secondary dark:bg-bg-primary flex items-center justify-center p-4"
>
  <div class="max-w-md w-full">
    <!-- Header -->
    <div class="text-center mb-8">
      <button
        on:click={goHome}
        class="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        Back to Home
      </button>
      <h1 class="text-4xl font-bold text-gradient mb-4">Welcome to Molly's Touch</h1>
      <p class="text-text-secondary dark:text-text-secondary">
        Sign in with your GTA World account to access your characters and manage your profiles.
      </p>
    </div>

    <!-- Testing Mode Indicator -->
    {#if isFakeAuthEnabled()}
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-center">
        <div class="flex items-center justify-center space-x-2 mb-2">
          <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <span class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Testing Mode Active</span>
        </div>
        <p class="text-xs text-yellow-700 dark:text-yellow-300">
          Using fake authentication for development. No real OAuth calls will be made.
        </p>
      </div>
    {/if}

    <!-- Sign In Card -->
    <div
      class="bg-bg-primary dark:bg-bg-secondary rounded-2xl shadow-2xl p-8 border border-border-accent dark:border-border-accent text-center"
    >
      <!-- GTA World Logo/Icon -->
      <div class="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          class="w-10 h-10 text-primary-600 dark:text-primary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-text-primary dark:text-text-primary mb-4">
        Sign In with GTA World
      </h2>

      <p class="text-text-secondary dark:text-text-secondary mb-8">
        Connect your GTA World account to access all your characters and manage your profiles.
      </p>

      <!-- Error Display -->
      {#if error}
        <div
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      {/if}

      <!-- Sign In Button -->
      <button
        on:click={handleSignIn}
        disabled={loading}
        class="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {#if loading}
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {isFakeAuthEnabled() ? "Testing..." : "Connecting..."}
        {:else}
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            ></path>
          </svg>
          Sign In with GTA World
        {/if}
      </button>

      <p class="text-xs text-text-tertiary dark:text-text-tertiary mt-4">
        By signing in, you agree to our terms of service and privacy policy.
      </p>
    </div>
  </div>
</div>
