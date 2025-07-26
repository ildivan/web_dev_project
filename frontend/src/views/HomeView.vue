
<script setup>
import Title from '../components/Title.vue'
import { useAuth } from '../composables/useAuth'
import { ref } from 'vue'

const title = ref('Welcome to the Research Hub')
const { logout } = useAuth()

</script>

<template>
  <div>
    <Title :title="title" />
    <button @click="logout">Logout</button>
  </div>
</template>

<style scoped>
</style>
