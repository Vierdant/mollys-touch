<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { auth } from "../../lib/stores/auth";
  import { AuthService } from "../../lib/services/auth";
  import type { Character, CharacterProfile } from "../../lib/services/auth";

  let loading = true;
  let saving = false;
  let error = "";
  let success = "";
  let editingProfile: CharacterProfile | null = null;

  onMount(async () => {
    try {
      if (!$auth.user) {
        goto("/login");
        return;
      }

      if ($auth.profiles.length === 0) {
        await AuthService.initializeProfiles($auth.user);
      }
    } catch (err) {
      error = "Failed to load profiles";
      console.error(err);
    } finally {
      loading = false;
    }
  });

  function editProfile(profile: CharacterProfile) {
    editingProfile = { ...profile };
  }

  function cancelEdit() {
    editingProfile = null;
  }

  async function saveProfile() {
    if (!editingProfile) return;

    try {
      saving = true;
      
      // Update profile in Supabase
      await AuthService.updateProfile(editingProfile);
      
      // Update the profile in the store
      auth.updateProfile(editingProfile);
      
      // If this profile is being set as active, deactivate others
      if (editingProfile && editingProfile.is_active) {
        const updatedProfiles = $auth.profiles.map(p => ({
          ...p,
          is_active: p.id === editingProfile!.id
        }));
        
        auth.setProfiles(updatedProfiles);
        auth.setActiveProfile(editingProfile);
      }
      
      success = "Profile updated successfully!";
      editingProfile = null;
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        success = "";
      }, 3000);
    } catch (err) {
      error = "Failed to save profile";
      console.error(err);
    } finally {
      saving = false;
    }
  }

  function goHome() {
    goto("/");
  }
</script>

<svelte:head>
  <title>Manage Profiles - Molly's Touch</title>
</svelte:head>

<div class="min-h-screen bg-bg-secondary dark:bg-bg-primary p-4">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <button
        on:click={goHome}
        class="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors"
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
      
      <h1 class="text-3xl font-bold text-gradient">Manage Profiles</h1>
      
      <div class="w-20"></div> <!-- Spacer for centering -->
    </div>

    {#if loading}
      <!-- Loading State -->
      <div class="text-center py-12">
        <svg
          class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373 0 018 8v4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-text-secondary">Loading your profiles...</p>
      </div>
    {:else}
      <!-- Success/Error Messages -->
      {#if success}
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <p class="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      {/if}

      {#if error}
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      {/if}

      <!-- Profiles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $auth.profiles as profile (profile.id)}
          <div class="bg-bg-primary dark:bg-bg-secondary rounded-xl shadow-lg border border-border-accent dark:border-border-accent overflow-hidden">
            <!-- Profile Header -->
            <div class="p-6 border-b border-border-primary dark:border-border-primary">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-text-primary dark:text-text-primary">
                  {profile.username}
                </h3>
                {#if profile.is_active}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Active
                  </span>
                {/if}
              </div>
              <p class="text-sm text-text-secondary dark:text-text-secondary">
                Character ID: {profile.id}
              </p>
            </div>

            <!-- Profile Content -->
            <div class="p-6">
              {#if editingProfile && editingProfile.id === profile.id}
                <!-- Edit Mode -->
                <div class="space-y-4">
                  <div>
                    <label for="phone_{profile.id}" class="block text-sm font-medium text-text-primary dark:text-text-primary mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone_{profile.id}"
                      type="tel"
                      bind:value={editingProfile.phone_number}
                      class="w-full px-3 py-2 border border-border-primary dark:border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-bg-primary dark:bg-bg-tertiary text-text-primary dark:text-text-primary"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label for="routing_{profile.id}" class="block text-sm font-medium text-text-primary dark:text-text-primary mb-1">
                      Routing Number
                    </label>
                    <input
                      id="routing_{profile.id}"
                      type="tel"
                      bind:value={editingProfile.routing_number}
                      class="w-full px-3 py-2 border border-border-primary dark:border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-bg-primary dark:bg-bg-tertiary text-text-primary dark:text-text-primary"
                      placeholder="Enter routing number"
                    />
                  </div>

                  <div>
                    <label for="address_{profile.id}" class="block text-sm font-medium text-text-primary dark:text-text-primary mb-1">
                      Address
                    </label>
                    <textarea
                      id="address_{profile.id}"
                      bind:value={editingProfile.address}
                      rows="2"
                      class="w-full px-3 py-2 border border-border-primary dark:border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-bg-primary dark:bg-bg-tertiary text-text-primary dark:text-text-primary resize-none"
                      placeholder="Enter address"
                    ></textarea>
                  </div>

                  <div>
                    <label for="discord_{profile.id}" class="block text-sm font-medium text-text-primary dark:text-text-primary mb-1">
                      Discord
                    </label>
                    <input
                      id="discord_{profile.id}"
                      type="text"
                      bind:value={editingProfile.discord}
                      class="w-full px-3 py-2 border border-border-primary dark:border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-bg-primary dark:bg-bg-tertiary text-text-primary dark:text-text-primary"
                      placeholder="Enter Discord username"
                    />
                  </div>

                  <div class="flex items-center">
                    <input
                      id="active_{profile.id}"
                      type="checkbox"
                      bind:checked={editingProfile.is_active}
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-primary rounded"
                    />
                    <label
                      for="active_{profile.id}"
                      class="ml-2 block text-sm text-text-secondary dark:text-text-secondary"
                    >
                      Set as active profile
                    </label>
                  </div>

                  <div class="flex space-x-2">
                    <button
                      on:click={saveProfile}
                      disabled={saving}
                      class="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      on:click={cancelEdit}
                      class="flex-1 bg-bg-tertiary dark:bg-bg-secondary hover:bg-bg-accent dark:hover:bg-bg-tertiary text-text-primary dark:text-text-primary font-medium py-2 px-4 rounded-lg transition-colors border border-border-primary dark:border-border-primary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              {:else}
                <!-- View Mode -->
                <div class="space-y-3">
                  <div>
                    <span class="text-sm font-medium text-text-secondary dark:text-text-secondary">Phone:</span>
                    <p class="text-text-primary dark:text-text-primary">
                      {profile.phone_number || "Not set"}
                    </p>
                  </div>

                  <div>
                    <span class="text-sm font-medium text-text-secondary dark:text-text-secondary">Routing:</span>
                    <p class="text-text-primary dark:text-text-primary">
                      {profile.routing_number || "Not set"}
                    </p>
                  </div>

                  <div>
                    <span class="text-sm font-medium text-text-secondary dark:text-text-secondary">Address:</span>
                    <p class="text-text-primary dark:text-text-primary">
                      {profile.address || "Not set"}
                    </p>
                  </div>

                  <div>
                    <span class="text-sm font-medium text-text-secondary dark:text-text-secondary">Discord:</span>
                    <p class="text-text-primary dark:text-text-primary">
                      {profile.discord || "Not set"}
                    </p>
                  </div>

                  <button
                    on:click={() => editProfile(profile)}
                    class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <!-- No Profiles Message -->
      {#if $auth.profiles.length === 0}
        <div class="text-center py-12">
          <p class="text-text-secondary dark:text-text-secondary">
            No characters found. Please sign in with your GTA World account.
          </p>
        </div>
      {/if}
    {/if}
  </div>
</div>
