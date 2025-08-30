import { computed, watch } from 'vue'
import { useComponent } from './useComponent'
import axiosInstance from '../axios'

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
    
    const menu = computed(() => {
            const base = [ { label: 'Profilo', relURL: '/profile' } ]
            if (!userError.value) {
                base.push({ label: 'Amministrazione Componenti del Gruppo', relURL: '/admin/components' })
                base.push({ label: 'Amministrazione Progetti', relURL: '/admin/projects' })
                base.push({ label: 'Amministrazione Pubblicazioni', relURL: '/admin/publications' })
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