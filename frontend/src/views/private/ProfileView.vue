<script setup>
import { useAuth } from '../../composables/useAuth'
const { logout } = useAuth()
</script>

<template>
    <h1>Profile view</h1>
 <button @click="logout">Logout</button>
</template>