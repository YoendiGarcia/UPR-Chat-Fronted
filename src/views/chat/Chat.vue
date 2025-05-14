<script setup lang="ts">
import { ref } from 'vue'
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
import {
  extractJSONAndCreateForm,
  styleForm,
  generateFormFromString,
  deleteJsonFromString,
} from './utils/chat.utils.ts'

const isMenuOpen = ref(false)

const handleMenu = () => {
  isMenuOpen.value = true
}

const handleClose = (value: boolean) => {
  isMenuOpen.value = value
}

const requestInterceptor = async (requestDetails: any) => {
  console.log(requestDetails) // printed above
  const otherTask = await fetch('http://localhost:8000/', {
    method: 'post',
    body: JSON.stringify({ messages: [{ role: 'user', text: 'jhjk' }] }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!otherTask.ok) {
    return { error: 'Error in other task' }
  }
  return requestDetails
}

const responseInterceptor = async (response: any) => {
  const otherTask = await fetch('http://localhost:8000/', {
    method: 'post',
    body: JSON.stringify({ messages: [{ role: 'user', text: 'jhjk' }] }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!otherTask.ok) {
    return { error: 'Error in other task' }
  }
  // let form = extractJSONAndCreateForm(response['text'])
  let result = generateFormFromString(response['text'])
  if (result) {
    const form = styleForm(result.form)
    const text = deleteJsonFromString(response['text'], result.jsonObj)
    response['html'] = form.outerHTML
    response['text'] = text
  }

  // printed above
  return response
}
</script>

<template>
  <button class="side-menu-btn" @click="handleMenu"><i class="pi pi-bars"></i></button>
  <div v-if="isMenuOpen">
    <SideMenu @closeSideMenu="handleClose"></SideMenu>
  </div>
  <main>
    <div class="chat-container">
      <deep-chat
        :demo="true"
        :connect="connect"
        :style="style"
        :textInput="textInput"
        :messageStyles="messageStyles"
        :submitButtonStyles="submitButtonStyles"
        :avatars="avatars"
        :requestInterceptor="requestInterceptor"
        :responseInterceptor="responseInterceptor"
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
