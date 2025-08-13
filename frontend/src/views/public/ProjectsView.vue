<script setup>
import { ref, computed, onMounted } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import ProjectCard from '../../components/cards/ProjectCard.vue'
import { getProjects } from '../../apiCalls/apiCalls.js'
import Button from '../../components/Button.vue'
import { MENUS } from '../../composables/menus.js';

const welcomeMessage = ref('I nostri progetti')

const projects = ref([])
const selectedFilters = ref([]) // selected active filters
const filterPanelOpen = ref(false)

const currentPage = ref(1)
const pageSize = 4
const hasMore = ref(true)

const searchQuery = ref('')


async function loadProjects() {
  const data = await getProjects(currentPage.value, pageSize)
  projects.value = [...projects.value, ...data.results]

  if (!data.next) {
    hasMore.value = false
  }
}


function loadMore() {
  currentPage.value++
  loadProjects()
}

onMounted(() => {
  loadProjects()
})

const getStatus = (project) => {
  return project.end_date ? 'finished' : 'active'
}


const filteredProjects = computed(() => {
  let filtered = projects.value
  //state filters
  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter(project =>
      selectedFilters.value.includes(getStatus(project))
    )
  }
  //search query filter
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project =>
      project.title?.toLowerCase().includes(query)
      //  ||
      // project.description?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const toggleFilterPanel = () => {
  filterPanelOpen.value = !filterPanelOpen.value
}
</script>



<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar
        :menuItems = MENUS.home
    />

    <main class="flex-grow container max-w-8xl mx-auto p-6 mt-10">
        <section id="overview" class="container mx-auto py-12 px-4 text-center">
            <h2 class="text-3xl font-bold mb-4">{{ welcomeMessage }}</h2>
        </section>

        <section id="progetti" class="bg-white py-6 px-4 rounded-lg shadow relative">
            <div class="container mx-auto">
            <div class="flex items-center justify-between mb-4">
               <Button
                  message="Filtra"
                  @click="toggleFilterPanel"
                  class="mr-4"
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cerca progetti..."
                  class="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>  

                <!-- flex div for projects and filters -->
                <div class="flex transition-all duration-300">

                    <!-- filter panel -->
                    <transition name="slide-side">
                        <div 
                        v-if="filterPanelOpen" 
                        class="w-64 bg-gray-100 shadow-lg rounded-lg p-4 relative flex-shrink-0 mr-4"
                        >

                            <button 
                                @click="filterPanelOpen = false"
                                class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>

                            <div class="space-y-2">
                                <label class="flex items-center space-x-2">
                                <input 
                                    type="checkbox" 
                                    value="active"
                                    v-model="selectedFilters"
                                    class="w-3 h-3 bg-white rounded-sm border border-gray-300 !appearance-none checked:bg-indigo-500 transition-colors duration-200"
                                    style="box-shadow: inset 0 1px 2px rgba(0,0,0,0.10);"

                                />
                                <span 
                                class="px-2 py-1 rounded-md hover:bg-gray-300 transition-colors duration-300"
                                >
                                    Attivi
                                </span>
                                </label>
                                <label class="flex items-center space-x-2">
                                <input 
                                    type="checkbox" 
                                    value="finished"
                                    v-model="selectedFilters"
                                    class="w-3 h-3 bg-white rounded-sm border border-gray-300 !appearance-none checked:bg-indigo-500 transition-colors duration-200"
                                    style="box-shadow: inset 0 1px 2px rgba(0,0,0,0.10);"
                                />
                                <span 
                                class="px-2 py-1 rounded-md hover:bg-gray-300 transition-colors duration-300"
                                >
                                    Conclusi
                                </span>
                                </label>
                            </div>
                        </div>
                    </transition>

                    <div class="grid md:grid-cols-1 gap-6">
                        <ProjectCard
                        v-for="project in filteredProjects"
                        :key="project.id"
                        :project="project"
                        />
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <Button
                        v-if="hasMore"
                        message="Carica altri progetti"
                        @click="loadMore"
                    />
                </div>
            </div>
        </section>
    </main>

    <Footer/>
  </div>
</template>

<style>
.slide-side-enter-active,
.slide-side-leave-active {
  transition: width 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.slide-side-enter-from,
.slide-side-leave-to {
  width: 0;
  opacity: 0;
  padding-left: 0;
  padding-right: 0;
  margin-right: 0;
}

.slide-side-enter-to,
.slide-side-leave-from {
  width: 16rem; 
  opacity: 1;
  padding-left: 1rem;  
  padding-right: 1rem;
  margin-right: 1rem; 
}

</style>