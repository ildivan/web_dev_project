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

    async function fetchUserPermissions() {
        try {
            const res = await getPermissions()
            permissions.value = res.data
        } catch (err) {
            console.error('Error fetching user permissions:', err)
            throw err
        }
    }

    onMounted(() => {
        fetchUserPermissions()
    })

    const menu = computed(() => {
            const base = [ { label: 'Profilo', relURL: '/profile' } ]
            if (!userError.value || permissions.value.some(permission => permission.includes('groupcomponents'))) {
                base.push({ label: 'Amministrazione Componenti del Gruppo', relURL: '/admin/components' })
                
            }
            if (!userError.value || permissions.value.some(permission => permission.includes('researchprojects'))) {
                base.push({ label: 'Amministrazione Progetti', relURL: '/admin/projects' })
                
            }
            if (!userError.value || permissions.value.some(permission => permission.includes('publications'))) {
                base.push({ label: 'Amministrazione Pubblicazioni', relURL: '/admin/publications' })
                
            }
            if (!userError.value || permissions.value.some(permission => permission.includes('courses'))) {
                base.push({ label: 'Amministrazione Corsi', relURL: '/admin/courses' })
                
            }
            
            return base
        })
    
    // keep watch to trigger evaluation early if desired; computed will update automatically
    watch([userLoading, userError], () => {}, { immediate: true })

    return {
    menu: menu,
        loading: userLoading,
        error: userError
    }
}