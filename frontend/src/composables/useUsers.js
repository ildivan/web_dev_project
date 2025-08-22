import {ref} from 'vue'
import { getGroupComponents } from '../apiCalls/apiCalls'

export default function useUsers() {
    const users = ref([])
    const count = ref(0)

    async function fetchUsersPaginated(page = 1, pageSize = 10) {
        try {
            const response = await getGroupComponents(page, pageSize)
            users.value = response.results
            count.value = response.count
        } catch (error) {
            console.error('Error fetching paginated users:', error)
        }
    }

    async function fetchAllUsers() {
        try {
            // request the API to disable pagination per-request (backend supports ?page_size=0 or ?page_size=all)
            // pass undefined for page and 'all' for pageSize; adjust if your apiCalls implementation differs
            const response = await getGroupComponents(undefined, 0)

            users.value = response
            count.value = response.length
        } catch (error) {
            console.error('Error fetching all users:', error)
        }
    }

    return {
        users,
        count,
        fetchUsersPaginated,
        fetchAllUsers
    }
}

