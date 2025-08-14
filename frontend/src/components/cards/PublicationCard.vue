<script setup>

const props = defineProps({
  publication: Object
})

</script>

<template>
  <div class="p-4 bg-indigo-50 rounded shadow hover:shadow-lg transition-shadow duration-300">
    <h3 class="font-semibold">{{ props.publication.title }}</h3>
    <p class="text-sm text-gray-600">{{ props.publication.description }}</p>

    <p class="text-xs text-gray-400">
      Data pubblicazione: {{ props.publication.publication_date }} 
    </p>

    <p class="text-xs text-gray-500 mt-1">
      Progetto di ricerca: {{ props.publication.research_project_detail.title }}
    </p>

    <div v-if="props.publication.components_detail?.length" class="mt-2">
      <p class="text-xs font-semibold">Componenti:</p>
      <ul class="text-xs text-gray-600 list-disc list-inside">
        <li v-for="comp in props.publication.components_detail" :key="comp.id">
          <router-link v-if="!comp.user.first_name && !comp.user.last_name" :to="`/members/${comp.user.id}`" class="font-semibold hover:underline">
            {{ comp.user.username }}
          </router-link>
          <router-link v-else :to="`/members/${comp.user.id}`" class="font-semibold hover:underline">
            {{ comp.user.first_name }} {{ comp.user.last_name }}
          </router-link>
        </li>
      </ul>
    </div>

  </div>
</template>