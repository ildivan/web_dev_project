<script setup>
import { ref } from 'vue'
import Footer from '../../components/Footer.vue'
import Navbar from '../../components/Navbar.vue'
import { useComponent } from '../../composables/useComponent.js'
import ComponentForm from '../../components/entity_edit/ComponentForm.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
import ComponentList from '../../components/entity_edit/ComponentList.vue'
import useComponents from '../../composables/useComponents.js'
import { onMounted } from 'vue'
import useProjects from '../../composables/useProjects.js'
import useCourses from '../../composables/useCourses.js'
import usePublications from '../../composables/usePublications.js'
import ViewDropDownSelector from '../../components/ViewDropDownSelector.vue'
import usePrivateMenu from '../../composables/usePrivateMenu.js'
import { createGroupComponent, deleteGroupComponent, getPermissions, getUsers, isComponent } from '../../apiCalls/apiCalls.js'
import ComponentCreationForm from '../../components/entity_edit/ComponentCreationForm.vue'
import ConfirmModal from '../../components/ConfirmDeleteModal.vue'

const selectedComponentId = ref(null)
const creatingNewInstance = ref(false)
const permissions = ref([])

const showDeleteModal = ref(false)
const componentToDelete = ref(null)


function fetchComponentId() {
    return selectedComponentId.value
}

const { menu } = usePublicMenu()

const usersNotComponents = ref([])
const { components: paginatedComponents, count: totalComponents, fetchComponentsPaginated } = useComponents()
const { projects: allProjects, fetchAllProjects } = useProjects()
const { publications: allPublications, fetchAllPublications } = usePublications()
const { courses: allCourses, fetchAllCourses } = useCourses()
const { components: allComponents, fetchAllComponents: fetchAllComponents } = useComponents()

const refreshUsersNotComponents = async () => {
  await fetchAllComponents(); // Wait for components to update
  const fetchedUsers = await getUsers();
  const users_already_components = new Set(allComponents.value.map(c => c.user.id));
  const users_not_components = fetchedUsers.filter(user => !users_already_components.has(user.id));
  usersNotComponents.value = users_not_components;
}

const {
  loading: componentToEditLoading,
  error: componentToEditError,
  component: componentToEditComponent,
  projects: componentToEditProjects,
  teachedCourses: componentToEditTeachedCourses,
  publications: componentToEditPublications,
  updateComponent: componentToEditUpdate,
  fetchComponentData: componentToEditFetch
} = useComponent(fetchComponentId)

onMounted(async () => {
  fetchComponentsPaginated(1, 10, true)
  fetchAllProjects()
  fetchAllPublications()
  fetchAllCourses()
  refreshUsersNotComponents()
  getPermissions().then(fetchedPermissions => {
    permissions.value = fetchedPermissions.permissions
  })
})

componentToEditFetch()

const componentSave = async (toSave) => {
  try {
    await componentToEditUpdate(toSave)
    await fetchComponentsPaginated(1, 10, true)
    if (selectedComponentId.value) {
      await componentToEditFetch()
    }
    selectedComponentId.value = null
    creatingNewInstance.value = false
  } catch (error) {
    console.error('Error saving component data:', error)
  }
}

const componentCreate = (toCreate) => {
  try {
    createGroupComponent(toCreate).then(
      () => {
        creatingNewInstance.value = false
        fetchComponentsPaginated(1, 10, true)
        refreshUsersNotComponents()
      }
    )
  } catch (error) {
    console.error('Error creating component data:', error)
  }
}

const onComponentEdit = (id) => {
  selectedComponentId.value = id
  creatingNewInstance.value = false
  componentToEditFetch()
}

const onComponentPaginate = (page, pageSize) => {
  fetchComponentsPaginated(page, pageSize, true)
}

const confirmComponentDelete = (component) => {
  componentToDelete.value = component
  showDeleteModal.value = true
}

const performComponentDelete = async () => {
  if (!componentToDelete.value) return
  try {
    await deleteGroupComponent(componentToDelete.value)
    refreshUsersNotComponents()
    fetchComponentsPaginated(1, 10, true)

    if (selectedComponentId.value === componentToDelete.value) {
      selectedComponentId.value = null
      creatingNewInstance.value = false
    }

    showDeleteModal.value = false
    componentToDelete.value = null
  } catch (error) {
    console.error('Error deleting component:', error)
  }
}



const onComponentCreate = () => {
  creatingNewInstance.value = true
  selectedComponentId.value = null
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
          <ConfirmModal
            :show="showDeleteModal"
            title="Conferma Eliminazione"
            :message="`Sei sicuro di voler eliminare il componente?`"
            confirmText="Elimina"
            cancelText="Annulla"
            warningText="Questa operazione non può essere annullata"
            @confirm="performComponentDelete"
            @cancel="showDeleteModal = false"
          />

            <ComponentList 
            :components="paginatedComponents"
            :maxHeight="'28rem'"
            :totalItems="totalComponents"
            :allowCreate="permissions.some(permission => permission == 'api.add_researchgroupcomponent')"
            @edit="onComponentEdit"
            @delete="confirmComponentDelete"
            @paginate="onComponentPaginate"
            @create="onComponentCreate"
            />
            <ComponentCreationForm
            v-if="creatingNewInstance"
            :users="usersNotComponents"
            :saving="componentToEditLoading"
            :projectOptions="allProjects"
            :courseOptions="allCourses"
            :publicationOptions="allPublications"
            @save="componentCreate"
            />
            <ComponentForm 
            v-if="!creatingNewInstance && !componentToEditLoading && !componentToEditError && componentToEditComponent && selectedComponentId"
            :component="componentToEditComponent"
            :projects="componentToEditProjects"
            :teachedCourses="componentToEditTeachedCourses"
            :publications="componentToEditPublications"
            :saving="componentToEditLoading"
            :projectOptions="allProjects"
            :courseOptions="allCourses"
            :publicationOptions="allPublications"
            title="Modifica Componente"
            @save="componentSave"
            />
          </div>
        </div> 
    </main>

    <Footer/>
  </div>
</template>
