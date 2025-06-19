import { createRouter, createWebHistory } from 'vue-router'
import Chat from '@/views/chat/Chat.vue'
import Login from '@/views/login/Login.vue'
import UserDataSee from '@/views/user_data/UserDataSee.vue'
import UserDataUpdate from '@/views/user_data/UserDataUpdate.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: "/user_data",
      name: 'user-data',
      component: UserDataSee
    },
    {
      path: "/user_update",
      name: 'user-update',
      component: UserDataUpdate
    }
  ],
})


router.beforeEach((to, from, next) => {
  // Verificar autenticación
  const isAuthenticated = checkAuth()
  
  // Ruta protegida y no autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Si está autenticado y va al login, redirigir al chat
  if (to.name === 'login' && isAuthenticated) {
    next({ path: '/chat' })
    return
  }
  
  next()
})

// Función para verificar autenticación (ajusta según tu implementación)
function checkAuth(): boolean {
  // Ejemplo: verificar token en localStorage
  return sessionStorage.getItem('access_token') !== null
  // O podrías verificar contra un store Pinia/Vuex
}

export default router