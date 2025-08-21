<script setup>
import { ref, watch } from 'vue'
import EntityForm from './EntityForm.vue'
import EntityMultiSelect from './EntityMultiSelect.vue'

// Props: user object, groups options, and loading state
const props = defineProps({
  user: { type: Object, required: true },
  projects: {type: Array, default: () => [] },
  ownedProjects: {type: Array, default: () => [] },
  teachedCourses: {type: Array, default: () => [] },
  publications: {type: Array, default: () => [] },
  projectOptions: { type: Array, default: () => [] }, 
  courseOptions: { type: Array, default: () => [] }, 
  publicationOptions: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['save'])

const description = ref(props.user.description)
const localProjects = ref([...props.projects])
const localOwnedProjects = ref([...props.ownedProjects])
const localTeachedCourses = ref([...props.teachedCourses])
const localPublications = ref([...props.publications])

watch(() => props.user.description, (val) => {
  description.value = val
})

watch(() => props.projects, (val) => {
  localProjects.value = [...val]
})

watch(() => props.ownedProjects, (val) => {
  localOwnedProjects.value = [...val]
})

watch(() => props.teachedCourses, (val) => {
  localTeachedCourses.value = [...val]
})

watch(() => props.publications, (val) => {
  localPublications.value = [...val]
})

function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function arraysHaveSameElements(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  return arr1.every(el1 => 
    arr2.some(el2 => deepEqual(el1, el2))
  );
}

function onSave() {
  let toSave = {}
  if(description.value != props.user.description) {
    toSave.description = description.value
  }

  if(!arraysHaveSameElements(localProjects.value, props.projects)) {
    toSave.projects = localProjects.value.map(p => p.id)
  }

  if(!arraysHaveSameElements(localOwnedProjects.value, props.ownedProjects)) {
    toSave.owned_projects = localOwnedProjects.value.map(p => p.id)
  }

  if(!arraysHaveSameElements(localTeachedCourses.value, props.teachedCourses)) {
    toSave.teached_courses = localTeachedCourses.value.map(c => c.id)
  }

  if(!arraysHaveSameElements(localPublications.value, props.publications)) {
    toSave.publications = localPublications.value.map(pub => pub.id)
  }

  emit('save', toSave)
}

function onCancel() {
  description.value = props.user.description
  localProjects.value = [...props.projects]
  localOwnedProjects.value = [...props.ownedProjects]
  localTeachedCourses.value = [...props.teachedCourses]
  localPublications.value = [...props.publications]
}
</script>

<template>
  <EntityForm
    :saving="saving"
    title="Modifica Componente"
    @save="onSave"
    @cancel="onCancel"
  >
    <template #fields>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <input v-model="description" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
      </div>
    </template>
    <template #relations>
      <!-- Research Projects -->
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Research Projects Participations</label>
        <EntityMultiSelect
          v-model="localProjects"
          :options="projectOptions"
          placeholder="Select projects"
          label="title"
          trackBy="id"
        />
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Owned Research Projects</label>
        <EntityMultiSelect
          v-model="localOwnedProjects"
          :options="projectOptions"
          placeholder="Select projects"
          label="title"
          trackBy="id"
        />
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Publications</label>
        <EntityMultiSelect
          v-model="localPublications"
          :options="publicationOptions"
          placeholder="Select publications"
          label="title"
          trackBy="id"
        />
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Taught Courses</label>
        <EntityMultiSelect
          v-model="localTeachedCourses"
          :options="courseOptions"
          placeholder="Select courses"
          label="name"
          :trackBy="'id'"
        />
      </div>
    </template>
  </EntityForm>
</template>