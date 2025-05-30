<script setup lang="ts">
import { onMounted, ref } from 'vue'
import 'deep-chat'
import IntroPanel from './components/IntroPanel.vue'
import SideMenu from './components/SideMenu.vue'
import 'primeicons/primeicons.css'
import {
  messageStyles,
  submitButtonStyles,
  style,
  textInput,
  avatars,
} from './config/chat.styles.ts'
import { connect } from './config/chat.connect.ts'
import { requestInterceptor, responseInterceptor } from './utils/chat.handle-messages.ts'
import { htmlClassUtilities } from './utils/chat.format-methods.ts'
import { Chat } from '@/interfaces/Chats.ts'

const isMenuOpen = ref(false)

const history = ref<any>([])

const chats = ref<Chat[]>()

const chargeKey = ref(0)

const handleMenu = () => {
  isMenuOpen.value = true
}

const handleClose = (value: boolean) => {
  isMenuOpen.value = value
}

const handleChats = () => {
  history.value = []
  let currentChatId: any = localStorage.getItem('chat_id')
  if (!currentChatId) throw new Error('Not chat id')
  currentChatId = parseInt(currentChatId) + 1
  localStorage.setItem('chat_id', currentChatId)
}

const getChats = async () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('access_token')
  let chats = []

  try {
    const chatsResponse = await fetch(`${apiUrl}/chats/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!chatsResponse.ok) throw new Error(`HTTP error status: ${chatsResponse.status}`)

    chats = await chatsResponse.json()

    for (let chat of chats) {
      const url = new URL(`${apiUrl}/llmqueries`)
      url.searchParams.append('chat_id', chat.id)
      const llmquerysResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!llmquerysResponse.ok) throw new Error(`HTTP error status: ${llmquerysResponse.status}`)

      const llmqueries = await llmquerysResponse.json()

      chat.llmqueries = llmqueries
    }
  } catch (error) {
    console.error('Error getting chats:', error)
  }

  return chats
}

const getChat = (chatId: number) => {
  const chat = chats.value?.find((chat) => chat.id == chatId)
  history.value = []
  if (chat) {
    let messages = chat.llmqueries
    for (let message of messages) {
      history.value.push(message.input.find((m) => m.role == 'user'))
      history.value.push({ role: 'ai', text: message.output.text, html: message.output.html, files:message.output.files })
    }
  }
  localStorage.setItem('chat_id',chatId.toString())
  chargeKey.value +=1
}

onMounted(async () => {
  localStorage.setItem('chat_id', '')
  chats.value = await getChats()
})
</script>

<template>
  <button class="side-menu-btn" @click="handleMenu"><i class="pi pi-bars"></i></button>
  <div v-if="isMenuOpen">
    <SideMenu
      :chats="chats?.length ? chats : []"
      @closeSideMenu="handleClose"
      @create-new-chat="handleChats"
      @get-chat="getChat"
    ></SideMenu>
  </div>
  <main>
    <div :key="chargeKey" class="chat-container">
      <deep-chat
        :demo="false"
        :avatars="avatars"
        :connect="connect"
        :style="style"
        :textInput="textInput"
        :messageStyles="messageStyles"
        :submitButtonStyles="submitButtonStyles"
        :requestInterceptor="requestInterceptor"
        :responseInterceptor="responseInterceptor"
        :htmlClassUtilities="htmlClassUtilities"
        :history="history"
      >
        <IntroPanel />
      </deep-chat>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100dvh;
}
h1 {
  color: #009150;
}

.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 75%;
  margin-top: 10px;
}

.side-menu-btn {
  background: transparent;
  border: 0;
}

.side-menu-btn > i {
  color: #009150;
  transition: 0.3s ease-in-out;
  border-radius: 50%;
  padding: 10px;
  font-size: 1.8rem;
  position: absolute;
  left: 30px;
  top: 30px;
}

.side-menu-btn > i:hover {
  background-color: #dff7df;
  cursor: pointer;
}

@media (max-width: 480px) {
  .chat-container {
    width: 100%;
  }
}
</style>
