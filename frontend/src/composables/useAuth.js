import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance, { axiosEventBus } from '../axios'

const authToken = ref(localStorage.getItem('authToken') || null)
const refreshToken = ref(localStorage.getItem('refreshToken') || null)
const permissions = ref(localStorage.getItem('userPermissions') || null)
const authError = ref(null)

export function useAuth() {
  const router = useRouter()

  const login = async (username, password) => {
    try {
      const res = await axiosInstance.post('api/auth/jwt/create/', {
        username,
        password,
      })
      const access = res.data.access
      const refresh = res.data.refresh
      localStorage.setItem('authToken', access)
      localStorage.setItem('refreshToken', refresh)
      authToken.value = access
      refreshToken.value = refresh
      authError.value = null
      router.push('/profile')
    } catch (err) {
      authError.value = 'Invalid credentials'
    } finally {
      try {
        const permissionsRes = await axiosInstance.get('api/auth/permissions/')
        permissions.value = permissionsRes.data.permissions
        localStorage.setItem('userPermissions', JSON.stringify(permissions.value))
      } catch (err) {
        console.error('Failed to fetch permissions:', err)
      }
    }
  }

  const logout = async () => {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userPermissions')
      permissions.value = null
      authToken.value = null
      refreshToken.value = null
      router.push('/login')
  }

  // Listen for logout event from axios
  const handleLogoutEvent = () => {
    logout()
  }

  onMounted(() => {
    axiosEventBus.addEventListener('auth:logout', handleLogoutEvent)
  })

  onUnmounted(() => {
    axiosEventBus.removeEventListener('auth:logout', handleLogoutEvent)
  })

  const register = async (email, username, password) => {
    try {
      await axiosInstance.post('api/auth/users/', {
        email,
        username,
        password,
      })
      await login(username, password)
    } catch (err) {
      authError.value = err.response?.data || 'Registration failed'
      console.error(err)
    }
  }

  return {
    authToken,
    permissions,
    authError,
    login,
    logout,
    register
  }
}