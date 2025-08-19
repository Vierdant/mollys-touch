<script lang="ts">
  import Header from "$lib/components/Header.svelte";
</script>

<svelte:head>
  <title>Terms and Conditions - Molly's Touch</title>
</svelte:head>

<div class="min-h-screen bg-bg-secondary">
  <Header />
  
  <main class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Navigation -->
    <div class="mb-8">
      <a 
        href="/" 
        class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Main Page
      </a>
    </div>

    <!-- Document Header -->
    <header class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-text-primary dark:text-text-primary mb-4">
        Terms And Conditions
      </h1>
      <p class="text-lg text-text-secondary dark:text-text-secondary">
        Effective date: 17th August 2025
      </p>
    </header>

    <!-- Table of Contents -->
    <nav class="mb-12 p-6 bg-bg-secondary rounded-lg border border-(--color-border-primary)">
      <h2 class="text-xl font-semibold text-text-primary dark:text-text-primary mb-4">
        Table of Contents
      </h2>
      <ul class="space-y-2">
        <li><a href="#introduction" class="text-primary-600 dark:text-primary-400 hover:underline">Introduction</a></li>
        <li><a href="#section1" class="text-primary-600 dark:text-primary-400 hover:underline">1. Service Overview</a></li>
        <li><a href="#section2" class="text-primary-600 dark:text-primary-400 hover:underline">2. Booking & Payment</a></li>
        <li><a href="#section3" class="text-primary-600 dark:text-primary-400 hover:underline">3. Cancellations & Refunds</a></li>
        <li><a href="#section4" class="text-primary-600 dark:text-primary-400 hover:underline">4. Delays & No-Shows</a></li>
        <li><a href="#section5" class="text-primary-600 dark:text-primary-400 hover:underline">5. Client Responsibilities</a></li>
        <li><a href="#section6" class="text-primary-600 dark:text-primary-400 hover:underline">6. Privacy & Data Collection</a></li>
        <li><a href="#section7" class="text-primary-600 dark:text-primary-400 hover:underline">7. Website Usage</a></li>
        <li><a href="#section8" class="text-primary-600 dark:text-primary-400 hover:underline">8. Limitation of Liability</a></li>
        <li><a href="#section9" class="text-primary-600 dark:text-primary-400 hover:underline">9. Amendments</a></li>
        <li><a href="#contact" class="text-primary-600 dark:text-primary-400 hover:underline">Contact Us</a></li>
      </ul>
    </nav>

    <!-- Document Content -->
    <article class="prose prose-lg dark:prose-invert max-w-none">
      <!-- Introduction -->
      <section id="introduction" class="mb-12">
      <p class="text-text-secondary dark:text-text-secondary mb-4 leading-relaxed">
        Welcome to Molly's Touch (“we,” “our,” “us,” or “the Company”). By using our website, booking our services, or otherwise engaging with us, you (“the Client,” “the Customer,” or “you”) agree to the following Terms of Service. Please read carefully before making a booking.
      </p>
      </section>
      <!-- Section 1 -->
      <section id="section1" class="mb-12">
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          1. Service Overview
        </h2>
        <p class="text-text-secondary dark:text-text-secondary mb-4 leading-relaxed">
          Molly's Touch provides luxury massage, beauty, and personal care services delivered to the location of your choice within the city of Los Santos and other selected locations. 
          All appointments must be booked and paid for in advance through our website.
        </p>
      </section>

      <!-- Section 2 -->
      <section id="section2" class="mb-12">
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          2. Booking & Payment
        </h2>
        <ul class="list-disc list-inside text-text-secondary dark:text-text-secondary mb-4 space-y-2">
          <li><strong>Advance Payment Required:</strong> All bookings require full payment at the time of scheduling.</li>
          <li><strong>Information Required:</strong> Clients must provide their full name, phone number, service address, and routing/account number for processing payments.</li>
          <li><strong>Confirmation:</strong> Once payment is received, you will receive an appointment confirmation.</li>
        </ul>
      </section>

      <!-- Section 3 -->
      <section id="section3" class="mb-12">
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          3. Cancellations & Refunds
        </h2>
        <ul class="list-disc list-inside text-text-secondary dark:text-text-secondary mb-4 space-y-2">
          <li><strong>Client-Initiated Cancellations:</strong></li>
          <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>Cancellations made more than 24 hours before the appointment are eligible for a full refund.</li>
            <li>Cancellations made within 24 hours of the scheduled appointment will incur a 25% cancellation fee.</li>
          </ul>
          <li><strong>Company-Initiated Cancellations:</strong></li>
          <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>If we must cancel due to unforeseen circumstances, you will receive a full refund or the option to reschedule.</li>
          </ul>
        </ul>
      </section>

      <!-- Section 4 -->
      <section id="section4" class="mb-12">
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          4. Delays & No-Shows
        </h2>
        <ul class="list-disc list-inside text-text-secondary dark:text-text-secondary mb-4 space-y-2">
          <li><strong>Client Delays:</strong></li>
          <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>A grace period of <strong>15 minutes</strong> is permitted.</li>
            <li>Beyond this period, a <strong>10% late fee</strong> may be charged, and appointment time may be reduced accordingly.</li>
          </ul>
          <li><strong>Company Delays:</strong></li>
          <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>If our staff arrives more than 15 minutes late without prior notice, the client will be compensated with a <strong>10% service credit.</strong></li>
          </ul>
          <li><strong>Client No-Show:</strong></li>
          <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>If the client fails to appear at the designated location within 30 minutes, the appointment is considered a <strong>no-show</strong>, and no refund will be issued.</li>
          </ul>
          <li><strong>Company No-Show:</strong></li>
          <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>If we fail to appear without proper notice, you are entitled to a <strong>full refund plus a 25% credit</strong> toward a future service.</li>
          </ul>
        </ul>
      </section>

      <!-- Section 5 -->
      <section id="section5" class="mb-12">
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          5. Client Responsibilities
        </h2>
        <ul class="list-disc list-inside text-text-secondary dark:text-text-secondary mb-4 space-y-2">
          <li>Ensure the service location is accessible, safe, and suitable for the scheduled service.</li>
          <li>Provide accurate and complete booking information.</li>
          <li>Treat our staff with respect; abusive or inappropriate behavior will result in immediate termination of services without a refund.</li>
        </ul>
      </section>

      <!-- Section 6 -->
      <section id="section6" class="mb-12">
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          6. Privacy & Data Collection
        </h2>
        <ul class="list-disc list-inside text-text-secondary dark:text-text-secondary mb-4 space-y-2">
          <li>We collect your name, phone number, service address, and routing/account number solely for the purpose of providing services and processing payments.</li>
          <li>This information is treated as confidential and will not be shared with any third parties unless required by law or by Privacy Policy.</li>
          <li>By booking, you consent to this collection and use of your information.</li>
        </ul>
      </section>

      <!-- Section 7 -->
      <section id="section7" class="mb-12">
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          7. Website Usage    
        </h2>
        <ul class="list-disc list-inside text-text-secondary dark:text-text-secondary mb-4 space-y-2">
          <li>You agree not to misuse our website, attempt to disrupt services, or provide false booking information.</li>
          <li>We reserve the right to suspend access or refuse service at our discretion.</li>  
        </ul>
      </section>

      <!-- Section 8 -->
      <section id="section8" class="mb-12">
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          8. Limitation of Liability
        </h2>
        <ul class="list-disc list-inside text-text-secondary dark:text-text-secondary mb-4 space-y-2">
          <li>We are not responsible for delays caused by traffic, emergencies, or circumstances beyond our control.</li>
          <li>Our liability is strictly limited to the value of the service purchased.</li>
        </ul>
      </section>

      <!-- Section 9 -->
      <section id="section9" class="mb-12">
        <h2 class="text-2xl font-semibold text-text-primary dark:text-text-primary mb-4">
          9. Amendments
        </h2>
        <p class="text-text-secondary dark:text-text-secondary mb-4 leading-relaxed">
          We may update these Terms of Service at any time. Continued use of our website or services after updates constitutes acceptance of the new terms.
        </p>
      </section>

      <!-- Contact Information -->
      <section class="mt-16 mb-12 p-6 bg-bg-primary rounded-lg border border-(--color-border-primary)">
        <h2 class="text-xl font-semibold text-text-primary dark:text-text-primary mb-4">
          Contact Us
        </h2>
        <p class="text-text-secondary dark:text-text-secondary mb-2">
          If you have any questions about this document, please contact us:
        </p>
        <p class="text-text-secondary dark:text-text-secondary">
          Email: contact@mollystouch.com (( discord: vierdant or join the discord server https://discord.gg/N3xyQmyFaZ ))<br>
          Address: Maze Bank Building, Los Santos, Office #4<br>
          Phone: 01123121
        </p>
      </section>
    </article>

    <!-- Bottom Navigation -->
    <div class="mt-12 text-center">
      <a 
        href="/" 
        class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Return to Main Page
      </a>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-bg-primary border-t border-border-color mt-16">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center text-text-secondary dark:text-text-secondary">
        <p>&copy; 2025 Molly's Touch. All rights reserved.</p>
        <div class="mt-4 space-x-4">
          <a href="/legal" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Terms & Conditions
          </a>
          <a href="/privacy" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  /* Custom scroll behavior for anchor links */
  html {
    scroll-behavior: smooth;
  }
  
  /* Custom styling for the prose content */
  .prose h2 {
    color: rgb(var(--color-text-primary));
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  .prose p {
    margin-bottom: 1rem;
    line-height: 1.7;
  }
  
  .prose ul {
    margin-bottom: 1rem;
  }
  
  .prose li {
    margin-bottom: 0.5rem;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
  }
</style>
