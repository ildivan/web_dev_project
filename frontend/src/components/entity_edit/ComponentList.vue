<script setup>
import EntityList from './EntityList.vue'
import EntityListItem from './EntityListItem.vue'
import ComponentCard from '../cards/ComponentCard.vue'

const props = defineProps({
  users: { type: Array, default: () => [] },
  maxHeight: { type: String, default: '28rem' }
})

const emit = defineEmits(['edit', 'paginate', 'create'])

function onEdit(id) {
  emit('edit', id)
}

function onPaginate(page, per_page) {
  emit('paginate', page, per_page)
}

function onCreate() {
  emit('create')
}

</script>

<template>
  <EntityList 
    :maxHeight="maxHeight" 
    @create="onCreate"
    @paginate="onPaginate"
  >
    <template #header>
      <div class="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600">
        <span>Users</span>
      </div>
    </template>
 
    <template v-if="props.users.length === 0">
      <div class="px-3 py-4 text-sm text-gray-500">No users</div>
    </template>

    <EntityListItem
      v-for="user in users.filter(user => user.can_change || user.can_delete)"
      :key="user.user.id"
      :id="user.user.id"
      @edit="onEdit"
    >
      <ComponentCard :component="user" :clickable="false"/>
    </EntityListItem>
  </EntityList>
</template>
