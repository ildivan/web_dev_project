import { ref } from 'vue'
import axios from '../axios'
import { useUser } from './useUser'

export function useLoggedUser() {
  const loading = ref(true)
  const error = ref(null)
  const userId = ref(null)
  const component = ref(null)
  const projects = ref([])
  const ownedProjects = ref([])
  const teachedCourses = ref([])
  const publications = ref([])


  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get('/api/auth/users/me/')
      userId.value = res.data.id

      const user = useUser(userId.value)

      await user.fetchUserData()

      component.value = user.component.value
      projects.value = user.projects.value
      ownedProjects.value = user.ownedProjects.value
      teachedCourses.value = user.teachedCourses.value
      publications.value = user.publications.value

      if (user.error.value) {
        error.value = user.error.value
      }
    } catch (err) {
      error.value = err.message || 'Could not fetch logged user.'
    } finally {
      loading.value = false
    }
  }


  fetchAll()

  return {
    loading,
    error,
    userId,
    component,
    projects,
    ownedProjects,
    teachedCourses,
    publications,
    fetchAll,
  }
}