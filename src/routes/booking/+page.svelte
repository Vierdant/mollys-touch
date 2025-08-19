<script lang="ts">
  import { onMount } from "svelte";
  import Header from "../../lib/components/Header.svelte";
  import { theme } from "../../lib/stores/theme";
  import { auth } from "../../lib/stores/auth";
  import { AuthService } from "../../lib/services/auth";
  import { 
    getAvailableDates, 
    formatDateForDisplay, 
    formatDateForInput, 
    getRelativeDateDescription,
    isDateTimeInPast,
    isToday,
    getCurrentUTCHour
  } from "../../lib/utils/datetime";
  import { 
    isDateBlacklisted, 
    isHourBlacklisted, 
    getAvailableHours,
    getHourBlacklistReason,
    getDateBlacklistReason
  } from "../../lib/config/scheduling";

  // Package data with features and pricing
  const packages = {
    silver: {
      name: "Silver",
      subtitle: "The Essentials",
      price: 10000,
      icon: "/rank-silver.webp",
      features: [
        "15 minutes Swedish or Deep Tissue massage",
        "Basic aromatherapy",
        "Travel to any location within Los Santos",
      ],
      duration: 15,
      massageTypes: ["Swedish", "Deep Tissue"],
      includes: ["Basic aromatherapy", "Travel included"],
    },
    gold: {
      name: "Gold",
      subtitle: "Signature Touch",
      price: 15000,
      icon: "/rank-gold.webp",
      features: [
        "30 minutes massage (choice of style)",
        "Hot stones or aromatherapy included",
        "Complimentary head & neck relaxation",
        "Choice of calming music playlist",
      ],
      duration: 30,
      massageTypes: ["Swedish", "Deep Tissue", "Hot Stone", "Aromatherapy"],
      includes: [
        "Hot stones or aromatherapy",
        "Head & neck relaxation",
        "Music selection",
      ],
    },
    platinum: {
      name: "Platinum",
      subtitle: "Vinewood Indulgence",
      price: 30000,
      icon: "/rank-platinum.webp",
      features: [
        "30-60 minutes massage (mix & match styles)",
        "Hot stone + aromatherapy combo",
        "Luxury facial or foot soak",
        "Mini styling session (hair or makeup touch-up)",
        "Free gift bag of spa goodies",
      ],
      duration: 60,
      massageTypes: [
        "Swedish",
        "Deep Tissue",
        "Hot Stone",
        "Aromatherapy",
        "Luxury",
      ],
      includes: [
        "Hot stone + aromatherapy combo",
        "Facial or foot soak",
        "Styling session",
        "Gift bag",
      ],
    },
  };

  // Add-ons with pricing and time additions
  const addOns = [
    {
      id: "extra-30",
      name: "Extra 30 minutes",
      price: 8000,
      description: "Extend your session",
      timeAdded: 30,
    },
    {
      id: "facial",
      name: "Full facial treatment",
      price: 12000,
      description: "Complete facial care",
      timeAdded: 15,
    },
    {
      id: "hair-styling",
      name: "Hair blowout / styling",
      price: 10000,
      description: "Professional hair styling",
      timeAdded: 15,
    },
    {
      id: "makeover",
      name: "Pre-party makeover",
      price: 15000,
      description: "Full glam transformation",
      timeAdded: 15,
    },
    {
      id: "stretching",
      name: "Wellness stretching session",
      price: 6000,
      description: "Flexibility & wellness",
      timeAdded: 15,
    },
    {
      id: "shopping",
      name: "Personal shopping delivery",
      price: 20000,
      description: "Curated shopping service",
      timeAdded: 0, // No additional session time
    },
  ];

  // Reactive state
  let selectedPackage: keyof typeof packages = "gold";
  let selectedDuration = 30;
  let selectedMassageType = "Swedish";
  let selectedAddOns: string[] = [];
  let userInfo = {
    name: "",
    phone: "",
    address: "",
    routingNumber: "",
  };

  // Scheduling state
  let selectedDate: Date | null = null;
  let selectedTime: string | null = null; // Changed to string for specific times
  let availableDates: Date[] = [];
  let availableTimes: string[] = []; // Changed to string array
  let showDatePicker = false;
  let showTimePicker = false;
  let showSchedulingInfo = false; // For scheduling info dropdown
  let use24HourFormat = true; // Toggle between 24-hour and 12-hour display

  // Get package from URL parameter
  let urlParams: URLSearchParams;
  let packageFromUrl: string | null = null;

  // Computed values
  $: basePrice = packages[selectedPackage].price;
  $: durationMultiplier = selectedDuration / packages[selectedPackage].duration;
  $: adjustedBasePrice = Math.round(basePrice * durationMultiplier);
  $: addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find((a) => a.id === addOnId);
    return total + (addOn ? addOn.price : 0);
  }, 0);
  $: totalPrice = adjustedBasePrice + addOnsTotal;
  $: isScheduleValid = selectedDate !== null && selectedTime !== null;
  
  // Calculate total session duration including add-ons
  $: totalSessionDuration = packages[selectedPackage].duration + selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find((a) => a.id === addOnId);
    return total + (addOn ? addOn.timeAdded : 0);
  }, 0);
  
  // Check if all required user information fields are filled
  $: isUserInfoValid = userInfo.name.trim() !== '' && 
                       userInfo.phone.trim() !== '' && 
                       userInfo.address.trim() !== '' && 
                       userInfo.routingNumber.trim() !== '';
  
  // Overall booking validation - requires schedule AND user info
  $: isBookingValid = isScheduleValid && isUserInfoValid;

  // Update duration options when package changes
  $: if (packages[selectedPackage]) {
    selectedDuration = packages[selectedPackage].duration;
    selectedMassageType = packages[selectedPackage].massageTypes[0];
  }

  // Get available durations for selected package
  $: availableDurations = [
    packages[selectedPackage].duration,
    packages[selectedPackage].duration * 1.5,
    packages[selectedPackage].duration * 2,
    packages[selectedPackage].duration * 2.5,
    packages[selectedPackage].duration * 3,
  ].map((d) => Math.round(d));

  // Auto-fill user info if logged in
  $: if ($auth.user && $auth.activeProfile) {
    userInfo.name = $auth.activeProfile.username || "";
    userInfo.phone = $auth.activeProfile.phone_number || "";
    userInfo.address = $auth.activeProfile.address || "";
    userInfo.routingNumber = $auth.activeProfile.routing_number || "";
  }

  // Update available times when date changes
  $: if (selectedDate) {
    const availableHours = getAvailableHours(selectedDate).filter(hour => {
      if (isToday(selectedDate!)) {
        // For today, only show times that are at least 1 hour in the future
        const currentHour = getCurrentUTCHour();
        return hour > currentHour + 1;
      } else {
        // For future dates, show all available hours
        return !isHourBlacklisted(hour);
      }
    });
    
    // Generate 15-minute intervals for each available hour
    availableTimes = availableHours.flatMap(hour => [
      `${hour.toString().padStart(2, '0')}:00`,
      `${hour.toString().padStart(2, '0')}:15`,
      `${hour.toString().padStart(2, '0')}:30`,
      `${hour.toString().padStart(2, '0')}:45`
    ]);
  }

  // Scheduling functions
  function selectDate(date: Date) {
    selectedDate = date;
    selectedTime = null; // Reset time when date changes
    showDatePicker = false;
  }

  function selectTime(time: string) {
    selectedTime = time;
    showTimePicker = false;
  }

  function toggleDatePicker() {
    showDatePicker = !showDatePicker;
    if (showDatePicker) showTimePicker = false;
  }

  function toggleTimePicker() {
    showTimePicker = !showTimePicker;
    if (showTimePicker) showDatePicker = false;
  }

  function isDateSelectable(date: Date): boolean {
    return !isDateBlacklisted(date.getUTCMonth() + 1, date.getUTCDate());
  }

  function isTimeSelectable(time: string): boolean {
    if (!selectedDate) return false;
    const hour = parseInt(time.split(':')[0]);
    
    if (isToday(selectedDate)) {
      // For today, only allow times that are at least 1 hour in the future
      const currentHour = getCurrentUTCHour();
      return !isHourBlacklisted(hour) && hour > currentHour + 1;
    } else {
      // For future dates, just check blacklist
      return !isHourBlacklisted(hour);
    }
  }

  // Format time for display based on selected format
  function formatTimeForDisplay(time: string): string {
    if (use24HourFormat) {
      return time;
    } else {
      // Convert 24-hour to 12-hour format
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
      return `${displayHour}:${minute} ${period}`;
    }
  }

  // Close pickers when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Don't close if clicking on the toggle buttons
    if (target.closest('.date-toggle') || target.closest('.time-toggle')) {
      return;
    }
    
    // Don't close if clicking inside the picker dropdowns
    if (target.closest('.date-picker') || target.closest('.time-picker')) {
      return;
    }
    
    // Close both pickers if clicking outside
    showDatePicker = false;
    showTimePicker = false;
  }

  onMount(() => {
    // Apply theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme.set(savedTheme as "light" | "dark");
    }

    // Get package from URL parameter
    if (typeof window !== 'undefined') {
      urlParams = new URLSearchParams(window.location.search);
      packageFromUrl = urlParams.get("package");
      
      // Set selected package if valid
      if (packageFromUrl && packages[packageFromUrl as keyof typeof packages]) {
        selectedPackage = packageFromUrl as keyof typeof packages;
        selectedDuration = packages[selectedPackage].duration;
        selectedMassageType = packages[selectedPackage].massageTypes[0];
      }
    }

    // Get current user on mount
    AuthService.getCurrentUser();

    // Initialize available dates
    availableDates = getAvailableDates(60); // Show next 60 days

    // Add click outside handler
    // document.addEventListener('click', handleClickOutside);

    // Cleanup on unmount
    return () => {
      // document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<svelte:head>
  <title>Book Your Session - Molly's Touch</title>
</svelte:head>

<div class="min-h-screen bg-bg-secondary dark:bg-bg-primary">
  <Header />

  <!-- Main Booking Section -->
  <section class="py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1
          class="text-4xl font-bold text-text-primary dark:text-text-primary mb-4"
        >
          Book Your Session
        </h1>
        <p
          class="text-xl text-text-secondary dark:text-text-secondary max-w-2xl mx-auto"
        >
          Customize your perfect experience and secure your booking
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-8 justify-between">
        <!-- Left Panel - Package Selection & Customization -->
        <div class="flex-1 space-y-12">
          <!-- Package Selection -->
          <div
            class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent"
          >
            <h2
              class="text-2xl font-bold text-text-primary dark:text-text-primary mb-6"
            >
              Choose Your Package
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              {#each Object.entries(packages) as [key, pkg]}
                <button
                  on:click={() =>
                    (selectedPackage = key as keyof typeof packages)}
                  class="relative p-4 rounded-xl border-2 transition-all duration-200 text-left {selectedPackage ===
                  key
                    ? 'border-primary-500 bg-bg-secondary dark:bg-primary-900/20'
                    : 'border-border-primary dark:border-border-secondary hover:border-primary-300 dark:hover:border-primary-600'}"
                >
                  <div class="flex items-center space-x-3 mb-3">
                    <img src={pkg.icon} alt={pkg.name} class="w-8 h-8" />
                    <div>
                      <h3
                        class="font-bold text-text-primary dark:text-text-primary"
                      >
                        {pkg.name}
                      </h3>
                      <p
                        class="text-sm text-text-secondary dark:text-text-secondary"
                      >
                        {pkg.subtitle}
                      </p>
                    </div>
                  </div>
                  <div
                    class="text-lg font-bold text-primary-600 dark:text-primary-400"
                  >
                    ${pkg.price.toLocaleString()}
                  </div>
                  {#if selectedPackage === key}
                    <div
                      class="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center"
                    >
                      <svg
                        class="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <!-- User Information Form (Compact) -->
          <div
            class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent"
          >
                         <h2
               class="text-2xl font-bold text-text-primary dark:text-text-primary mb-4"
             >
               {#if $auth.user && $auth.activeProfile}
                 Confirm Your Information
               {:else}
                 Your Information
               {/if}
             </h2>
             
             <p class="text-sm text-text-secondary dark:text-text-secondary mb-4">
               <span class="text-red-500">*</span> Required fields must be completed before booking
             </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <!-- Name -->
               <div>
                 <label
                   for="user-name"
                   class="block text-sm font-medium text-text-primary dark:text-text-primary mb-1"
                 >
                   Full Name <span class="text-red-500">*</span>
                 </label>
                <input
                  id="user-name"
                  type="text"
                  bind:value={userInfo.name}
                  placeholder="Enter your full name"
                  class="w-full p-2 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>

              <!-- Phone -->
               <div>
                 <label
                   for="user-phone"
                   class="block text-sm font-medium text-text-primary dark:text-text-primary mb-1"
                 >
                   Phone Number <span class="text-red-500">*</span>
                 </label>
                <input
                  id="user-phone"
                  type="tel"
                  bind:value={userInfo.phone}
                  placeholder="Enter your phone number"
                  class="w-full p-2 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>

                             <!-- Address -->
               <div class="md:col-span-2">
                 <label
                   for="user-address"
                   class="block text-sm font-medium text-text-primary dark:text-text-primary mb-1"
                 >
                   Address <span class="text-red-500">*</span>
                 </label>
                <input
                  id="user-address"
                  type="text"
                  bind:value={userInfo.address}
                  placeholder="Enter your full address"
                  class="w-full p-2 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>

                             <!-- Routing Number -->
               <div>
                 <label 
                   for="user-routing"
                   class="block text-sm font-medium text-text-primary mb-1"
                 >
                   Routing Number <span class="text-red-500">*</span>
                 </label>
                <input
                  id="user-routing"
                  type="text"
                  bind:value={userInfo.routingNumber}
                  placeholder="8-9 digit routing number"
                  maxlength="9"
                  class="w-full p-2 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {#if $auth.user && $auth.activeProfile}
              <div
                class="mt-4 p-3 bg-bg-secondary dark:bg-bg-primary rounded-lg border border-primary-200 dark:border-primary-800"
              >
                <p class="text-xs text-text-secondary">
                  Your information has been auto-filled from your profile.
                </p>
              </div>
            {/if}
          </div>



          <!-- Add-Ons Menu -->
          <div
            class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent"
          >
            <h2
              class="text-2xl font-bold text-text-primary dark:text-text-primary mb-6"
            >
              Enhance Your Experience
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each addOns as addOn}
                <label
                  class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-border-primary dark:border-border-secondary hover:bg-bg-accent dark:hover:bg-bg-tertiary transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addOn.id)}
                    on:change={(e) => {
                      if (e.currentTarget.checked) {
                        selectedAddOns = [...selectedAddOns, addOn.id];
                      } else {
                        selectedAddOns = selectedAddOns.filter(
                          (id) => id !== addOn.id,
                        );
                      }
                    }}
                    class="w-4 h-4 text-primary-600 rounded border-border-primary focus:ring-primary-500 mt-1"
                  />
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <span
                        class="font-medium text-text-primary dark:text-text-primary"
                      >
                        {addOn.name}
                      </span>
                      <span
                        class="font-bold text-primary-600 dark:text-primary-400"
                      >
                        ${addOn.price.toLocaleString()}
                      </span>
                    </div>
                    <p
                      class="text-sm text-text-secondary dark:text-text-secondary mt-1"
                    >
                      {addOn.description}
                    </p>
                  </div>
                </label>
              {/each}
            </div>
          </div>
        </div>

        <!-- Right Panel - Order Summary -->
        <div class="w-full md:w-100 space-y-12">

          <!-- Schedule Form -->
          <div
            class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent"
          >
            <h2
              class="text-2xl font-bold text-text-primary dark:text-text-primary mb-6"
            >
              Schedule Your Session
            </h2>

            <div class="space-y-6">
              <!-- Date Selection -->
              <div>
                <label class="block text-sm font-medium text-text-primary dark:text-text-primary mb-3">
                  Select Date
                </label>
                <div class="relative">
                  <button
                    type="button"
                    on:click={toggleDatePicker}
                    class="date-toggle w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left"
                  >
                    {#if selectedDate}
                      {getRelativeDateDescription(selectedDate)}
                    {:else}
                      Choose a date for your session
                    {/if}
                  </button>
                  
                  {#if showDatePicker}
                    <div class="date-picker absolute z-50 mt-2 w-full bg-bg-primary dark:bg-bg-secondary border border-border-primary dark:border-border-secondary rounded-lg shadow-xl max-h-64 overflow-y-auto" style="position: absolute; top: 100%; left: 0; right: 0;">
                      {#each availableDates as date (date.getTime())}
                        {#if isDateSelectable(date)}
                          <button
                            type="button"
                            on:click={() => selectDate(date)}
                            class="w-full p-3 text-left hover:bg-bg-secondary dark:hover:bg-bg-tertiary transition-colors border-b border-border-primary dark:border-border-secondary last:border-b-0"
                          >
                            <div class="font-medium text-text-primary dark:text-text-primary">
                              {getRelativeDateDescription(date)}
                            </div>
                            <div class="text-sm text-text-secondary dark:text-text-secondary">
                              {formatDateForDisplay(date)}
                            </div>
                          </button>
                        {:else}
                          <div class="w-full p-3 text-left text-text-secondary dark:text-text-secondary border-b border-border-primary dark:border-border-secondary last:border-b-0">
                            <div class="font-medium line-through">
                              {getRelativeDateDescription(date)}
                            </div>
                            <div class="text-sm">
                              {getDateBlacklistReason(date.getUTCMonth() + 1, date.getUTCDate()) || "Not available"}
                            </div>
                          </div>
                        {/if}
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Time Selection -->
              {#if selectedDate}
                <div>
                  <label class="block text-sm font-medium text-text-primary dark:text-text-primary mb-3">
                    Select Time (UTC)
                  </label>
                  
                  <!-- Time Format Toggle -->
                  <div class="mb-3 flex items-center justify-between">
                    <div class="flex items-center">
                      <input
                        id="time-format-toggle"
                        type="checkbox"
                        bind:checked={use24HourFormat}
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-primary rounded"
                      />
                      <label
                        for="time-format-toggle"
                        class="ml-2 block text-sm text-text-secondary dark:text-text-secondary"
                      >
                        Use 24-hour format
                      </label>
                    </div>
                    <span class="text-xs text-text-secondary dark:text-text-secondary px-2 py-1 bg-bg-secondary dark:bg-bg-primary rounded border border-border-primary dark:border-border-secondary">
                      {use24HourFormat ? '24h' : '12h'} Format
                    </span>
                  </div>
                  
                  <div class="relative">
                    <button
                      type="button"
                      on:click={toggleTimePicker}
                      class="time-toggle w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left"
                    >
                      {#if selectedTime !== null}
                        {formatTimeForDisplay(selectedTime)}
                      {:else}
                        Choose a time for your session
                      {/if}
                    </button>
                    
                    {#if showTimePicker}
                      <div class="time-picker absolute z-50 mt-2 w-full bg-bg-primary dark:bg-bg-secondary border border-border-primary dark:border-border-secondary rounded-lg shadow-xl max-h-64 overflow-y-auto" style="position: absolute; top: 100%; left: 0; right: 0;">
                        {#each availableTimes as time (time)}
                          <button
                            type="button"
                            on:click={() => selectTime(time)}
                            class="w-full p-3 text-left hover:bg-bg-secondary dark:hover:bg-bg-tertiary transition-colors border-b border-border-primary dark:border-border-secondary last:border-b-0"
                          >
                            <div class="font-medium text-text-primary dark:text-text-primary">
                              {formatTimeForDisplay(time)}
                            </div>
                          </button>
                        {/each}
                      </div>
                    {/if}
                  </div>
                </div>
              {/if}

              <!-- Scheduling Info -->
              <div class="border border-border-primary dark:border-border-secondary rounded-lg overflow-hidden">
                <button
                  type="button"
                  on:click={() => showSchedulingInfo = !showSchedulingInfo}
                  class="w-full p-4 bg-bg-secondary dark:bg-bg-primary text-left flex items-center justify-between hover:bg-bg-tertiary dark:hover:bg-bg-secondary transition-colors"
                >
                  <h3 class="font-medium text-text-primary dark:text-text-primary">
                    Scheduling Information
                  </h3>
                  <svg
                    class="w-5 h-5 text-text-secondary dark:text-text-secondary transition-transform duration-200 {showSchedulingInfo ? 'rotate-180' : ''}"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {#if showSchedulingInfo}
                  <div class="p-4 bg-bg-primary dark:bg-bg-secondary border-t border-border-primary dark:border-border-secondary transition-all duration-200 ease-in-out">
                    <ul class="text-sm text-text-secondary dark:text-text-secondary space-y-1">
                      <li>• All times are in UTC timezone</li>
                      <li>• Available times: 15-minute intervals from 6:00 AM - 10:00 PM UTC</li>
                      <li>• Toggle between 24-hour and 12-hour display formats</li>
                      <li>• Blacklisted times: 5:00 PM - 8:00 PM UTC (dinner hours)</li>
                      <li>• Blacklisted dates: August 5th, December 25th, January 1st</li>
                      <li>• No bookings in the past</li>
                    </ul>
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div
            class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent sticky top-8"
          >
            <h2
              class="text-2xl font-bold text-text-primary dark:text-text-primary mb-6"
            >
              Order Summary
            </h2>

            <!-- Selected Package -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span
                  class="font-medium text-text-primary dark:text-text-primary"
                >
                  {packages[selectedPackage].name} Package
                </span>
                <span
                  class="font-bold text-text-primary dark:text-text-primary"
                >
                  ${adjustedBasePrice.toLocaleString()}
                </span>
              </div>
              
              <!-- Package Features (Compact) -->
              <div class="mt-3 space-y-2">
                <div class="text-sm text-text-secondary dark:text-text-secondary">
                  <strong>What's Included:</strong>
                </div>
                <ul class="text-xs text-text-secondary dark:text-text-secondary space-y-1 ml-2">
                  {#each packages[selectedPackage].includes as feature}
                    <li class="flex items-center space-x-2">
                      <svg
                        class="w-3 h-3 text-primary-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>

            <!-- Session Duration -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span
                  class="font-medium text-text-primary dark:text-text-primary"
                >
                  Session Duration
                </span>
                <span
                  class="font-bold text-primary-600 dark:text-primary-400"
                >
                  {totalSessionDuration} minutes
                </span>
              </div>
              <div class="text-xs text-text-secondary dark:text-text-secondary">
                Base: {packages[selectedPackage].duration} min
                {#if selectedAddOns.length > 0}
                  + {selectedAddOns.length} add-on{selectedAddOns.length > 1 ? 's' : ''}
                {/if}
              </div>
            </div>

            <!-- Schedule Status -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span
                  class="font-medium text-text-primary dark:text-text-primary"
                >
                  Schedule
                </span>
                {#if isScheduleValid}
                  <span class="font-medium text-green-600 dark:text-green-400 text-sm">
                    ✓ {selectedDate && getRelativeDateDescription(selectedDate)} at {selectedTime && formatTimeForDisplay(selectedTime)} UTC
                  </span>
                {:else}
                  <span class="text-orange-600 dark:text-orange-400 text-sm">
                    ⚠ Please select date & time
                  </span>
                {/if}
              </div>
              {#if selectedDate && isToday(selectedDate)}
                <div class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Same-day booking available (times shown are 1+ hour ahead)
                </div>
              {/if}
            </div>

            <!-- Information Status -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span
                  class="font-medium text-text-primary dark:text-text-primary"
                >
                  Your Information
                </span>
                {#if isUserInfoValid}
                  <span class="font-medium text-green-600 dark:text-green-400 text-sm">
                    ✓ All required fields completed
                  </span>
                {:else}
                  <span class="text-orange-600 dark:text-orange-400 text-sm">
                    ⚠ Complete required fields
                  </span>
                {/if}
              </div>
            </div>

            <!-- Selected Add-ons -->
            {#if selectedAddOns.length > 0}
              <div class="mb-6">
                <h4
                  class="font-medium text-text-primary dark:text-text-primary mb-3"
                >
                  Add-ons
                </h4>
                <div class="space-y-2">
                  {#each selectedAddOns as addOnId}
                    {@const addOn = addOns.find((a) => a.id === addOnId)}
                    {#if addOn}
                      <div class="flex justify-between items-center text-sm">
                        <div class="flex-1">
                          <span
                            class="text-text-secondary dark:text-text-secondary"
                          >
                            {addOn.name}
                          </span>
                          {#if addOn.timeAdded > 0}
                            <span class="text-xs text-primary-600 dark:text-primary-400 ml-2">
                              (+{addOn.timeAdded} min)
                            </span>
                          {/if}
                        </div>
                        <span class="text-text-primary dark:text-text-primary">
                          ${addOn.price.toLocaleString()}
                        </span>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Total -->
            <div
              class="border-t border-border-primary dark:border-border-secondary pt-4 mb-6"
            >
              <div class="flex justify-between items-center">
                <span
                  class="text-lg font-bold text-text-primary dark:text-text-primary"
                >
                  Total
                </span>
                <span
                  class="text-2xl font-bold text-primary-600 dark:text-primary-400"
                >
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <!-- Book Now Button -->
            <button
              disabled={!isBookingValid}
              class="w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none {isBookingValid ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white hover:scale-105' : 'bg-gray-400 text-gray-200'}"
            >
              {#if isBookingValid}
                Book Now - ${totalPrice.toLocaleString()}
              {:else if !isScheduleValid}
                Select Date & Time to Book
              {:else}
                Complete Your Information to Book
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
