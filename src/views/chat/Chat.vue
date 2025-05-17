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
  requestInterceptor,
  responseInterceptor,
} from './utils/chat.handle-messages.ts'
import { htmlClassUtilities } from './utils/chat.format-methods.ts'

const isMenuOpen = ref(false)

const handleMenu = () => {
  isMenuOpen.value = true
}

const handleClose = (value: boolean) => {
  isMenuOpen.value = value
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
        :htmlClassUtilities="htmlClassUtilities"
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
