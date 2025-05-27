import { text } from '@primeuix/themes/aura/inlinemessage'
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
export let invalidForm = false

//Funcion para manejar el request
export const requestInterceptor = async (requestDetails: any) => {
  if (isForm) {
    if (fieldsValidated()) {
      requestDetails.body.messages.push({ role: 'user', text: JSON.stringify(data) })
      invalidForm = false
    } else{
      requestDetails.body.messages.push({ role: 'ia', text: "Faltan campos por llenar" })
      invalidForm = true
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
  if(invalidForm){
    response['text'] = "### Faltan campos por llenar \n \n" + response['text']
  }
  return response
}
