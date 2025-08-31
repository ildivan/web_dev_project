<script setup>
import { ref, onMounted } from 'vue'
import { useUser } from '../../composables/useUser.js'
import Navbar from '../../components/Navbar.vue'
import Footer from '../../components/Footer.vue'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import usePrivateMenu from '../../composables/usePrivateMenu.js'
import UserEditForm from '../../components/entity_edit/UserForm.vue'
import ProfileContentPrivate from '../../components/ProfileContentPrivate.vue'
import useProjects from '../../composables/useProjects.js'
import { useComponent } from '../../composables/useComponent.js'
import { isComponent } from '../../apiCalls/apiCalls.js'

// Menu
const { menu } = usePublicMenu()
const { menu: privateMenu } = usePrivateMenu()

// Editing state
const editing = ref(false)

// User + progetti
const { user, loading: loadingUser, error: errorUser, updateUserData, fetchUserData } = useUser()
const { projects: allProjects, fetchAllProjects } = useProjects()

// Stato componente
const isGroupComponent = ref(false)
let componentData = null

// Queste saranno collegate direttamente al composable
let loadingComponent = ref(false)
let errorComponent = ref(null)

// Funzioni editing
const startEditing = () => (editing.value = true)
const cancelEditing = () => (editing.value = false)

const saveChanges = async (toSave) => {
  try {

    await updateUserData(toSave);

    editing.value = false;
  } catch (err) {
    console.error('Error saving changes:', err);
  }
};


onMounted(async () => {
  try {
    await fetchUserData()
    await fetchAllProjects()

    const componentFlag = (await isComponent(user.value.id)).is_component;
    isGroupComponent.value = componentFlag;

    if (componentFlag && user.value.id) {
      const { loading, error, component, projects, ownedProjects, teachedCourses, publications, fetchComponentData, updateComponent } =
        useComponent(() => user.value.id)
      
      loadingComponent = loading
      errorComponent = error
      componentData = { loading, error, component, projects, ownedProjects, teachedCourses, publications, fetchComponentData, updateComponent }

      await fetchComponentData()
    }

  } catch (err) {
    console.error(err)
    isGroupComponent.value = false
  }
})
</script>



<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <Navbar :menuItems="menu" />

    <main class="flex-grow container max-w-6xl mx-auto p-4 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <ViewDropDownSelector :menuOptions="privateMenu" />

        <div class="flex-1 bg-white rounded-xl shadow p-6">

          <!-- Loader generale -->
          <div v-if="loadingUser || loadingComponent" class="text-gray-500 text-center">
            Loading profile...
          </div>

          <!-- Error -->
          <div v-else-if="errorUser || errorComponent" class="text-red-500">
            {{ errorUser || errorComponent }}
          </div>

          <!-- User loaded -->
          <div v-else-if="user">
            <h2 class="text-2xl font-bold mb-4 text-violet-700">Profilo utente</h2>

            <!-- Edit mode -->
            <UserEditForm
              v-if="editing"
              :user="user"
              @save="saveChanges"
              @cancel="cancelEditing"
            />

            <!-- Display mode -->
            <div v-else>
              <p><strong>Username:</strong> {{ user.username }}</p>
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p>
                <strong>Nome:</strong>
                <span v-if="user.first_name">{{ user.first_name }}</span>
                <span v-else class="text-gray-400 italic"> da compilare</span>
              </p>
              <p>
                <strong>Cognome:</strong>
                <span v-if="user.last_name">{{ user.last_name }}</span>
                <span v-else class="text-gray-400 italic"> da compilare</span>
              </p>

               <!-- Pulsante modifica -->
              <button
                v-if="!editing"
                @click="startEditing"
                class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
              >
                Modifica
              </button>

            <!-- Profile content privato solo se componente -->
              <ProfileContentPrivate
                v-if="isGroupComponent && componentData"
                :projects="componentData.projects.value || []"
                :ownedProjects="componentData.ownedProjects.value || []"
                :teachedCourses="componentData.teachedCourses.value || []"
                :publications="componentData.publications.value || []"
                :allProjects="allProjects.value || []"
              />

              <p v-else class="text-gray-500 italic mt-4">
                L'utente non è componente di alcun gruppo.
              </p>


             
            </div>
          </div>

          <!-- User non trovato -->
          <div v-else class="text-gray-500">Utente non trovato.</div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
