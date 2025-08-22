<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  maxHeight: { type: String, default: '28rem' }, // ~448px
  // pagination props
  totalItems: { type: Number, default: 0 },
  initialPage: { type: Number, default: 1 },
  initialPerPage: { type: Number, default: 10 },
  perPageOptions: { type: Array, default: () => [5, 10, 20, 50] },
  showPagination: { type: Boolean, default: true }
})

const emit = defineEmits(['paginate'])

const page = ref(props.initialPage)
const perPage = ref(props.initialPerPage)

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / perPage.value)))

watch(() => props.totalItems, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

watch([page, perPage], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
  emit('paginate', page.value, perPage.value)
}, { immediate: true })

function prevPage() {
  if (page.value > 1) page.value -= 1
}

function nextPage() {
  if (page.value < totalPages.value) page.value += 1
}

function goTo(p) {
  if (p >= 1 && p <= totalPages.value) page.value = p
}

function onPerPageChange(e) {
  perPage.value = Number(e.target.value)
  page.value = 1
}

// small page window around current page
const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const current = page.value
  const delta = 2
  const left = Math.max(1, current - delta)
  const right = Math.min(total, current + delta)
  const pages = []
  for (let i = left; i <= right; i++) pages.push(i)
  return pages
})

const leftOverflow = computed(() => visiblePageNumbers.value[0] > 1)
const rightOverflow = computed(() => {
  const last = visiblePageNumbers.value[visiblePageNumbers.value.length - 1]
  return last < totalPages.value
})
</script>



<template>
  <!-- container now controls maxHeight and is a column flexbox -->
  <div
    class="entity-list w-full bg-white border border-gray-200 rounded shadow-sm flex flex-col"
    :style="{ maxHeight }"
  >
    <!-- optional header slot (always visible, outside scroller) -->
    <div
      v-if="$slots.header"
      class="header px-3 py-2 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100"
      role="row"
    >
      <slot name="header" />
    </div>

    <!-- scrollable items area (flex-grow) -->
    <div
      class="body overflow-y-auto motion-safe:scroll-smooth divide-y divide-gray-100 flex-1"
      role="list"
      aria-label="Entity list"
    >
      <slot />
    </div>

    <!-- pagination (fixed at bottom of component) -->
    <div v-if="showPagination" class="footer px-3 py-2 bg-white border-t border-gray-100">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                   bg-white border border-gray-200 text-gray-700 hover:bg-violet-50
                   disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="page === 1"
            @click="prevPage"
            aria-label="Previous page"
          >
            Prev
          </button>

          <div class="hidden sm:flex items-center gap-1 text-sm text-gray-600">
            <button
              v-for="p in visiblePageNumbers"
              :key="p"
              @click="goTo(p)"
              :aria-current="p === page ? 'page' : null"
              :class="[
                'px-2 py-1 rounded-md text-sm',
                p === page ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 hover:bg-violet-50'
              ]"
            >
              {{ p }}
            </button>

            <button
              v-if="leftOverflow"
              class="px-2 text-sm text-gray-500"
              @click="goTo(Math.max(1, page - 5))"
              aria-hidden="true"
            >
              ...
            </button>

            <button
              v-if="rightOverflow"
              class="px-2 text-sm text-gray-500"
              @click="goTo(Math.min(totalPages, page + 5))"
              aria-hidden="true"
            >
              ...
            </button>
          </div>

          <button
            type="button"
            class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                   bg-white border border-gray-200 text-gray-700 hover:bg-violet-50
                   disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="page >= totalPages"
            @click="nextPage"
            aria-label="Next page"
          >
            Next
          </button>
        </div>

        <div class="flex items-center gap-2">
          <div class="text-sm text-gray-600 hidden sm:block">
            Page {{ page }} of {{ totalPages }}
          </div>

          <label class="text-sm text-gray-600 flex items-center gap-2">
            <span class="text-sm text-gray-600">Per page</span>
            <select
              class="form-select rounded-md border border-gray-200 px-2 py-1 text-sm bg-white"
              :value="perPage"
              @change="onPerPageChange"
              aria-label="Items per page"
            >
              <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
