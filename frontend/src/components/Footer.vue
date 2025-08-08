<script setup>
import { ref } from 'vue';

const authorName = ref('Riccardo Modina, Ivan Abrami'); 
const appVersion = ref('0.0.1');
const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <footer class="bg-gray-50 text-slate-700 py-6 text-center rounded-b-xl font-sans select-none shadow-inner">
    <p class="text-sm">&copy; {{ currentYear }} by {{ authorName }}</p>
    <p class="text-sm">Version {{ appVersion }}</p>
  </footer>
</template>
