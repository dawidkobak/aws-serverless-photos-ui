<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="flex justify-center rounded-md px-3 py-2 test-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    :class="additionalClasses"
    @click="props.onClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    required: false,
    type: String,
    default: ''
  },
  fullWidth: {
    required: false,
    type: Boolean,
    default: false
  },
  secondary: {
    required: false,
    type: Boolean,
    default: false
  },
  danger: {
    required: false,
    type: Boolean,
    default: false
  },
  disabled: {
    required: false,
    type: Boolean,
    default: false
  },
  onClick: {
    required: false,
    type: Function,
    default: () => {}
  },
  styles: {
    required: false,
    type: Object
  }
})

const additionalClasses = computed(() => {
  return {
    ...props.styles,
    'cursor-default': props.disabled,
    'w-full': props.fullWidth,
    'text-gray-900': props.secondary,
    'text-white': !props.secondary,
    'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600': props.danger,
    'bg-blue-500 hover:bg-blue-700 focus-visible:outline-sky-600': !props.secondary && !props.danger
  }
})
</script>
