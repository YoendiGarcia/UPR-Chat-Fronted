<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref<string>("")
const password = ref<string>("")
const router = useRouter()

const handleLogin = () =>{
  const loginParams = new URLSearchParams()
  loginParams.append("username",username.value)
  loginParams.append("password",password.value)

  router.push('/chat')

}

</script>

<template>
  <div class="container">
    <div>
      <img src="../../assets/Logo.png" alt="Logo">
      <p>Bienvenido</p>
      <div class="username-container">
        <label for="username">Usuario</label>
        <input type="text" id="username" placeholder="Nombre de usuario" v-model="username" />
      </div>
      <div class="password-container">
        <label for="password">Contraseña</label>
        <input type="password" id="password" placeholder="Contraseña" v-model="password" />
      </div>
      <button class="send-btn" @click="handleLogin" >Entrar</button>
    </div>
  </div>
</template>

<style scoped>
.container,
.container > div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

.container {
  height: 100vh;
}

.container > div{
    border: 1px solid #009150 ;
    padding: 10px;
    border-radius: 10px;
    width: 25%;
    box-shadow: 0 0 20px 10px #dff7df;
}

.username-container,
.password-container {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  width: 90%;
}

img{
  height: 100px;
  width: 100px;
}

p{
  color: #009150;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.send-btn{
    background-color: white;
    border: 1px solid #009150;
    padding: 10px;
    width: 90%;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: 500;
    color: #009150;
    transition: .3s ease-in-out;
    margin-top: 20px;
    margin-bottom: 10px;
}

.send-btn:hover{
  background-color: #009150;
  color: white;
  cursor: pointer;
}

label{
  font-size: 1.2rem;
  color: #009150;
  width: 100%;
}

input{
  width: 100%;
  height: 35px;
  border-radius: 10px;
  border: 1px solid #009150;
  font-size: .9rem;
}

@media (max-width: 980px) {
  .container > div{
    width: 40%;
  }
}

@media (max-width: 730px) {
  .container > div{
    width: 50%;
  }
}

@media (max-width: 520px) {
  .container > div{
    width: 60%;
  }
}

@media (max-width: 480px) {
  .container > div{
    width: 70%;
  }
}

@media (max-width: 350px) {
  .container > div{
    width: 80%;
  }
}

</style>
