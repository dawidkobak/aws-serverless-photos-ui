<template>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <span :class="infoClass"> {{ info }}</span>
        <InputComp id="email" label="Email address" type="email" v-model="email" />
        <InputComp id="password" label="Password" type="password" v-model="password" />
        <div>
          <ButtomComp fullWidth type="submit">
            {{ buttonCaption }}
          </ButtomComp>
        </div>
      </form>

      <div class="mt-5" v-if="confirmationCodeSent && variant === 'REGISTER'">
        <InputComp
          id="confirmation"
          label="Confirmation code"
          type="number"
          v-model="confirmationCode"
          class="mt-3"
        />
        <ButtomComp fullWidth type="submit" class="mt-5" :on-click="confirmFunc">
          Confirm
        </ButtomComp>
      </div>

      <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
        <div>{{ authActionCaption }}</div>
        <div @click="toggleVariant" className="underline cursor-pointer">
          {{ authActionCaption2 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ButtomComp from './ButtonComp.vue'
import InputComp from './InputComp.vue'
import { config } from '@/env'
import { Authentication } from '@/auth/authentication'
import { useRouter } from 'vue-router'

const router = useRouter()
const variant = ref('LOGIN')
const authActionCaption = computed(() =>
  variant.value === 'REGISTER' ? 'Already have an account?' : 'New to UEK photos?'
)
const authActionCaption2 = computed(() =>
  variant.value === 'REGISTER' ? 'Log in' : 'Create an account'
)

const buttonCaption = computed(() => (variant.value === 'REGISTER' ? 'Register' : 'Log in'))

const toggleVariant = () => {
  if (variant.value === 'LOGIN') {
    variant.value = 'REGISTER'
  } else {
    variant.value = 'LOGIN'
  }
}

const email = ref('')
const password = ref('')
const confirmationCode = ref('')
const confirmationCodeSent = ref(false)

const info = ref('')
const infoClass = ref([])

const handleSubmit = () => {
  if (variant.value === 'LOGIN') {
    handleLogin()
  } else {
    handleRegister()
  }
}

const handleRegister = () => {
  registerFunc()
}

const handleLogin = () => {
  loginFunc()
}

const auth = new Authentication(
  config.userPoolId,
  config.identityPoolId,
  config.webClientId,
  config.region
)

const registerRequest = computed(() => {
  return {
    email: email.value,
    password: password.value,
    website: 'photos-app'
  }
})

const confirmRequest = computed(() => {
  return {
    email: registerRequest.value.email,
    code: confirmationCode.value
  }
})

const loginRequest = computed(() => {
  return {
    email: registerRequest.value.email,
    password: registerRequest.value.password
  }
})

const confirmFunc = () => {
  auth
    .confirm(confirmRequest.value)
    .then((resp) => {
      console.log(resp)
      info.value = 'Account sucessfully created and confirmed. You can log in now.'
      infoClass.value = ['text-green-600']
    })
    .catch((err) => {
      console.log(err)
      info.value = err
      infoClass.value = ['text-red-600']
    })
}

const registerFunc = () => {
  auth
    .register(registerRequest.value)
    .then((resp) => {
      console.log(resp)
      info.value =
        'Confirmation code sent to provided email address. Check your mailbox and enter confirmation code below'
      infoClass.value = ['text-green-600']
      confirmationCodeSent.value = true
    })
    .catch((err) => {
      console.log(err)
      info.value = err.message
      infoClass.value = ['text-red-600']
    })
}

const loginFunc = () => {
  auth
    .login(loginRequest.value)
    .then(() => {
      auth.getCurrentUser()
      router.push({ name: 'Photos' })
    })
    .catch((err) => {
      console.log(err)
      info.value = err.message
      infoClass.value = ['text-red-600']
    })
}
</script>
