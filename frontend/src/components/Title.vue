
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Welcome to the Research Hub'
  }
})
</script>

<template>
  <h1>{{ title }}</h1>
</template>

<style scoped>
h1 {
  color: #42b883;
}
</style>
