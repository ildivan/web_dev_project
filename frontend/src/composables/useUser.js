import { ref } from 'vue'
import axiosInstance from '../axios'

export function useUser() {
  const loading = ref(true)   // stato generale
  const error = ref(null)
  const user = ref(null)

  // Fetch dati utente loggato
  const fetchUserData = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axiosInstance.get('/api/auth/users/me/')
      user.value = res.data
    } catch (err) {
      error.value = err.response?.data || err.message || 'Could not load user data.'
    } finally {
      loading.value = false
    }
  }

  // Aggiorna dati utente loggato
  const updateUserData = async (data) => {
    loading.value = true        // usa loading esistente, NON loadingUpdate
    error.value = null
    try {
      const res = await axiosInstance.patch('/api/auth/users/me/', data)
      user.value = res.data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message || 'Could not update user data.'
    } finally {
      loading.value = false
    }
  }

  // Fetch iniziale
  fetchUserData()

  return {
    user,
    loading,
    error,
    fetchUserData,
    updateUserData
  }
}
