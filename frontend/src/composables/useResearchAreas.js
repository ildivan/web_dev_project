import { ref } from 'vue'
import { getResearchAreas } from '../apiCalls/apiCalls'

export default function useResearchAreas() {
    const researchAreas = ref([])
    const count = ref(0)

    async function fetchResearchAreasPaginated(page = 1, pageSize = 10, editable=false) {
        try {
            const response = await getResearchAreas(page, pageSize)
            researchAreas.value = response.results
            count.value = response.count
        } catch (error) {
            console.error('Error fetching paginated research areas:', error)
        }
    }

    async function fetchAllResearchAreas(editable=false) {
        try {
            // request the API to disable pagination per-request (backend supports ?page_size=0 or ?page_size=all)
            const response = await getResearchAreas(undefined, 0, editable)

            researchAreas.value = response
            count.value = response.length
        } catch (error) {
            console.error('Error fetching all research areas:', error)
        }
    }

    return {
        researchAreas,
        count,
        fetchResearchAreasPaginated,
        fetchAllResearchAreas,
    }
}