<script lang="ts">
  import { goto } from "$app/navigation";
  import { theme } from "../stores/theme";
  import { auth } from "../stores/auth";
  import { AuthService } from "../services/auth";

  let isOpen = false;



  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function closeDropdown() {
    isOpen = false;
  }

  async function handleLogout() {
    try {
      await AuthService.logout();
      closeDropdown();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  function handleShowLogin() {
    closeDropdown();
    goto("/login");
  }

  function handleShowBookings() {
    closeDropdown();
    // TODO: Navigate to bookings page
    console.log("Show bookings");
  }

  function handleManageProfiles() {
    closeDropdown();
    goto("/profiles");
  }
</script>

<div class="relative w-auto">
  <button
    on:click={toggleDropdown}
    class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-(--color-border-accent) focus:outline-none focus:ring-2 focus:ring-primary-500 whitespace-nowrap"
    class:text-primary-600={$theme === "light"}
    class:text-primary-300={$theme === "dark"}
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      ></path>
    </svg>
    <span class="font-medium">Profile</span>
    <svg
      class="w-4 h-4 transition-transform duration-200 transform-gpu"
      class:rotate-180={isOpen}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  </button>

  {#if isOpen}
    <div
      class="absolute right-0 top-full mt-2 w-48 bg-bg-primary dark:bg-bg-secondary rounded-lg shadow-xl border border-border-accent dark:border-border-accent py-2 z-50 transform-gpu"
    >
      {#if $auth.user}
        <!-- Logged in user -->
        <div
          class="px-4 py-2 border-b border-border-primary dark:border-border-secondary"
        >
          <p
            class="text-sm font-medium text-text-primary dark:text-text-primary"
          >
            {$auth.user.username}
          </p>
          <p class="text-xs text-text-tertiary dark:text-text-tertiary">
            {#if $auth.activeProfile}
              {$auth.activeProfile.phone_number || "No phone set"}
            {:else}
              No active profile
            {/if}
          </p>
        </div>

        <button
          on:click={handleManageProfiles}
          class="w-full text-left px-4 py-2 text-sm text-text-secondary dark:text-text-secondary hover:bg-(--color-border-accent) transition-colors"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span>Manage Profiles</span>
          </div>
        </button>

        <button
          on:click={handleShowBookings}
          class="w-full text-left px-4 py-2 text-sm text-text-secondary dark:text-text-secondary hover:bg-(--color-border-accent) transition-colors"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span>My Bookings</span>
          </div>
        </button>

        <button
          on:click={handleLogout}
          class="w-full text-left px-4 py-2 text-sm text-text-secondary dark:text-text-secondary hover:bg-(--color-border-accent) transition-colors"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            <span>Logout</span>
          </div>
        </button>
      {:else}
        <!-- Not logged in -->
        <button
          on:click={handleShowLogin}
          class="w-full text-left px-4 py-2 text-sm text-text-secondary dark:text-text-secondary hover:bg-(--color-border-accent) transition-colors"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              ></path>
            </svg>
            <span>Sign In</span>
          </div>
        </button>
      {/if}
    </div>
  {/if}
</div>

<!-- Click outside to close -->
<!-- {#if isOpen}
  <div class="fixed inset-0 z-40" on:click={closeDropdown}></div>
{/if} -->
