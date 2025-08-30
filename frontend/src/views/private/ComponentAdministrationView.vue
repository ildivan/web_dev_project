<script setup>
import { ref } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { useUser } from '../../composables/useUser.js'
import ComponentForm from '../../components/entity_edit/ComponentForm.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import ComponentList from '../../components/entity_edit/ComponentList.vue'
import useUsers from '../../composables/useUsers.js'
import { onMounted } from 'vue'
import useProjects from '../../composables/useProjects.js'
import useCourses from '../../composables/useCourses.js'
import usePublications from '../../composables/usePublications.js'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'
import usePrivateMenu from '../../composables/usePrivateMenu.js'
import { createGroupComponent, getPermissions } from '../../apiCalls/apiCalls.js'
import { getUsers } from '../../apiCalls/apiCalls.js'
import ComponentCreationForm from '../../components/entity_edit/ComponentCreationForm.vue'

const selectedUserId = ref(null)
const creatingNewInstance = ref(false)
const permissions = ref([])

function fetchUserId() {
    return selectedUserId.value
}

const { menu } = usePublicMenu()

const users = ref([])
const { users: paginatedUsers, count: totalUsers, fetchUsersPaginated } = useUsers()
const { projects: allProjects, fetchAllProjects } = useProjects()
const { publications: allPublications, fetchAllPublications } = usePublications()
const { courses: allCourses, fetchAllCourses } = useCourses()
const { users: allComponents, fetchAllUsers: fetchAllComponents } = useUsers()

onMounted(() => {
  fetchUsersPaginated(1, 10, true)
  fetchAllProjects()
  fetchAllPublications()
  fetchAllCourses()
  fetchAllComponents().then(
    () => {
      getUsers().then(fetchedUsers => {
        const users_already_components = new Set(allComponents.value.map(c => c.user.id))
        const users_not_components = fetchedUsers.filter(user => !users_already_components.has(user.id))
        users.value = users_not_components
      })
    }
  )
  getPermissions().then(fetchedPermissions => {
    permissions.value = fetchedPermissions.permissions
  })
})

const {
  loading: userToEditLoading,
  error: userToEditError,
  component: userToEditComponent,
  projects: userToEditProjects,
  teachedCourses: userToEditTeachedCourses,
  publications: userToEditPublications,
  updateUser: userToEditUpdate,
  fetchUserData: userToEditFetch
} = useUser(fetchUserId)


const componentSave = (toSave) => {
  try {
    userToEditUpdate(toSave)
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

const componentCreate = (toCreate) => {
  try {
    createGroupComponent(toCreate)
    creatingNewInstance.value = false
  } catch (error) {
    console.error('Error creating user data:', error)
  }
}

const onComponentEdit = (id) => {
  selectedUserId.value = id
  creatingNewInstance.value = false
  userToEditFetch()
}

const onComponentPaginate = (page, pageSize) => {
  fetchUsersPaginated(page, pageSize, true)
}

const onCreate = () => {
  creatingNewInstance.value = true
  selectedUserId.value = null
}

const {menu: privateMenu} = usePrivateMenu()

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <Navbar
        :menuItems="menu"
    />

    <main class="flex-grow container max-w-6xl mx-auto p-2 sm:p-4 md:p-6 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <ViewDropDownSelector :menuOptions="privateMenu"/>

        <div class="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px]">
          <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 md:flex-nowrap">
            <ComponentList 
            :users="paginatedUsers"
            :maxHeight="'28rem'"
            :totalItems="totalUsers"
            :allowCreate="permissions.some(permission => permission == 'api.add_researchgroupcomponent')"
            @edit="onComponentEdit"
            @paginate="onComponentPaginate"
            @create="onCreate"
            />
            <ComponentCreationForm
            v-if="creatingNewInstance"
            :users="users"
            :saving="userToEditLoading"
            :projectOptions="allProjects"
            :courseOptions="allCourses"
            :publicationOptions="allPublications"
            @save="componentCreate"
            />
            <ComponentForm 
            v-if="!creatingNewInstance && !userToEditLoading && !userToEditError && userToEditComponent"
            :user="userToEditComponent"
            :projects="userToEditProjects"
            :teachedCourses="userToEditTeachedCourses"
            :publications="userToEditPublications"
            :saving="userToEditLoading"
            :projectOptions="allProjects"
            :courseOptions="allCourses"
            :publicationOptions="allPublications"
            title="Modifica Componente"
            @save="componentSave"
            />
          </div>
        </div>
      </div>
    </main>

    <Footer/>
  </div>
</template>
