<script setup>
import EntityList from './EntityList.vue'
import EntityListItem from './EntityListItem.vue'
import PublicationCard from '../cards/PublicationCard.vue'

const props = defineProps({
  publications: { type: Array, default: () => [] },
  projects: { type: Array, default: () => [] },
  maxHeight: { type: String, default: '28rem' },
  allowCreate: { type: Boolean, default: false }
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
    :allowCreate="allowCreate"
    @paginate="onPaginate"
  >
    <template #header>
      <div class="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600">
        <span>Publications</span>
      </div>
    </template>

    <template v-if="props.publications.length === 0">
      <div class="px-3 py-4 text-sm text-gray-500">No publications</div>
    </template>

    <EntityListItem
      v-for="publication in props.publications.filter(publication => publication.can_change || publication.can_delete)"
      :key="publication.id"
      :id="publication.id"
      @edit="onEdit"
    >
      <PublicationCard :publication="publication" :projects="props.projects" :clickable="false"/>
    </EntityListItem>
  </EntityList>
</template>