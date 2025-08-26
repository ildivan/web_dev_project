import { ref } from 'vue'
import {
getCourse,
    getGroupComponent,
updateCourse
} from '../apiCalls/apiCalls'

export function useCourse(getId) {
    const loading = ref(true)
    const error = ref(null)
    const course = ref(null)
    const components = ref([])

    const id = ref(null)

    const fetchCourseData = async () => {
        loading.value = true
        error.value = null
        course.value = null
        components.value = []

        try {
            id.value = await getId()
            if (!id.value) {
                loading.value = false
                return
            }

            // fetch main course
            course.value = await getCourse(id.value)
            if (!course.value) {
                throw new Error('Course not found')
            }

            // components: may be array of ids or array of objects
            const comps = []
            const rawComps = course.value.teachers || []
            for (const c of rawComps) {
                comps.push(await getGroupComponent(c))
            }
            components.value = comps.map(c => c.user)
        } catch (err) {
            error.value = err.message || 'Could not load course data.'
        } finally {
            loading.value = false
        }
    }

    const updateCourseData = async (data) => {
        loading.value = true
        error.value = null
        try {
        course.value = await updateCourse(id.value, data)
        await fetchCourseData()
        } catch (err) {
        error.value = err.message || 'Could not update course.'
        } finally {
        loading.value = false
        }
    }

    fetchCourseData()

    return {
        loading,
        error,
        course,
        components,
        fetchCourseData,
        updateCourseData,
    }
}