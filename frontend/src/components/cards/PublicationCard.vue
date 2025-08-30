<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  publication: {type: Object, required: true},
  projects: {type: Array, required: true},
  clickable: { type: Boolean, default: true }
})

const router = useRouter()

// funzione helper per trovare il titolo del progetto
function getProjectTitle(projectId) {
  const proj = props.projects?.find(p => p.id === projectId)
  return proj ? proj.title : '-'
}

const containerClasses = computed(() => {
  const base = 'w-full p-4 bg-indigo-50 rounded'
  if (props.clickable) {
    return [
      base,
      'cursor-pointer hover:shadow-lg transition-shadow duration-300',
      'focus:outline-none focus:ring-2 focus:ring-indigo-200'
    ].join(' ')
  }
  return [base, 'cursor-default pointer-events-none'].join(' ')
})

function onClick() {
  if (!props.clickable) return
  const id = props.publication?.id
  if (id != null) router.push(`/publications/${id}`)
}
</script>

<template>
  <div
    :class="containerClasses"
    @click="onClick"
    :role="clickable ? 'button' : undefined"
    :aria-disabled="!clickable"
  >

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
      Progetto di ricerca: {{ getProjectTitle(props.publication.research_project) }}
    </p>
  </div>
</template>
