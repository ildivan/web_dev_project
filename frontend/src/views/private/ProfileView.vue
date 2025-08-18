<script setup>
import { ref, onMounted, computed } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { useLoggedUser } from '../../composables/useLoggedUser.js'
import { MENUS } from '../../composables/menus.js'
import { isComponent } from '../../apiCalls/apiCalls.js'
import ProfileContent from '../../components/ProfileContent.vue'

const tempMessage = ref('')
const { loading,
        error,
        userId,
        component,
        projects,
        ownedProjects,
        teachedCourses,
        publications} = useLoggedUser()

const checkIfComponent = async () => {
  try {
    const response = await isComponent()
    if (response.is_component) {
      tempMessage.value = 'Benvenuto nel tuo hub, Componente!'
    } else {
      tempMessage.value = 'Benvenuto nel tuo hub!'
    }
  } catch (error) {
    console.error('Errore durante il recupero dello stato del componente:', error)
  }
}

onMounted(() => {
  checkIfComponent()
})

const menuOptions = [
  { key: 'info', label: 'Panoramica' },
  { key: 'settings', label: 'Impostazioni' },
  { key: 'security', label: 'Sicurezza' },
]
const selectedMenu = ref('info')
const mobileMenuOpen = ref(false)

const selectOption = (option) => {
  if (option.action) {
    option.action()
  } else {
    selectedMenu.value = option.key
  }
  mobileMenuOpen.value = false
}
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}


const selectedLabel = computed(() => {
  const found = menuOptions.find(opt => opt.key === selectedMenu.value)
  return found ? found.label : 'Menu'
})
const isSelected = (key) => selectedMenu.value === key
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <Navbar
        :menuItems = MENUS.profile
    />

    <main class="flex-grow container max-w-6xl mx-auto p-2 sm:p-4 md:p-6 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <aside class="w-full md:w-64 mb-2 md:mb-0">
          <button
            class="w-full bg-white border border-violet-200 rounded-lg px-4 py-3 mb-2 flex justify-between items-center"
            @click="toggleMobileMenu"
            aria-expanded="mobileMenuOpen"
            aria-controls="profile-menu"
          >
            <span>{{ selectedLabel }}</span>
            <svg :class="{'transform rotate-180': mobileMenuOpen}" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <div id="profile-menu" v-show="mobileMenuOpen" class="bg-white border border-violet-200 rounded-lg shadow mb-2 z-20">
            <button
              v-for="option in menuOptions"
              :key="option.key"
              @click="selectOption(option)"
              :class="[
                'block w-full text-left px-4 py-2 rounded transition',
                isSelected(option.key) ? 'bg-violet-100 text-violet-700 font-semibold' : 'hover:bg-gray-100'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </aside>

        <section class="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px]">
          <template v-if="selectedMenu === 'info'">
            <ProfileContent
              v-if="!loading && !error"
              :component="component"
              :projects="projects"
              :owned-projects="ownedProjects"
              :teached-courses="teachedCourses"
              :publications="publications"
            />
            <div v-else-if="loading">
              <h2 class="text-2xl font-bold mb-4">Loading profile...</h2>
            </div>
            <div v-else>
              <h2 class="text-2xl font-bold mb-4">Benvenuto</h2>
              <p>Questa pagina è vuota in quanto non sei un componente del gruppo.</p>
            </div>
          </template>
          <template v-else-if="selectedMenu === 'settings'">
            <h2 class="text-2xl font-bold mb-4">Impostazioni</h2>
            <p>Qui puoi modificare le tue impostazioni.</p>
          </template>
          <template v-else-if="selectedMenu === 'security'">
            <h2 class="text-2xl font-bold mb-4">Sicurezza</h2>
            <p>Gestisci le impostazioni di sicurezza del tuo account.</p>
          </template>
        </section>
      </div>
    </main>

    <Footer/>
  </div>
</template>
