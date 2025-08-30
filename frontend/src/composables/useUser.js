// composables/useUser.js
import { ref } from 'vue'
import { getUser, updateUser } from '../apiCalls/apiCalls'

export function useUser(getId) {
  const loading = ref(true)
  const error = ref(null)
  const user = ref(null)

  const id = ref(null)

  const fetchUserData = async () => {
    loading.value = true
    error.value = null
    user.value = null

    try {
      id.value = await getId()
      if (!id.value) {
        loading.value = false
        return
      }

      user.value = await getUser(id.value)
    } catch (err) {
      error.value = err.message || 'Could not load user data.'
    } finally {
      loading.value = false
    }
  }

  const updateUserData = async (data) => {
    loading.value = true
    error.value = null
    try {
      user.value = await updateUser(id.value, data)
      await fetchUserData() // Refresh data after update
    } catch (err) {
      error.value = err.message || 'Could not update user data.'
    } finally {
      loading.value = false
    }
  }

  fetchUserData()

  return {
    user,
    loading,
    error,
    fetchUserData,
    updateUserData
  }
}
