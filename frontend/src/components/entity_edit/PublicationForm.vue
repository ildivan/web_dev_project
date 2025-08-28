<script setup>
import { ref, watch } from 'vue'
import EntityForm from './EntityForm.vue'
import EntitySelect from './EntitySelect.vue'

const props = defineProps({
  publication: { type: Object, required: true },
  project: { type: Object, required: true },
  components: { type: Array, required: true },

  saving: { type: Boolean, default: false },
  componentOptions: { type: Array, required: true },
  projectOptions: { type: Array, required: true }
})

const emit = defineEmits(['save'])

const title = ref(props.publication.title || '')
const description = ref(props.publication.description || '')
const publicationDate = ref(props.publication.publication_date || '')
const link = ref(props.publication.link || '')
const localProject = ref(props.project)
const localComponents = ref(props.components)

watch(() => props.publication.title, (v) => title.value = v || '')
watch(() => props.publication.description, (v) => description.value = v || '')
watch(() => props.publication.publication_date, (v) => publicationDate.value = v || '')
watch(() => props.publication.link, (v) => link.value = v || '')
watch(() => props.project, (v) => localProject.value = v)
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
  if (title.value !== props.publication.title) toSave.title = title.value
  if (description.value !== props.publication.description) toSave.description = description.value
  if (publicationDate.value !== props.publication.publication_date) toSave.publication_date = publicationDate.value
  if (link.value !== props.publication.link) toSave.link = link.value

  if (!deepEqual(localProject.value, props.project)) {
    toSave.research_project = localProject.value.id
  }

  if (!arraysHaveSameElements(localComponents.value, props.components)) {
    toSave.components = localComponents.value.map(c => c.id)
  }

  emit('save', toSave)
}

function onCancel() {
  title.value = props.publication.title || ''
  description.value = props.publication.description || ''
  publicationDate.value = props.publication.publication_date || ''
  link.value = props.publication.link || ''
  localProject.value = props.project || null
  localComponents.value = props.components
}
</script>

<template>
  <EntityForm
    :saving="saving"
    title="Modifica Pubblicazione"
    @save="onSave"
    @cancel="onCancel"
  >
    <template #fields>
        <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <input v-model="title" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
            <label class="block text-sm font-medium mb-1">Publication Date</label>
            <input v-model="publicationDate" type="date" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea v-model="description" class="w-full border rounded px-3 py-2" rows="4"></textarea>
        </div>
        <div>
            <label class="block text-sm font-medium mb-1">Link</label>
            <input v-model="link" type="url" class="w-full border rounded px-3 py-2" />
        </div>
    </template>

    <template #relations>
        <div>
          <label class="block text-sm font-medium mb-1">Project</label>
          <EntitySelect
            v-model="localProject"
            :options="props.projectOptions"
            placeholder="Select project"
            label="title"
            trackBy="id"
            :multiple="false"
            :allow-empty="false"
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
    </template>
</EntityForm>
</template>