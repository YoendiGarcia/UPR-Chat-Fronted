<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')
const errorMsg = ref<boolean>(false)
const disabledSendBtn = ref<boolean>(true)

const handleLogin = async () => {
  const loginParams = new URLSearchParams()
  loginParams.append('username', username.value)
  loginParams.append('password', password.value)
  const apiUrl = import.meta.env.VITE_API_URL
  try {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: loginParams,
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const tokenData = await response.json()
    router.push('/chat').then(() => {
      window.location.reload()
    })
    localStorage.setItem('access_token', tokenData.access_token)
    localStorage.setItem('username', username.value)
    handleUserId(apiUrl, tokenData.access_token)
  } catch (error) {
    console.error('Error getting OAuth token:', error)
    errorMsg.value = true
  }
}

const handleUserId = async (apiUrl: string, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const userId = await response.json()
    localStorage.setItem('user_id', userId)
  } catch (error) {
    console.error('Error getting user id:', error)
  }
}

const handleButtonEnable = () => {
  errorMsg.value = false
  if (username.value.length > 3 && password.value.length > 3) {
    disabledSendBtn.value = false
  } else {
    disabledSendBtn.value = true
  }
}
</script>

<template>
  <div class="container">
    <div>
      <img src="../../assets/Logo.png" alt="Logo" />
      <p class="welcome">Bienvenido</p>
      <div class="username-container">
        <label for="username">Usuario</label>
        <input
          type="text"
          id="username"
          placeholder="Nombre de usuario"
          maxlength="20"
          v-model="username"
          @input="handleButtonEnable"
        />
      </div>
      <div class="password-container">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          maxlength="20"
          v-model="password"
          @input="handleButtonEnable"
        />
      </div>
      <p v-show="errorMsg" class="error-msg">Usuario o contraseña incorrectos</p>
      <button
        :disabled="disabledSendBtn"
        :class="{ 'hover-btn': !disabledSendBtn }"
        class="send-btn"
        @click="handleLogin"
      >
        Entrar
      </button>
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

.container > div {
  border: 1px solid #009150;
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

img {
  height: 100px;
  width: 100px;
}

.welcome {
  color: #009150;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.send-btn {
  background-color: white;
  border: 1px solid #009150;
  padding: 10px;
  width: 90%;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #009150;
  transition: 0.3s ease-in-out;
  margin-top: 20px;
  margin-bottom: 10px;
}

.send-btn:disabled {
  color: #dff7df;
  border: 1px solid #dff7df;
}

.hover-btn:hover {
  background-color: #009150;
  color: white;
  cursor: pointer;
}

label {
  font-size: 1.2rem;
  color: #009150;
  width: 100%;
}

input {
  width: 100%;
  height: 35px;
  border-radius: 10px;
  border: 1px solid #009150;
  font-size: 0.9rem;
}

input:focus {
  outline: 1px solid #009150;
  box-shadow: 0 0 5px 2px #dff7df;
}

.error-msg {
  color: #e60026;
  text-align: center;
}

@media (max-width: 980px) {
  .container > div {
    width: 50%;
  }
}

@media (max-width: 730px) {
  .container > div {
    width: 60%;
  }
}

@media (max-width: 520px) {
  .container > div {
    width: 70%;
  }
}

@media (max-width: 480px) {
  .container > div {
    width: 80%;
    height: 60%;
  }
}

@media (max-width: 350px) {
  .container > div {
    width: 90%;
    height: 60%;
  }
}
</style>
