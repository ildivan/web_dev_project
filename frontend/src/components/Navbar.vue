<script setup>
import { ref } from 'vue';


const menuItems = [
  { name: 'Home', to: '/' },
  { name: 'Membri', to: '/#membri' },
  { name: 'Progetti', to: '/#progetti' },
  { name: 'Pubblicazioni', to: '/#pubblicazioni' },
  { name: 'Contatti', to: '/#contatti' },
  { name: 'Profilo', to: '/#profilo' }
]

console.log('test');
console.log(menuItems);
console.log(document.querySelectorAll('nav ul li a'))

const isOpen = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

import { onMounted } from 'vue'

onMounted(() => {
  const links = document.querySelectorAll('nav ul li a');
  console.log('links count:', links.length);
  links.forEach(link => console.log('link text:', link.textContent));
});


</script>

<template>
  <header class="bg-indigo-300 text-gray-900 shadow-md">
    <nav class="container mx-auto flex justify-between items-center p-4">
      
      <h1 class="text-xl font-bold">Gruppo di Ricerca</h1>

      <!-- Bottone hamburger visibile solo su mobile -->
      <button 
        @click="toggleMenu" 
        class="md:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" 
          viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path v-if="!isOpen" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Menu: visibile su desktop, toggle su mobile -->
  <ul
        class="flex-col md:flex md:flex-row md:gap-6 md:static absolute bg-indigo-300 md:bg-transparent w-full md:w-auto left-0 md:left-auto top-full md:top-auto transition-all duration-300"
        :class="isOpen ? 'flex' : 'hidden md:flex'"
        style="min-height: 100px;"
      >
        <li v-for="item in menuItems" :key="item.name" class="md:relative">
          <router-link 
            :to="item.to" 
            class="block px-4 py-2 md:px-0 md:py-0 hover:text-indigo-700 hover:border hover:border-indigo-700 rounded-md transition"
            @click="isOpen = false"
          >
            {{ item.name }}
          </router-link>
        </li>
      </ul>


    </nav>
  </header>
</template>
