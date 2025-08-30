import {ref} from 'vue'
import { getGroupComponents } from '../apiCalls/apiCalls'

export default function useComponents() {
    const components = ref([])
    const count = ref(0)

    async function fetchComponentsPaginated(page = 1, pageSize = 10, editable=false) {
        try {
            const response = await getGroupComponents(page, pageSize, editable)
            components.value = response.results
            count.value = response.count
        } catch (error) {
            console.error('Error fetching paginated components:', error)
        }
    }

    async function fetchAllComponents(editable=false) {
        try {
            const response = await getGroupComponents(undefined, 0, editable)

            components.value = response
            count.value = response.length
        } catch (error) {
            console.error('Error fetching all components:', error)
        }
    }

    return {
        components,
        count,
        fetchComponentsPaginated,
        fetchAllComponents
    }
}

