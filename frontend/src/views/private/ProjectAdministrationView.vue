<script setup>
import { ref, computed } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import useComponents from '../../composables/useComponents.js'
import { onMounted } from 'vue'
import useProjects from '../../composables/useProjects.js'
import ProjectList from '../../components/entity_edit/ProjectList.vue'
import ProjectForm from '../../components/entity_edit/ProjectForm.vue'
import {useProject} from '../../composables/useProject.js'
import useResearchAreas from '../../composables/useResearchAreas.js'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'
import usePrivateMenu from '../../composables/usePrivateMenu.js'
import { createProject, deleteProject } from '../../apiCalls/apiCalls.js'
import { getPermissions } from '../../apiCalls/apiCalls.js'

const selectedProjectId = ref(null)
const creatingNewInstance = ref(false)
const permissions = ref([])

function fetchProjectId() {
    return selectedProjectId.value
}

const { menu } = usePublicMenu()

const { components: allComponents, fetchAllComponents } = useComponents()
const { projects: paginatedProjects, count: totalProjects, fetchProjectsPaginated } = useProjects()
const { researchAreas: allResearchAreas, fetchAllResearchAreas } = useResearchAreas()

onMounted(() => {
  fetchProjectsPaginated(1, 10, true)
  fetchAllComponents()
  fetchAllResearchAreas()
  getPermissions().then(fetchedPermissions => {
    permissions.value = fetchedPermissions.permissions
  })
})

const {
  loading: projectToEditLoading,
  error: projectToEditError,
  project: projectToEdit,
  components: projectToEditComponents,
  researchArea: projectToEditResearchArea,
  projectOwner: projectToEditProjectOwner,
  updateProjectData: projectToEditUpdate,
  fetchProjectData: projectToEditFetch
} = useProject(fetchProjectId)

const projectSave = (toSave) => {
  try {
    projectToEditUpdate(toSave)
  } catch (error) {
    console.error('Error saving project data:', error)
  }
}

const projectCreate = (toCreate) => {
  try {
    createProject(toCreate).then(
      () => {
        creatingNewInstance.value = false
        fetchProjectsPaginated(1, 10, true)
      }
    )
  } catch (error) {
    console.error('Error creating project data:', error)
  }
}

const onProjectEdit = (id) => {
  selectedProjectId.value = id
  creatingNewInstance.value = false
  projectToEditFetch()
}

const onProjectPaginate = (page, pageSize) => {
  fetchProjectsPaginated(page, pageSize, true)
}

const onProjectDelete = (id) => {
  deleteProject(id).then(() => {
    // Refresh the project list after deletion
    fetchProjectsPaginated(1, 10, true)
    // If the deleted project was being edited, clear the form
    if (selectedProjectId.value === id) {
      selectedProjectId.value = null
      creatingNewInstance.value = false
    }
  }).catch(error => {
    console.error('Error deleting project:', error)
  })
}

const onProjectCreate = () => {
  creatingNewInstance.value = true
  selectedProjectId.value = null
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
                <ProjectList 
                  :projects="paginatedProjects"
                  :maxHeight="'28rem'"
                  :totalItems="totalProjects"
                  :allowCreate="permissions.some(permission => permission == 'api.add_researchproject')"
                  @edit="onProjectEdit"
                  @delete="onProjectDelete"
                  @paginate="onProjectPaginate"
                  @create="onProjectCreate"
                />
                <ProjectForm 
                  v-if="creatingNewInstance"
                  :componentOptions="allComponents"
                  :researchAreaOptions="allResearchAreas"
                  formTitle="Creazione Progetto"
                  @save="projectCreate"
                />
                <ProjectForm 
                  v-if="!creatingNewInstance && !projectToEditLoading && !projectToEditError && projectToEdit && selectedProjectId"
                  :project="projectToEdit"
                  :components="projectToEditComponents"
                  :researchArea="projectToEditResearchArea"
                  :projectOwner="projectToEditProjectOwner"
                  :saving="projectToEditLoading"
                  :componentOptions="allComponents"
                  :researchAreaOptions="allResearchAreas"
                  formTitle="Modifica Progetto"
                  @save="projectSave"
                />
            </div>
        </section>
      </div>
    </main>

    <Footer/>
  </div>
</template>
