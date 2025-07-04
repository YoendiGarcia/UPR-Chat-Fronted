import {
  extractJson,
  styleForm,
  deleteJsonFromString,
  createForm,
  fieldsValidated,
  data,
} from './chat.format-methods'

//Variable para gestionar los formularios
export let isForm = false

export let currentLLMQuery = {
  input: {},
  output: {},
}

//Funcion para manejar el request
export const requestInterceptor = async (requestDetails: any) => {
  let chat_id = await handleCurrentChatId()
  requestDetails.body.chat_id = chat_id.toString()
  if (isForm) {
    if (fieldsValidated()) {
      requestDetails.body.messages.push({ role: 'user', text: data })
    } else {
      requestDetails.body.messages.push({ role: 'user', text: `${data} -> Faltan campos por llenar` })
    }
  } 
  currentLLMQuery.input = requestDetails.body.messages
  console.log(requestDetails.body)
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


  } catch (error) {
    console.error('Error saving LLMQuery:', error)
  }
}

export const handleCurrentChatId = async () => {
  let currentId = sessionStorage.getItem('chat_id')
  if (currentId == '') {
    const apiUrl = import.meta.env.VITE_API_URL
    const userId = sessionStorage.getItem('user_id')
    const token = sessionStorage.getItem('access_token')
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
      currentId = data['id']
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }
  if (!currentId) {
    throw new Error('No chat ID available')
  }
  sessionStorage.setItem('chat_id', currentId)
  return currentId
}


// export const sendData = async (data: string) =>{
//   const apiUrl = import.meta.env.VITE_API_URL
//   const currentChatId = await handleCurrentChatId()
//   const token = sessionStorage.getItem('access_token')
//   const body = {
//     messages:[{
//       "role":"user",
//       "text":data.toString()
//     }],
//     chat_id:currentChatId.toString()
//   }

//   if (!currentChatId) {
//     throw new Error('No chat ID available')
//   }


//   try {
//     const response = await fetch(`${apiUrl}/chats/prompt`, {
//       method: 'POST',
//       headers: {
//         'Content-type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(body),
//     })

//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)


//   } catch (error) {
//     console.error('Error saving data:', error)
//   }
// }