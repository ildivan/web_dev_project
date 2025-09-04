<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import Footer from '../../components/Footer.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import { useCourse } from '../../composables/useCourse.js'
import CourseContent from '../../components/CourseContent.vue'

const { menu } = usePublicMenu()
const route = useRoute()
const id = route.params.id

const {
  loading,
  error,
  course,
  components,
  fetchCourseData,
  updateCourseData
} = useCourse(() => id)

onMounted(() => {
  fetchCourseData()
})

// Ricarica se cambia l'id nel router
watch(
  () => route.params.id,
  async () => {
    await fetchCourseData()
  }
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar :menuItems="menu" />
    <main class="flex-grow pt-18">
      <div v-if="loading" class="text-center my-8 text-lg text-gray-500">
        Loading...
      </div>

      <div v-else-if="error" class="text-center my-8 text-red-500">
        {{ error }}
      </div>

      <CourseContent
        v-else-if="course"
        :course="course"
        :components="components"
        @updateCourse="updateCourseData"
      />

      <div v-else>
        <p class="text-center text-gray-500">Course not found.</p>
      </div>
    </main>
    <Footer />
  </div>
</template>
