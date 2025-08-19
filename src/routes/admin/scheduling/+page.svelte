<script lang="ts">
  import { onMount } from "svelte";
  import Header from "../../../lib/components/Header.svelte";
  import { theme } from "../../../lib/stores/theme";
  import { auth } from "../../../lib/stores/auth";
  import { goto } from "$app/navigation";
  import {
    BLACKLISTED_TIMES,
    BLACKLISTED_DATES,
    BLACKLISTED_TIME_RANGES,
    type BlacklistedTime,
    type BlacklistedDate,
    type BlacklistedTimeRange,
  } from "../../../lib/config/scheduling";

  // Loading and admin state
  let isLoading = true;
  let isAdmin = false;
  let adminCheckComplete = false;

  // Local state for editing
  let blacklistedTimes: BlacklistedTime[] = [...BLACKLISTED_TIMES];
  let blacklistedDates: BlacklistedDate[] = [...BLACKLISTED_DATES];
  let blacklistedTimeRanges: BlacklistedTimeRange[] = [
    ...BLACKLISTED_TIME_RANGES,
  ];

  // Form state
  let newTime: BlacklistedTime = { hour: 0, reason: "" };
  let newDate: BlacklistedDate = { month: 1, day: 1, reason: "" };
  let newTimeRange: BlacklistedTimeRange = {
    startHour: 0,
    endHour: 0,
    reason: "",
  };

  onMount(() => {
    // Check if user is admin (you can customize this logic)
    // Show loading state for 2 seconds before checking admin status
    setTimeout(() => {
      if (!$auth.activeProfile?.is_admin) {
        console.log("🔧 Not admin, redirecting to home");
        isAdmin = false;
        adminCheckComplete = true;
        isLoading = false;
        goto("/");
        return;
      }
      
      // User is admin
      isAdmin = true;
      adminCheckComplete = true;
      isLoading = false;
      console.log("🔧 Admin check complete, user is admin");
    }, 2000);

    // Apply theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme.set(savedTheme as "light" | "dark");
    }
  });

  // Time management functions
  function addBlacklistedTime() {
    if (newTime.hour >= 0 && newTime.hour <= 23) {
      blacklistedTimes = [...blacklistedTimes, { ...newTime }];
      newTime = { hour: 0, reason: "" };
    }
  }

  function removeBlacklistedTime(index: number) {
    blacklistedTimes = blacklistedTimes.filter((_, i) => i !== index);
  }

  // Date management functions
  function addBlacklistedDate() {
    if (
      newDate.month >= 1 &&
      newDate.month <= 12 &&
      newDate.day >= 1 &&
      newDate.day <= 31
    ) {
      blacklistedDates = [...blacklistedDates, { ...newDate }];
      newDate = { month: 1, day: 1, reason: "" };
    }
  }

  function removeBlacklistedDate(index: number) {
    blacklistedDates = blacklistedDates.filter((_, i) => i !== index);
  }

  // Time range management functions
  function addBlacklistedTimeRange() {
    if (
      newTimeRange.startHour >= 0 &&
      newTimeRange.startHour <= 23 &&
      newTimeRange.endHour >= 0 &&
      newTimeRange.endHour <= 23
    ) {
      blacklistedTimeRanges = [...blacklistedTimeRanges, { ...newTimeRange }];
      newTimeRange = { startHour: 0, endHour: 0, reason: "" };
    }
  }

  function removeBlacklistedTimeRange(index: number) {
    blacklistedTimeRanges = blacklistedTimeRanges.filter((_, i) => i !== index);
  }

  // Save configuration (in a real app, this would save to database)
  function saveConfiguration() {
    // Here you would typically save to your database
    console.log("Saving configuration:", {
      blacklistedTimes,
      blacklistedDates,
      blacklistedTimeRanges,
    });

    // For now, just show a success message
    alert(
      "Configuration saved! (Note: This is just a demo - changes will reset on page reload)",
    );
  }

  // Helper functions
  function getMonthName(month: number): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1];
  }

  function formatTime(hour: number): string {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }
</script>

<svelte:head>
  <title>Admin - Scheduling Configuration - Molly's Touch</title>
</svelte:head>

<div class="min-h-screen bg-bg-secondary dark:bg-bg-primary">
  <Header />

  <!-- Loading State -->
  {#if isLoading}
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          Checking Admin Access...
        </h2>
        <p class="text-text-secondary dark:text-text-secondary">
          Verifying your permissions to access the scheduling configuration.
        </p>
      </div>
    </section>
  {:else if !isAdmin && adminCheckComplete}
    <!-- Access Denied State -->
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <div class="text-red-500 text-6xl mb-6">🚫</div>
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          Access Denied
        </h2>
        <p class="text-text-secondary dark:text-text-secondary mb-6">
          You don't have permission to access this page. Redirecting to home...
        </p>
        <div class="animate-pulse text-sm text-text-secondary dark:text-text-secondary">
          Redirecting...
        </div>
      </div>
    </section>
  {:else if isAdmin && adminCheckComplete}
    <!-- Admin Content -->
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <h1
            class="text-4xl font-bold text-text-primary dark:text-text-primary mb-4"
          >
            Scheduling Configuration
          </h1>
          <p class="text-lg text-text-secondary dark:text-text-secondary">
            Manage blacklisted dates and times for booking restrictions
          </p>
        </div>

      <!-- Blacklisted Times Section -->
      <div
        class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent mb-8"
      >
        <h2
          class="text-2xl font-bold text-text-primary dark:text-text-primary mb-6"
        >
          Blacklisted Time Slots
        </h2>

        <!-- Add New Time -->
        <div class="flex gap-4 mb-6">
          <div class="flex-1">
            <label
              class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
            >
              Hour (0-23)
            </label>
            <input
              type="number"
              min="0"
              max="23"
              bind:value={newTime.hour}
              class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary"
            />
          </div>
          <div class="flex-1">
            <label
              class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
            >
              Reason
            </label>
            <input
              type="text"
              bind:value={newTime.reason}
              placeholder="e.g., Dinner time"
              class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary"
            />
          </div>
          <div class="flex items-end">
            <button
              on:click={addBlacklistedTime}
              class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Add Time
            </button>
          </div>
        </div>

        <!-- Current Blacklisted Times -->
        <div class="space-y-3">
          {#each blacklistedTimes as time, index (index)}
            <div
              class="flex items-center justify-between p-3 bg-bg-secondary dark:bg-bg-primary rounded-lg border border-border-primary dark:border-border-secondary"
            >
              <div>
                <span
                  class="font-medium text-text-primary dark:text-text-primary"
                >
                  {formatTime(time.hour)}
                </span>
                {#if time.reason}
                  <span
                    class="text-sm text-text-secondary dark:text-text-secondary ml-2"
                  >
                    ({time.reason})
                  </span>
                {/if}
              </div>
              <button
                on:click={() => removeBlacklistedTime(index)}
                class="text-red-600 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          {/each}
        </div>
      </div>

      <!-- Blacklisted Dates Section -->
      <div
        class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent mb-8"
      >
        <h2
          class="text-2xl font-bold text-text-primary dark:text-text-primary mb-6"
        >
          Blacklisted Specific Dates
        </h2>

        <!-- Add New Date -->
        <div class="flex gap-4 mb-6">
          <div class="flex-1">
            <label
              class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
            >
              Month
            </label>
            <select
              bind:value={newDate.month}
              class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary"
            >
              {#each Array.from({ length: 12 }, (_, i) => i + 1) as month}
                <option value={month}>{getMonthName(month)}</option>
              {/each}
            </select>
          </div>
          <div class="flex-1">
            <label
              class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
            >
              Day
            </label>
            <input
              type="number"
              min="1"
              max="31"
              bind:value={newDate.day}
              class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary"
            />
          </div>
          <div class="flex-1">
            <label
              class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
            >
              Reason
            </label>
            <input
              type="text"
              bind:value={newDate.reason}
              placeholder="e.g., Holiday"
              class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary"
            />
          </div>
          <div class="flex items-end">
            <button
              on:click={addBlacklistedDate}
              class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Add Date
            </button>
          </div>
        </div>

        <!-- Current Blacklisted Dates -->
        <div class="space-y-3">
          {#each blacklistedDates as date, index (index)}
            <div
              class="flex items-center justify-between p-3 bg-bg-secondary dark:bg-bg-primary rounded-lg border border-border-primary dark:border-border-secondary"
            >
              <div>
                <span
                  class="font-medium text-text-primary dark:text-text-primary"
                >
                  {getMonthName(date.month)}
                  {date.day}
                </span>
                {#if date.reason}
                  <span
                    class="text-sm text-text-secondary dark:text-text-secondary ml-2"
                  >
                    ({date.reason})
                  </span>
                {/if}
              </div>
              <button
                on:click={() => removeBlacklistedDate(index)}
                class="text-red-600 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          {/each}
        </div>
      </div>

      <!-- Blacklisted Time Ranges Section -->
      <div
        class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent mb-8"
      >
        <h2
          class="text-2xl font-bold text-text-primary dark:text-text-primary mb-6"
        >
          Blacklisted Time Ranges
        </h2>

        <!-- Add New Time Range -->
        <div class="flex gap-4 mb-6">
          <div class="flex-1">
            <label
              class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
            >
              Start Hour (0-23)
            </label>
            <input
              type="number"
              min="0"
              max="23"
              bind:value={newTimeRange.startHour}
              class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary"
            />
          </div>
          <div class="flex-1">
            <label
              class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
            >
              End Hour (0-23)
            </label>
            <input
              type="number"
              min="0"
              max="23"
              bind:value={newTimeRange.endHour}
              class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary"
            />
          </div>
          <div class="flex-1">
            <label
              class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
            >
              Reason
            </label>
            <input
              type="text"
              bind:value={newTimeRange.reason}
              placeholder="e.g., After hours"
              class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary"
            />
          </div>
          <div class="flex items-end">
            <button
              on:click={addBlacklistedTimeRange}
              class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Add Range
            </button>
          </div>
        </div>

        <!-- Current Blacklisted Time Ranges -->
        <div class="space-y-3">
          {#each blacklistedTimeRanges as range, index (index)}
            <div
              class="flex items-center justify-between p-3 bg-bg-secondary dark:bg-bg-primary rounded-lg border border-border-primary dark:border-border-secondary"
            >
              <div>
                <span
                  class="font-medium text-text-primary dark:text-text-primary"
                >
                  {formatTime(range.startHour)} - {formatTime(range.endHour)}
                </span>
                {#if range.reason}
                  <span
                    class="text-sm text-text-secondary dark:text-text-secondary ml-2"
                  >
                    ({range.reason})
                  </span>
                {/if}
              </div>
              <button
                on:click={() => removeBlacklistedTimeRange(index)}
                class="text-red-600 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          {/each}
        </div>
      </div>

      <!-- Save Button -->
      <div class="text-center">
        <button
          on:click={saveConfiguration}
          class="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
        >
          Save Configuration
        </button>
      </div>
    </div>
  </section>
  {/if}
</div>
