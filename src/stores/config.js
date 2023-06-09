import { ref } from 'vue'
import { defineStore } from 'pinia'
import { config } from '@/env'

export const useConfigStore = defineStore('config', () => {
  const region = ref(config.region)
  const userPoolId = ref(config.userPoolId)
  const webClientId = ref(config.webClientId)
  const identityPoolId = ref(config.identityPoolId)
  const bucket = ref(config.bucket)
  const directoryPrefix = ref(config.directoryPrefix)
  const apiBaseUrl = ref(config.apiBaseUrl)

  return { region, userPoolId, webClientId, identityPoolId, bucket, directoryPrefix, apiBaseUrl }
})
