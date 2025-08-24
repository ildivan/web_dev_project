<script setup>
import { ref, computed } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { useUser } from '../../composables/useUser.js'
import ProfileContent from '../../components/ProfileContent.vue'
import ComponentForm from '../../components/entity_edit/ComponentForm.vue'
import { useMenu } from '../../composables/useMenu.js'
import ComponentList from '../../components/entity_edit/ComponentList.vue'
import axiosInstance from '../../axios'
import useUsers from '../../composables/useUsers.js'
import { onMounted } from 'vue'
import useProjects from '../../composables/useProjects.js'
import useCourses from '../../composables/useCourses.js'
import usePublications from '../../composables/usePublications.js'
import ProjectList from '../../components/entity_edit/ProjectList.vue'
import ProjectForm from '../../components/entity_edit/ProjectForm.vue'
import {useProject} from '../../composables/useProject.js'

const selectedMenu = ref('info')
const mobileMenuOpen = ref(false)
const selectedUserId = ref(null)
const selectedProjectId = ref(null)

async function fetchLoggedUserId() {
  try {
    const res = await axiosInstance.get('/api/auth/users/me/')
    return res.data.id
  } catch (err) {
    console.error('Error fetching logged user ID:', err)
    throw err
  }
}

function fetchUserId() {
    return selectedUserId.value
}

function fetchProjectId() {
    return selectedProjectId.value
}

const { menu } = useMenu()

const { users: paginatedUsers, count: totalUsers, fetchUsersPaginated } = useUsers()
const { users: allUsers, fetchAllUsers } = useUsers()
const { projects: paginatedProjects, count: totalProjects, fetchProjectsPaginated } = useProjects()
const { projects: allProjects, fetchAllProjects } = useProjects()
const { publications: allPublications, fetchAllPublications } = usePublications()
const { courses: allCourses, fetchAllCourses } = useCourses()

onMounted(() => {
  fetchUsersPaginated(1, 10)
  fetchProjectsPaginated(1, 10)
  fetchAllProjects()
  fetchAllUsers()
  fetchAllPublications()
  fetchAllCourses()
})

const {
  loading: loggedUserLoading,
  error: loggedUserError,
  component: loggedUserComponent,
  projects: loggedUserProjects,
  ownedProjects: loggedUserOwnedProjects,
  teachedCourses: loggedUserTeachedCourses,
  publications: loggedUserPublications,
  updateUser: loggedUserUpdate,
  fetchUserData: loggedUserFetch
} = useUser(fetchLoggedUserId)

const {
  loading: userToEditLoading,
  error: userToEditError,
  component: userToEditComponent,
  projects: userToEditProjects,
  ownedProjects: userToEditOwnedProjects,
  teachedCourses: userToEditTeachedCourses,
  publications: userToEditPublications,
  updateUser: userToEditUpdate,
  fetchUserData: userToEditFetch
} = useUser(fetchUserId)

const {
  loading: projectToEditLoading,
  error: projectToEditError,
  project: projectToEdit,
  components: projectToEditComponents,
  publications: projectToEditPublications,
  researchArea: projectToEditResearchArea,
  projectOwner: projectToEditProjectOwner,
  updateProjectData: projectToEditUpdate,
  fetchProjectData: projectToEditFetch
} = useProject(fetchProjectId)

const menuOptions = [
  { key: 'info', label: 'Panoramica' },
  { key: 'components', label: 'Gestione componenti del gruppo' },
  { key: 'projects', label: 'Gestione Progetti' },
]

const selectOption = (option) => {
  if (option.action) {
    option.action()
  } else {
    selectedMenu.value = option.key
  }
  mobileMenuOpen.value = false
}
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}


const selectedLabel = computed(() => {
  const found = menuOptions.find(opt => opt.key === selectedMenu.value)
  return found ? found.label : 'Menu'
})

const isSelected = (key) => selectedMenu.value === key

const componentSave = (toSave) => {
  try {
    userToEditUpdate(toSave)
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

const projectSave = (toSave) => {
  try {
    projectToEditUpdate(toSave)
  } catch (error) {
    console.error('Error saving project data:', error)
  }
}

const onComponentEdit = (id) => {
  selectedUserId.value = id
  userToEditFetch().then(
    () => {
      loggedUserFetch()
    }
  )
}

const onProjectEdit = (id) => {
  selectedProjectId.value = id
  projectToEditFetch().then(
    () => {
      loggedUserFetch()
    }
  )
}

const onComponentPaginate = (page, pageSize) => {
  fetchUsersPaginated(page, pageSize)
}

const onProjectPaginate = (page, pageSize) => {
  fetchProjectsPaginated(page, pageSize)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <Navbar
        :menuItems="menu"
    />

    <main class="flex-grow container max-w-6xl mx-auto p-2 sm:p-4 md:p-6 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <aside class="w-full md:w-64 mb-2 md:mb-0">
          <button
            class="w-full bg-white border border-violet-200 rounded-lg px-4 py-3 mb-2 flex justify-between items-center"
            @click="toggleMobileMenu"
            aria-expanded="mobileMenuOpen"
            aria-controls="profile-menu"
          >
            <span>{{ selectedLabel }}</span>
            <svg :class="{'transform rotate-180': mobileMenuOpen}" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <div id="profile-menu" v-show="mobileMenuOpen" class="bg-white border border-violet-200 rounded-lg shadow mb-2 z-20">
            <button
              v-for="option in menuOptions"
              :key="option.key"
              @click="selectOption(option)"
              :class="[
                'block w-full text-left px-4 py-2 rounded transition',
                isSelected(option.key) ? 'bg-violet-100 text-violet-700 font-semibold' : 'hover:bg-gray-100'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </aside>

        <section class="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px]">
          <template v-if="selectedMenu === 'info'">
            <ProfileContent
              v-if="!loggedUserLoading && !loggedUserError"
              :component="loggedUserComponent"
              :projects="loggedUserProjects"
              :owned-projects="loggedUserOwnedProjects"
              :teached-courses="loggedUserTeachedCourses"
              :publications="loggedUserPublications"
            />
            <div v-else-if="loggedUserLoading">
              <h2 class="text-2xl font-bold mb-4">Loading profile...</h2>
            </div>
            <div v-else>
              <h2 class="text-2xl font-bold mb-4">Benvenuto</h2>
              <p>Questa pagina è vuota in quanto non sei un componente del gruppo.</p>
            </div>
          </template>
          <template v-else-if="selectedMenu === 'components'">
            <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 md:flex-nowrap">
              <ComponentList 
                :users="paginatedUsers"
                :maxHeight="'28rem'"
                :totalItems="totalUsers"
                @edit="onComponentEdit"
                @paginate="onComponentPaginate"
              />
              <ComponentForm 
                v-if="!userToEditLoading && !userToEditError && userToEditComponent"
                :user="userToEditComponent"
                :projects="userToEditProjects"
                :teachedCourses="userToEditTeachedCourses"
                :publications="userToEditPublications"
                :saving="userToEditLoading"
                :projectOptions="allProjects"
                :courseOptions="allCourses"
                :publicationOptions="allPublications"
                @save="componentSave"
              />
            </div>
           </template>
          <template v-else-if="selectedMenu === 'projects'">
            <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 md:flex-nowrap">
              <ProjectList 
                :projects="paginatedProjects"
                :maxHeight="'28rem'"
                :totalItems="totalProjects"
                @edit="onProjectEdit"
                @paginate="onProjectPaginate"
              />
              <ProjectForm 
                v-if="!projectToEditLoading && !projectToEditError && projectToEdit"
                :project="projectToEdit"
                :components="projectToEditComponents"
                :publications="projectToEditPublications"
                :researchArea="projectToEditResearchArea"
                :projectOwner="projectToEditProjectOwner"
                :saving="projectToEditLoading"
                :projectOptions="allProjects"
                :componentOptions="allUsers"
                :publicationOptions="allPublications"
                @save="projectSave"
              />
            </div>
          </template>
        </section>
      </div>
    </main>

    <Footer/>
  </div>
</template>
