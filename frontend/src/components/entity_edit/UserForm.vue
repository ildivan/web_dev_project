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
  email: props.user.email
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    localUser.username = newUser.username
    localUser.email = newUser.email
  }
})

const onSave = () => emit('save', { username: localUser.username, email: localUser.email })
const onCancel = () => {
  localUser.username = props.user.username
  localUser.email = props.user.email
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
    </template>
  </EntityForm>
</template>

<style scoped>
</style>
