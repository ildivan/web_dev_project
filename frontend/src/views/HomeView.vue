<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'

const router = useRouter()

// tutti i progetti
const projects = ref([
  { id: 1, name: 'Intelligenza Artificiale per la Medicina', description: 'Sviluppo di algoritmi di AI per la diagnosi precoce.', status: 'Attivo' },
  { id: 2, name: 'Energia Rinnovabile e Storage', description: 'Tecnologie innovative per accumulo di energia solare.', status: 'Concluso' },
  { id: 3, name: 'Robotica per Ambienti Pericolosi', description: 'Progettazione di robot autonomi per missioni di salvataggio.', status: 'Attivo' },
  { id: 4, name: 'Sicurezza Informatica Avanzata', description: 'Sistemi di difesa e rilevamento minacce informatiche.', status: 'In sviluppo' },
  { id: 5, name: 'Analisi di Big Data per la Climatologia', description: 'Studio di modelli climatici usando dataset di grandi dimensioni.', status: 'Attivo' },
  { id: 6, name: 'Biotecnologie per l’Agricoltura', description: 'Tecniche innovative per aumentare la resa agricola sostenibile.', status: 'Concluso' },
  { id: 7, name: 'Machine Learning per la Prevenzione Sismica', description: 'Modelli predittivi per identificare segnali precursori di terremoti.', status: 'In sviluppo' },
  { id: 8, name: 'Nanotecnologie per la Medicina Rigenerativa', description: 'Utilizzo di nanoparticelle per la rigenerazione di tessuti danneggiati.', status: 'Attivo' },
  { id: 9, name: 'Blockchain per la Tracciabilità Alimentare', description: 'Sistemi decentralizzati per garantire la sicurezza della filiera alimentare.', status: 'Attivo' },
  { id: 10, name: 'Sistemi di Visione Artificiale per la Qualità Industriale', description: 'Telecamere intelligenti per rilevare difetti in produzione.', status: 'Concluso' }
])

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
            <div 
              v-for="project in visibleProjects" 
              :key="project.id" 
              class="p-4 bg-gray-100 rounded shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h3 class="font-semibold">{{ project.name }}</h3>
              <p class="text-sm text-gray-600">{{ project.description }}</p>
              <p class="mt-2 text-xs font-medium text-gray-500">
                Stato: <span :class="{
                  'text-green-600': project.status === 'Attivo',
                  'text-red-600': project.status === 'Concluso',
                  'text-yellow-600': project.status === 'In sviluppo'
                }">{{ project.status }}</span>
              </p>
            </div>
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
