<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import PublicationContent from '../../components/PublicationContent.vue'
import { usePublication } from '../../composables/usePublication.js'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import Footer from '../../components/Footer.vue'

const { menu } = usePublicMenu()
const route = useRoute()

// Passiamo una funzione che restituisce l'id della publication dai params
const {
  loading,
  error,
  publication,
  researchProject,
  components,
  fetchPublicationData,
} = usePublication(() => route.params.id)

// Rifetch se cambia l'id della route
watch(
  () => route.params.id,
  async (newId) => {
    await fetchPublicationData()
  }
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar :menuItems="menu" />
    <main class="flex-grow pt-18">
      <div v-if="loading" class="text-center my-8 text-lg text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-center my-8 text-red-500">{{ error }}</div>

      <PublicationContent
        v-else-if="publication && components"
        :publication="publication"
        :research-project="researchProject"
        :components="components"
      />

      <div v-else>
        <p class="text-center text-gray-500">Publication not found.</p>
      </div>
    </main>

    <Footer />
  </div>
</template>
