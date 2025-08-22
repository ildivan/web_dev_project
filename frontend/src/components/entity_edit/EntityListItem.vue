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
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  showEdit: { type: Boolean, default: true },
  editLabel: { type: String, default: 'Edit' },
})

const emit = defineEmits(['edit'])

function onEdit() {
  emit('edit', props.id)
}
</script>