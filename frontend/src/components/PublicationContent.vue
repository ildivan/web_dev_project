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
    </section>
    <section class="mb-8">
      <h3 class="text-xl font-bold text-indigo-700 mb-2">Data pubblicazione</h3>
      <p class="text-gray-600">{{ publication.publication_date }}</p>
    </section>

    <section class="mb-8">
      <h3 class="text-xl font-bold text-indigo-700 mb-2">Progetto di ricerca</h3>
      <RouterLink
        v-if="researchProject?.id"
        :to="`/projects/${researchProject.id}`"
        class="text-grey-600 hover:underline"
      >
        {{ getProjectTitle(researchProject) }}
      </RouterLink>
    </section>


    <!-- Sezione componenti -->
    <section v-if="components && components.length" class="mb-8">
      <h3 class="text-xl font-bold text-indigo-700 mb-4">Autori</h3>
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
