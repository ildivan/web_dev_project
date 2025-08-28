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

const selectedUserId = ref(null)

function fetchUserId() {
    return selectedUserId.value
}

const { menu } = usePublicMenu()

const { users: paginatedUsers, count: totalUsers, fetchUsersPaginated } = useUsers()
const { projects: allProjects, fetchAllProjects } = useProjects()
const { publications: allPublications, fetchAllPublications } = usePublications()
const { courses: allCourses, fetchAllCourses } = useCourses()

onMounted(() => {
  fetchUsersPaginated(1, 10, true)
  fetchAllProjects()
  fetchAllPublications()
  fetchAllCourses()
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

const onComponentEdit = (id) => {
  selectedUserId.value = id
  userToEditFetch()
}

const onComponentPaginate = (page, pageSize) => {
  fetchUsersPaginated(page, pageSize, true)
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
        </div>
      </div>
    </main>

    <Footer/>
  </div>
</template>
