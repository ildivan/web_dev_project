<script setup>
import { onMounted } from 'vue'
import ComponentCard from './cards/ComponentCard.vue'
import PublicationCard from './cards/PublicationCard.vue'
import  useProjects from '../composables/useProjects.js'

defineProps({
  project: { type: Object, required: true },
  researchArea: { type: Object, default: null },
  projectOwner: { type: Object, default: null },
  components: { type: Array, default: () => [] },
  publications: { type: Array, default: () => [] }
})

const {projects, fetchAllProjects} = useProjects()

onMounted(() => {
  const init = async () => {
    await fetchAllProjects()
  }
  init()
})
</script>

<template>
  <main class="flex-grow container max-w-6xl mx-auto p-6 mt-10">
    <!-- Sezione progetto -->
    <section class="bg-indigo-50 rounded-xl p-8 mb-8 shadow-md">
      <h2 class="text-3xl font-semibold text-indigo-700 mb-2">
        {{ project.title }}
      </h2>
      <p class="text-gray-600 mb-2">{{ project.description }}</p>
      <p class="text-xs text-gray-500 mt-1">
        Area di ricerca: {{ researchArea?.name || '-' }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        Owner: {{ projectOwner?.first_name }} {{ projectOwner?.last_name }}
      </p>
    </section>

    <!-- Sezione componenti -->
    <section v-if="components.length" class="mb-8">
      <h3 class="text-xl font-bold text-indigo-700 mb-4">Componenti</h3>
      <div class="flex flex-wrap gap-4">
        <ComponentCard
          v-for="component in components"
          :key="component.id"
          :component="component"
        />
      </div>
    </section>

    <!-- Sezione pubblicazioni -->
    <section v-if="publications.length" class="mb-8">
      <h3 class="text-xl font-bold text-indigo-700 mb-4">Pubblicazioni</h3>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <PublicationCard
          v-for="pub in publications"
          :key="pub.id"
          :publication="pub"
          :projects="projects"
        />
      </div>
    </section>
  </main>
</template>
