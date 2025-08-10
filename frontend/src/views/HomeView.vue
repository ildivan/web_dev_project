<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import ProjectCard from '../components/ProjectCard.vue'
import axiosInstance from '../axios' 

const router = useRouter()
const welcomeMessage = ref('Benvenuti nel nostro gruppo di ricerca!')
const description = ref('Siamo un team dedicato allo sviluppo di soluzioni innovative nelle aree di Intelligenza Artificiale, Sicurezza Informatica e Data Science. Esplora i nostri progetti e le nostre ricerche per scoprire come stiamo contribuendo al progresso tecnologico e scientifico.')
const projectViewTitle = ref('Progetti di Ricerca')
// tutti i progetti
// const projects = ref([
//   { id: 1, name: 'Intelligenza Artificiale per la Medicina', description: 'Sviluppo di algoritmi di AI per la diagnosi precoce.', status: 'Attivo' },
//   { id: 2, name: 'Energia Rinnovabile e Storage', description: 'Tecnologie innovative per accumulo di energia solare.', status: 'Concluso' },
//   { id: 3, name: 'Robotica per Ambienti Pericolosi', description: 'Progettazione di robot autonomi per missioni di salvataggio.', status: 'Attivo' },
//   { id: 4, name: 'Sicurezza Informatica Avanzata', description: 'Sistemi di difesa e rilevamento minacce informatiche.', status: 'In sviluppo' },
//   { id: 5, name: 'Analisi di Big Data per la Climatologia', description: 'Studio di modelli climatici usando dataset di grandi dimensioni.', status: 'Attivo' },
//   { id: 6, name: 'Biotecnologie per l’Agricoltura', description: 'Tecniche innovative per aumentare la resa agricola sostenibile.', status: 'Concluso' },
//   { id: 7, name: 'Machine Learning per la Prevenzione Sismica', description: 'Modelli predittivi per identificare segnali precursori di terremoti.', status: 'In sviluppo' },
//   { id: 8, name: 'Nanotecnologie per la Medicina Rigenerativa', description: 'Utilizzo di nanoparticelle per la rigenerazione di tessuti danneggiati.', status: 'Attivo' },
//   { id: 9, name: 'Blockchain per la Tracciabilità Alimentare', description: 'Sistemi decentralizzati per garantire la sicurezza della filiera alimentare.', status: 'Attivo' },
//   { id: 10, name: 'Sistemi di Visione Artificiale per la Qualità Industriale', description: 'Telecamere intelligenti per rilevare difetti in produzione.', status: 'Concluso' }
// ])

const projects = ref([])  // array vuoto inizialmente
const authError = ref(null)  // per gestire errori

const fetchProjects = async () => {
  try {
    const response = await axiosInstance.get('api/projects')
    projects.value = response.data  // assegna i dati ricevuti
  } catch (err) {
    authError.value = err.response?.data || 'Failed to fetch projects'
    console.error(err)
  }
}

// quanti progetti mostrare in home
const visibleCount = ref(6) // mostra solo 6, cambia in base al layout
const visibleProjects = computed(() => projects.value.slice(0, visibleCount.value))

const goToAllProjects = () => {
  router.push('/progetti') // pagina dedicata con lista completa
}

onMounted(() => {
  fetchProjects()
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
              v-for="project in visibleProjects"
              :key="project.id"
              :project="project"
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
