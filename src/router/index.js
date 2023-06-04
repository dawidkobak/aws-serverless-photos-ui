import { createRouter, createWebHashHistory } from 'vue-router'

import AuthorizationView from '@/views/AuthorizationView.vue'
import PhotosView from '@/views/PhotosView.vue'

const routes = [
  {
    path: '/',
    name: 'Authorization',
    component: AuthorizationView
  },
  {
    path: '/photos',
    name: 'Photos',
    component: PhotosView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
      behavior: 'smooth'
    }
  }
})

export default router
