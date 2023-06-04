<script setup>
import { onMounted, ref } from 'vue'
import { config } from '@/env'
import { StorageFactory } from '@/storage/storage'
import { Authentication } from '@/auth/authentication'
import ButtonComp from '../components/ButtonComp.vue'
import InputComp from '../components/InputComp.vue'

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

const helloContent = ref('Hello Guest')
const fileInputs = ref([])
const photosList = ref([])
const photosLinks = ref([])
const active = ref(false)

const uploadFunc = async () => {
  if (!fileInputs.value.length > 0) {
    return
  }

  const userStorage = await storageFactory.createUserStorage()
  const toBeUploaded = [...fileInputs.value]

  toBeUploaded.forEach(async (file) => {
    userStorage
      .upload(file)
      .then((data) => userStorage.getPublicUrl(data.key))
      .then((link) => photosLinks.value.push(link))
      .catch((err) => console.log(err))
  })
}

const getPhotos = () => {
  photosLinks.value = []
  auth
    .getCurrentUser()
    .then((profile) => (helloContent.value = `Hello ${profile.email}`))
    .then(async () => {
      const userStorage = await storageFactory.createUserStorage()
      const allPhotos = await userStorage.getMyFiles()
      photosList.value = allPhotos
      photosList.value.forEach(async (photo) => {
        const link = await userStorage.getPublicUrl(photo.Key)
        photosLinks.value.push(link)
      })
    })
    .catch((err) => console.log(err))
}

onMounted(() => getPhotos())

const toggleActive = () => {
  active.value = !active.value
}

const addFileFromInput = (e) => {
  for (let i = 0; i < e.target.files.length; i++) {
    fileInputs.value.push(e.target.files.item(i))
  }
}

const addFileFromZone = (event) => {
  if (event.dataTransfer.items) {
    ;[...event.dataTransfer.items].forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        fileInputs.value.push(file)
      }
    })
  }
}
</script>

<template>
  <div class="mt-10">
    <span class="text-2xl" id="helloMessage">{{ helloContent }}</span>

    <div id="storage">
      <form>
        <div
          @dragenter.prevent="toggleActive"
          @dragleave.prevent="toggleActive"
          @dragover.prevent
          @drop.prevent="toggleActive"
          @drop="addFileFromZone"
          :class="{ 'active-dropzone': active }"
          class="dropzone"
        >
          <span>Drag or Drop File</span>
          <span>OR</span>
          <input
            type="file"
            id="dropzoneFile"
            class="dropzoneFile"
            multiple
            @input="addFileFromInput"
          />
        </div>
        <ButtonComp class="mt-5" full-width type="submit" :on-click="uploadFunc">Upload</ButtonComp>
      </form>
    </div>

    <div class="photos mt-20">
      <InputComp type="text" placeholder="Search photos by tag" />
      <ButtonComp class="mt-1 mb-10" full-width :on-click="getPhotos">Get photos</ButtonComp>
      <ul class="photosList">
        <li v-for="photo in photosLinks" :key="photo">
          <img width="200" :src="photo" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dropzone {
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 2px dashed #3b82f6;
  background-color: #fff;
  transition: 0.3s ease all;
}

.active-dropzone {
  color: #fff;
  border-color: #fff;
  background-color: #1d4ed8;
}
</style>
