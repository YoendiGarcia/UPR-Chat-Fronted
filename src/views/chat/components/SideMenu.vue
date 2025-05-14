<script setup lang="ts">
import 'primeicons/primeicons.css'
import HistoryChat from './HistoryChat.vue';

const emit = defineEmits(['closeSideMenu'])

const closeSideMenu = () =>{
    emit('closeSideMenu',false)
}

</script>

<template>
  <div class="container slide-in">
    <div class="up-buttons">
      <button class="new-chat"><i class="pi pi-plus">Nuevo chat</i></button>
      <button class="cancel" @click="closeSideMenu" ><i class="pi pi-times"></i></button>
    </div>
    <div class="chats-history">
        <HistoryChat v-for="i in [1,2,3,4,5,6,7,8,9,10,11,12]" text="Texto de ejemplo" ></HistoryChat>
    </div>
    <div class="down-buttons">
      <button class="settings"><i class="pi pi-cog"></i></button>
      <button class="logout">
        <i class="pi pi-sign-out"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 25dvw;
  height: 100dvh;
  padding: 20px;
  box-shadow: 0px 0px 3px 0px gray;
  background-color: white;
  position: fixed;
  z-index: 2;
  left: 0px;
  top: 0px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
}

.chats-history{
    display: grid;
    grid-template-columns: 100%;
    height: 70%;
    width: 100%;
    flex-wrap: wrap;
    overflow-y: auto;
    overflow-x: hidden;
}

.up-buttons, .down-buttons {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.cancel, .logout {
  background: transparent;
  border: none;
}

.cancel > i, .logout > i, .settings > i {
  font-size: 1.6rem;
  padding: 10px;
  color: #81878b;
  transition: 0.3s ease-in-out;
}

.new-chat,
.settings {
  background-color: transparent;
  border: none;
}

.new-chat > i {
  font-size: 1.2rem;
  color: #009150;
  border: 1px solid #009150;
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


.new-chat > i:hover,
.settings > i:hover {
  color: white;
  background-color: #009150;
  cursor: pointer;
}

.cancel > i:hover, .logout >i:hover, .settings > i:hover {
  color: #009150;
  cursor: pointer;
  border-radius: 50%;
  background-color: #dff7df;
}



@media (max-width: 780px) {
    .container{
        width: 50dvw;
    }
}

@media (max-width: 480px) {
    .container{
        width: 75dvw;
    }
}

.slide-in{
    animation: slideIn .3s ease-out forwards;
}


@keyframes slideIn {
    from{
        transform: translateX(-100%);
        opacity: 0;
    }
    to{
        transform: translateX(0);
        opacity: 1;
    }
}


</style>
