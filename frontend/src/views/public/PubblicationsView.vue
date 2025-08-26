<script setup>
import { ref, computed, onMounted } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { getPublications } from '../../apiCalls/apiCalls.js'
import Button from '../../components/Button.vue'
import PublicationCard from '../../components/cards/PublicationCard.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import EntitySelect from '../../components/entity_edit/EntitySelect.vue'


const { menu } = usePublicMenu()
const welcomeMessage = ref('Pubblicazioni')

const publications = ref([])
const selectedFilters = ref([])
const selectedProjects = ref([])
// const filterPanelOpen = ref(false)

const currentPage = ref(1)
const pageSize = 4
const hasMore = ref(true)

const searchQuery = ref('')


async function loadPublications() {
  const data = await getPublications(currentPage.value, pageSize)
  publications.value = [...publications.value, ...data.results]
  if (!data.next) {
    hasMore.value = false
  }
}


function loadMore() {
  currentPage.value++
  loadPublications()
}

onMounted(() => {
  loadPublications()
})

const projects = computed(() => {
  const allProjects = publications.value
    .map(pub => pub.research_project?.title)
    .filter(Boolean)
  const unique = [...new Set(allProjects)]
  return unique.map(title => ({ label: title, value: title }))
})



const filteredPublications = computed(() => {
  let filtered = publications.value
  //state filters
  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter(publication =>
      selectedFilters.value.includes(getStatus(publication))
    )
  }
  //search query filter
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(publication =>
      publication.title?.toLowerCase().includes(query)
      //  ||
      // project.description?.toLowerCase().includes(query)
    )
  }

  // filtro per progetti multiselect
  if (selectedProjects.value.length > 0) {
    filtered = filtered.filter(pub =>
      selectedProjects.value.some(proj => proj.value === pub.research_project?.title)
    )
  }


  return filtered
})

// const toggleFilterPanel = () => {
//   filterPanelOpen.value = !filterPanelOpen.value
// }
</script>



<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar
        :menuItems="menu"
    />

    <main class="flex-grow container max-w-8xl mx-auto p-6 mt-10">
        <section id="overview" class="container mx-auto py-12 px-4 text-center">
            <h2 class="text-3xl font-bold mb-4">{{ welcomeMessage }}</h2>
        </section>

        <section id="pubblicazioni" class="bg-white py-6 px-4 rounded-lg shadow relative">
            <div class="container mx-auto">
                <div class="flex items-center justify-between mb-4">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Cerca pubblicazioni..."
                      class="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>  
                
                <div class="flex items-center justify-between mb-4">
               <EntitySelect
                  v-model="selectedProjects"
                  :options="projects"
                  multiple
                  placeholder="Filtra per progetto"
                  label="label"
                  track-by="value"
                  class="flex-1"
                />



                </div>


                <div class="flex transition-all duration-300">
                    <div class="w-full space-y-6">
                        <PublicationCard
                        v-for="publication in filteredPublications"
                        :key="publication.id"
                        :publication="publication"
                        />
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <Button
                        v-if="hasMore"
                        message="Carica altre pubblicazioni"
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