<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  component: { type: Object, required: true },
  clickable: { type: Boolean, default: true }
})

const router = useRouter()

const groupsString = computed(() => {
  return props.component?.user?.groups?.join(', ') || 'Nessun gruppo'
})

const containerClasses = computed(() => {
  const base = 'border rounded-xl p-4 bg-indigo-50 transition'
  const border = 'border-indigo-300'
  if (props.clickable) {
    return [
      base,
      border,
      'cursor-pointer hover:shadow-lg hover:bg-indigo-100 hover:border-indigo-500',
      'focus:outline-none focus:ring-2 focus:ring-indigo-200'
    ].join(' ')
  }
  return [base, border, 'cursor-default pointer-events-none'].join(' ')
})

function onClick() {
  if (!props.clickable) return
  const id = props.component?.user?.id
  if (id != null) router.push(`/members/${id}`)
}
</script>

<template>
  <div
    :class="containerClasses"
    @click="onClick"
    :role="clickable ? 'button' : undefined"
    :aria-disabled="!clickable"
  >
    <h3 class="text-lg font-bold text-indigo-900 capitalize">
      {{ component.user.first_name }} {{ component.user.last_name }}
    </h3>

    <p class="text-gray-700 font-medium mt-1">
      <span class="font-semibold">Email: </span>
      <a
        :href="clickable ? `mailto:${component.user.email}` : undefined"
        :class="clickable ? 'text-gray-700 hover:underline' : 'text-gray-700 no-underline'"
      >
        {{ component.user.email }}
      </a>
    </p>

    <p class="text-gray-700 font-medium mt-1">
      <span class="font-semibold">Gruppi:</span> {{ groupsString }}
    </p>

    <p v-if="component.role" class="text-gray-700 font-medium mt-1">
      <span class="font-semibold">Ruolo:</span> {{ component.role }}
    </p>

    <p v-if="component.phone" class="text-gray-700 font-medium mt-1">
      <span class="font-semibold">Telefono:</span> {{ component.phone }}
    </p>
  </div>
</template>
