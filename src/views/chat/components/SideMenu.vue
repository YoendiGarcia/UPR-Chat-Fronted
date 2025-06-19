<script setup lang="ts">
import 'primeicons/primeicons.css'
import HistoryChat from './HistoryChat.vue'
import { useRouter } from 'vue-router'
import { Chat } from '@/interfaces/Chats'

interface Props {
  chats: Chat[]
}

const emit = defineEmits(['closeSideMenu', 'createNewChat', 'getChat', 'deleteChat'])
const props = defineProps<Props>()

const username = sessionStorage.getItem('username')
const router = useRouter()

const closeSideMenu = () => {
  emit('closeSideMenu', false)
}

const handleLogout = () => {
  sessionStorage.removeItem('access_token')
  router.push('/')
}

const createNewChat = async () => {
  emit('createNewChat', [])
}

const getChat = async (id: number) => {
  emit('getChat', id)
}

const deleteChat = async (id: number) => {
  emit('deleteChat', id)
}

const goToUserData = ()=> {
  router.push('/user_data')
}

</script>

<template>
  <div class="container slide-in">
    <div class="up-buttons">
      <button @click="createNewChat" class="new-chat"><i class="pi pi-plus">Nuevo chat</i></button>
      <button class="cancel" @click="closeSideMenu"><i class="pi pi-times"></i></button>
    </div>
    <div class="chats-history">
      <HistoryChat
        v-for="chat in props.chats.filter((chat) => chat.llmqueries[0] != undefined)"
        :key="chat.id"
        :text="chat.llmqueries[chat.llmqueries.length - 1]?.output?.text"
        :id="chat.id"
        @get-chat="getChat"
        @delete-chat="deleteChat"
      ></HistoryChat>
    </div>
    <div class="down-buttons">
      <div class="user-login">
        <i class="pi pi-user" @click="goToUserData" ></i>
        <p>{{ username }}</p>
      </div>
      <button @click="handleLogout" class="logout">
        <i class="pi pi-sign-out"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  width: 25dvw;
  height: 100dvh;
  padding: 20px;
  box-shadow: 0px 0px 3px 0px gray;
  background-color: #fefefe;
  position: fixed;
  z-index: 1000;
  left: 0px;
  top: 0px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
}

.chats-history {
  display: grid;
  grid-template-columns: 100%;
  height: 70%;
  width: 100%;
  flex-wrap: wrap;
  overflow-y: auto;
  overflow-x: hidden;
  align-content: flex-start;
}

.up-buttons,
.down-buttons {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.cancel,
.logout {
  background: transparent;
  border: none;
}

.cancel > i,
.logout > i {
  font-size: 1.6rem;
  padding: 10px;
  color: #63686b;
  transition: 0.3s ease-in-out;
}

.new-chat {
  background-color: transparent;
  border: none;
}

.new-chat > i {
  color: #009150;
  background-color: #dff7df;
  width: 130px;
  height: 40px;
  padding: 5px;
  border-radius: 30px;
  transition: 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 1rem;
}

.new-chat > i:hover {
  background-color: #c8eac8;
  cursor: pointer;
}

.cancel > i:hover,
.logout > i:hover {
  color: #009150;
  cursor: pointer;
  border-radius: 50%;
  background-color: #dff7df;
}

.user-login {
  display: flex;
  justify-content: center;
  align-items: center;
  /* flex-direction: column; */
  gap: 5px;
}

.user-login i {
  color: #009150;
  font-size: 1.2rem;
  background-color: #dff7df;
  padding: 10px;
  border-radius: 50%;
  transition: .3s ease-in-out;
}

.user-login i:hover{
  background-color: #009150;
  color: white;
  cursor: pointer;
}

.user-login p {
  margin: 0;
}

@media (max-width: 780px) {
  .container {
    width: 50dvw;
  }
}

@media (max-width: 480px) {
  .container {
    width: 75dvw;
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
