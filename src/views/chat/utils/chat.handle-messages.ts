import {
  extractJson,
  styleForm,
  deleteJsonFromString,
  createForm,
  fieldsValidated,
  data,
} from './chat.format-methods'

//Variable para saber si en la respuesta hay un formulario
export let isForm = false

//Funcion para manejar el request
export const requestInterceptor = async (requestDetails: any) => {
  if (isForm) {
    if (fieldsValidated()) {
      requestDetails.body.messages.push({ role: 'user', text: JSON.stringify(data) })
    } else{
      requestDetails.body.messages.push({ role: 'ia', text: "Faltan campos por llenar" })
    }
  }
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
  return response
}
