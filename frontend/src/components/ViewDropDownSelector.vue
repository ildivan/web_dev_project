<script setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const props = defineProps(
  {
    menuOptions: {
      type: Array,
      default: () => []
    },
  }
)

const menuOpen = ref(false)
const currentRoute = useRoute()
const router = useRouter()

const selectOption = (option) => {
  router.push(option.relURL)
}

const toggleMobileMenu = () => {
  menuOpen.value = !menuOpen.value
}

const isSelected = (key) => currentRoute.name === key

</script>

<template>
    <aside class="w-full md:w-64 mb-2 md:mb-0">
        <button
        class="w-full bg-white border border-violet-200 rounded-lg px-4 py-3 mb-2 flex justify-between items-center"
        @click="toggleMobileMenu"
        aria-expanded="mobileMenuOpen"
        aria-controls="profile-menu"
        >
        <span>{{ props.menuOptions.find(opt => opt.relURL === currentRoute.name)?.label || 'Menu' }}</span>
        <svg :class="{'transform rotate-180': menuOpen}" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
        </button>

        <div id="profile-menu" v-show="menuOpen" class="bg-white border border-violet-200 rounded-lg shadow mb-2 z-20">
        <button
            v-for="option in props.menuOptions"
            :key="option.relURL"
            @click="selectOption(option)"
            :class="[
            'block w-full text-left px-4 py-2 rounded transition',
            isSelected(option.relURL) ? 'bg-violet-100 text-violet-700 font-semibold' : 'hover:bg-gray-100'
            ]"
        >
            {{ option.label }}
        </button>
        </div>
    </aside>
</template>