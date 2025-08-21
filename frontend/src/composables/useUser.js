import { ref } from 'vue'
import axios from '../axios'

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
      const res = await axios.get(`/api/group-components/${id.value}/`)
      component.value = res.data

      if (!component.value) {
        throw new Error('Component not found')
      }

      for (const projectId of component.value.projects || []) {
        const projectRes = await axios.get(`/api/projects/${projectId}/`)
        projects.value.push(projectRes.data)
      }
      for (const projectId of component.value.owned_projects || []) {
        const projectRes = await axios.get(`/api/projects/${projectId}/`)
        ownedProjects.value.push(projectRes.data)
      }
      for (const courseId of component.value.teached_courses || []) {
        const courseRes = await axios.get(`/api/courses/${courseId}/`)
        teachedCourses.value.push(courseRes.data)
      }
      for (const pubId of component.value.publications || []) {
        const pubRes = await axios.get(`/api/publications/${pubId}/`)
        publications.value.push(pubRes.data)
      }
    } catch (err) {
      error.value = err.message || 'Could not load user data.'
    } finally {
      loading.value = false
    }
  }

  function isEqual(a, b) {
    // Compare arrays by value
    if (Array.isArray(a) && Array.isArray(b)) {
      return JSON.stringify(a) === JSON.stringify(b)
    }
    // Compare objects by value
    if (typeof a === 'object' && typeof b === 'object' && a && b) {
      return JSON.stringify(a) === JSON.stringify(b)
    }
    // Fallback to primitive comparison
    return a === b
  }

  const updateUser = async (data) => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.patch(`/api/group-components/${id.value}/`, data)
      component.value = res.data
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