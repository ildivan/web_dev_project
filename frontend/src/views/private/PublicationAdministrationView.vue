<script setup>
import { ref } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import useComponents from '../../composables/useComponents.js'
import { onMounted } from 'vue'
import useProjects from '../../composables/useProjects.js'
import usePublications from '../../composables/usePublications.js'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'
import { usePublication } from '../../composables/usePublication.js'
import PublicationForm from '../../components/entity_edit/PublicationForm.vue'
import PublicationList from '../../components/entity_edit/PublicationList.vue'
import usePrivateMenu from '../../composables/usePrivateMenu.js'
import { createPublication, getPermissions, deletePublication, isComponent } from '../../apiCalls/apiCalls.js'

const selectedPublicationId = ref(null)
const creatingNewInstance = ref(false)
const permissions = ref([])

const component = ref(false)

function fetchPublicationId() {
    return selectedPublicationId.value
}

const { components: allComponents, fetchAllComponents } = useComponents()
const { projects: allProjects, fetchAllProjects } = useProjects()
const { publications: paginatedPublications, count: totalPublications, fetchPublicationsPaginated } = usePublications()

onMounted(async () => {
  component.value = (await isComponent()).is_component
  if (component.value) {
    fetchPublicationsPaginated(1, 10, true)
    fetchAllComponents()
    fetchAllProjects()
    getPermissions().then(fetchedPermissions => {
      permissions.value = fetchedPermissions.permissions
    })
  }
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

const publicationCreate = (toCreate) => {
  try {
    createPublication(toCreate).then(() => {
      creatingNewInstance.value = false
      fetchPublicationsPaginated(1, 10, true)
    })
  } catch (error) {
    console.error('Error creating publication data:', error)
  }
}

const onPublicationEdit = (id) => {
  selectedPublicationId.value = id
  creatingNewInstance.value = false
  publicationToEditFetch()
}

const onPublicationPaginate = (page, pageSize) => {
  fetchPublicationsPaginated(page, pageSize, true)
}

const onPublicationDelete = (id) => {
  deletePublication(id).then(() => {
    fetchPublicationsPaginated(1, 10, true)
    if (selectedPublicationId.value === id) {
      selectedPublicationId.value = null
      creatingNewInstance.value = false
    }
  }).catch(error => {
    console.error('Error deleting publication:', error)
  })
}

const onPublicationCreate = () => {
  creatingNewInstance.value = true
  selectedPublicationId.value = null
}

const { menu: publicMenu } = usePublicMenu()
const {menu: privateMenu} = usePrivateMenu()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 pt-16">
    <Navbar
        :menuItems="publicMenu"
    />

    <main class="flex-grow container max-w-6xl mx-auto p-2 sm:p-4 md:p-6 mt-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <ViewDropDownSelector :menuOptions="privateMenu"/>

        <section v-if="!component" class="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px] flex items-center justify-center">
          <div class="text-center"> 
              <h3 class="text-red-500 text-lg mb-3">Accesso Negato</h3>
              <p class="text-red-500 text-lg">Questa sezione è riservata ai componenti del gruppo di ricerca</p>
          </div>
        </section>

        <section v-else class="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px]">
            <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 md:flex-nowrap">
                <PublicationList 
                  :publications="paginatedPublications"
                  :maxHeight="'28rem'"
                  :totalItems="totalPublications"
                  :projects="allProjects"
                  :allowCreate="permissions.some(permission => permission == 'api.add_publication')"
                  @edit="onPublicationEdit"
                  @delete="onPublicationDelete"
                  @paginate="onPublicationPaginate"
                  @create="onPublicationCreate"
                />
                <PublicationForm 
                  v-if="creatingNewInstance"
                  :saving="publicationToEditLoading"
                  :componentOptions="allComponents"
                  :projectOptions="allProjects"
                  formTitle="Creazione Pubblicazione"
                  @save="publicationCreate"
                />
                <PublicationForm 
                  v-if="!creatingNewInstance && !publicationToEditLoading && !publicationToEditError && publicationToEdit"
                  :publication="publicationToEdit"
                  :components="publicationToEditComponents"
                  :project="publicationToEditProject"
                  :saving="publicationToEditLoading"
                  :componentOptions="allComponents"
                  :projectOptions="allProjects"
                  formTitle="Modifica Pubblicazione"
                  @save="publicationSave"
                />
            </div>
        </section>
      </div>
    </main>

    <Footer/>
  </div>
</template>
