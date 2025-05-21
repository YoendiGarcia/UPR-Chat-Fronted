import { FormField, FormConfig } from '@/interfaces/Forms'

//Variable para guardar los datos de los inputs de los formularios
export let data: any = {}

//Arreglo para guardar los ids de los campos requeridos(y usarlo mas abajo)
let requireds: string[] = []

//Funcion para extraer el objeto JSON de la response si existe
export const extractJson = (completeText: string) => {
  // Expresión regular para encontrar el JSON en el string
  const jsonRegex = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/
  const jsonMatch = completeText.match(jsonRegex)

  if (!jsonMatch) {
    return null
  }

  let jsonObj
  try {
    jsonObj = JSON.parse(jsonMatch[0])
  } catch (e) {
    console.error(e)
    return null
  }

  // Validar estructura básica del formulario JSON
  if (!jsonObj.fields || !Array.isArray(jsonObj.fields)) {
    console.log('Incorrect structure')
    return null
  }

  return jsonObj
}

//Funcion para crear formulario
export const createForm = (config: FormConfig): HTMLDivElement => {
  const form = document.createElement('div')

  if (config.formAttributes) {
    Object.entries(config.formAttributes).forEach(([key, value]) => {
      form.setAttribute(key, value)
    })
  }

  for (const field of config.fields) {
    const fieldContainer = document.createElement('div')
    fieldContainer.className = `form-field ${field.className || ''}`.trim()

    if (field.label) {
      const label = document.createElement('label')
      label.textContent = field.label
      label.htmlFor = field.id || field.name
      fieldContainer.appendChild(label)
    }

    const inputElement = createInputElement(field)
    fieldContainer.appendChild(inputElement)

    form.appendChild(fieldContainer)
  }

  const textError = document.createElement('p')
  textError.className = 'text-error'
  textError.textContent = 'Faltan datos por llenar'
  form.appendChild(textError)

  const submitButton = document.createElement('button')
  submitButton.type = 'submit'
  submitButton.textContent = config.submitButtonText || 'Enviar'
  submitButton.className = config.submitButtonClass || 'send-btn'
  submitButton.classList.add('deep-chat-temporary-message')
  submitButton.classList.add('deep-chat-suggestion-button')
  form.appendChild(submitButton)

  return form
}

//Funcion para crear los inputs del formulario
const createInputElement = (field: FormField): HTMLElement => {
  let element: HTMLElement

  switch (field.type) {
    case 'textarea':
      const textarea = document.createElement('textarea')
      textarea.id = field.id || field.name
      textarea.name = field.name
      textarea.className = 'textarea'
      textarea.placeholder = field.placeholder || ''
      if (field.value) textarea.textContent = field.value
      element = textarea
      data[textarea.id] = ''
      break

    case 'select':
      const select = document.createElement('select')
      select.id = field.id || field.name
      select.name = field.name
      select.className = 'select'

      const defaultOption = document.createElement('option')
      defaultOption.value = ''
      defaultOption.textContent = 'Selecciona una opción'
      defaultOption.selected = true
      defaultOption.hidden = true
      select.appendChild(defaultOption)

      if (field.options) {
        data[select.id] = field.options[0].value
        field.options.forEach((option) => {
          const optionElement = document.createElement('option')
          optionElement.value = option.value
          optionElement.textContent = option.label
          select.appendChild(optionElement)
        })
      }
      element = select
      break

    case 'radio':
      const radioContainer = document.createElement('div')
      radioContainer.className = 'radio-group'
      radioContainer.id = field.id || field.name

      if (field.options) {
        data[radioContainer.id] = field.options[0].value
        field.options.forEach((option, index) => {
          const radioId = `${field.id || field.name}-${index}`

          const radioDiv = document.createElement('div')
          radioDiv.className = 'radio-option'

          const radio = document.createElement('input')
          radio.type = 'radio'
          radio.id = radioId
          radio.name = field.name
          radio.value = option.value
          if (field.value === option.value) radio.checked = true

          const label = document.createElement('label')
          label.htmlFor = radioId
          label.textContent = option.label

          radioDiv.appendChild(radio)
          radioDiv.appendChild(label)
          radioContainer.appendChild(radioDiv)
        })
      }
      if (field.required) {
        radioContainer.setAttribute('required', '')
        requireds.push(field.id || field.name)
      }
      return radioContainer

    case 'checkbox':
      if (field.options) {
        const checkboxContainer = document.createElement('div')
        checkboxContainer.className = 'checkbox-group'
        checkboxContainer.id = field.id || field.name
        data[checkboxContainer.id] = []

        field.options.forEach((option, index) => {
          const checkboxId = `${field.id || field.name}-${index}`

          const checkboxDiv = document.createElement('div')
          checkboxDiv.className = 'checkbox-option'

          const checkbox = document.createElement('input')
          checkbox.type = 'checkbox'
          checkbox.id = checkboxId
          checkbox.name = field.name
          checkbox.value = option.value

          if (Array.isArray(field.value) && field.value.includes(option.value)) {
            checkbox.checked = true
          }

          const label = document.createElement('label')
          label.htmlFor = checkboxId
          label.textContent = option.label

          checkboxDiv.appendChild(checkbox)
          checkboxDiv.appendChild(label)
          checkboxContainer.appendChild(checkboxDiv)
        })
        if (field.required) {
          checkboxContainer.setAttribute('required', '')
          requireds.push(field.id || field.name)
        }
        return checkboxContainer
      } else {
        const checkboxDiv = document.createElement('div')
        checkboxDiv.className = 'checkbox-single'

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = field.id || field.name
        checkbox.name = field.name
        data[checkbox.id] = false
        if (field.value) checkbox.checked = Boolean(field.value)

        const label = document.createElement('label')
        label.htmlFor = field.id || field.name
        label.textContent = field.label || ''

        checkboxDiv.appendChild(checkbox)
        checkboxDiv.appendChild(label)
        checkboxDiv.id = checkbox.id
        if (field.required) {
          checkbox.setAttribute('required', '')
          requireds.push(field.id || field.name)
        }
        return checkboxDiv
      }

    default:
      const input = document.createElement('input')
      input.type = field.type
      input.id = field.id || field.name
      input.name = field.name
      input.className = 'input'
      input.placeholder = field.placeholder || ''
      data[input.id] = ''
      if (field.value) input.value = field.value
      element = input
  }

  if (field.required) {
    element.setAttribute('required', '')
    requireds.push(field.id || field.name)
  }

  if (field.attributes) {
    Object.entries(field.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
  }

  return element
}

//Funcion para darle estilos al formulario
export const styleForm = (form: any) => {
  // Aplicar estilos al formulario principal
  form.style.fontFamily = "'Arial', sans-serif"
  form.style.maxWidth = '600px'
  form.style.margin = '20px auto'
  form.style.padding = '20px'
  form.style.backgroundColor = '#f9f9f9'
  form.style.borderRadius = '8px'
  form.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'

  // Estilizar todos los divs con clase form-field
  const formFields = form.querySelectorAll('.form-field')
  formFields.forEach((field: any) => {
    field.style.marginBottom = '15px'
    field.style.display = 'flex'
    field.style.flexDirection = 'column'
  })

  // Estilizar las etiquetas
  const labels = form.querySelectorAll('label')
  labels.forEach((label: any) => {
    label.style.marginBottom = '5px'
    label.style.fontWeight = 'bold'
    label.style.color = '#333'
  })

  // Estilizar inputs de texto y número
  const textInputs = form.querySelectorAll('input[type="text"], input[type="number"]')
  textInputs.forEach((input: any) => {
    input.style.padding = '10px'
    input.style.border = '1px solid #ddd'
    input.style.borderRadius = '4px'
    input.style.fontSize = '16px'

    // Añadir evento para el focus
    input.addEventListener('focus', function (this: any) {
      this.style.borderColor = '#4a90e2'
      this.style.outline = 'none'
      this.style.boxShadow = '0 0 0 2px rgba(74, 144, 226, 0.2)'
    })

    // Añadir evento para cuando pierde el focus
    input.addEventListener('blur', function (this: any) {
      this.style.borderColor = '#ddd'
      this.style.boxShadow = 'none'
    })
  })

  // Estilizar checkboxes
  const checkboxes = form.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach((checkbox: any) => {
    checkbox.style.width = 'auto'
    checkbox.style.marginTop = '5px'
  })

  // Estilizar botón
  const button = form.querySelector('button')

  button.style.backgroundColor = '#009150'
  button.style.color = 'white'
  button.style.border = 'none'
  button.style.padding = '10px 15px'
  button.style.fontSize = '16px'
  button.style.borderRadius = '4px'
  button.style.cursor = 'pointer'
  button.style.transition = 'background-color 0.3s'

  const textError = form.querySelector('.text-error')
  textError.style.color = 'red'
  textError.style.textAlign = 'center'
  textError.style.visibility = 'hidden'

  return form
}

//Funcion para eliminar el JSON de la response
export const deleteJsonFromString = (completeText: string, jsonObj: any) => {
  // Primero intentamos encontrar el JSON con el formato exacto
  const jsonString = JSON.stringify(jsonObj, null, 2)
  let inicioJSON = completeText.indexOf(jsonString)

  if (inicioJSON !== -1) {
    return (
      completeText.substring(0, inicioJSON) + completeText.substring(inicioJSON + jsonString.length)
    ).trim()
  }

  // Si no se encuentra, intentamos una búsqueda más flexible
  const jsonRegex = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/
  const jsonMatch = completeText.match(jsonRegex)

  if (!jsonMatch) {
    console.warn('No se pudo encontrar ningún JSON en el texto')
    return completeText
  }

  try {
    // Parseamos el JSON encontrado para comparar su contenido (no formato)
    const jsonEnTexto = JSON.parse(jsonMatch[0])
    if (jsonMatch.index === undefined) {
      // Manejar el caso donde no hay índice (retornar un valor por defecto o lanzar error)
      return completeText.trim() // o throw new Error("No match found");
    }

    // Comparamos los objetos sin considerar el formato
    if (JSON.stringify(jsonEnTexto) === JSON.stringify(jsonObj)) {
      return (
        completeText.substring(0, jsonMatch.index) +
        completeText.substring(jsonMatch.index + jsonMatch[0].length)
      ).trim()
    }
  } catch (e) {
    console.warn('El JSON encontrado no es válido para comparar ' + e)
  }

  // Si todo falla, devolvemos el texto original
  console.warn('No se pudo encontrar el JSON específico para eliminar')
  return completeText
}

//Funcion para validar los campos obligatorios del formulario
export const fieldsValidated = () => {
  for (let fieldId of requireds) {
    if (data[fieldId] == '' || data[fieldId] == false) {
      return false
    }
  }
  return true
}

//Funcion para controlar las interacciones con los inputs del formulario y recoger los datos
export const htmlClassUtilities = {
  ['input']: {
    events: {
      ['mouseleave']: (e: any) => {
        data[e.target.id] = e.target.value
      },
    },
  },
  ['textarea']: {
    events: {
      ['mouseleave']: (e: any) => {
        data[e.target.id] = e.target.value
      },
    },
  },
  ['select']: {
    events: {
      ['change']: (e: any) => {
        data[e.target.id] = e.target.value
      },
    },
  },
  ['radio-group']: {
    events: {
      ['change']: (e: any) => {
        data[e.target.closest('.radio-group').id] = e.target.value
      },
    },
  },
  ['checkbox-group']: {
    events: {
      ['change']: (e: any) => {
        data[e.target.closest('.checkbox-group').id] = new Array()
        if (!data[e.target.closest('.checkbox-group').id].includes(e.target.value))
          data[e.target.closest('.checkbox-group').id].push(e.target.value)
      },
    },
  },
  ['checkbox-single']: {
    events: {
      ['change']: (e: any) => {
        data[e.target.id] = e.target.value
      },
    },
  },
}
