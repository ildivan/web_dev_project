<script setup>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const modelValue = defineModel('modelValue', {
  type: [Array, Object],
  default: () => []
})

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select or add options'
  },
  label: {
    type: String,
    default: 'label'
  },
  trackBy: {
    type: String,
    default: 'value'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  allowEmpty: {
    type: Boolean,
    default: true
  }
})

</script>

<template>
  <div>
    <Multiselect
      v-model="modelValue"
      :options="props.options"
      :multiple="props.multiple"
      :taggable="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      :placeholder="props.placeholder"
      :label="props.label"
      :track-by="props.trackBy"
      :allow-empty="props.allowEmpty"
      class="custom-multiselect"
    />
  </div>
</template>

<style scoped>
:deep(.custom-multiselect .multiselect:focus-within) {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5); /* focus:ring-indigo-500 */
}

:deep(.custom-multiselect .multiselect__tags){
  border: none !important;
  background-color: rgb(195, 160, 233) !important; 
  box-shadow: none; /* rimuove l'ombra di default */
}

:deep(.custom-multiselect .multiselect__tags),
:deep(.custom-multiselect .multiselect__single),
:deep(.custom-multiselect .multiselect__input) {
  background-color: rgb(195, 160, 233) !important;
  color: #1f2937;          /* text-gray-800 */
  font-size: 0.875rem;     /* text-sm */
}

:deep(.custom-multiselect .multiselect__placeholder) {
  color: #1f2937; /* text-gray-500 */
  font-size: 0.875rem;
  margin-left: 4px;
}


/* Dropdown container */
:deep(.custom-multiselect .multiselect__content-wrapper) {
  background-color: #fff;
  border: 1px solid rgb(209, 213, 219);  /* border-gray-300 */
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(124, 58, 237, 0.1);
  margin-top: 0.25rem;
  font-size: 0.875rem;
  z-index: 50;
}

/* Singole opzioni nel dropdown */
:deep(.custom-multiselect .multiselect__option) {
  font-size: 0.875rem;
  color: #1f2937;   /* text-gray-800 */
  background-color: #fff;
  opacity: 1;
}

/* Evidenziata al passaggio del mouse */
:deep(.custom-multiselect .multiselect__option--highlight) {
  background-color: rgba(99, 102, 241, 0.1); /* violet soft hover */
  color: #1f2937;
}

/* Opzione selezionata */
:deep(.custom-multiselect .multiselect__option--selected) {
  background-color: rgba(99, 102, 241, 0.1); /* stesso hover leggero */
  color: #1f2937; /* text-gray-800 */
}

/* Tag multipli selezionati (barra sopra) */
:deep(.custom-multiselect .multiselect__tag) {
  background-color:rgb(233, 220, 241); /* chiaro come le opzioni */
  color: #1f2937; /* testo scuro */
  border-radius: 0.25rem; 
  padding: 0.25rem 0.75rem;
  margin-right: 0.25rem;
  font-size: 0.875rem;
}

/* Single select (barra sopra) */
:deep(.custom-multiselect .multiselect__single) {
  background-color: #fff; /* stesso sfondo input */
  color: #1f2937; /* testo scuro */
}

</style>
