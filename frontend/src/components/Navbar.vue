<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const mobileMenuOpen = ref(false);
const menuItems = [
  { name: 'Home', to: '/' },
  { name: 'Membri', to: '/members' },
  { name: 'Progetti', to: '/projects' },
  { name: 'Pubblicazioni', to: '/pubblications' },
  { name: 'Profilo', to: '/profile' }
];

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// --- Nuovo: mostra/nascondi navbar allo scroll ---
const lastScrollY = ref(window.scrollY);
const showNavbar = ref(true);

const handleScroll = () => {
  if (window.scrollY > lastScrollY.value && window.scrollY > 80) {
    // scendendo -> nascondi
    showNavbar.value = false;
  } else {
    // salendo -> mostra
    showNavbar.value = true;
  }
  lastScrollY.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav
    class="bg-white shadow-md fixed w-full z-30 top-0 left-0 transform transition-transform duration-300"
    :class="{ '-translate-y-full': !showNavbar, 'translate-y-0': showNavbar }"
  >
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <router-link to="/" class="text-indigo-900 font-bold text-xl select-none hover:text-indigo-700 transition-colors duration-300">
          Research Hub
        </router-link>

        <!-- Desktop menu -->
        <div class="hidden md:!flex space-x-8 font-semibold text-gray-700">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.to"
            class="px-3 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-300"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="toggleMobileMenu"
          type="button"
          class="md:!hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300"
          aria-controls="mobile-menu"
          :aria-expanded="mobileMenuOpen.toString()"
        >
          <span class="sr-only">Toggle main menu</span>
          <svg
            :class="{'rotate-90': mobileMenuOpen, 'rotate-0': !mobileMenuOpen}"
            class="h-6 w-6 transform transition-transform duration-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 8h16M4 16h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform -translate-y-4"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform -translate-y-4"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white shadow-md border-t border-gray-200"
        id="mobile-menu"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 font-semibold text-gray-700">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.to"
            class="block px-3 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-300"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
body, #app {
  padding-top: 4rem; /* spazio per navbar fissa */
}
</style>
