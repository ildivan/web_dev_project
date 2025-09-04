<script setup>
const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Conferma' },
  message: { type: String, default: 'Sei sicuro?' },
  confirmText: { type: String, default: 'Conferma' },
  cancelText: { type: String, default: 'Annulla' },
  maxWidth: { type: String, default: 'max-w-md' },
  warningText: { type: String, default: 'Questa operazione non può essere annullata' } // Nuova prop
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="show" :class="['mx-auto my-4 p-4 border rounded shadow-md w-full', maxWidth, 'bg-red-50 border-red-400']">
    <h3 class="text-lg font-semibold mb-2 text-red-700">{{ title }}</h3>
    <p class="mb-2">{{ message }}</p>
    <p class="text-xs text-gray-600 mb-4">{{ warningText }}</p> <!-- Nota di avviso in piccolo -->
    <div class="flex justify-end gap-2">
      <button
        class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
        @click="$emit('cancel')"
      >{{ cancelText }}</button>
      <button
        class="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
        @click="$emit('confirm')"
      >{{ confirmText }}</button>
    </div>
  </div>
</template>

<style scoped>
</style>
