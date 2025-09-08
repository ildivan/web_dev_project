<script setup>
import ComponentCard from './cards/ComponentCard.vue'

defineProps({
  course: { type: Object, required: true },
  components: { type: Array, default: () => [] }
})
</script>

<template>
  <main class="flex-grow container max-w-6xl mx-auto p-6 mt-10">
    <!-- Sezione corso -->
    <section class="bg-indigo-50 rounded-xl p-8 mb-8 shadow-md">
      <h2 class="text-3xl font-semibold text-indigo-700 mb-2">
        {{ course.name }}
      </h2>
      <p class="text-gray-600 mb-2">{{ course.description }}</p>
    </section>

    <!-- Sezione docenti -->
    <section v-if="components.length" class="mb-8">
      <h3 class="text-xl font-bold text-indigo-700 mb-4">Docenti</h3>
      <div class="flex flex-wrap gap-4">
        <ComponentCard
          v-for="component in components"
          :key="component.id"
          :component="component"
        />
      </div>
    </section>

    <!-- Eventuali altre informazioni -->
    <section v-if="course.extra_info" class="mb-8">
      <h3 class="text-xl font-bold text-indigo-700 mb-2">Informazioni aggiuntive</h3>
      <p class="text-gray-600">{{ course.extra_info }}</p>
    </section>
  </main>
</template>
