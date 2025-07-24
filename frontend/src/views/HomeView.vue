
<script setup>
import Title from '../components/Title.vue'
import { ref } from 'vue'

const title = ref('Welcome to the Research Hub')
</script>

<template>
  <div>
    <Title :title="title" />
  </div>
</template>

<style scoped>
</style>
