<script setup>
import ComponentForm from './ComponentForm.vue';
import EntitySelect from './EntitySelect.vue';
import { ref } from 'vue';

const props = defineProps({
    users: Array,
    projectOptions: Array,
    courseOptions: Array,
    publicationOptions: Array,
    saving: Boolean
})

const emit = defineEmits(['save'])
const localUser = ref(null)
const users = ref(props.users || [])

function componentCreate(toCreate) {
  emit('save', { ...toCreate, user: localUser.value.id })
}
</script>

<template>
    <div class="w-full p-4 flex flex-col gap-4">
        <h2 class="text-lg font-semibold">Create New Component</h2>
        <EntitySelect 
            v-model="localUser"
            :options="users"
            placeholder="Select the user"
            label="username"
            :trackBy="'id'"
            :multiple="false"
        />
        <ComponentForm 
            v-if="localUser"
            @save="componentCreate"
            :saving="saving"
            :projectOptions="projectOptions"
            :courseOptions="courseOptions"
            :publicationOptions="publicationOptions"
            title="Creazione Componente"
        />
    </div>
</template>