<script setup>

const props = defineProps({
  project: Object
})

</script>

<template>
  <div class="p-4 bg-indigo-50 rounded shadow hover:shadow-lg transition-shadow duration-300">
    <h3 class="font-semibold">{{ props.project.title }}</h3>
    <p class="text-sm text-gray-600">{{ props.project.description }}</p>

    <p class="text-xs text-gray-400">
      Data pubblicazione: {{ props.project.publication_date }} 
    </p>

    <p class="text-xs text-gray-500 mt-1">
      Progetto di ricerca: {{ props.project.research_project_detail.title }}
    </p>

    <div v-if="props.project.components_detail?.length" class="mt-2">
      <p class="text-xs font-semibold">Componenti:</p>
      <ul class="text-xs text-gray-600 list-disc list-inside">
        <li v-for="comp in props.project.components_detail" :key="comp.id">
          {{ comp.name }} — {{ comp.user.first_name }} {{ comp.user.last_name }}
        </li>
      </ul>
    </div>

  </div>
</template>