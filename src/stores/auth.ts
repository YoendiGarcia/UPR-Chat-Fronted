
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const username = ref('')
  
  const setUsername = (newUsername: string) => {
    username.value = newUsername
  }
  
  return { username, setUsername }
})