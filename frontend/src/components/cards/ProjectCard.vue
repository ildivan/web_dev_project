<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  project: Object
})

const router = useRouter()


function onClick() {
  const id = props.project?.id
  if (id != null) router.push(`/projects/${id}`)
}

const statusClass = computed(() => {
  return props.project.end_date ? 'text-red-600' : 'text-green-600'
})
</script>

<template>
  <div 
  @click="onClick"
      role="button"
  class="w-full max-w-full p-4 bg-gray-100 rounded shadow hover:shadow-lg transition-shadow duration-300">
    <h3 class="font-semibold break-words whitespace-normal">
      {{ props.project.title }}
    </h3>

    <p class="text-sm text-gray-600 mt-1 break-words whitespace-normal">
      {{ props.project.description }}
    </p>

    <!-- Status derivato da end_date -->
    <p class="mt-2 text-xs font-medium text-gray-500">
      Stato:
      <span :class="statusClass" class="ml-1">
        {{ props.project.end_date ? 'Concluso' : 'Attivo' }}
      </span>
    </p>

    <!-- Date -->
    <p class="text-xs text-gray-400">
      Da: {{ props.project.start_date }}
      <span v-if="props.project.end_date"> - A: {{ props.project.end_date }}</span>
    </p>

    <!-- Research area -->
    <p class="text-xs text-gray-500 mt-1 break-words whitespace-normal">
      Area: {{ props.project.research_area?.name || 'N/A' }}
    </p>
  </div>
</template>