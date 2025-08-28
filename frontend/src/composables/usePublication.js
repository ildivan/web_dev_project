import { ref } from 'vue'
import {
    getPublication,
    updatePublication
} from '../apiCalls/apiCalls'

export function usePublication(getId) {
    const loading = ref(true)
    const error = ref(null)
    const publication = ref(null)
    const researchProject = ref(null)
    const components = ref([])

    const id = ref(null)

    const fetchPublicationData = async () => {
        loading.value = true
        error.value = null
        publication.value = null
        researchProject.value = null
        components.value = []

        try {
            id.value = await getId()
            if (!id.value) {
                loading.value = false
                return
            }

            // fetch main publication
            publication.value = await getPublication(id.value)
            if (!publication.value) {
                throw new Error('Publication not found')
            }

            researchProject.value = publication.value.research_project
            components.value = publication.value.components.map(c => c.user)
        } catch (err) {
            error.value = err.message || 'Could not load publication data.'
        } finally {
            loading.value = false
        }
    }

    const updatePublicationData = async (data) => {
        loading.value = true
        error.value = null
        try {
        publication.value = await updatePublication(id.value, data)
        await fetchPublicationData()
        } catch (err) {
        error.value = err.message || 'Could not update publication.'
        } finally {
        loading.value = false
        }
    }

    fetchPublicationData()

    return {
        loading,
        error,
        publication,
        researchProject,
        components,
        fetchPublicationData,
        updatePublicationData,
    }
}