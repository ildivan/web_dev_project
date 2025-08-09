<script setup>
import axiosInstance from '../axios'
import { useAuth } from '../composables/useAuth'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'


const title = ref('Welcome to the Research Hub')
const { logout } = useAuth()
const message = ref('')
const user = ref(null)
const error = ref('')
const router = useRouter()


// const fetchMainPage = async () => {
//   try {
//     const res = await axiosInstance.get('api/auth/users/me/')
//     user.value = res.data
//     return user.value
//   } catch (e) {
//     error.value = 'Errore nel recupero dati main page'
//     console.error(e)
//   }
// }

//dati simulati
const projects = ref([
  {
    id: 1,
    name: 'Intelligenza Artificiale per la Medicina',
    description: 'Sviluppo di algoritmi di AI per la diagnosi precoce.',
    status: 'Attivo'
  },
  {
    id: 2,
    name: 'Energia Rinnovabile e Storage',
    description: 'Tecnologie innovative per accumulo di energia solare.',
    status: 'Concluso'
  },
  {
    id: 3,
    name: 'Robotica per Ambienti Pericolosi',
    description: 'Progettazione di robot autonomi per missioni di salvataggio.',
    status: 'Attivo'
  }
])

// onMounted(() => {
//   fetchMainPage()
// })

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar/>

    <main class="flex-grow container mx-auto p-6">
      <section id="overview" class="container mx-auto py-12 px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Benvenuti nel nostro gruppo</h2>
        <p class="max-w-2xl mx-auto text-gray-600">
          Siamo un gruppo di ricerca universitario dedicato allo sviluppo di soluzioni innovative 
          nelle aree di Intelligenza Artificiale, Sicurezza Informatica e Data Science.
        </p>
      </section>


      <section id="progetti" class="bg-white py-12 px-4 rounded-lg shadow">
        <div class="container mx-auto">
          <h2 class="text-2xl font-bold mb-6 mb-12">Progetti di Ricerca</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="p-4 bg-gray-100 rounded shadow">
              <h3 class="font-semibold">Progetto 1</h3>
              <p class="text-sm text-gray-600">Descrizione breve del progetto...</p>
            </div>
            <div class="p-4 bg-gray-100 rounded shadow">
              <h3 class="font-semibold">Progetto 2</h3>
              <p class="text-sm text-gray-600">Descrizione breve del progetto...</p>
            </div>
            <div class="p-4 bg-gray-100 rounded shadow">
              <h3 class="font-semibold">Progetto 3</h3>
              <p class="text-sm text-gray-600">Descrizione breve del progetto...</p>
            </div>
          </div>
        </div>
      </section>
    </main>

      <!-- 
      va resa un apagina
      <section id="contatti" class="container mx-auto py-12 px-4 text-center">
        <h2 class="text-2xl font-bold mb-4">Contattaci</h2>
        <p class="text-gray-600">Email: info@grupporicerca.it</p>
      </section> -->
    
    <Footer/>

  </div>
</template>
