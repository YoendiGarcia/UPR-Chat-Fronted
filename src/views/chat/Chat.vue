<script setup lang="ts">
import { ref } from 'vue'
import 'deep-chat'
import IntroPanel from './components/IntroPanel.vue'
import SideMenu from './components/SideMenu.vue'
import 'primeicons/primeicons.css'
import { messageStyles, submitButtonStyles, style, textInput } from './config/chat.styles.ts'

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
      <h1>UPR-Chat</h1>
      <deep-chat
        :demo="true"
        :style="style"
        :textInput="textInput"
        :messageStyles="messageStyles"
        :submitButtonStyles="submitButtonStyles"
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
  height: 90vh;
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
  margin-right: 10px;
}

.side-menu-btn {
  background: transparent;
  border: 0;
}

.side-menu-btn > i {
  color: #009150;
  transition: 0.3s ease-in-out;
  font-size: 1.8rem;
  position: absolute;
  left: 20px;
  top: 20px;
}

.side-menu-btn > i:hover {
  color: #04cf74;
  cursor: pointer;
}
</style>
