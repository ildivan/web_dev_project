import { computed, onMounted, watch , ref} from 'vue'
import { useComponent } from './useComponent'
import axiosInstance from '../axios'
import { getPermissions } from '../apiCalls/apiCalls'

export default function usePrivateMenu() {
    async function fetchLoggedUserId() {
        try {
            const res = await axiosInstance.get('/api/auth/users/me/')
            return res.data.id
        } catch (err) {
            console.error('Error fetching logged user ID:', err)
            throw err
        }
    }
    
    const { loading: userLoading, error: userError } = useComponent(fetchLoggedUserId)
    const permissions = ref([])
    const objectPermissions = ref({})

    async function fetchUserPermissions() {
        try {
            const res = await getPermissions()
            permissions.value = res.permissions || []
            objectPermissions.value = res.object_permissions || {}
        } catch (err) {
            console.error('Error fetching user permissions:', err)
            permissions.value = []
            objectPermissions.value = {}
        }
    }

    onMounted(() => {
        fetchUserPermissions()
    })

    function hasAnyPermission(modelKey, permPrefix) {
        // Check model-level permission
        if (Array.isArray(permissions.value) && permissions.value.some(p => p.includes(permPrefix))) {
            return true
        }
        // Check object-level permission
        const objPerms = objectPermissions.value[modelKey]
        if (objPerms) {
            // If any permission array for this model is non-empty
            return Object.values(objPerms).some(arr => Array.isArray(arr) && arr.length > 0)
        }
        return false
    }

    const menu = computed(() => {
        const base = [ { label: 'Profilo', relURL: '/profile' } ]
        if (!userError.value && hasAnyPermission('researchgroupcomponent', 'researchgroupcomponent')) {
            base.push({ label: 'Amministrazione Componenti del Gruppo', relURL: '/admin/components' })
        }
        if (!userError.value && hasAnyPermission('researchproject', 'researchproject')) {
            base.push({ label: 'Amministrazione Progetti', relURL: '/admin/projects' })
        }
        if (!userError.value && hasAnyPermission('publication', 'publication')) {
            base.push({ label: 'Amministrazione Pubblicazioni', relURL: '/admin/publications' })
        }
        if (!userError.value && hasAnyPermission('course', 'course')) {
            base.push({ label: 'Amministrazione Corsi', relURL: '/admin/courses' })
        }
        return base
    })
    
    watch([userLoading, userError], () => {}, { immediate: true })

    return {
        menu: menu,
        loading: userLoading,
        error: userError
    }
}