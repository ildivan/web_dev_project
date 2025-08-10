<script setup>

    const props = defineProps({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
    });

</script>

<template>
    <div
        class="p-4 bg-gray-100 rounded shadow hover:shadow-lg transition-shadow duration-300"
    >
        <h3 class="font-semibold">{{ name }}</h3>
        <p class="text-sm text-gray-600">{{ description }}</p>
        <p class="mt-2 text-xs font-medium text-gray-500">
        Stato: <span :class="{
            'text-green-600': status === 'Attivo',
            'text-red-600': status === 'Concluso',
            'text-yellow-600': status === 'In sviluppo'
        }">{{ status }}</span>
        </p>
    </div>
</template>