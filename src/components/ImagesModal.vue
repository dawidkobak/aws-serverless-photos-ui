<template>
  <div id="myModal" class="modal" :class="modalClasses">
    <span class="close" @click="closeModal">&times;</span>
    <img class="modal-content inset-0" id="img01" :src="currentImage" />
    <div id="caption"></div>
    <button
      v-show="existsPreviousImage"
      @click="previousImage"
      class="carousel-button prev"
      data-carousel-button="prev"
    >
      &#8656;
    </button>
    <button
      v-show="existsNextImage"
      @click="nextImage"
      class="carousel-button next"
      data-carousel-button="next"
    >
      &#8658;
    </button>
  </div>
</template>

<script setup>
import { computed, ref, toValue, toRef } from 'vue'

const props = defineProps({
  imagesSrc: {
    required: true,
    type: Array
  },
  selectedImage: {
    required: true,
    type: String
  },
  isVisible: {
    required: true,
    type: Boolean
  }
})

const modalClasses = computed(() => {
  return {
    hidden: !props.isVisible
  }
})

const currentImage = ref(toValue(toRef(props, 'selectedImage')))
const currentIndex = computed(() => {
  return props.imagesSrc.findIndex((el) => el === currentImage.value)
})
const existsPreviousImage = computed(() => {
  return currentIndex.value - 1 >= 0
})
const existsNextImage = computed(() => {
  return currentIndex.value + 1 < props.imagesSrc.length
})

const previousImage = () => {
  currentImage.value = props.imagesSrc.at(currentIndex.value - 1)
}
const nextImage = () => {
  currentImage.value = props.imagesSrc.at(currentIndex.value + 1)
}

const closeModal = () => {
  emit('closeModal')
}

const emit = defineEmits(['closeModal'])
</script>

<style scoped>
/* The Modal (background) */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.9);
}

.modal-content {
  margin: auto;
  position: absolute;
  display: block;
  width: 80%;
  max-width: 700px;
}

#caption {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  text-align: center;
  color: #ccc;
  padding: 10px 0;
  height: 150px;
}

.modal-content,
#caption {
  -webkit-animation-name: zoom;
  -webkit-animation-duration: 0.6s;
  animation-name: zoom;
  animation-duration: 0.6s;
}

@-webkit-keyframes zoom {
  from {
    -webkit-transform: scale(0);
  }
  to {
    -webkit-transform: scale(1);
  }
}

@keyframes zoom {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

@media only screen and (max-width: 700px) {
  .modal-content {
    width: 100%;
  }
}

.carousel-button {
  position: absolute;
  z-index: 2;
  background: none;
  border: none;
  font-size: 4rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  border-radius: 0.25rem;
  padding: 0 0.5rem;
  background-color: rgba(0, 0, 0, 0.1);
}

.carousel-button:hover,
.carousel-button:focus {
  color: white;
  background-color: rgba(0, 0, 0, 0.2);
}

.carousel-button:focus {
  outline: 1px solid black;
}

.carousel-button.prev {
  left: 1rem;
}

.carousel-button.next {
  right: 1rem;
}
</style>
