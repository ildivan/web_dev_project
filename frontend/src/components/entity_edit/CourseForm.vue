<script setup>
import { ref, watch } from 'vue'
import EntityForm from './EntityForm.vue'
import EntitySelect from './EntitySelect.vue'

const props = defineProps({
  course: { type: Object, required: true },
  components: { type: Array, required: true },
  saving: { type: Boolean, default: false },
  componentOptions: { type: Array, required: true },
})

const emit = defineEmits(['save'])

const name = ref(props.course.name || '')
const description = ref(props.course.description || '')
const startDate = ref(props.course.start_date || '')
const endDate = ref(props.course.end_date || '')
const localComponents = ref(props.components)

watch(() => props.course.name, (v) => name.value = v || '')
watch(() => props.course.description, (v) => description.value = v || '')
watch(() => props.course.start_date, (v) => startDate.value = v || '')
watch(() => props.course.end_date, (v) => endDate.value = v || '')
watch(() => props.components, (v) => localComponents.value = v)

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function arraysHaveSameElements(arr1, arr2) {
  if (!arr1 && !arr2) return true
  if (!arr1 || !arr2) return false
  if (arr1.length !== arr2.length) return false
  return arr1.every(el1 => arr2.some(el2 => deepEqual(el1, el2)))
}

function onSave() {
  const toSave = {}
  if (name.value !== props.course.name) toSave.name = name.value
  if (description.value !== props.course.description) toSave.description = description.value
  if (startDate.value !== (props.course.start_date || '')) toSave.start_date = startDate.value
  if (endDate.value !== (props.course.end_date || '')) toSave.end_date = endDate.value

  if (!arraysHaveSameElements(localComponents.value, props.components)) {
    toSave.teachers = localComponents.value.map(c => c.id)
  }

  emit('save', toSave)
}

function onCancel() {
  name.value = props.course.name || ''
  description.value = props.course.description || ''
  startDate.value = props.course.start_date || ''
  endDate.value = props.course.end_date || ''
  localComponents.value = props.components
}
</script>

<template>
  <EntityForm
    :saving="saving"
    title="Modifica Corso"
    @save="onSave"
    @cancel="onCancel"
  >
    <template #fields>
        <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input v-model="name" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
            <label class="block text-sm font-medium mb-1">Start Date</label>
            <input v-model="startDate" type="date" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
            <label class="block text-sm font-medium mb-1">End Date</label>
            <input v-model="endDate" type="date" class="w-full border rounded px-3 py-2" />
        </div>
        <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea v-model="description" class="w-full border rounded px-3 py-2" rows="4"></textarea>
        </div>
    </template>

    <template #relations>
        <div class="mt-4">
            <label class="block text-sm font-medium mb-1">Insegnanti</label>
            <EntitySelect
                v-model="localComponents"
                :options="props.componentOptions.map(c => c.user)"
                placeholder="Seleziona insegnanti"
                label="username"
                trackBy="id"
                :multiple="true"
            />
        </div>
    </template>
</EntityForm>
</template>