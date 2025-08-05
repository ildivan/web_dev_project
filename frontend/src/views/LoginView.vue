
<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const username = ref('')
const password = ref('')
const { login, authError } = useAuth()

const handleLogin = () => {
  login(username.value, password.value)
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
      <p v-if="authError">{{ authError }}</p>
      <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    </form>
  </div>
</template>