<script lang="ts">
  import { onMount } from "svelte";
  import Header from "../../lib/components/Header.svelte";
  import { theme } from "../../lib/stores/theme";
  import { auth } from "../../lib/stores/auth";
  import { AuthService } from "../../lib/services/auth";

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

  // Add-ons with pricing
  const addOns = [
    {
      id: "extra-30",
      name: "Extra 30 minutes",
      price: 8000,
      description: "Extend your session",
    },
    {
      id: "facial",
      name: "Full facial treatment",
      price: 12000,
      description: "Complete facial care",
    },
    {
      id: "hair-styling",
      name: "Hair blowout / styling",
      price: 10000,
      description: "Professional hair styling",
    },
    {
      id: "makeover",
      name: "Pre-party makeover",
      price: 15000,
      description: "Full glam transformation",
    },
    {
      id: "stretching",
      name: "Wellness stretching session",
      price: 6000,
      description: "Flexibility & wellness",
    },
    {
      id: "shopping",
      name: "Personal shopping delivery",
      price: 20000,
      description: "Curated shopping service",
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

          <!-- Package Details -->
          <div
            class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent"
          >
            <h2
              class="text-2xl font-bold text-text-primary dark:text-text-primary mb-6"
            >
              Package Details
            </h2>

            <!-- Package Features -->
            <div class="space-y-4">
              <div>
                <h4
                  class="text-lg font-semibold text-text-primary dark:text-text-primary mb-3"
                >
                  What's Included
                </h4>
                <ul class="space-y-2">
                  {#each packages[selectedPackage].includes as feature}
                    <li class="flex items-center space-x-3">
                      <svg
                        class="w-5 h-5 text-primary-500 flex-shrink-0"
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
                      <span class="text-text-secondary dark:text-text-secondary">
                        {feature}
                      </span>
                    </li>
                  {/each}
                </ul>
              </div>

              <div>
                <h4
                  class="text-lg font-semibold text-text-primary dark:text-text-primary mb-3"
                >
                  Available Massage Types
                </h4>
                <div class="flex flex-wrap gap-2">
                  {#each packages[selectedPackage].massageTypes as type}
                    <span class="px-3 py-1 bg-bg-secondary text-text-primary rounded-full text-sm font-medium">
                      {type}
                    </span>
                  {/each}
                </div>
              </div>

              <div>
                <h4
                  class="text-lg font-semibold text-text-primary dark:text-text-primary mb-3"
                >
                  Session Duration
                </h4>
                <p class="text-text-secondary dark:text-text-secondary">
                  {packages[selectedPackage].duration} minutes
                </p>
              </div>
            </div>
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

        <!-- Right Panel - User Information & Order Summary -->
        <div class="w-full md:w-100 space-y-12">
          <!-- User Information Form -->
          <div
            class="bg-bg-primary dark:bg-bg-secondary rounded-2xl p-6 shadow-xl border border-border-accent dark:border-border-accent"
          >
            <h2
              class="text-2xl font-bold text-text-primary dark:text-text-primary mb-6"
            >
              {#if $auth.user && $auth.activeProfile}
                Confirm Your Information
              {:else}
                Your Information
              {/if}
            </h2>

            <div class="space-y-4">
              <!-- Name -->
              <div>
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label
                  class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  bind:value={userInfo.name}
                  placeholder="Enter your full name"
                  class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- Phone -->
              <div>
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label
                  class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  bind:value={userInfo.phone}
                  placeholder="Enter your phone number"
                  class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- Address -->
              <div>
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label
                  class="block text-sm font-medium text-text-primary dark:text-text-primary mb-2"
                >
                  Address
                </label>
                <input
                  type="text"
                  bind:value={userInfo.address}
                  placeholder="Enter your full address"
                  class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- Routing Number -->
              <div>
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Routing Number
                </label>
                <input
                  type="text"
                  bind:value={userInfo.routingNumber}
                  placeholder="8-9 digit routing number"
                  maxlength="9"
                  class="w-full p-3 border border-border-primary dark:border-border-secondary rounded-lg bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {#if $auth.user && $auth.activeProfile}
              <div
                class="mt-6 p-4 bg-bg-primary rounded-lg border border-primary-200 dark:border-primary-800"
              >
                <p class="text-sm text-text-secondary">
                  Your information has been auto-filled from your profile.
                </p>
              </div>
            {/if}
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
                        <span
                          class="text-text-secondary dark:text-text-secondary"
                        >
                          {addOn.name}
                        </span>
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
              class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform hover:scale-105"
            >
              Book Now - ${totalPrice.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
