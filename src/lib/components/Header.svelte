<script lang="ts">
  import ThemeToggle from "./ThemeToggle.svelte";
  import ProfileDropdown from "./ProfileDropdown.svelte";
  import { isFakeAuthEnabled } from "../config/testing";
</script>

<header
  class="bg-bg-primary dark:bg-bg-secondary border-b border-border-accent dark:border-border-accent shadow-sm"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Left side - Logo and Title -->
      <div class="flex items-center space-x-3">
        <a href="/" aria-label="Home"><div
          class="w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center shadow-lg"
        >
        <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div></a>
        <a href="/" aria-label="Home"><h1 class="text-2xl font-bold text-gradient">Molly's Touch</h1></a>
        
        <!-- Testing Mode Badge -->
        {#if isFakeAuthEnabled()}
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            TESTING
          </span>
        {/if}
      </div>

      <!-- Right side - Theme Toggle and Profile -->
      <div class="flex items-center space-x-4">
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </div>
  </div>
</header>
