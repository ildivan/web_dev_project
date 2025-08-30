<script setup>
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'
import usePrivateMenu from '../../composables/usePrivateMenu.js'
import { ref } from 'vue'
import { useUser } from '../../composables/useUser.js'
import UserEditForm from '../../components/entity_edit/UserForm.vue'

const { menu } = usePublicMenu()
const { menu: privateMenu } = usePrivateMenu()
const editing = ref(false)

// Composable per gestire dati utente
const { user, loading, error, updateUserData } = useUser()

// Funzioni editing
const startEditing = () => editing.value = true
const cancelEditing = () => editing.value = false
const saveChanges = async (toSave) => {
  try {
    await updateUserData(toSave) // PATCH /me/
    editing.value = false
    // user.value è già aggiornato, non serve ulteriore fetch
  } catch (err) {
    console.error('Error updating user:', err)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <Navbar :menuItems="menu" />

    <main class="flex-grow container max-w-6xl mx-auto p-4 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <ViewDropDownSelector :menuOptions="privateMenu" />

        <div class="flex-1 bg-white rounded-xl shadow p-6">
          <div v-if="loading" class="text-gray-500">Loading profile...</div>
          <div v-else-if="error" class="text-red-500">{{ error }}</div>
          <div v-else>
            <h2 class="text-2xl font-bold mb-4">Profilo utente</h2>

            <!-- Lettura -->
            <div v-if="!editing" class="space-y-2">
              <p><strong>Username:</strong> {{ user.username }}</p>
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p>
                <strong>Nome: </strong>
                <span v-if="user.first_name">{{ user.first_name }}</span>
                <span v-else class="text-gray-400 italic"> da compilare</span>
              </p>
              <p>
                <strong>Cognome: </strong>
                <span v-if="user.first_name">{{ user.last_name }}</span>
                <span v-else class="text-gray-400 italic"> da compilare</span>
              </p>

              <button
                @click="startEditing"
                class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
              >
                Modifica
              </button>
            </div>

            <!-- Form -->
            <UserEditForm
              v-if="editing"
              :user="user"
              @save="saveChanges"
              @cancel="cancelEditing"
            />
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
