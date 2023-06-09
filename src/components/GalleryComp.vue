<template>
  <ul>
    <li class="mb-3" v-for="photo in props.photosLinks" :key="photo">
      <img
        class="rounded cursor-pointer hover:opacity-70"
        width="200"
        :src="photo"
        @click="showImageSlider(photo)"
      />
    </li>
  </ul>
  <ImagesSlider
    :selected-image="selectedImage"
    :images-src="props.photosLinks"
    :is-visible="imageSliderVisible"
    @close-modal="imageSliderVisible = false"
  />
</template>

<script setup>
import { ref } from 'vue'
import ImagesSlider from '../components/ImagesSlider.vue'

const props = defineProps({
  photosLinks: {
    requied: true,
    type: Array
  }
})

const selectedImage = ref('')
const imageSliderVisible = ref(false)

const showImageSlider = (image) => {
  selectedImage.value = image
  imageSliderVisible.value = true
}
</script>
