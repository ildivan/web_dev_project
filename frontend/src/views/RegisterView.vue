<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import Footer from '../components/Footer.vue'

const username = ref('')
const password = ref('')
const email = ref('')
const { register, authError } = useAuth()
const showPassword = ref(false);

const passwordFieldType = computed(() => showPassword.value ? 'text' : 'password');

const handleRegistration = async () => {
  //wait for the register funcion to complete  to handle possible errors (thas why we use await)
    await register(email.value, username.value, password.value)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const isFormValid = computed(() => {
  return username.value.length > 0 && password.value.length > 0;
});

</script>
<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <div class="flex-grow flex justify-center items-center p-6">
      <div class="w-full max-w-lg">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-center text-2xl font-bold mb-4 text-indigo-900">Sign up</h2>
          <p class="text-center text-indigo-500 mb-6">
            Already have an account?
            <router-link to="/login" class="text-indigo-600 font-semibold hover:text-indigo-800 underline">
              Log in
            </router-link>
          </p>

          <form @submit.prevent="handleRegistration" class="space-y-6">
            <div>
              <label for="username" class="block text-indigo-700 font-semibold mb-1">Your username</label>
              <input
                id="username"
                v-model="username"
                placeholder="Username"
                required
                class="w-full px-4 py-2 rounded-lg border border-indigo-300 bg-indigo-100 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label for="email" class="block text-indigo-700 font-semibold mb-1">Your email</label>
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="Email"
                required
                class="w-full px-4 py-2 rounded-lg border border-indigo-300 bg-indigo-100 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div class="relative">
              <label for="password" class="block text-indigo-700 font-semibold mb-1">Your password</label>
              <input
                :type="passwordFieldType"
                id="password"
                v-model="password"
                placeholder="Password"
                required
                class="w-full px-4 py-2 rounded-lg border border-indigo-300 bg-indigo-100 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-2/4 -translate-y-2/4 text-indigo-600 hover:text-indigo-800 font-semibold show-button-position"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>

            <button
              type="submit"
              :disabled="!isFormValid"
              :class="isFormValid ? 'bg-indigo-900 hover:bg-indigo-700 text-white' : 'bg-indigo-300 text-indigo-600 cursor-not-allowed'"
              class="w-full py-3 rounded-lg font-bold transition-colors"
            >
              Sign up
            </button>

            <p v-if="authError" class="text-red-600 mt-3 text-center">{{ authError }}</p>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>


<style scoped>
.show-button-position {
  top: 70%;
  margin-right: 30px;
}
</style>