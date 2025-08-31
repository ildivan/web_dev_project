<script setup>
import EntityList from './EntityList.vue'
import EntityListItem from './EntityListItem.vue'
import CourseCard from '../cards/CourseCard.vue'

const props = defineProps({
  courses: { type: Array, default: () => [] },
  maxHeight: { type: String, default: '28rem' },
  allowCreate: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'paginate', 'delete'])

function onEdit(id) {
  emit('edit', id)
}

function onPaginate(page, per_page) {
  emit('paginate', page, per_page)
}

function onDelete(id) {
  emit('delete', id)
}
</script>

<template>
  <EntityList 
    :maxHeight="maxHeight"
    :allowCreate="allowCreate"
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
      v-for="course in props.courses.filter(course => course.can_change || course.can_delete)"
      :key="course.id"
      :id="course.id"
      :showEdit="course.can_change"
      :showDelete="course.can_delete"
      @delete="onDelete"
      @edit="onEdit"
    >
      <CourseCard :course="course" />
    </EntityListItem>
  </EntityList>
</template>