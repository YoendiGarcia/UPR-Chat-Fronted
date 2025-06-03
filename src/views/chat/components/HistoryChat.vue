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
  width: 100%;
  height: 50px;
  border-radius: 7px;
  /* border: 1px solid #81878b; */
  margin: 1px;
  padding: 3px;
  background-color: #fafbfd;
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
