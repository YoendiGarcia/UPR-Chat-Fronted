import { createRouter, createWebHistory } from 'vue-router'
import Chat from '@/views/chat/Chat.vue'
import Login from '@/views/login/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
    },
    {
      path: '/',
      name: 'login',
      component: Login,
    },
  ],
})

export default router
