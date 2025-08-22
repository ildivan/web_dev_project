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

        if (!component.value) {
          throw new Error('Component not found')
        }

        for (const projectId of component.value.projects || []) {
          projects.value.push(await getProject(projectId))
        }
        for (const courseId of component.value.teached_courses || []) {
          teachedCourses.value.push(await getCourse(courseId))
        }
        for (const pubId of component.value.publications || []) {
          publications.value.push(await getPublication(pubId))
        }
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