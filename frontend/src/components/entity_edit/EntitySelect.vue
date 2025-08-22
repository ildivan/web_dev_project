<script setup>
import { computed } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const modelValue = defineModel('modelValue', {
  type: Array,
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
      class="custom-multiselect"
    />
  </div>
</template>

<style scoped>
:deep(.custom-multiselect .multiselect) {
  background-color: #fff;
  border: 2px solid #7c3aed;
  border-radius: 0.5rem;
  min-height: 42px;
  box-shadow: 0 1px 2px 0 rgba(124, 58, 237, 0.08);
}
:deep(.custom-multiselect .multiselect__tags) {
  background-color: #fff;
  border-bottom: 2px solid #7c3aed;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
:deep(.custom-multiselect .multiselect__tag) {
  background-color: #a78bfa;
  color: #fff;
  border-radius: 0.25rem;
  padding: 0.5rem 1.3rem;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}
:deep(.custom-multiselect .multiselect__option--highlight) {
  background-color: #7c3aed;
  color: #fff;
}
:deep(.custom-multiselect .multiselect__option--selected) {
  background-color: #a78bfa;
  color: #fff;
}
:deep(.custom-multiselect .multiselect__input),
:deep(.custom-multiselect .multiselect__single) {
  background-color: #fff;
  color: #7c3aed;
}
:deep(.custom-multiselect .multiselect__placeholder) {
  color: #7c3aed;
  opacity: 0.8;
}
</style>