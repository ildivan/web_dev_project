<script setup>
import EntityList from './EntityList.vue'
import EntityListItem from './EntityListItem.vue'
import ProjectCard from '../cards/ProjectCard.vue'

const props = defineProps({
  projects: { type: Array, default: () => [] },
  maxHeight: { type: String, default: '28rem' },
  allowCreate: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'paginate', 'delete'])

function onEdit(id) {
  emit('edit', id)
}

function onPaginate(page, per_page) {
  emit('paginate', page, per_page)
}

function onDelete(id) {
  emit('delete', id)
}
</script>

<template>
  <EntityList 
    :maxHeight="maxHeight"
    :allowCreate="allowCreate"
    @paginate="onPaginate"
  >
    <template #header>
      <div class="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600">
        <span>Projects</span>
      </div>
    </template>

    <template v-if="props.projects.length === 0">
      <div class="px-3 py-4 text-sm text-gray-500">No projects</div>
    </template>

    <EntityListItem
      v-for="project in props.projects.filter(project => project.can_change || project.can_delete)"
      :key="project.id"
      :id="project.id"
      :showEdit="project.can_change"
      :showDelete="project.can_delete"
      @delete="onDelete"
      @edit="onEdit"
    >
      <ProjectCard :project="project" :clickable="false"/>
    </EntityListItem>
  </EntityList>
</template>