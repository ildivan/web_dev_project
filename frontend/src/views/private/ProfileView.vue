<script setup>
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { useUser } from '../../composables/useUser.js'
import ProfileContent from '../../components/ProfileContent.vue'
import { useMenu } from '../../composables/useMenu.js'
import axiosInstance from '../../axios'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'

async function fetchLoggedUserId() {
  try {
    const res = await axiosInstance.get('/api/auth/users/me/')
    return res.data.id
  } catch (err) {
    console.error('Error fetching logged user ID:', err)
    throw err
  }
}

const { menu } = useMenu()

const {
  loading: loggedUserLoading,
  error: loggedUserError,
  component: loggedUserComponent,
  projects: loggedUserProjects,
  ownedProjects: loggedUserOwnedProjects,
  teachedCourses: loggedUserTeachedCourses,
  publications: loggedUserPublications,
} = useUser(fetchLoggedUserId)

const adminPageSelector = [
  {
    label: 'Profilo',
    relURL: '/profile'
  },
  {
    label: 'Amministrazione Componenti del Gruppo',
    relURL: '/admin/components'
  },
  {
    label: 'Amministrazione Progetti',
    relURL: '/admin/projects'
  },
]

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <Navbar
        :menuItems="menu"
    />

    <main class="flex-grow container max-w-6xl mx-auto p-2 sm:p-4 md:p-6 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <ViewDropDownSelector :menuOptions="adminPageSelector"/>

        <div class="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px]">
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
        </div>
      </div>
    </main>

    <Footer/>
  </div>
</template>
