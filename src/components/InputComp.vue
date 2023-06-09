<template>
  <div>
    <label class="block text-sm font-medium leading-6 text-gray-900"> {{ props.label }} </label>
    <div class="mt-2">
      <input
        :id="props.id"
        :type="props.type"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        class="form-input block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
        @input="handleInput"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  id: {
    required: true,
    type: String
  },
  label: {
    required: false,
    type: String,
    default: ''
  },
  type: {
    required: false,
    type: String,
    default: ''
  },
  disabled: {
    required: false,
    type: Boolean,
    default: false
  },
  placeholder: {
    required: false,
    type: String,
    default: ''
  }
})

const handleInput = (event) => {
  const target = event.target
  emit('update:modelValue', target.value)
}

const emit = defineEmits(['update:modelValue'])
</script>
