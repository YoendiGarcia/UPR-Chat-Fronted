export const extractJSONAndCreateForm = (text: string) => {
  // Intenta encontrar un JSON en el texto
  const jsonMatch = text.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/)

  if (!jsonMatch) {
    return null
  }

  let json
  try {
    json = JSON.parse(jsonMatch[0])
  } catch (e) {
    return null
  }

  // Crear el formulario
  const form = document.createElement('form')

  // Función recursiva para agregar campos al formulario
  function addFieldsToForm(data: any, parentElement: any, parentKey = '') {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key
        const value = data[key]

        if (typeof value === 'object' && value !== null) {
          // Si es un objeto, agregar fieldset y procesar recursivamente
          const fieldset = document.createElement('fieldset')
          const legend = document.createElement('legend')
          legend.textContent = fullKey
          fieldset.appendChild(legend)
          addFieldsToForm(value, fieldset, fullKey)
          parentElement.appendChild(fieldset)
        } else {
          // Crear contenedor del campo
          const div = document.createElement('div')
          div.className = 'form-field'

          // Crear etiqueta
          const label = document.createElement('label')
          label.textContent = key
          label.htmlFor = fullKey

          // Crear input según el tipo de dato
          let input
          if (typeof value === 'boolean') {
            input = document.createElement('input')
            input.type = 'checkbox'
            input.checked = value
          } else if (typeof value === 'number') {
            input = document.createElement('input')
            input.type = 'number'
            input.value = value
          } else {
            input = document.createElement('input')
            input.type = 'text'
            input.value = value
          }

          input.id = fullKey
          input.name = fullKey

          div.appendChild(label)
          div.appendChild(input)
          parentElement.appendChild(div)
        }
      }
    }
  }

  addFieldsToForm(json, form)

  // Agregar botón de submit
  const submitBtn = document.createElement('button')
  submitBtn.type = 'submit'
  submitBtn.textContent = 'Enviar'
  form.appendChild(submitBtn)

  return form
}

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
  formFields.forEach((field) => {
    field.style.marginBottom = '15px'
    field.style.display = 'flex'
    field.style.flexDirection = 'column'
  })

  // Estilizar las etiquetas
  const labels = form.querySelectorAll('label')
  labels.forEach((label) => {
    label.style.marginBottom = '5px'
    label.style.fontWeight = 'bold'
    label.style.color = '#333'
  })

  // Estilizar inputs de texto y número
  const textInputs = form.querySelectorAll('input[type="text"], input[type="number"]')
  textInputs.forEach((input) => {
    input.style.padding = '10px'
    input.style.border = '1px solid #ddd'
    input.style.borderRadius = '4px'
    input.style.fontSize = '16px'

    // Añadir evento para el focus
    input.addEventListener('focus', function () {
      this.style.borderColor = '#4a90e2'
      this.style.outline = 'none'
      this.style.boxShadow = '0 0 0 2px rgba(74, 144, 226, 0.2)'
    })

    // Añadir evento para cuando pierde el focus
    input.addEventListener('blur', function () {
      this.style.borderColor = '#ddd'
      this.style.boxShadow = 'none'
    })
  })

  // Estilizar fieldsets
  const fieldsets = form.querySelectorAll('fieldset')
  fieldsets.forEach((fieldset) => {
    fieldset.style.border = '1px solid #ddd'
    fieldset.style.borderRadius = '4px'
    fieldset.style.padding = '15px'
    fieldset.style.marginBottom = '15px'
  })

  // Estilizar leyendas
  const legends = form.querySelectorAll('legend')
  legends.forEach((legend) => {
    legend.style.padding = '0 10px'
    legend.style.fontWeight = 'bold'
    legend.style.color = '#555'
  })

  // Estilizar checkbox
  const checkbox = form.querySelector('input[type="checkbox"]')
  if (checkbox) {
    checkbox.style.width = 'auto'
    checkbox.style.marginTop = '5px'
  }

  // Estilizar botón
  const buttons = form.querySelectorAll('button')
  buttons.forEach((button) => {
    button.style.backgroundColor = '#009150'
    button.style.color = 'white'
    button.style.border = 'none'
    button.style.padding = '10px 15px'
    button.style.fontSize = '16px'
    button.style.borderRadius = '4px'
    button.style.cursor = 'pointer'
    button.style.transition = 'background-color 0.3s'
  })

  const inputsSubmits = form.querySelectorAll('input[type="submit"]')
  inputsSubmits.forEach((input) => {
    input.style.backgroundColor = '#009150'
    input.style.color = 'white'
    input.style.border = 'none'
    input.style.padding = '10px 15px'
    input.style.fontSize = '16px'
    input.style.borderRadius = '4px'
    input.style.cursor = 'pointer'
    input.style.transition = 'background-color 0.3s'
  })

  return form
}

export const generateFormFromString = (completeText: string) => {
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

  // Generar el formulario HTML
  const form = document.createElement('form')
  if (jsonObj.id) form.id = jsonObj.id
  if (jsonObj.action) form.action = jsonObj.action
  if (jsonObj.method) form.method = jsonObj.method

  // Agregar campos al formulario
  jsonObj.fields.forEach((field) => {
    const fieldContainer = document.createElement('div')
    fieldContainer.className = 'form-field'

    // Crear etiqueta si el campo la tiene (no aplica para submit)
    if (field.label && field.type !== 'submit') {
      const label = document.createElement('label')
      label.htmlFor = field.id || field.name
      label.textContent = field.label
      if (field.required) {
        label.innerHTML += ' <span class="required">*</span>'
      }
      fieldContainer.appendChild(label)
    }

    // Crear el elemento de entrada según el tipo
    let input
    if (field.type === 'textarea') {
      input = document.createElement('textarea')
      input.id = field.id || field.name
      input.name = field.name
      if (field.placeholder) input.placeholder = field.placeholder
    } else {
      input = document.createElement('input')
      input.type = field.type
      input.id = field.id || field.name
      input.name = field.name
      if (field.placeholder) input.placeholder = field.placeholder
      if (field.value) input.value = field.value
    }

    // Atributos adicionales
    if (field.required && field.type !== 'submit') {
      input.required = true
    }

    fieldContainer.appendChild(input)
    form.appendChild(fieldContainer)
  })

  return {
    form: form,
    jsonObj: jsonObj,
  }
}

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

    // Comparamos los objetos sin considerar el formato
    if (JSON.stringify(jsonEnTexto) === JSON.stringify(jsonObj)) {
      return (
        completeText.substring(0, jsonMatch.index) +
        completeText.substring(jsonMatch.index + jsonMatch[0].length)
      ).trim()
    }
  } catch (e) {
    console.warn('El JSON encontrado no es válido para comparar')
  }

  // Si todo falla, devolvemos el texto original
  console.warn('No se pudo encontrar el JSON específico para eliminar')
  return completeText
}
