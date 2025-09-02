
<script setup>
import Navbar from '../../components/Navbar.vue'
import Footer from '../../components/Footer.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'

const { menu } = usePublicMenu()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-violet-600 to-white">
    <Navbar 
        :menuItems="menu"
    />
    <main class="flex-grow flex flex-col items-center justify-center">
      <div class="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full">
        <svg class="w-20 h-20 text-violet-600 mb-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5"/>
        </svg>
        <h1 class="text-3xl font-bold text-violet-700 mb-2">Accesso Negato</h1>
        <p class="text-gray-700 mb-6 text-center">
          Non sei autorizzato ad accedere a questa pagina.<br>
          Se pensi che si tratti di un errore, contatta l'amministratore.
        </p>
        <router-link to="/" class="inline-block px-6 py-2 rounded-lg bg-violet-600 text-white font-semibold shadow hover:bg-violet-700 transition">
          Torna alla Home
        </router-link>
      </div>
    </main>
    <Footer />
  </div>
</template>


<style scoped>
/* Optional: subtle animation */
@keyframes pop {
  0% { transform: scale(0.95); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}
div.bg-white {
  animation: pop 0.5s cubic-bezier(.4,2,.6,1)
}
</style>