import { ref } from 'vue'
import axios from '../axios'

export function useUser(id) {
  const loading = ref(true)
  const error = ref(null)
  const component = ref(null)
  const projects = ref([])
  const ownedProjects = ref([])
  const teachedCourses = ref([])
  const publications = ref([])

  const fetchUserData = async () => {
    loading.value = true
    error.value = null
    projects.value = []
    ownedProjects.value = []
    teachedCourses.value = []
    publications.value = []
    try {
      
      const res = await axios.get(`/api/group-components/${id}/`)
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
  }
}