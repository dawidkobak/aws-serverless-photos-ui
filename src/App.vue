<script setup>
import { onMounted, ref } from 'vue'
import { greet } from './greeter/greeter'
import { config } from './env'
import { Authentication } from './auth/authentication'
import { StorageFactory } from './storage/storage'

import { ListObjectsCommand } from '@aws-sdk/client-s3'

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

const registerRequest = {
  email: 'soi21816@omeie.com',
  password: '12345aaa!',
  website: 'jkan.pl'
}

const confirmRequest = {
  email: registerRequest.email,
  code: '234271'
}

const loginRequest = {
  email: registerRequest.email,
  password: registerRequest.password
}

const confirmFunc = () => {
  auth
    .confirm(confirmRequest)
    .then((resp) => console.log(resp))
    .catch((err) => console.log(err))
}

const registerFunc = () => {
  auth
    .register(registerRequest)
    .then((resp) => console.log(resp))
    .catch((err) => console.log(err))
}

const loginFunc = () => {
  auth
    .login(loginRequest)
    .then(() => auth.getCurrentUser())
    .then((profile) => (helloContent.value = `Hello ${profile.email}`))
    .catch((err) => console.log(err))
}

// const logoutFunc = () => {
//   auth.logout().then(() => (helloContent.value = `Hello Guest`))
// }

const listBucketsFunc = async () => {
  const s3 = await storageFactory.createCredentialsAwareS3()
  const response = await s3.send(
    new ListObjectsCommand({
      Bucket: config.bucket
    })
  )

  console.log(response.Contents.map((file) => file.Key))
}

const fileInputs = ref()
const addFile = (e) => {
  fileInputs.value = e.target.files
}

const photosList = ref([])
const photosLinks = ref([])

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
</script>

<template>
  <h1>My UEK photos - APP UI</h1>

  <span id="helloMessage">{{ helloContent }}</span>

  <div>
    <button id="hello" @click="greet('Dawid')">Hello</button>
    <button id="register" @click="registerFunc()">Register</button>
    <button id="confirm" @click="confirmFunc()">Confirm</button>
    <button id="login" @click="loginFunc()">Login</button>
  </div>

  <div id="storage">
    <button id="lsObjects" @click="listBucketsFunc()">List objects</button>

    <form>
      <input type="file" id="filesInput" @input="addFile" multiple />
      <button type="submit" id="uploadFiles" @click.prevent="uploadFunc()">Upload</button>
    </form>
  </div>

  <div class="photos">
    <input class="photosQuery" type="text" />
    <button class="getPhotos" @click="getPhotos">get photos</button>
    <ul class="photosList">
      <li v-for="photo in photosLinks" :key="photo">
        <img width="200" :src="photo" />
      </li>
    </ul>
  </div>
</template>

<style>
@import 'https://cdn.simplecss.org/simple.min.css';
</style>
