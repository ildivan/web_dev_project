import { ref } from 'vue'
import { getProjects } from '../apiCalls/apiCalls'

export default function useProjects() {
    const projects = ref([])
    const count = ref(0)

    async function fetchProjectsPaginated(page = 1, pageSize = 10) {
        try {
            const response = await getProjects(page, pageSize)
            projects.value = response.results
            count.value = response.count
        } catch (error) {
            console.error('Error fetching paginated projects:', error)
        }
    }

    async function fetchAllProjects() {
        try {
            // request the API to disable pagination per-request (backend supports ?page_size=0 or ?page_size=all)
            const response = await getProjects(undefined, 0)

            projects.value = response
            count.value = response.length
        } catch (error) {
            console.error('Error fetching all projects:', error)
        }
    }

    return {
        projects,
        count,
        fetchProjectsPaginated,
        fetchAllProjects,
    }
}