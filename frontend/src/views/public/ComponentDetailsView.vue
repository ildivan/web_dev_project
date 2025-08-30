<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import ProfileContent from '../../components/ProfileContent.vue'
import { useComponent } from '../../composables/useComponent.js'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import useProjects from '../../composables/useProjects.js'

const { menu } = usePublicMenu()
const route = useRoute()
const id = route.params.id
const {
  loading,
  error,
  component,
  projects,
  ownedProjects,
  teachedCourses,
  publications,
  fetchComponentData
} = useComponent(() => id)
const {projects: allProjects, fetchAllProjects} = useProjects()

onMounted(() => {
  fetchAllProjects()
})

// Refetch if route param changes
watch(
  () => route.params.id,
  async (newId) => {
    await fetchComponentData(newId)
  }
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar :menuItems="menu" />
    <main class="flex-grow pt-18">
      <div v-if="loading" class="text-center my-8 text-lg text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-center my-8 text-red-500">{{ error }}</div>
  
      <ProfileContent
        v-else-if="component"
        :component="component"
        :projects="projects"
        :allProjects="allProjects"
        :ownedProjects="ownedProjects"
        :teachedCourses="teachedCourses"
        :publications="publications"
      />
  
      <div v-else>
        <p class="text-center text-gray-500">Component not found.</p>
      </div>
    </main>
  </div>
</template>
