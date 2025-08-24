<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: { type: Object, required: true },
  showActions: { type: Boolean, default: true },
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
</script>

<template>
  <!-- limited width and subtle violet-50 background to match palette; falls back nicely to grey/white -->
  <article class="max-w-full w-full border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-violet-50 border-violet-100">
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
