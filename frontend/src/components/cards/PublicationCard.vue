<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  publication: Object,
  projects: Array,
  clickable: { type: Boolean, default: false } // se vuoi abilitare il click
})

const router = useRouter() // <-- IMPORTANTE

// funzione helper per trovare il titolo del progetto
function getProjectTitle(projectId) {
  const proj = props.projects?.find(p => p.id === projectId)
  return proj ? proj.title : '-'
}

function onClick() {
  const id = props.publication?.id
  if (id != null) router.push(`/publications/${id}`)
}
</script>

<template>
  <div 
    @click="onClick"
      role="button"
      class="w-full p-4 bg-indigo-50 rounded shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
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
