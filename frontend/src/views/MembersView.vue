<script setup>
import Footer from '../components/Footer.vue';
import Navbar from '../components/Navbar.vue';
import Title from '../components/Title.vue';

// Lista contatti del gruppo di ricerca
const contacts = [
  {
    name: 'Dr. Maria Rossi',
    role: 'Coordinatrice del Gruppo',
    email: 'maria.rossi@university.edu',
    phone: '+39 333 123 4567'
  },
  {
    name: 'Luca Bianchi',
    role: 'Ricercatore Senior',
    email: 'luca.bianchi@university.edu',
    phone: '+39 333 987 6543'
  },
  {
    name: 'Elena Verdi',
    role: 'Dottoranda',
    email: 'elena.verdi@university.edu',
    phone: '+39 320 111 2233'
  }
];
</script>

<template>


    
        <div class="flex flex-col min-h-screen bg-gray-50">
            <Navbar/>
            <main class="flex-grow pt-18">
            <section class="flex-grow flex justify-center items-center p-6">
                <div class="w-full max-w-3xl">
                    <Title title="Research Group Contacts" class="mb-6" />

                    <div class="bg-white rounded-2xl shadow-lg p-8">
                        <h2 class="text-center text-2xl font-bold mb-6 text-gray-600">Our Team</h2>

                        <div class="space-y-6">
                            <div
                                v-for="contact in contacts"
                                :key="contact.email"
                                class="border border-indigo-300 rounded-xl p-4 bg-indigo-50 hover:bg-indigo-100 transition"
                                >
                                <h3 class="text-lg font-bold text-indigo-900">{{ contact.name }}</h3>
                                <p class="text-gray-700 font-medium">{{ contact.role }}</p>
                                <p class="text-gray-600">
                                    <span class="font-semibold">Email:</span>
                                    <a :href="`mailto:${contact.email}`" class="text-indigo-600 hover:underline">
                                    {{ contact.email }}
                                    </a>
                                </p>
                                <p class="text-gray-600">
                                    <span class="font-semibold">Phone:</span>
                                    <a :href="`tel:${contact.phone}`" class="text-indigo-600 hover:underline">
                                    {{ contact.phone }}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </main>
        </div>
  
    <Footer />
</template>
