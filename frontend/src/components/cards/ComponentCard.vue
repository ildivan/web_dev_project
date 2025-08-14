<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  component: Object
})


const groupsString = computed(() => {
  return props.component.user.groups?.join(', ') || 'Nessun gruppo'
})


const router = useRouter()

</script>

<template>
  <div
    @click="() => { router.push(`/members/${props.component.user.id}`) }"
    class="border border-indigo-300 rounded-xl p-4 bg-indigo-50 cursor-pointer transition hover:shadow-lg hover:bg-indigo-100 hover:border-indigo-500"
  >
    <h3 class="text-lg font-bold text-indigo-900 capitalize">
      {{ props.component.user.first_name }} {{ props.component.user.last_name }}
    </h3>

    <p class="text-gray-700 font-medium">
      <span class="font-semibold">Email: </span>
      <a :href="`mailto:${props.component.user.email}`" class="text-gray-700 hover:underline">
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
