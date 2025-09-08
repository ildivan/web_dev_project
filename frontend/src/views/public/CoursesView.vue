<script setup>
import { ref, onMounted } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { getCourses } from '../../apiCalls/apiCalls.js'
import Button from '../../components/Button.vue'
import Title from '../../components/Title.vue'
import CourseCard from '../../components/cards/CourseCard.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'

const { menu } = usePublicMenu()
const title = 'Corsi del Gruppo di Ricerca'

const courses = ref([])

const currentPage = ref(1)
const pageSize = 4
const hasMore = ref(true)



async function loadCourses() {
  const data = await getCourses(currentPage.value, pageSize)
  courses.value = [...courses.value, ...data.results]
  if (!data.next) {
    hasMore.value = false
  }
}

function loadMore() {
  currentPage.value++
  loadCourses()
}

onMounted(() => {
  loadCourses()
})

</script>

<template>
        <div class="flex flex-col min-h-screen bg-gray-50">
            <Navbar
                :menuItems="menu"
            />
            <main class="flex-grow pt-18">
            <section class="flex-grow flex justify-center items-center p-6">
                <div class="w-full max-w-3xl">
                    <Title :title="title"  class="mb-6" />

                    <div class="bg-white rounded-2xl shadow-lg p-8">
                        <h2 class="text-center text-2xl font-bold mb-6 text-gray-600">I nostri corsi</h2>

                       <div class="space-y-6">
                           <CourseCard
                                v-for="course in courses"
                                :key="course.id"
                                :course="course"
                            />
                            <div class="mt-8 text-center">
                            <Button
                                v-if="hasMore"
                                message="Carica altri corsi"
                                @click="loadMore"
                            />
                        </div>
                        </div>
                    </div>
                </div>
            </section>
            </main>
        </div>
  
    <Footer />
</template>
