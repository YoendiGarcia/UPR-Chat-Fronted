<script setup lang="ts">
interface Props {
  id: number
  text: string
}

const props = defineProps<Props>()

const emit = defineEmits(['getChat','deleteChat'])

const getChat = (chatId: number) => {
  emit('getChat', chatId)
}

const deleteChat = (chatId: number) =>{
  emit('deleteChat',chatId)
}

</script>

<template>
  <div>
    <p @click="getChat(props.id)">{{ props.text }}</p>
    <button @click="deleteChat(props.id)"><i class="pi pi-trash"></i></button>
  </div>
</template>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;

  transition: 0.3s ease-in;
  width: 100%;
  height: 50px;
  border-radius: 7px;
  /* border: 1px solid #81878b; */
  margin: 1px;
  padding: 10px;
  background-color: #f7fff5;
}

p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

button {
  background-color: transparent;
  border: none;
  z-index: 2;
  transition: 0.3s ease-in-out;
  height: 40px;
  width: 40px;
}

button:hover {
  background-color: #affcaf;
  border-radius: 50%;
  cursor: pointer;
}

button > i {
  font-size: 1rem;
}

div:hover {
  background-color: #dff7df;
  cursor: pointer;
}
</style>
