<script setup>

const props = defineProps({
  publication: Object
})



</script>

<template>
  <!-- changed: make card take available width in flex layouts (min-w-0) and allow wrapping -->
  <div class="w-full p-4 bg-indigo-50 rounded shadow hover:shadow-lg transition-shadow duration-300">
    <h3 class="font-semibold break-words whitespace-normal">
      {{ props.publication.title }}
    </h3>

    <p class="text-sm text-gray-600 whitespace-normal break-words mt-2">
      {{ props.publication.description }}
    </p>

    <p class="text-xs text-gray-400 mt-2">
      Data pubblicazione: {{ props.publication.publication_date }}
    </p>

    <p class="text-xs text-gray-500 mt-1 whitespace-normal break-words">
      Progetto di ricerca: {{ props.publication.research_project?.title || '-' }}
    </p>
  </div>
</template>