<template>
  <div class="mt-10">
    <div class="pb-5">
      <span class="text-2xl" id="helloMessage">{{ helloContent }}</span>
      <ButtonComp :on-click="logout" :styles="logoutBtnStyles"> Log out </ButtonComp>
    </div>
    <UploadFileForm @file-uploaded="addLinkToPhoto" />

    <div class="photos mt-20">
      <InputComp
        id="queryPhotos"
        type="text"
        v-model="queryPhotos"
        placeholder="Search photos by tag"
      />
      <ButtonComp class="mt-1 mb-10" full-width :on-click="getPhotos">Get photos</ButtonComp>

      <GalleryComp :photos-links="photosLinks" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { config } from '@/env'
import { StorageFactory } from '@/storage/storage'
import { Authentication } from '@/auth/authentication'
import { useRouter } from 'vue-router'
import ButtonComp from '../components/ButtonComp.vue'
import InputComp from '../components/InputComp.vue'
import UploadFileForm from '../components/UploadFileForm.vue'
import GalleryComp from '../components/GalleryComp.vue'

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
const queryPhotos = ref('')
const router = useRouter()

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

const addLinkToPhoto = (e) => {
  console.log(e)
  photosLinks.value.push(e)
}

const logout = () => {
  auth.logout()
  router.push({ name: 'Authorization' })
}

const logoutBtnStyles = {
  'float-right': true
}
</script>
