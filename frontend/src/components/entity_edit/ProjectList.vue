<script setup>
import EntityList from './EntityList.vue'
import EntityListItem from './EntityListItem.vue'
import ProjectCard from '../cards/ProjectCard.vue'

const props = defineProps({
  projects: { type: Array, default: () => [] },
  maxHeight: { type: String, default: '28rem' }
})

const emit = defineEmits(['edit', 'paginate'])

function onEdit(id) {
  emit('edit', id)
}

function onPaginate(page, per_page) {
  emit('paginate', page, per_page)
}
</script>

<template>
  <EntityList 
    :maxHeight="maxHeight"
    @paginate="onPaginate"
  >
    <template #header>
      <div class="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600">
        <span>Projects</span>
      </div>
    </template>

    <template v-if="projects.length === 0">
      <div class="px-3 py-4 text-sm text-gray-500">No projects</div>
    </template>

    <EntityListItem
      v-for="project in projects"
      :key="project.id"
      :id="project.id"
      @edit="onEdit"
    >
      <ProjectCard :project="project" />
    </EntityListItem>
  </EntityList>
</template>