<script setup>
import ComponentCard from './cards/ComponentCard.vue'

defineProps({
  publication: {
    type: Object,
    required: true
  },
  researchProject: {
    type: Object,
    default: null
  },
  components: {
    type: Array,
    default: () => []
  }
})

// Helper per visualizzare il titolo del progetto
const getProjectTitle = (project) => {
  return project?.title || '-'
}
</script>

<template>
  <main class="flex-grow container max-w-8xl mx-auto p-6 mt-10">
    
    <!-- Sezione pubblicazione -->
    <section class="bg-indigo-50 rounded-xl p-8 mb-8 shadow-md">
      <h2 class="text-3xl font-semibold text-indigo-700 mb-2">
        {{ publication.title }}
      </h2>
      <p class="text-gray-600 mb-2">{{ publication.description }}</p>
      <p class="text-xs text-gray-400">
        Data pubblicazione: {{ publication.publication_date }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        Progetto di ricerca: {{ getProjectTitle(researchProject) }}
      </p>
    </section>

    <!-- Sezione componenti -->
    <section v-if="components && components.length" class="mb-8">
      <h3 class="text-xl font-bold text-indigo-700 mb-4">Components</h3>
      <div class="flex flex-wrap gap-4">
        <ComponentCard
          v-for="component in components"
          :key="component.id"
          :component="component"
        />
      </div>
    </section>
    
  </main>
</template>
