<script setup>
import { ref } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import useUsers from '../../composables/useUsers.js'
import { onMounted } from 'vue'
import useProjects from '../../composables/useProjects.js'
import usePublications from '../../composables/usePublications.js'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'
import { usePublication } from '../../composables/usePublication.js'
import PublicationForm from '../../components/entity_edit/PublicationForm.vue'
import PublicationList from '../../components/entity_edit/PublicationList.vue'
import usePrivateMenu from '../../composables/usePrivateMenu.js'

const selectedPublicationId = ref(null)

function fetchPublicationId() {
    return selectedPublicationId.value
}

const { menu } = usePublicMenu()

const { users: allUsers, fetchAllUsers } = useUsers()
const { projects: allProjects, fetchAllProjects } = useProjects()
const { publications: paginatedPublications, count: totalPublications, fetchPublicationsPaginated } = usePublications()

onMounted(() => {
  fetchPublicationsPaginated(1, 10)
  fetchAllUsers()
  fetchAllProjects()
})

const {
  loading: publicationToEditLoading,
  error: publicationToEditError,
  publication: publicationToEdit,
  components: publicationToEditComponents,
  researchProject: publicationToEditProject,
  updatePublicationData: publicationToEditUpdate,
  fetchPublicationData: publicationToEditFetch
} = usePublication(fetchPublicationId)

const publicationSave = (toSave) => {
  try {
    publicationToEditUpdate(toSave)
  } catch (error) {
    console.error('Error saving publication data:', error)
  }
}

const onPublicationEdit = (id) => {
  selectedPublicationId.value = id
  publicationToEditFetch()
}

const onPublicationPaginate = (page, pageSize) => {
  fetchPublicationsPaginated(page, pageSize)
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

        <section class="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px]">
            <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 md:flex-nowrap">
                <PublicationList 
                  :publications="paginatedPublications"
                  :maxHeight="'28rem'"
                  :totalItems="totalPublications"
                  @edit="onPublicationEdit"
                  @paginate="onPublicationPaginate"
                />
                <PublicationForm 
                  v-if="!publicationToEditLoading && !publicationToEditError && publicationToEdit"
                  :publication="publicationToEdit"
                  :components="publicationToEditComponents"
                  :project="publicationToEditProject"
                  :saving="publicationToEditLoading"
                  :componentOptions="allUsers"
                  :projectOptions="allProjects"
                  @save="publicationSave"
                />
            </div>
        </section>
      </div>
    </main>

    <Footer/>
  </div>
</template>
