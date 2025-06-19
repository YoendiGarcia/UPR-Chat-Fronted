<script lang="ts" setup>
import { User } from '@/interfaces/Users'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const user = ref<User>({
  username: '',
  data: {
    complete_name: 'N/A',
    email: 'N/A',
    phone: 'N/A',
    type: 'N/A',
    year: 0,
    career: '',
    course: '',
    subjects: [],
  },
})

const router = useRouter()

const goBack = () => {
  router.push('/chat')
}

const goEdit = () => {
  router.push('/user_update')
}

const getUserData = async () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const token = sessionStorage.getItem('access_token')
  const params = new URLSearchParams()
  const username = sessionStorage.getItem('username')
  if (!username) throw new Error('Not username')
  params.append('username', username)

  try {
    const response = await fetch(`${apiUrl}/users?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error(`HTTP error status: ${response.status}`)

    let data = await response.json()
    user.value.username = data.username
    asignValues(data.data)
    console.log(user.value)
  } catch (error) {
    console.error('Error getting user data:', error)
  }
}

const asignValues = (data: any) => {
  if (data.complete_name != undefined) user.value.data.complete_name = data.complete_name
  if (data.email != undefined) user.value.data.email = data.email
  if (data.phone != undefined) user.value.data.phone = data.phone
  if (data.type != undefined) user.value.data.type = data.type
  if (data.year != undefined) user.value.data.year = data.year
  if (data.career != undefined) user.value.data.career = data.career
  if (data.course != undefined) user.value.data.course = data.course
  if (data.subjects != undefined) user.value.data.subjects = data.subjects
}

onMounted(async () => {
  await getUserData()
})
</script>

<template>
  <div class="outer">
    <div class="container">
      <p class="title">Perfil</p>
      <div class="cols">
        <div class="col1">
          <div class="data-field">
            <p><i class="pi pi-user"></i> Nombre Completo:</p>
            <p class="data">{{ user.data.complete_name }}</p>
          </div>
          <div class="data-field">
            <p><i class="pi pi-envelope"></i> Email:</p>
            <p class="data">{{ user.data.email }}</p>
          </div>
          <div class="data-field">
            <p><i class="pi pi-phone"></i> Teléfono:</p>
            <p class="data">{{ user.data.phone }}</p>
          </div>
        </div>
        <div class="col2">
          <div class="data-field">
            <p><i class="pi pi-graduation-cap"></i> Tipo:</p>
            <p class="data">{{ user.data.type }}</p>
            <div class="type-data" v-if="user.data.type == 'Estudiante'">
              <p>Carrera:</p>
              <p class="data">{{ user.data.career }}</p>
              <p>Año:</p>
              <p class="data">{{ user.data.year }}</p>
              <p>Curso:</p>
              <p class="data">{{ user.data.course }}</p>
            </div>
            <div v-else-if="user.data.type == 'Profesor'">
              <p>Asignatura(s):</p>
              <div class="subjects">
                <p class="data" v-for="subject in user.data.subjects" :id="subject">
                  {{ subject }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button @click="goBack" class="go-back">Atrás</button>
        <button @click="goEdit" class="edit">Editar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 30px;
  width: 50%;
  border: 1px solid #009150;
}

.container > div,
.title {
  color: #009150;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.cols {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 100px;
}

.data {
  color: black;
  background-color: #dff7df;
  padding: 5px;
  border-radius: 5px;
  height: 35px;
  width: 250px;
}

.data-field {
  margin-bottom: 30px;
}

.go-back,
.edit {
  font-size: 1rem;
  color: #009150;
  background-color: transparent;
  border: 1px solid #009150;
  width: 130px;
  height: 40px;
  padding: 5px;
  border-radius: 10px;
  transition: 0.3s ease-in-out;
}

.go-back:hover,
.edit:hover {
  cursor: pointer;
  background-color: #009150;
  color: white;
}

.buttons{
  display: flex;
  justify-content: space-between;
  width: 90%;
}

@media (max-width: 1165px) {
  .cols{
    gap: 30px;
  }
}

@media (max-width: 1046px) {
  .cols{
    gap: 0px;
    flex-direction: column;
  }

  .container{
    width: 90vw;
  }
}

</style>
