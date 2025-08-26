<script setup>
import EntityList from './EntityList.vue'
import EntityListItem from './EntityListItem.vue'
import CourseCard from '../cards/CourseCard.vue'

const props = defineProps({
  courses: { type: Array, default: () => [] },
  maxHeight: { type: String, default: '28rem' }
})

const emit = defineEmits(['edit', 'paginate'])

function onEdit(id) {
  emit('edit', id)
}

function onPaginate(page, per_page) {
  emit('paginate', page, per_page)
}
</script>

<template>
  <EntityList 
    :maxHeight="maxHeight"
    @paginate="onPaginate"
  >
    <template #header>
      <div class="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600">
        <span>Courses</span>
      </div>
    </template>

    <template v-if="props.courses.length === 0">
      <div class="px-3 py-4 text-sm text-gray-500">No courses</div>
    </template>

    <EntityListItem
      v-for="course in props.courses"
      :key="course.id"
      :id="course.id"
      @edit="onEdit"
    >
      <CourseCard :course="course" />
    </EntityListItem>
  </EntityList>
</template>