
<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  showEdit: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  editLabel: { type: String, default: 'Edit' },
  deleteLabel: { type: String, default: 'Delete' }
})

const emit = defineEmits(['edit', 'delete'])

function onEdit() {
  emit('edit', props.id)
}

function onDelete() {
  emit('delete', props.id)
}
</script>

<template>
  <div
    class="entity-list-item flex items-center justify-between gap-3 px-3 py-2 border-b border-gray-200 bg-white hover:bg-violet-50"
    role="listitem"
  >
    <div
      class="content flex-1 truncate focus:outline-none rounded"
      tabindex="0"
    >
      <slot />
    </div>

    <button
      v-if="showEdit"
      type="button"
      :aria-label="`Edit item ${props.id}`"
      @click.stop="onEdit"
      class="ml-3 inline-flex items-center px-3 py-1.5 bg-violet-600 text-white text-sm font-medium rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-1"
    >
      {{ editLabel }}
    </button>
    <button
      v-if="showDelete"
      type="button"
      :aria-label="`Delete item ${props.id}`"
      @click.stop="onDelete"
      class="ml-3 inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1"
    >
      {{ deleteLabel }}
    </button>
  </div>
</template>
