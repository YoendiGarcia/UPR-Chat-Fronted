import {
  extractJson,
  styleForm,
  deleteJsonFromString,
  createForm,
  fieldsValidated,
  data,
} from './chat.format-methods'
import { LLMQuery } from '@/interfaces/LLMQueries'
import { useChatStore } from '@/stores/chat'

//Variable para gestionar los formularios
export let isForm = false

export let currentLLMQuery = {
  input: {},
  output: {},
}

//Funcion para manejar el request
export const requestInterceptor = async (requestDetails: any) => {
  if (isForm) {
    if (fieldsValidated()) {
      requestDetails.body.messages.push({ role: 'user', text: JSON.stringify(data) })
    } else {
      requestDetails.body.messages.push({ role: 'ai', text: 'Faltan campos por llenar' })
    }
  }
  currentLLMQuery.input = requestDetails.body.messages
  return requestDetails
}

//Funcion para manejar la response
export const responseInterceptor = async (response: any) => {
  let Json = extractJson(response['text'])
  if (Json) {
    isForm = true
    const form = createForm(Json)
    const styledForm = styleForm(form)
    const text = deleteJsonFromString(response['text'], Json)
    response['html'] = styledForm.outerHTML
    response['text'] = text
  } else {
    isForm = false
  }
  currentLLMQuery.output = response
  saveLLMQuery()
  return response
}

const saveLLMQuery = async () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const url = new URL(`${apiUrl}/llmqueries`)
  const currentChatId = await handleCurrentChatId()

  if (!currentChatId) {
    throw new Error('No chat ID available')
  }

  url.searchParams.append('chat_id', currentChatId)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(currentLLMQuery),
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    let data = await response.json()

    const completeCurrentLLMQuery: LLMQuery = data
    const chatStore = useChatStore()
    chatStore.addChat({ id: parseInt(currentChatId), llmqueries: [] })
    chatStore.saveLLMQuery(parseInt(currentChatId), completeCurrentLLMQuery)
  } catch (error) {
    console.error('Error saving LLMQuery:', error)
  }
}

export const handleCurrentChatId = async () => {
  let currentId = localStorage.getItem('chat_id')
  if (currentId == '') {
    const apiUrl = import.meta.env.VITE_API_URL
    const userId = localStorage.getItem('user_id')
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(`${apiUrl}/chats`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      let data = await response.json()
      console.log(data)
      currentId = data['id']
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }
  if (!currentId) {
    throw new Error('No chat ID available')
  }
  localStorage.setItem('chat_id', currentId)
  return currentId
}
