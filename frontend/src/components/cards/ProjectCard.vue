<script setup>
import { computed } from 'vue'

const props = defineProps({
  project: Object
})


const statusClass = computed(() => {
  return props.project.end_date ? 'text-red-600' : 'text-green-600'
})
</script>

<template>
  <div class="p-4 bg-gray-100 rounded shadow hover:shadow-lg transition-shadow duration-300">
    <h3 class="font-semibold">{{ props.project.title }}</h3>
    <p class="text-sm text-gray-600">{{ props.project.description }}</p>

    <!-- Status derivato da end_date -->
    <p class="mt-2 text-xs font-medium text-gray-500">
      Stato: 
      <span :class="statusClass">
        {{ props.project.end_date ? 'Concluso' : 'Attivo' }}
      </span>
    </p>

    <!-- Date -->
    <p class="text-xs text-gray-400">
      Da: {{ props.project.start_date }} 
      <span v-if="props.project.end_date"> - A: {{ props.project.end_date }}</span>
    </p>

    <!-- Research area -->
    <p class="text-xs text-gray-500 mt-1">
      Area: {{ props.project.research_area?.name || 'N/A' }}
    </p>
  </div>
</template>