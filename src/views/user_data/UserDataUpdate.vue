<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { User } from '@/interfaces/Users'
import router from '@/router'
import { data } from '../chat/utils/chat.format-methods'

let user = reactive<User>({
  username: '',
  data: {
    complete_name: '',
    email: '',
    phone: '',
    type: '',
    year: 0,
    career: '',
    course: '',
    subjects: [],
  },
})

const error = ref(false)
const incorrectFields = ref<string[]>([])

const newSubject = ref('')
const subjectSelected = ref('')

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
    user.username = data.username
    asignValues(data.data)
  } catch (error) {
    console.error('Error getting user data:', error)
  }
}

const saveUserData = async () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const token = sessionStorage.getItem('access_token')
  clearUnusedData()
  validateData()
  if (error.value == true) return
  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    })

    if (!response.ok) throw new Error(`HTTP error status: ${response.status}`)

    router.push('/user_data')
  } catch (error) {
    console.error('Error getting user data:', error)
  }
}

const addSubject = () => {
  user.data.subjects.unshift(newSubject.value)
  newSubject.value = ''
  clearError()
}

const deleteSubject = () => {
  user.data.subjects = user.data.subjects.filter((s) => s != subjectSelected.value)
}

const asignValues = (data: any) => {
  if (data.complete_name != undefined) user.data.complete_name = data.complete_name
  if (data.email != undefined) user.data.email = data.email
  if (data.phone != undefined) user.data.phone = data.phone
  if (data.type != undefined) user.data.type = data.type
  if (data.year != undefined) user.data.year = data.year
  if (data.career != undefined) user.data.career = data.career
  if (data.course != undefined) user.data.course = data.course
  if (data.subjects != undefined) user.data.subjects = data.subjects
}

const clearUnusedData = () => {
  if (user.data.type == 'Estudiante') {
    user.data.subjects = []
  } else if (user.data.type == 'Profesor') {
    user.data.career = ''
    user.data.course = ''
    user.data.year = 0
  } else {
    user.data.subjects = []
    user.data.career = ''
    user.data.course = ''
    user.data.year = 0
  }
}

const validateData = () => {
  if (!isValidPhoneNumber(user.data.phone) && user.data.phone != '') {
    if (!incorrectFields.value.includes('Teléfono')) incorrectFields.value.push('Teléfono')
  }
  if (!validateEmail(user.data.email) && user.data.email != '') {
    if (!incorrectFields.value.includes('Email')) incorrectFields.value.push('Email')
  }
  if (user.data.subjects.length == 0 && user.data.type == 'Profesor') {
    if (!incorrectFields.value.includes('Asignaturas')) incorrectFields.value.push('Asignaturas')
  }
  if (user.data.career.length == 0 && user.data.type == 'Estudiante') {
    if (!incorrectFields.value.includes('Carrera')) incorrectFields.value.push('Carrera')
  }
  if (user.data.course == '' && user.data.type == 'Estudiante') {
    if (!incorrectFields.value.includes('Curso')) incorrectFields.value.push('Curso')
  }
  if (user.data.year == 0 && user.data.type == 'Estudiante') {
    if (!incorrectFields.value.includes('Año')) incorrectFields.value.push('Año')
  }
  if (incorrectFields.value.length > 0) {
    error.value = true
  }
}

const validateEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!email || typeof email !== 'string' || !regex.test(email)) {
    return false
  }

  if (/\s/.test(email)) {
    return false
  }

  const parts = email.split('@')
  if (parts.length !== 2 || parts[1].indexOf('.') === -1) {
    return false
  }

  const domain = parts[1]
  const domainParts = domain.split('.')
  const tld = domainParts[domainParts.length - 1]
  if (tld.length < 2) {
    return false
  }

  return true
}

const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+?(\d{1,3})?[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}$/

  const cleanedPhone = phoneNumber.trim()

  if (cleanedPhone.length < 5 || cleanedPhone.length > 20) {
    return false
  }
  return phoneRegex.test(cleanedPhone)
}

const clearError = () => {
  error.value = false
  incorrectFields.value = []
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
          <div class="complete-name">
            <p><i class="pi pi-user"></i> Nombre Completo:</p>
            <input
              v-model="user.data.complete_name"
              maxlength="25"
              type="text"
              placeholder="Nombre Apellido"
            />
          </div>
          <div class="email">
            <p><i class="pi pi-envelope"></i> Email:</p>
            <input
              v-model="user.data.email"
              type="email"
              maxlength="25"
              placeholder="ejemplo@gmail.com"
              @input="clearError"
            />
          </div>
          <div class="phone">
            <p><i class="pi pi-phone"></i> Teléfono:</p>
            <input
              v-model="user.data.phone"
              @input="clearError"
              type="tel"
              maxlength="20"
              placeholder="XXXXXXXX"
            />
          </div>
        </div>
        <div class="col2">
          <div class="type">
            <p><i class="pi pi-graduation-cap"></i> Tipo:</p>
            <select v-model="user.data.type">
              <option value="Estudiante">Estudiante</option>
              <option value="Profesor">Profesor</option>
              <option value="Otro">Otro</option>
            </select>
            <div class="student-data" v-if="user.data.type == 'Estudiante'">
              <p>Carrera:</p>
              <input
                type="text"
                maxlength="25"
                v-model="user.data.career"
                placeholder="Licenciado en ..."
                @input="clearError"
              />
              <div class="year">
                <p>Año:</p>
                <select @change="clearError" v-model="user.data.year">
                  <option value="1">1ro</option>
                  <option value="2">2do</option>
                  <option value="3">3ro</option>
                  <option value="4">4to</option>
                  <option value="5">5to</option>
                </select>
              </div>
              <p>Curso:</p>
              <div class="course">
                <div class="crd">
                  <label>CRD</label>
                  <input @click="clearError" v-model="user.data.course" type="radio" name="course" value="CRD" />
                </div>
                <div class="cpe">
                  <label>CPE</label>
                  <input @click="clearError"  v-model="user.data.course" type="radio" name="course" value="CPE" />
                </div>
              </div>
            </div>
            <div v-else-if="user.data.type == 'Profesor'">
              <p>Asignaturas:</p>
              <div class="subject-add">
                <input v-model="newSubject" maxlength="25" type="text" placeholder="Asignatura" />
                <button @click="addSubject" class="btn-subject">+</button>
              </div>
              <div class="subject-list">
                <select v-model="subjectSelected">
                  <option
                    v-for="subject in user.data.subjects"
                    :value="subject"
                  >
                    {{ subject }}
                  </option>
                </select>
                <button class="btn-subject" @click="deleteSubject">-</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-show="error" class="error">Algunos datos son incorrectos: {{ incorrectFields }}</p>
      <button @click="saveUserData" class="btn-accept">Aceptar</button>
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
  border: 1px solid #009150;
  border-radius: 30px;
  width: 50%;
  padding: 50px;
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
  align-items: flex-start;
  gap: 100px;
  width: 100%;
}

.col2 {
  display: flex;
  justify-content: center;
  align-self: start;
}

input,
select {
  width: 100%;
  height: 35px;
  border-radius: 10px;
  border: 1px solid #009150;
  font-size: 0.9rem;
}

select {
  background-color: transparent;
}

input:focus {
  outline: 1px solid #009150;
  box-shadow: 0 0 5px 2px #dff7df;
}

input[type='radio'] {
  accent-color: #009150;
  outline: none;
}

.subject-add {
  display: flex;
}

.subject-list {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.btn-subject {
  border: 1px solid #009150;
  background-color: transparent;
  border-radius: 10px;
  width: 35px;
  height: 35px;
  font-size: 1.5rem;
  color: #009150;
  transition: 0.3s ease-in-out;
  margin-left: 10px;
}

.btn-subject:hover {
  background-color: #009150;
  color: white;
  cursor: pointer;
}

.year {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.year > select {
  width: 50%;
}

.course {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.crd,
.cpe {
  display: flex;
  justify-content: center;
  align-items: center;
}

.crd > input,
.cpe > input {
  width: 20px;
  height: 20px;
}

.btn-accept {
  border: 1px solid #009150;
  color: #009150;
  background-color: transparent;
  transition: 0.3s ease-in-out;
  border-radius: 10px;
  padding: 10px;
  font-size: 1rem;
  margin-top: 30px;
  width: 150px;
}

.btn-accept:hover {
  background-color: #009150;
  color: white;
  cursor: pointer;
}

.error {
  color: #e60026;
  text-align: center;
}

@media (max-width: 960px) {
  .container {
    width: 90%;
  }
  .cols {
    flex-direction: column;
    gap: 0;
  }
}
</style>
