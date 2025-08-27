<script setup>
import Navbar from '../../components/Navbar.vue'
import Footer from '../../components/Footer.vue'
import { usePublicMenu } from '../../composables/usePublicMenu.js'
const { menu } = usePublicMenu()


const welcomeMessage = 'Contatti del gruppo di ricerca'

// Hardcoded contacts
const contact = {
    sede: 'Sede Brescia',
    email: 'gruppo.ricerca@university.edu',
    phone: '+39 234 567 8901'
  }

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar
        :menuItems="menu"
    />
    <main class="flex-grow container max-w-8xl mx-auto p-6 mt-10">
      <section id="overview" class="container mx-auto py-12 px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ welcomeMessage }}</h2>
      </section>

      <section id="contacts" class="bg-white py-6 px-4 rounded-lg shadow relative">
        <div class="container mx-auto">
          <div class="grid md:grid-cols-1 gap-6">
              <h3 class="font-semibold text-base sm:text-lg break-words whitespace-normal">
                {{ contact.sede }}
              </h3>

              <p class="text-xs sm:text-sm text-gray-500 mt-2">
                Email: <a class="text-indigo-500 hover:underline" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
              </p>

              <p class="text-xs sm:text-sm text-gray-500 mt-1">
                Telefono: {{ contact.phone }}
              </p>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>
