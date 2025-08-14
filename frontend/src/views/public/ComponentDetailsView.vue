<template>

  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar
        :menuItems = MENUS.home
    />

    <div v-if="loading" class="text-center my-8 text-lg text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center my-8 text-red-500">{{ error }}</div>
    <main v-else-if="component" class="flex-grow container max-w-8xl mx-auto p-6 mt-10">
      <section class="bg-violet-50 rounded-xl p-8 mb-8 shadow-md">
        <h2 class="text-3xl font-semibold text-violet-700 mb-2">
          {{ component.user.first_name }} {{ component.user.last_name }}
        </h2>
        <p class="text-violet-500 mb-1">@{{ component.user.username }}</p>
        <p class="text-violet-400 mb-1">{{ component.user.email }}</p>
        <div class="mb-2 flex flex-wrap gap-2">
          <span
            v-for="group in component.user.groups"
            :key="group"
            class="bg-violet-200 text-violet-700 rounded px-3 py-1 text-sm"
          >{{ group }}</span>
        </div>
        <p class="mt-4 text-gray-700" v-if="component.description">{{ component.description }}</p>
      </section>

      <section v-if="projects && projects.length" class="mb-8">
        <h3 class="text-xl font-bold text-violet-700 mb-4">Projects</h3>
        <div class="flex flex-wrap gap-4">
          <ProjectCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
          />
        </div>
      </section>

      <section v-if="owned_projects && owned_projects.length" class="mb-8">
        <h3 class="text-xl font-bold text-violet-700 mb-4">Owned Projects</h3>
        <div class="flex flex-wrap gap-4">
          <ProjectCard
            v-for="project in owned_projects"
            :key="project.id"
            :project="project"
          />
        </div>
      </section>

    <!--
    <section v-if="teached_courses && teached_courses.length" class="mb-8">
      <h3 class="text-xl font-bold text-violet-700 mb-4">Teached Courses</h3>
      <div class="flex flex-wrap gap-4">
        <div
        v-for="course in teached_courses"
        :key="course.id"
        class="bg-violet-100 rounded-lg px-6 py-4 min-w-[120px] text-center shadow"
        >
        <RouterLink
          :to="{ name: 'CourseDetails', params: { id: course.id } }"
          class="text-violet-700 hover:underline"
        >
          Course #{{ course.id }}
        </RouterLink>
        </div>
      </div>
    </section>
    -->

      <section v-if="publications && publications.length" class="mb-8">
        <h3 class="text-xl font-bold text-violet-700 mb-4">Publications</h3>
        <div class="flex flex-wrap gap-4">
          <PublicationCard
            v-for="pub in publications"
            :key="pub.id"
            :publication="pub"
          />
        </div>
      </section>
    </main>
    <div v-else>
      <p class="text-center text-gray-500">Component not found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProjectCard from '../../components/cards/ProjectCard.vue'
import PublicationCard from '../../components/cards/PublicationCard.vue'
import Navbar from '../../components/Navbar.vue'
import {MENUS} from '../../composables/menus.js'
import axios from '../../axios'

const route = useRoute()
const component = ref(null)
const projects = ref([])
const owned_projects = ref([])
const teached_courses = ref([])
const publications = ref([])
const loading = ref(true)
const error = ref(null)

const fetchComponent = async () => {
  loading.value = true
  error.value = null
  try {
    const id = route.params.id
    const res = await axios.get(`/api/group-components/${id}/`)
    component.value = res.data
    projects.value = []
    owned_projects.value = []
    teached_courses.value = []
    publications.value = []
  } catch (err) {
    error.value = 'Could not load component details.'
  } finally {
    loading.value = false
    for(const projectId of component.value.projects) {
      const projectRes = await axios.get(`/api/projects/${projectId}/`)
      projects.value = [...projects.value, projectRes.data]
    }
    for(const projectId of component.value.owned_projects) {
      const projectRes = await axios.get(`/api/projects/${projectId}/`)
      owned_projects.value = [...owned_projects.value, projectRes.data]
    }
    for(const courseId of component.value.teached_courses) {
      const courseRes = await axios.get(`/api/courses/${courseId}/`)
      teached_courses.value = [...teached_courses.value, courseRes.data]
    }
    for(const pubId of component.value.publications) {
      const pubRes = await axios.get(`/api/publications/${pubId}/`)
      publications.value = [...publications.value, pubRes.data]
    }
  }
}

onMounted(fetchComponent)
watch(() => route.params.id, fetchComponent)
</script>