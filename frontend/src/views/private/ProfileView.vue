<script setup>
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'
import usePrivateMenu from '../../composables/usePrivateMenu.js'
import { ref, reactive, watch } from 'vue'
import { useUser } from '../../composables/useUser.js'
import axiosInstance from '../../axios'
import UserEditForm from '../../components/entity_edit/UserForm.vue'

const { menu } = usePublicMenu()
const { menu: privateMenu } = usePrivateMenu()

const editing = ref(false)

// Ottieni ID dell'utente loggato
async function fetchLoggedUserId() {
  try {
    const res = await axiosInstance.get('/api/auth/users/me/')
    return res.data.id
  } catch (err) {
    console.error('Error fetching logged user ID:', err)
    return null
  }
}

// Composable per gestire dati utente
const { user, loading, error, fetchUserData, updateUserData } = useUser(fetchLoggedUserId)

// Funzioni editing
const startEditing = () => { editing.value = true }
const cancelEditing = () => { editing.value = false }
const saveChanges = async (toSave) => {
  try {
    await updateUserData(toSave)
    editing.value = false
    await fetchUserData()
  } catch (err) {
    console.error('Error updating user:', err)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <Navbar :menuItems="menu" />

    <main class="flex-grow container max-w-6xl mx-auto p-2 sm:p-4 md:p-6 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <ViewDropDownSelector :menuOptions="privateMenu" />

        <div class="flex-1 bg-white rounded-xl shadow p-6 ">
          <div v-if="loading" class="text-gray-500">Loading profile...</div>
          <div v-else-if="error" class="text-red-500">{{ error }}</div>
          <div v-else>
            <h2 class="text-2xl font-bold mb-4">Profilo utente</h2>

            <!-- dati in lettura -->
            <div v-if="!editing" class="space-y-2">
              <p><strong>Username:</strong> {{ user.username }}</p>
              <p><strong>Email:</strong> {{ user.email }}</p>

              <button
                @click="startEditing"
                class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
              >
                Modifica
              </button>
            </div>

            <!-- form in place -->
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
