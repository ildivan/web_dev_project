<script setup>
import { ref, watch } from 'vue'
import EntityForm from './EntityForm.vue'
import EntitySelect from './EntitySelect.vue'

const props = defineProps({
  project: { type: Object, required: true },
  researchArea : { type: Object, default: () => ({}) },
  projectOwner: { type: Object, default: () => ({}) },
  components: { type: Array, default: () => [] },
  publications: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
  researchAreaOptions: { type: Array, default: () => [] },
  componentOptions: { type: Array, default: () => [] },
  publicationOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['save'])

const title = ref(props.project.title || '')
const description = ref(props.project.description || '')
const startDate = ref(props.project.start_date || '')
const endDate = ref(props.project.end_date || '')
const localResearchArea = ref(props.researchArea || null)
const localProjectOwner = ref(props.projectOwner || null)
const localComponents = ref([...(props.components || [])])
const localPublications = ref([...(props.publications || [])])

watch(() => props.project.title, (v) => title.value = v || '')
watch(() => props.project.description, (v) => description.value = v || '')
watch(() => props.project.start_date, (v) => startDate.value = v || '')
watch(() => props.project.end_date, (v) => endDate.value = v || '')
watch(() => props.project.research_area, (v) => localResearchArea.value = v || null)
watch(() => props.project.project_owner, (v) => localProjectOwner.value = v || null)
watch(() => props.project.components, (v) => localComponents.value = [...(v || [])])
watch(() => props.project.publications, (v) => localPublications.value = [...(v || [])])

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
  if (title.value !== props.project.title) toSave.title = title.value
  if (description.value !== props.project.description) toSave.description = description.value
  if (startDate.value !== props.project.start_date) toSave.start_date = startDate.value
  if ((endDate.value || null) !== (props.project.end_date || null)) toSave.end_date = endDate.value || null

  if (!deepEqual(localResearchArea.value, props.researchArea)) {
    toSave.research_area = localResearchArea.value ? localResearchArea.value.id : null
  }

  if (!deepEqual(localProjectOwner.value, props.projectOwner)) {
    toSave.project_owner = localProjectOwner.value ? localProjectOwner.value.id ?? localProjectOwner.value.id : null
  }

  if (!arraysHaveSameElements(localComponents.value, props.components || [])) {
    toSave.components = localComponents.value.map(c => c.id)
  }

  if (!arraysHaveSameElements(localPublications.value, props.publications || [])) {
    toSave.publications = localPublications.value.map(p => p.id)
  }

  emit('save', toSave)
}

function onCancel() {
  title.value = props.project.title || ''
  description.value = props.project.description || ''
  startDate.value = props.project.start_date || ''
  endDate.value = props.project.end_date || ''
  localResearchArea.value = props.researchArea || null
  localProjectOwner.value = props.projectOwner || null
  localComponents.value = [...(props.components || [])]
  localPublications.value = [...(props.publications || [])]
}
</script>

<template>
  <EntityForm
    :saving="saving"
    title="Modifica Progetto"
    @save="onSave"
    @cancel="onCancel"
  >
    <template #fields>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium mb-1">Title</label>
                <input v-model="title" type="text" class="w-full border rounded px-3 py-2" required />
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Research Area</label>
                <EntitySelect
                    v-model="localResearchArea"
                    :options="props.researchAreaOptions"
                    placeholder="Select research area"
                    label="name"
                    trackBy="id"
                    :multiple="false"
                />
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
        </div>
    </template>

    <template #relations>
        <div>
          <label class="block text-sm font-medium mb-1">Project Owner</label>
          <EntitySelect
            v-model="localProjectOwner"
            :options="props.componentOptions.map(c => c.user)"
            placeholder="Select project owner"
            label="username"
            trackBy="id"
            :multiple="false"
          />
        </div>

        <div class="mt-4">
            <label class="block text-sm font-medium mb-1">Components (participants)</label>
            <EntitySelect
                v-model="localComponents"
                :options="props.componentOptions.map(c => c.user)"
                placeholder="Select components"
                label="username"
                trackBy="id"
                :multiple="true"
            />
        </div>

        <div class="mt-4">
            <label class="block text-sm font-medium mb-1">Publications</label>
            <EntitySelect
                v-model="localPublications"
                :options="props.publicationOptions"
                placeholder="Select publications"
                label="title"
                trackBy="id"
                :multiple="true"
            />
        </div>
    </template>
</EntityForm>
</template>

<style scoped>
</style>