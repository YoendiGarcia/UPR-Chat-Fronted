import { extractJson, styleForm, deleteJsonFromString,createForm } from './chat.format-methods'

export const requestInterceptor = async (requestDetails: any) => {
  const otherTask = await fetch('http://localhost:8000/', {
    method: 'post',
    body: JSON.stringify({ messages: requestDetails.body.messages }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!otherTask.ok) {
    return { error: 'Error in other task' }
  }
  return requestDetails
}

export const responseInterceptor = async (response: any) => {
  const otherTask = await fetch('http://localhost:8000/', {
    method: 'post',
    body: JSON.stringify({ messages: [{ role: 'user', text: 'jhjk' }] }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!otherTask.ok) {
    return { error: 'Error in other task' }
  }

  let Json = extractJson(response['text'])
  if (Json) {
    const form = createForm(Json)
    const styledForm = styleForm(form)
    const text = deleteJsonFromString(response['text'], Json)
    response['html'] = styledForm.outerHTML
    response['text'] = text
  }

  return response
}
