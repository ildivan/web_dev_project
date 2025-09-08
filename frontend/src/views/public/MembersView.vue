<script setup>
import { ref, computed, onMounted } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { getGroupComponents } from '../../apiCalls/apiCalls.js'
import Button from '../../components/Button.vue'
import Title from '../../components/Title.vue'
import ComponentCard from '../../components/cards/ComponentCard.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'

const { menu } = usePublicMenu()
const title = 'Componenti del Gruppo di Ricerca'

const components = ref([])

const currentPage = ref(1)
const pageSize = 4
const hasMore = ref(true)



async function loadComponents() {
  const data = await getGroupComponents(currentPage.value, pageSize)
  components.value = [...components.value, ...data.results]
  if (!data.next) {
    hasMore.value = false
  }
}

function loadMore() {
  currentPage.value++
  loadComponents()
}

onMounted(() => {
  loadComponents()
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
                        <h2 class="text-center text-2xl font-bold mb-6 text-gray-600">Il nostro team</h2>

                       <div class="space-y-6">
                           <ComponentCard
                                v-for="component in components"
                                :key="component.id"
                                :component="component"
                            />
                            <div class="mt-8 text-center">
                            <Button
                                v-if="hasMore"
                                message="Carica altri componenti"
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
