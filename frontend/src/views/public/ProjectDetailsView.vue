<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import ProjectContent from '../../components/ProjectContent.vue'
import { useProject } from '../../composables/useProject.js'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import Footer from '../../components/Footer.vue'

const { menu } = usePublicMenu()
const route = useRoute()

// Hook personalizzato
const {
  loading,
  error,
  project,
  researchArea,
  projectOwner,
  components,
  publications,
  fetchProjectData,
} = useProject(() => route.params.id)

// Rifetch se cambia l'id della route
watch(
  () => route.params.id,
  async () => {
    await fetchProjectData()
  }
)

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar :menuItems="menu" />
    <main class="flex-grow pt-18">
      <div v-if="loading" class="text-center my-8 text-lg text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-center my-8 text-red-500">{{ error }}</div>

      <ProjectContent
        v-else-if="project"
        :project="project"
        :research-area="researchArea"
        :project-owner="projectOwner"
        :components="components"
        :publications="publications"
      />

      <div v-else>
        <p class="text-center text-gray-500">Project not found.</p>
      </div>
    </main>
    <Footer />
  </div>
</template>
