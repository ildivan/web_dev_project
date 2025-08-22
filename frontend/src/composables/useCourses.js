import { ref } from 'vue'
import { getCourses } from '../apiCalls/apiCalls'

export default function useCourses() {
    const courses = ref([])
    const count = ref(0)

    async function fetchCoursesPaginated(page = 1, pageSize = 10) {
        try {
            const response = await getCourses(page, pageSize)
            courses.value = response.results
            count.value = response.count
        } catch (error) {
            console.error('Error fetching paginated courses:', error)
        }
    }

    async function fetchAllCourses() {
        try {
            // backend supports ?page_size=0 or ?page_size=all to disable pagination
            const response = await getCourses(undefined, 0)
            courses.value = response
            count.value = response.length
        } catch (error) {
            console.error('Error fetching all courses:', error)
        }
    }

    return {
        courses,
        count,
        fetchCoursesPaginated,
        fetchAllCourses,
    }
}