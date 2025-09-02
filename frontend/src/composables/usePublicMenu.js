import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function usePublicMenu() {
  const route = useRoute()

  const MENUS = {
    home: [
      { name: 'Home', to: '/' },
      { name: 'Membri', to: '/members' },
      { name: 'Progetti', to: '/projects' },
      { name: 'Pubblicazioni', to: '/pubblications' },
      { name: 'Profilo', to: '/profile' }
    ],
    profile: [
      { name: 'Home', to: '/' },
      { name: 'Logout', action: 'logout' }
    ]
  } 

  // Map route paths to menu keys
  const menuKeyByPath = {
    '/': 'home',
    '/members': 'home',
    '/projects': 'home',
    '/pubblications': 'home',
    '/profile': 'profile',
  }

  const menu = computed(() => {
    // If on profile page, use profile menu
    if (route.path === '/profile' || route.path ==='/admin/components'
      || route.path ==='/admin/projects' || route.path ==='/admin/publications'
      || route.path ==='/admin/courses'
    ) return MENUS.profile
    // Otherwise, use home menu for all main pages
    return MENUS[menuKeyByPath[route.path]] || MENUS.home
  })

  return {
    menu
  }
}