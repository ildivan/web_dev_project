<script setup>
import { computed } from 'vue'

const props = defineProps({
  component: Object
})

const groupsString = computed(() => {
  return props.component.user.groups?.join(', ') || 'Nessun gruppo'
})
</script>

<template>
  <div class="border border-indigo-300 rounded-xl p-4 bg-indigo-50 hover:bg-indigo-100 transition">
    <h3 class="text-lg font-bold text-indigo-900">
      {{ props.component.user.first_name }} {{ props.component.user.last_name }}
    </h3>

    <p class="text-gray-700 font-medium">
      <span class="font-semibold">Email:</span>
      <a :href="`mailto:${props.component.user.email}`" class="text-indigo-600 hover:underline">
        {{ props.component.user.email }}
      </a>
    </p>

    <p class="text-gray-700 font-medium">
      <span class="font-semibold">Gruppi:</span> {{ groupsString }}
    </p>

    <!-- Esempio campi opzionali -->
    <p v-if="props.component.role" class="text-gray-700 font-medium">
      <span class="font-semibold">Ruolo:</span> {{ props.component.role }}
    </p>

    <p v-if="props.component.phone" class="text-gray-700 font-medium">
      <span class="font-semibold">Telefono:</span> {{ props.component.phone }}
    </p>
  </div>
</template>
