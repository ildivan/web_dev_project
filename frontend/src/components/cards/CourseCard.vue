<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  course: { type: Object, required: true },
  showActions: { type: Boolean, default: true },
  clickable: { type: Boolean, default: true }
})

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString()
  } catch {
    return d
  }
}

const teacherNames = computed(() => {
  const list = props.course.teachers || props.course.teacher_detail || props.course.teachers_detail || []
  if (!Array.isArray(list) || list.length === 0) return '—'
  return list
    .map(t => {
      if (!t) return ''
      if (typeof t === 'string') return t
      if (t.user && (t.user.username || t.user.first_name)) {
        return t.user.username || `${t.user.first_name} ${t.user.last_name || ''}`.trim()
      }
      if (t.username) return t.username
      if (t.name) return t.name
      if (t.first_name || t.last_name) return `${t.first_name || ''} ${t.last_name || ''}`.trim()
      return t.id ?? ''
    })
    .filter(Boolean)
    .join(', ')
})

const containerClasses = computed(() => {
  const base = 'max-w-full w-full bg-violet-50 rounded-lg p-4'
  if (props.clickable) {
    return [
      base,
      'cursor-pointer hover:shadow-md transition bg-violet-50 duration-300',
      'focus:outline-none focus:ring-2 focus:ring-indigo-200'
    ].join(' ')
  }
  return [base, 'cursor-default pointer-events-none'].join(' ')
})

function onClick() {
    if (!props.clickable) return
    const id = props.course?.id
    if (id != null) router.push(`/courses/${id}`)
}

</script>

<template>
  <!-- limited width and subtle violet-50 background to match palette; falls back nicely to grey/white -->
  <article 
    :class="containerClasses"
    @click="onClick"
    :role="clickable ? 'button' : undefined"
    :aria-disabled="!clickable"
  >
    <header class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">{{ course.name }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ teacherNames }}</p>
      </div>
      <div class="text-sm text-gray-500 text-right">
        <div>{{ formatDate(course.start_date) }}</div>
        <div class="mt-1">{{ formatDate(course.end_date) }}</div>
      </div>
    </header>

    <p class="text-sm text-gray-600 mt-3 line-clamp-3" v-if="course.description">
      {{ course.description }}
    </p>
  </article>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
