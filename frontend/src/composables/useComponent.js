import { ref } from 'vue'
import { getGroupComponent , getProject, getPublication, getCourse, updateGroupComponent} from '../apiCalls/apiCalls'

//si aspetta una funzione getId che ritorna l'id del componente da caricare
export function useComponent(getId) {
  const loading = ref(true)
  const error = ref(null)
  const component = ref(null)
  const projects = ref([])
  const ownedProjects = ref([])
  const teachedCourses = ref([])
  const publications = ref([])

  const id = ref(null)

  const fetchComponentData = async () => {
    loading.value = true
    error.value = null
    component.value = null
    projects.value = []
    ownedProjects.value = []
    teachedCourses.value = []
    publications.value = []
    try {
      id.value = await getId()
      if (id.value) {
        component.value = await getGroupComponent(id.value)
        projects.value = component.value.projects || []
        ownedProjects.value = component.value.owned_projects || []
        teachedCourses.value = component.value.teached_courses || []
        publications.value = component.value.publications || []
    }
    } catch (err) {
      error.value = err.message || 'Could not load user data.'
    } finally {
      loading.value = false
    }
  }

  const updateComponent = async (data) => {
  loading.value = true
  error.value = null
  try {
    // Aggiorna sul server
    await updateGroupComponent(id.value, data)

    // Poi ricarica i dati aggiornati dal server
    await fetchComponentData()
  } catch (err) {
    error.value = err.message || 'Could not update component data.'
  } finally {
    loading.value = false
  }
}

  return {
    loading,
    error,
    component,
    projects,
    ownedProjects,
    teachedCourses,
    publications,
    fetchComponentData,
    updateComponent
  }
}