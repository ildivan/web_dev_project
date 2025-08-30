<script setup>
import { ref, reactive, watch } from 'vue'
import EntityForm from './EntityForm.vue'

const props = defineProps({
  user: { type: Object, required: true },
  saving: { type: Boolean, default: false },
  formTitle: { type: String, default: 'Modifica Profilo' }
})

const emit = defineEmits(['save', 'cancel'])

const localUser = reactive({
  username: props.user.username,
  email: props.user.email,
  first_name: props.user.first_name || '',
  last_name: props.user.last_name || ''
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    localUser.username = newUser.username
    localUser.email = newUser.email
    localUser.first_name = newUser.first_name || ''
    localUser.last_name = newUser.last_name || ''
  }
})

const onSave = () => emit('save', { 
  username: localUser.username,
  email: localUser.email,
  first_name: localUser.first_name,
  last_name: localUser.last_name
})

const onCancel = () => {
  // ripristina i valori locali dai props
  localUser.username = props.user.username
  localUser.email = props.user.email
  localUser.first_name = props.user.first_name || ''
  localUser.last_name = props.user.last_name || ''
  emit('cancel')
}

</script>

<template>
  <EntityForm
    :saving="saving"
    :title="formTitle"
    @save="onSave"
    @cancel="onCancel"
  >
    <template #fields>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Username</label>
        <input
          v-model="localUser.username"
          type="text"
          class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          v-model="localUser.email"
          type="email"
          class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

       <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Nome</label>
        <input
          v-model="localUser.first_name"
          type="text"
          class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          
        />
      </div>

       <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Cognome</label>
        <input
          v-model="localUser.last_name"
          type="text"
          class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          
        />
      </div>
    </template>
  </EntityForm>
</template>

<style scoped>
</style>
