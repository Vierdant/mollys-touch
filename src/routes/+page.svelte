<script lang="ts">
  import { onMount } from "svelte";
  import Header from "../lib/components/Header.svelte";
  import { theme } from "../lib/stores/theme";
  import { auth } from "../lib/stores/auth";
  import { AuthService } from "../lib/services/auth";

  let packagesSection: HTMLElement;
  let packageCards: HTMLElement[] = [];
  let packagesAnimated = false;

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah C.",
      initials: "SC",
      quote:
        "Molly's Touch transformed my home into a luxury spa. The attention to detail and professional service exceeded all my expectations. I've never felt more relaxed and pampered.",
    },
    {
      name: "Marcus R.",
      initials: "MR",
      quote:
        "As someone who travels frequently, having Molly come to my location is a game-changer. The massage techniques are incredible and the aromatherapy is divine. Pure luxury!",
    },
    {
      name: "Isabella T.",
      initials: "IT",
      quote:
        "The Platinum package was worth every penny. From the hot stone therapy to the mini styling session, everything was perfect. Molly truly knows how to create a VIP experience.",
    },
    {
      name: "David K.",
      initials: "DK",
      quote:
        "I was skeptical about in-home massage services, but Molly's Touch completely changed my mind. Professional, discreet, and absolutely luxurious. I'm a regular customer now.",
    },
  ];

  let currentTestimonial = 0;
  let testimonialInterval: number | undefined;

  function setCurrentTestimonial(index: number) {
    console.log("Setting testimonial to:", index);
    currentTestimonial = index;
  }

  function nextTestimonial() {
    console.log("Next testimonial, current:", currentTestimonial);
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    console.log("New testimonial:", currentTestimonial);
  }

  function previousTestimonial() {
    console.log("Previous testimonial, current:", currentTestimonial);
    currentTestimonial =
      currentTestimonial === 0
        ? testimonials.length - 1
        : currentTestimonial - 1;
    console.log("New testimonial:", currentTestimonial);
  }

  function startTestimonialCarousel() {
    console.log("Starting testimonial carousel");
    testimonialInterval = window.setInterval(() => {
      console.log("Auto-rotating testimonial");
      nextTestimonial();
    }, 5000); // Change every 5 seconds
  }

  function stopTestimonialCarousel() {
    console.log("Stopping testimonial carousel");
    if (testimonialInterval) {
      window.clearInterval(testimonialInterval);
      testimonialInterval = undefined;
    }
  }

  onMount(() => {
    // Apply theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme.set(savedTheme as "light" | "dark");
    }

    // Get current user on mount
    AuthService.getCurrentUser();

    // Intersection Observer for package cards animation
    if (typeof IntersectionObserver !== "undefined" && packagesSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !packagesAnimated) {
              packagesAnimated = true;
              animatePackageCards();
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: "0px 0px -100px 0px",
        },
      );

      observer.observe(packagesSection);

      return () => {
        observer.unobserve(packagesSection);
      };
    }

    // Start testimonial carousel
    startTestimonialCarousel();

    // Cleanup function
    return () => {
      stopTestimonialCarousel();
    };
  });

  function animatePackageCards() {
    if (packageCards && packageCards.length > 0) {
      packageCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add(`animate-drop-in-${index + 1}`);
        }, index * 200);
      });
    }
  }

  function scrollToPackages() {
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<svelte:head>
  <title>Molly's Touch - Luxury Experience</title>
</svelte:head>

<div
  class="min-h-screen bg-bg-secondary dark:bg-bg-primary relative overflow-hidden"
>
  <Header />

  <!-- Hero Section -->
  <section class="relative py-20 px-4 z-10 overflow-hidden">
    <!-- Background Leaf Pattern for Spa Feel -->
    <div class="leaf-pattern">
      <div class="leaf"></div>
      <div class="leaf"></div>
      <div class="leaf"></div>
    </div>

    <!-- Background Decorative Flowers -->
    <div
      class="absolute top-10 left-10 w-60 h-60 opacity-70 dark:opacity-30 animate-float"
    >
      <img
        src="flower-1-colored.webp"
        alt="Decorative Flower"
        class="w-full h-full object-contain"
      />
    </div>
    <div
      class="absolute bottom-10 right-20 w-32 h-32 opacity-70 dark:opacity-30 animate-float animation-delay-2000"
    >
      <img
        src="flower-2-colored.webp"
        alt="Decorative Flower"
        class="w-full h-full object-contain"
      />
    </div>

    <div class="max-w-7xl mx-auto relative">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Side - Welcome Message and CTA -->
        <div class="text-center lg:text-left relative z-10">
          <h1 class="text-3xl md:text-5xl font-bold text-gradient mb-6">
            Luxury Massage & Beauty — At Your Doorstep
          </h1>
          <p
            class="text-xl md:text-2xl text-text-secondary dark:text-text-secondary mb-8 leading-relaxed"
          >
            From the elegance of Asian tradition to the glamour of Vinewood,
            Molly's Touch brings an exclusive spa and styling experience
            directly to you
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href="/booking"
              class="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Book Your Session
            </a>
            <button
              on:click={scrollToPackages}
              class="bg-bg-primary dark:bg-bg-secondary hover:bg-bg-accent dark:hover:bg-bg-tertiary text-text-primary dark:text-text-primary font-semibold py-4 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 border border-border-primary dark:border-border-primary"
            >
              View Services
            </button>
          </div>

          <!-- User Welcome (if logged in) -->
          {#if $auth.user && $auth.activeProfile}
            <div
              class="mt-6 pt-6 border-t border-border-primary dark:border-border-secondary"
            >
              <p class="text-sm text-text-tertiary dark:text-text-tertiary">
                Welcome back, <span
                  class="font-medium text-text-primary dark:text-text-primary"
                >
                  {$auth.activeProfile.username}
                </span>
              </p>
            </div>
          {/if}
        </div>

        <!-- Right Side - Large Dragon Image -->
        <div class="relative flex justify-center lg:justify-end">
          <div class="relative w-full max-w-2xl lg:max-w-3xl -mr-20 lg:-mr-32">
            <!-- Large Dragon Image -->
            <img
              src="mollys-pet-chinese-dragon-colored-massage.webp"
              alt="Trace"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="relative py-12 px-4 bg-bg-primary dark:bg-bg-primary z-10">
    <div class="max-w-7xl mx-auto">
      <h2
        class="text-4xl font-bold text-center text-text-primary dark:text-text-primary mb-16"
      >
        Why Choose Molly's Touch?
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Feature 1 - Exclusive Privacy -->
        <div class="group relative">
          <div
            class="relative bg-bg-primary dark:bg-bg-primary backdrop-blur-sm p-6"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <h3
              class="text-xl font-bold text-text-primary dark:text-text-primary mb-4 text-center"
            >
              Exclusive Privacy
            </h3>
            <p
              class="text-text-secondary dark:text-text-secondary text-center leading-relaxed"
            >
              Your comfort is our priority; we come to you.
            </p>
          </div>
        </div>

        <!-- Feature 2 - Luxury Without Limits -->
        <div class="group relative">
          <div
            class="relative bg-bg-primary dark:bg-bg-primary backdrop-blur-sm p-6"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300"
            >
              <svg
                class="w-8 h-8 text-white"
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
            </div>
            <h3
              class="text-xl font-bold text-text-primary dark:text-text-primary mb-4 text-center"
            >
              Luxury Without Limits
            </h3>
            <p
              class="text-text-secondary dark:text-text-secondary text-center leading-relaxed"
            >
              Massage, styling and beauty care in one tailored package.
            </p>
          </div>
        </div>

        <!-- Feature 3 - Authentic Elegance -->
        <div class="group relative">
          <div
            class="relative bg-bg-primary dark:bg-bg-primary backdrop-blur-sm p-6"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
            </div>
            <h3
              class="text-xl font-bold text-text-primary dark:text-text-primary mb-4 text-center"
            >
              Authentic Elegance
            </h3>
            <p
              class="text-text-secondary dark:text-text-secondary text-center leading-relaxed"
            >
              Asian-inspired techniques blended with modern luxury.
            </p>
          </div>
        </div>

        <!-- Feature 4 - Your Time, Your Way -->
        <div class="group relative">
          <div
            class="relative bg-bg-primary dark:bg-bg-primary backdrop-blur-sm p-6"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3
              class="text-xl font-bold text-text-primary dark:text-text-primary mb-4 text-center"
            >
              Your Time, Your Way
            </h3>
            <p
              class="text-text-secondary dark:text-text-secondary text-center leading-relaxed"
            >
              Flexible scheduling, discreet service, and total customization.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="relative py-12 px-4 bg-bg-primary dark:bg-bg-secondary z-10">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Left Panel - Massage Kit Image -->
        <div class="flex justify-center lg:justify-start relative">
          <!-- Candle Flame Glow Effects -->
          <div class="absolute inset-0 flex items-center justify-center">
            <!-- First flame glow - positioned behind first candle -->
            <div
              class="absolute top-[44%] left-[25.3%] w-5 h-5 bg-yellow-400/60 rounded-full blur-sm animate-pulse"
            ></div>

            <!-- Second flame glow - positioned behind second candle -->
            <div
              class="absolute top-[35%] left-[42.4%] w-5 h-5 bg-orange-400/50 rounded-full blur-sm animate-pulse"
            ></div>
          </div>

          <img
            src="massage-kit-colored.webp"
            alt="Luxury Massage Kit"
            class="w-full max-w-md h-auto relative z-10"
          />
        </div>

        <!-- Right Panel - Testimonials -->
        <div class="relative">
          <div class="text-center mb-16">
            <p
              class="text-xl text-text-secondary dark:text-text-secondary max-w-2xl mx-auto"
            >
              Experience the luxury and care that has our clients coming back
              time and time again
            </p>
          </div>
          <div
            class="relative h-80"
            on:mouseenter={stopTestimonialCarousel}
            on:mouseleave={startTestimonialCarousel}
            aria-label="Testimonial Carousel"
            aria-roledescription="Testimonial Carousel"
            aria-describedby="Testimonial Carousel"
            role="region"
          >
            <!-- Current testimonial indicator -->
            <div
              class="absolute top-4 right-4 z-20 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
            >
              {currentTestimonial + 1} / {testimonials.length}
            </div>

            {#each testimonials as testimonial, index}
              <div
                class="absolute inset-0 transition-all duration-1000 ease-in-out {index ===
                currentTestimonial
                  ? 'opacity-100 translate-y-0 z-10'
                  : 'opacity-0 translate-y-8 z-0'}"
              >
                <div
                  class="bg-bg-secondary dark:bg-bg-primary rounded-2xl p-8 shadow-xl border border-border-accent dark:border-border-accent text-center"
                >
                  <div class="flex justify-center mb-6">
                    <div
                      class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                    >
                      {testimonial.initials}
                    </div>
                  </div>
                  <blockquote
                    class="text-lg text-text-secondary dark:text-text-secondary mb-6 italic"
                  >
                    "{testimonial.quote}"
                  </blockquote>
                  <div class="text-center">
                    <p
                      class="font-semibold text-text-primary dark:text-text-primary"
                    >
                      {testimonial.name}
                    </p>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Navigation Arrows -->
          <button
            on:click={() => previousTestimonial()}
            class="absolute left-4 top-[45%] transform -translate-y-1/2 bg-bg-primary dark:bg-bg-secondary border border-border-accent dark:border-border-accent rounded-full p-3 shadow-lg hover:bg-bg-secondary dark:hover:bg-bg-primary transition-colors duration-200 z-20"
            aria-label="Previous testimonial"
          >
            <svg
              class="w-6 h-6 text-text-primary dark:text-text-primary"
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
          </button>

          <button
            on:click={() => nextTestimonial()}
            class="absolute right-4 top-[45%] transform -translate-y-1/2 bg-bg-primary dark:bg-bg-secondary border border-border-accent dark:border-border-accent rounded-full p-3 shadow-lg hover:bg-bg-secondary dark:hover:bg-bg-primary transition-colors duration-200 z-20"
            aria-label="Next testimonial"
          >
            <svg
              class="w-6 h-6 text-text-primary dark:text-text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Packages Section -->
  <section
    bind:this={packagesSection}
    class="relative py-20 px-4 bg-bg-secondary dark:bg-bg-primary z-10"
  >
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2
          class="text-4xl font-bold text-text-primary dark:text-text-primary mb-4"
        >
          Choose Your Experience
        </h2>
        <p
          class="text-xl text-text-secondary dark:text-text-secondary max-w-2xl mx-auto"
        >
          From essential relaxation to full luxury indulgence, we have the
          perfect package for your needs
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <!-- Silver Package -->
        <div
          bind:this={packageCards[0]}
          class="relative group h-full mt-4 package-card"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 group-hover:animate-pulse transition-all duration-500"
          ></div>
          <div
            class="relative bg-bg-primary dark:bg-bg-secondary backdrop-blur-sm border border-gray-300/30 dark:border-gray-600/30 rounded-2xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col"
          >
            <div class="text-center mb-8">
              <div
                class="w-30 h-30 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg overflow-hidden"
              >
                <img
                  src="/rank-silver.webp"
                  alt="Silver Rank"
                  class="w-full h-full object-cover"
                />
              </div>
              <h3
                class="text-2xl font-bold text-text-primary dark:text-text-primary mb-2"
              >
                Silver
              </h3>
              <p class="text-text-secondary dark:text-text-secondary mb-4">
                "The Essentials"
              </p>
              <p
                class="text-sm text-text-tertiary dark:text-text-tertiary mb-6"
              >
                Budget-friendly starter
              </p>
              <div
                class="text-3xl font-bold text-text-primary dark:text-text-primary mb-2"
              >
                $10,000
              </div>
            </div>

            <ul class="space-y-4 mb-8 flex-grow">
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
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
                  15 minutes Swedish or Deep Tissue massage
                </span>
              </li>
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
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
                  Basic aromatherapy
                </span>
              </li>
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
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
                  Travel to any location within Los Santos
                </span>
              </li>
            </ul>

            <a
              href="/booking?package=silver"
              class="w-full bg-gray-500 hover:animate-pulse text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-auto flex items-center justify-center"
            >
              Choose Silver
            </a>
          </div>
        </div>

        <!-- Gold Package -->
        <div
          bind:this={packageCards[1]}
          class="relative group h-full package-card"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 group-hover:animate-pulse transition-all duration-500"
          ></div>
          <div
            class="relative bg-bg-primary dark:bg-bg-secondary backdrop-blur-sm border-2 border-(--color-primary-400)/80 dark:border-primary-600/50 rounded-2xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col"
            style="min-height: 600px;"
          >
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                class="bg-primary-500 text-white text-sm font-semibold px-4 py-1 rounded-full"
              >
                Most Popular
              </span>
            </div>

            <div class="text-center mb-8">
              <div
                class="w-30 h-30 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg overflow-hidden"
              >
                <img
                  src="/rank-gold.webp"
                  alt="Gold Rank"
                  class="w-full h-full object-cover"
                />
              </div>
              <h3
                class="text-2xl font-bold text-text-primary dark:text-text-primary mb-2"
              >
                Gold
              </h3>
              <p class="text-text-secondary dark:text-text-secondary mb-4">
                "Signature Touch"
              </p>
              <p
                class="text-sm text-text-tertiary dark:text-text-tertiary mb-6"
              >
                Most popular
              </p>
              <div
                class="text-3xl font-bold text-text-primary dark:text-text-primary mb-2"
              >
                $15,000
              </div>
            </div>

            <ul class="space-y-4 mb-8">
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0"
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
                  30 minutes massage (choice of style)
                </span>
              </li>
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0"
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
                  Hot stones or aromatherapy included
                </span>
              </li>
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0"
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
                  Complimentary head & neck relaxation
                </span>
              </li>
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0"
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
                  Choice of calming music playlist
                </span>
              </li>
            </ul>

            <a
              href="/booking?package=gold"
              class="w-full bg-primary-600 hover:animate-pulse text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-auto flex items-center justify-center"
            >
              Choose Gold
            </a>
          </div>
        </div>

        <!-- Platinum Package -->
        <div
          bind:this={packageCards[2]}
          class="relative group h-full mt-4 package-card"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 group-hover:animate-pulse transition-all duration-500"
          ></div>
          <div
            class="relative bg-bg-primary dark:bg-bg-secondary backdrop-blur-sm border border-purple-300/30 dark:border-purple-600/30 rounded-2xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col"
          >
            <div class="text-center mb-8">
              <div
                class="w-30 h-30 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg overflow-hidden"
              >
                <img
                  src="/rank-platinum.webp"
                  alt="Platinum Rank"
                  class="w-full h-full object-cover"
                />
              </div>
              <h3
                class="text-2xl font-bold text-text-primary dark:text-text-primary mb-2"
              >
                Platinum
              </h3>
              <p class="text-text-secondary dark:text-text-secondary mb-4">
                "Vinewood Indulgence"
              </p>
              <p
                class="text-sm text-text-tertiary dark:text-text-tertiary mb-6"
              >
                Full luxury
              </p>
              <div
                class="text-3xl font-bold text-text-primary dark:text-text-primary mb-2"
              >
                $30,000
              </div>
            </div>

            <ul class="space-y-4 mb-8 flex-grow">
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0"
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
                  30-60 minutes massage (mix & match styles)
                </span>
              </li>
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0"
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
                  Hot stone + aromatherapy combo
                </span>
              </li>
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0"
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
                  Luxury facial or foot soak
                </span>
              </li>
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0"
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
                  Mini styling session (hair or makeup touch-up)
                </span>
              </li>
              <li class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0"
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
                  Free gift bag of spa goodies
                </span>
              </li>
            </ul>

            <a
              href="/booking?package=platinum"
              class="w-full bg-purple-600 hover:animate-pulse text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-auto flex items-center justify-center"
            >
              Choose Platinum
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer
    class="bg-bg-primary border-t border-border-accent dark:border-border-accent"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="lg:col-span-2">
          <div class="flex items-center space-x-3 mb-6">
            <div
              class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg"
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
            </div>
            <h3 class="text-2xl font-bold text-gradient">Molly's Touch</h3>
          </div>
          <p class="text-text-secondary dark:text-text-secondary mb-6 max-w-md">
            Luxury on-location massage services that bring the spa experience
            directly to you. Professional, discreet, and tailored to your needs.
          </p>
          <div class="flex space-x-4">
            <a
              href="#"
              class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label="Facebook"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label="Twitter"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label="Pinterest"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.189.6 2.159 1.775 2.159 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4
            class="text-lg font-semibold text-text-primary dark:text-text-primary mb-6"
          >
            Quick Links
          </h4>
          <ul class="space-y-3">
            <li>
              <a
                href="/services"
                class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Book Now
              </a>
            </li>
            <li>
              <a
                href="/about"
                class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/gallery"
                class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="/faq"
                class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal & Support -->
        <div>
          <h4
            class="text-lg font-semibold text-text-primary dark:text-text-primary mb-6"
          >
            Legal & Support
          </h4>
          <ul class="space-y-3">
            <li>
              <a
                href="/privacy-policy"
                class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms-conditions"
                class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href="/careers"
                class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="/contact"
                class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="border-t border-border-accent dark:border-border-accent mt-8 pt-6"
      >
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-text-secondary dark:text-text-secondary text-sm">
            © 2025 Molly's Touch. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/sitemap"
              class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors"
            >
              Sitemap
            </a>
            <a
              href="/accessibility"
              class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors"
            >
              Accessibility
            </a>
            <a
              href="/cookies"
              class="text-text-secondary dark:text-text-secondary hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>
