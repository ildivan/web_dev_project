import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../axios'

const authToken = ref(localStorage.getItem('authToken') || null)
const authError = ref(null)

export function useAuth() {
  const router = useRouter()

  const login = async (username, password) => {
    try {
      const res = await axiosInstance.post('api/auth/token/login/', {
        username,
        password,
      })
      const token = res.data.auth_token
      localStorage.setItem('authToken', token)
      authToken.value = token
      authError.value = null
      router.push('/')
    } catch (err) {
      authError.value = 'Invalid credentials'
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('api/auth/token/logout/')
    } catch (err) {
      console.warn('Logout error:', err)
    } finally {
      localStorage.removeItem('authToken')
      authToken.value = null
      router.push('/login')
    }
  }

  return {
    authToken,
    authError,
    login,
    logout,
  }
}