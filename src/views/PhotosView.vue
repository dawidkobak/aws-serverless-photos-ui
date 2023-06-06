<script setup>
import { onMounted, ref } from 'vue'
import { config } from '@/env'
import { StorageFactory } from '@/storage/storage'
import { Authentication } from '@/auth/authentication'
import ButtonComp from '../components/ButtonComp.vue'
import InputComp from '../components/InputComp.vue'
import ImagesModal from '../components/ImagesModal.vue'
import UploadFileForm from '../components/UploadFileForm.vue'

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
const photosList = ref([])
const photosLinks = ref([])
const imageSrc = ref('')
const imageModalVisible = ref(false)
const queryPhotos = ref('')

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

const showImageModal = (image) => {
  imageSrc.value = image
  imageModalVisible.value = true
}

const addLinkToPhoto = (e) => {
  console.log(e)
  photosLinks.value.push(e)
}
</script>

<template>
  <div class="mt-10">
    <span class="text-2xl" id="helloMessage">{{ helloContent }}</span>

    <div id="storage">
      <UploadFileForm @file-uploaded="addLinkToPhoto" />
    </div>

    <div class="photos mt-20">
      <InputComp
        id="queryPhotos"
        type="text"
        v-model="queryPhotos"
        placeholder="Search photos by tag"
      />
      <ButtonComp class="mt-1 mb-10" full-width :on-click="getPhotos">Get photos</ButtonComp>
      <ul class="photosList">
        <li class="mb-3" v-for="photo in photosLinks" :key="photo">
          <img
            class="rounded cursor-pointer hover:opacity-70"
            width="200"
            :src="photo"
            @click="showImageModal(photo)"
          />
        </li>
      </ul>
    </div>
    <ImagesModal
      :selected-image="imageSrc"
      :images-src="photosLinks"
      :is-visible="imageModalVisible"
      @close-modal="imageModalVisible = false"
    />
  </div>
</template>
