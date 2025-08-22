import { ref } from 'vue'
import { getPublications } from '../apiCalls/apiCalls'

export default function usePublications() {
    const publications = ref([])
    const count = ref(0)

    async function fetchPublicationsPaginated(page = 1, pageSize = 10) {
        try {
            const response = await getPublications(page, pageSize)
            publications.value = response.results
            count.value = response.count
        } catch (error) {
            console.error('Error fetching paginated publications:', error)
        }
    }

    async function fetchAllPublications() {
        try {
            // backend supports ?page_size=0 or ?page_size=all to disable pagination
            const response = await getPublications(undefined, 0)
            publications.value = response
            count.value = response.length
        } catch (error) {
            console.error('Error fetching all publications:', error)
        }
    }

    return {
        publications,
        count,
        fetchPublicationsPaginated,
        fetchAllPublications,
    }
}