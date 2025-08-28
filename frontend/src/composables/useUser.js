import { ref } from 'vue'
import { getGroupComponent , getProject, getPublication, getCourse, updateGroupComponent} from '../apiCalls/apiCalls'

export function useUser(getId) {
  const loading = ref(true)
  const error = ref(null)
  const component = ref(null)
  const projects = ref([])
  const ownedProjects = ref([])
  const teachedCourses = ref([])
  const publications = ref([])

  const id = ref(null)

  const fetchUserData = async () => {
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

  const updateUser = async (data) => {
    loading.value = true
    error.value = null
    try {
      component.value = await updateGroupComponent(id.value, data)
      await fetchUserData() // Refresh data after update
    } catch (err) {
      error.value = err.message || 'Could not update user data.'
    } finally {
      loading.value = false
    }
  }

  fetchUserData()

  return {
    loading,
    error,
    component,
    projects,
    ownedProjects,
    teachedCourses,
    publications,
    fetchUserData,
    updateUser
  }
}