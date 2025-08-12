<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import ProjectCard from '../components/ProjectCard.vue'
import { getProjects } from '../apiCalls/apiCalls.js'
import Button from '../components/Button.vue'

const router = useRouter()
const welcomeMessage = ref('Benvenuti nel nostro gruppo di ricerca!')
const description = ref('Siamo un team dedicato allo sviluppo di soluzioni innovative nelle aree di Intelligenza Artificiale, Sicurezza Informatica e Data Science. Esplora i nostri progetti e le nostre ricerche per scoprire come stiamo contribuendo al progresso tecnologico e scientifico.')
const projectViewTitle = ref('Progetti di Ricerca')


const projects = ref([])

const goToAllProjects = () => {
  router.push('/projects')
}

onMounted(() => {
  getProjects(1,4).then(data => {
    projects.value = data.results
  })
  
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar/>

    <main class="flex-grow container max-w-8xl mx-auto p-6 mt-10">
      <section id="overview" class="container mx-auto py-12 px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{welcomeMessage}}</h2>
        <p class="max-w-2xl mx-auto text-gray-600">
          {{description}}
        </p>
      </section>

      <section id="progetti" class="bg-white py-12 px-4 rounded-lg shadow">
        <div class="container mx-auto">
          <h2 class="text-2xl font-bold mb-12">{{ projectViewTitle }}</h2>
          <div class="grid md:grid-cols-1 gap-6">
            <ProjectCard
              v-for="project in projects"
              :key="project.id"
              :project="project"
            />
          </div>


          <div class="mt-8 text-center">
            <Button
              message="Mostra tutti i progetti"
              @click="goToAllProjects">
            </Button>
          </div>
        </div>
      </section>
    </main>

    <Footer/>
  </div>
</template>
