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
        
        researchArea.value = project.value.research_area_detail
        projectOwner.value = project.value.project_owner_detail.user

        let comps = []
        for (const compId of project.value.components || []) {
            const comp = await getGroupComponent(compId)
            if (comp) {
                comps.push(comp)
            }
        }
        components.value = comps.map(c => c.user)

        publications.value = []
        for (const pubId of project.value.publications || []) {
            const pub = await getPublication(pubId)
            if (pub) {
                publications.value.push(pub)
            }
        }

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