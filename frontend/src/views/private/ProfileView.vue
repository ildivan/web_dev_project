<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import Button from '../../components/Button.vue'
import { useAuth } from '../../composables/useAuth';
import { MENUS } from '../../composables/menus.js';
import { isComponent } from '../../apiCalls/apiCalls.js';

const router = useRouter()
const welcomeMessage = ref('Benvenuto nel tuo hub!')
const tempMessage = ref('')
const { logoutUser } = useAuth();

const logout = () => {
  logoutUser()
  router.push('/')
}

const checkIfComponent = async () => {
  try {
    const response = await isComponent();
    if (response.is_component) {
      tempMessage.value = 'Benvenuto nel tuo hub, Componente!'
    } else {
      tempMessage.value = 'Benvenuto nel tuo hub!'
    }
  } catch (error) {
    console.error('Errore durante il recupero dello stato del componente:', error);
  }
}

onMounted(() => {
  checkIfComponent();
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <!-- Navbar con pulsanti Home e Logout -->
    <Navbar
        :menuItems = MENUS.profile
    />

    <main class="flex-grow container max-w-6xl mx-auto p-6 mt-10">
      <section id="overview" class="container mx-auto py-12 px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{welcomeMessage}}</h2>
        <p class="text-lg mb-6">{{tempMessage}}</p>
      </section>

      <section class="mb-12">
        
      </section>
    </main>

    <Footer/>
  </div>
</template>
