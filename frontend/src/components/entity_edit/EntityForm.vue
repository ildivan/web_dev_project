<script setup>

const props = defineProps({
  saving: { type: Boolean, default: false }, // loading state
  title: { type: String, default: 'Edit Entity' }
})

const emit = defineEmits(['save', 'cancel'])

const onSave = () => {
  emit('save') // let parent handle persistence
}

const onCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="p-6 bg-white rounded-2xl shadow-md w-full border-2 border-violet-600">
    <!-- Header -->
    <h2 class="text-xl font-semibold mb-4 text-violet-700">{{ title }}</h2>

    <!-- Main content -->
    <form @submit.prevent="onSave" class="space-y-6">
      <!-- Standard fields (name, description, etc.) -->
      <div class="space-y-4">
        <slot name="fields"></slot>
      </div>

      <!-- Relationships (multi-selects, subtables, etc.) -->
      <div class="space-y-4">
        <slot name="relations"></slot>
      </div>

      <!-- Custom extra content (optional) -->
      <div>
        <slot name="extra"></slot>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 border border-violet-300"
          @click="onCancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>