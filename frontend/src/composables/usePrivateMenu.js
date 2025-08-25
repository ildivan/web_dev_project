import { getPermissions } from "../apiCalls/apiCalls"
import { ref, onMounted } from "vue"

export default function usePrivateMenu() {
    const menu = ref([
        {
            label: 'Profilo',
            relURL: '/profile'
        }
    ])
    const permissions = ref([])

    const loadPermissions = async () => {
        const data = await getPermissions()
        permissions.value = data.permissions
    }

    onMounted(() => {
        loadPermissions().then(
            () => {
                if(permissions.value.includes('api.change_researchgroupcomponent')) {
                    menu.value.push(
                        {
                            label: 'Amministrazione Componenti del Gruppo',
                            relURL: '/admin/components'
                        }
                    )
                }
                if(permissions.value.includes('api.change_researchproject')) {
                    menu.value.push(
                        {
                            label: 'Amministrazione Progetti',
                            relURL: '/admin/projects'
                        }
                    )
                }
                if(permissions.value.includes('api.change_publication')) {
                    menu.value.push(
                        {
                            label: 'Amministrazione Pubblicazioni',
                            relURL: '/admin/publications'
                        }
                    )
                }
            }
        )
    })

    return {
        menu: menu.value
    }
}