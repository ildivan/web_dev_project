<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const username = ref('')
const password = ref('')
const email = ref('')
const { register, authError } = useAuth()

const handleRegistration = async () => {
  //wait for the register funcion to complete  to handle possible errors (thas why we use await)
    await register(email.value, username.value, password.value)
}


</script>

<template>
  <div>
    <h2>Registration</h2>
    <form @submit.prevent="handleRegistration">
         <input v-model="username" placeholder="Username" />
    <div v-if="authError && authError.username">
      <p v-for="(msg, i) in authError.username" :key="i">{{ msg }}</p>
    </div>

    <input v-model="email" type="email" placeholder="Email" />
    <div v-if="authError && authError.email">
      <p v-for="(msg, i) in authError.email" :key="i">{{ msg }}</p>
    </div>

    <input v-model="password" type="password" placeholder="Password" />
    <div v-if="authError && authError.password">
      <p v-for="(msg, i) in authError.password" :key="i">{{ msg }}</p>
    </div>

    <button type="submit">Register</button>
    </form>
  </div>
</template>