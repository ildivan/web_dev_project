<script setup>
import EntityList from './EntityList.vue'
import EntityListItem from './EntityListItem.vue'
import ComponentCard from '../cards/ComponentCard.vue'

const props = defineProps({
  components: { type: Array, default: () => [] },
  maxHeight: { type: String, default: '28rem' },
  allowCreate: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'paginate', 'delete'])

function onEdit(id) {
  emit('edit', id)
}

function onDelete(id) {
  emit('delete', id)
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
        <span>Componenti</span>
      </div>
    </template>
 
    <template v-if="props.components.length === 0">
      <div class="px-3 py-4 text-sm text-gray-500">No Componenti</div>
    </template>

    <EntityListItem
      v-for="user in components.filter(user => user.can_change || user.can_delete)"
      :key="user.user.id"
      :id="user.user.id"
      :showEdit="user.can_change"
      :showDelete="user.can_delete"
      @edit="onEdit"
      @delete="onDelete"
    >
      <ComponentCard :component="user" :clickable="false"/>
    </EntityListItem>
  </EntityList>
</template>
