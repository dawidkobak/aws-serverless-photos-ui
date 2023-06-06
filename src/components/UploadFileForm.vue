<template>
  <form @submit.prevent="">
    <div class="main">
      <div
        :class="dropzoneClasses"
        class="dropzone-container"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
      >
        <input
          type="file"
          multiple
          name="file"
          id="fileInput"
          class="hidden-input"
          @change="onChange"
          ref="file"
          accept=".jpg,.jpeg,.png"
        />

        <label for="fileInput" class="file-label">
          <div>Drop files here or <u>click here</u> to upload.</div>
        </label>

        <div class="preview-container mt-4" v-if="files.length">
          <div v-for="file in files" :key="file.name" class="preview-card">
            <div>
              <img class="preview-img" :src="generateThumbnail(file)" />
              <p :title="file.name">
                {{ makeName(file.name) }}
              </p>
            </div>
            <div>
              <button
                class="ml-2"
                type="button"
                @click="remove(files.indexOf(file))"
                title="Remove file"
              >
                <b>&times;</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ButtonComp class="mt-5" full-width type="submit" :on-click="uploadFunc">Upload</ButtonComp>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import ButtonComp from './ButtonComp.vue'
import { config } from '@/env'
import { StorageFactory } from '@/storage/storage'
import { Authentication } from '@/auth/authentication'
const isDragging = ref(false)
const files = ref([])
const file = ref(null)

const onChange = () => {
  files.value = [...file.value.files]
}

const generateThumbnail = (file) => {
  const fileSrc = URL.createObjectURL(file)
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc)
  }, 1000)
  return fileSrc
}

const makeName = (name) => {
  return name.split('.')[0].substring(0, 3) + '...' + name.split('.')[name.split('.').length - 1]
}

const remove = (i) => {
  files.value.splice(i, 1)
}

const dragover = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const dragleave = () => {
  isDragging.value = false
}

const dropzoneClasses = computed(() => {
  return {
    'bg-blue-300': isDragging.value
  }
})

const drop = (e) => {
  e.preventDefault()
  file.value.files = e.dataTransfer.files
  onChange()
  isDragging.value = false
}

const auth = new Authentication(
  config.userPoolId,
  config.identityId,
  config.webClientId,
  config.region
)

const storageFactory = new StorageFactory(
  config.region,
  config.bucket,
  config.directoryPrefix,
  async () => await auth.getCredentials()
)

const uploadFunc = async () => {
  if (!files.value.length > 0) {
    return
  }

  const userStorage = await storageFactory.createUserStorage()
  const toBeUploaded = [...files.value]

  toBeUploaded.forEach(async (file) => {
    userStorage
      .upload(file)
      .then((data) => userStorage.getPublicUrl(data.key))
      .then((link) => emit('fileUploaded', link))
      .catch((err) => console.log(err))
  })
  files.value = []
}

const emit = defineEmits(['fileUploaded'])
</script>

<style>
.main {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.dropzone-container {
  padding: 4rem;
  border: 2px dashed #3b82f6;
}
.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}
.file-label {
  font-size: 20px;
  display: block;
  cursor: pointer;
}
.preview-container {
  display: flex;
  margin-top: 2rem;
}
.preview-card {
  display: flex;
  border: 1px solid #a2a2a2;
  padding: 5px;
  margin-left: 5px;
}
.preview-img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #a2a2a2;
  background-color: #a2a2a2;
}
</style>
