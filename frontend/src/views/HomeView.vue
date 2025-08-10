<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import ProjectListItem from '../components/ProjectListItem.vue'
import { getProjects } from '../apiCalls/apiCalls.js'

const router = useRouter()

// tutti i progetti
const projects = ref([])

onMounted(() => {
  getProjects().then(data => {
    projects.value.results = data
  })
})

// quanti progetti mostrare in home
const visibleCount = ref(6) // mostra solo 6, cambia in base al layout
const visibleProjects = computed(() => projects.value.slice(0, visibleCount.value))

const goToAllProjects = () => {
  router.push('/progetti') // pagina dedicata con lista completa
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar/>

    <main class="flex-grow container max-w-8xl mx-auto p-6 mt-10">
      <section id="overview" class="container mx-auto py-12 px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Benvenuti nel nostro gruppo</h2>
        <p class="max-w-2xl mx-auto text-gray-600">
          Siamo un gruppo di ricerca universitario dedicato allo sviluppo di soluzioni innovative 
          nelle aree di Intelligenza Artificiale, Sicurezza Informatica e Data Science.
        </p>
      </section>

      <section id="progetti" class="bg-white py-12 px-4 rounded-lg shadow">
        <div class="container mx-auto">
          <h2 class="text-2xl font-bold mb-12">Progetti di Ricerca</h2>
          <div class="grid md:grid-cols-1 gap-6">
            <ProjectListItem
              v-for="project in visibleProjects"
              :key="project.id"
              :name="project.name"
              :description="project.description"
              :status="project.status"
            />
          </div>

          <div class="mt-8 text-center">
            <button 
              @click="goToAllProjects"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Mostra tutti i progetti
            </button>
          </div>
        </div>
      </section>
    </main>

    <Footer/>
  </div>
</template>
