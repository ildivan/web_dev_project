import {ref} from 'vue'
import { getGroupComponents } from '../apiCalls/apiCalls'

export default function useUsers() {
    const users = ref([])
    const count = ref(0)

    async function fetchUsersPaginated(page = 1, pageSize = 10, editable=false) {
        try {
            const response = await getGroupComponents(page, pageSize, editable)
            users.value = response.results
            count.value = response.count
        } catch (error) {
            console.error('Error fetching paginated users:', error)
        }
    }

    async function fetchAllUsers(editable=false) {
        try {
            const response = await getGroupComponents(undefined, 0, editable)

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

