<script setup>

const props = defineProps({
  publication: Object
})



</script>

<template>
  <div class="p-4 bg-indigo-50 rounded shadow hover:shadow-lg transition-shadow duration-300">
    <h3 class="font-semibold">{{ props.publication.title }}</h3>
    <p class="text-sm text-gray-600">{{ props.publication.description }}</p>

    <p class="text-xs text-gray-400">
      Data pubblicazione: {{ props.publication.publication_date }} 
    </p>

    <p class="text-xs text-gray-500 mt-1">
      Progetto di ricerca: {{ props.publication.research_project.title }}
    </p>
  </div>
</template>