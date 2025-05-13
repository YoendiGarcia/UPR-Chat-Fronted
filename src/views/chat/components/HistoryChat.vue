<script setup lang="ts">
interface Props {
  text: string
}

const props = defineProps<Props>()
</script>

<template>
  <div>
    <p>{{ props.text }}</p>
  </div>
</template>

<style scoped>
div {
  transition: 0.3s ease-in;
  width: 90%;
  height: 50px;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 2px #009150;
  margin: 3px;
  padding: 3px;
}

p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

div:hover {
  background-color: #dff7df;
  cursor: pointer;
}
</style>
