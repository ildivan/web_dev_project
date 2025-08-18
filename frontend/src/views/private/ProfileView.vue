<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { useAuth } from '../../composables/useAuth'
import { MENUS } from '../../composables/menus.js'
import { isComponent } from '../../apiCalls/apiCalls.js'

const router = useRouter()
const welcomeMessage = ref('Benvenuto nel tuo hub!')
const tempMessage = ref('')
const { logoutUser } = useAuth()

const logout = () => {
  logoutUser()
  router.push('/')
}

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
  { key: 'overview', label: 'Panoramica' },
  { key: 'settings', label: 'Impostazioni' },
  { key: 'security', label: 'Sicurezza' },
]
const selectedMenu = ref('overview')
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

// helpers used in template to avoid ref/arrow quirks
const selectedLabel = computed(() => {
  const found = menuOptions.find(opt => opt.key === selectedMenu.value)
  return found ? found.label : 'Menu'
})
const isSelected = (key) => selectedMenu.value === key
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <!-- Navbar con pulsanti Home e Logout -->
    <Navbar
        :menuItems = MENUS.profile
    />

    <main class="flex-grow container max-w-6xl mx-auto p-2 sm:p-4 md:p-6 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <!-- Sidebar Menu (single dropdown for all sizes) -->
        <aside class="w-full md:w-64 mb-2 md:mb-0">
          <!-- Always-visible dropdown button -->
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

          <!-- Unified dropdown used on all viewports -->
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

        <!-- Main Content -->
        <section class="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px]">
          <template v-if="selectedMenu === 'overview'">
            <h2 class="text-3xl font-bold mb-4">{{ welcomeMessage }}</h2>
            <p class="text-lg mb-6">{{ tempMessage }}</p>
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
