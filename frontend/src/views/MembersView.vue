<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import { getGroupComponents } from '../apiCalls/apiCalls.js'
import Button from '../components/Button.vue'
import Title from '../components/Title.vue'

const router = useRouter()
const welcomeMessage = ref('Componenti del Gruppo di Ricerca')

const components = ref([])

const currentPage = ref(1)
const pageSize = 4
const hasMore = ref(true)


async function loadComponents() {
  const data = await getGroupComponents(currentPage.value, pageSize)
  projects.value = [...components.value, ...data.results]

  if (!data.next) {
    hasMore.value = false
  }
}

function loadMore() {
  currentPage.value++
  loadProjects()
}

onMounted(() => {
  loadComponents()
  console.log('Components loaded:', components.value)
})

</script>

<template>
        <div class="flex flex-col min-h-screen bg-gray-50">
            <Navbar/>
            <main class="flex-grow pt-18">
            <section class="flex-grow flex justify-center items-center p-6">
                <div class="w-full max-w-3xl">
                    <Title title={{welcomeMessage}} class="mb-6" />

                    <div class="bg-white rounded-2xl shadow-lg p-8">
                        <h2 class="text-center text-2xl font-bold mb-6 text-gray-600">Our Team</h2>

                        <div class="space-y-6">
                            <div
                                v-for="contact in contacts"
                                :key="contact.email"
                                class="border border-indigo-300 rounded-xl p-4 bg-indigo-50 hover:bg-indigo-100 transition"
                                >
                                <h3 class="text-lg font-bold text-indigo-900">{{ contact.name }}</h3>
                                <p class="text-gray-700 font-medium">{{ contact.role }}</p>
                                <p class="text-gray-600">
                                    <span class="font-semibold">Email:</span>
                                    <a :href="`mailto:${contact.email}`" class="text-indigo-600 hover:underline">
                                    {{ contact.email }}
                                    </a>
                                </p>
                                <p class="text-gray-600">
                                    <span class="font-semibold">Phone:</span>
                                    <a :href="`tel:${contact.phone}`" class="text-indigo-600 hover:underline">
                                    {{ contact.phone }}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </main>
        </div>
  
    <Footer />
</template>
