import { ref } from 'vue'
import {
  getProject,
  getGroupComponent,
  getPublication,
  getResearchArea,
  updateProject
} from '../apiCalls/apiCalls'

export function useProject(getId) {
  const loading = ref(true)
  const error = ref(null)
  const project = ref(null)
  const researchArea = ref(null)
  const projectOwner = ref(null)
  const components = ref([])
  const publications = ref([])

  const id = ref(null)

  const fetchProjectData = async () => {
    loading.value = true
    error.value = null
    project.value = null
    researchArea.value = null
    projectOwner.value = null
    components.value = []
    publications.value = []

    try {
        id.value = await getId()
        if (!id.value) {
            loading.value = false
            return
        }

        // fetch main project
        project.value = await getProject(id.value)
        if (!project.value) {
            throw new Error('Project not found')
        }
        
        researchArea.value = project.value.research_area
        projectOwner.value = project.value.project_owner.user
        components.value = project.value.components.map(c => c.user)

        publications.value = project.value.publications
    } catch (err) {
      error.value = err.message || 'Could not load project data.'
    } finally {
      loading.value = false
    }
  }

  const updateProjectData = async (data) => {
    loading.value = true
    error.value = null
    try {
      project.value = await updateProject(id.value, data)
      await fetchProjectData()
    } catch (err) {
      error.value = err.message || 'Could not update project.'
    } finally {
      loading.value = false
    }
  }

  fetchProjectData()


  return {
    loading,
    error,
    project,
    researchArea,
    projectOwner,
    components,
    publications,
    fetchProjectData,
    updateProjectData
  }
}