const CHATGPT_KEY = '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'
mostrarCard(false)
mostrarCargando(false)
let cantidadPreguntas = 5
let json = []
let index = 0
let needShowQuestion = true

function mostrarCargando(esVisible) {
  document.getElementById('imgCargando').hidden = !esVisible
}


function mostrarCard(esVisible) {
  document.getElementsByClassName('card')[0].hidden = !esVisible

}

function mostrarRespuesta(esVisible) {
  document.getElementById('respuesta').hidden = !esVisible
}

function mostrarPregunta(esVisible) {
  document.getElementById('pregunta').hidden = !esVisible
}

async function onClickBtnPreguntas() {
  const inputArea = document.getElementById('inputArea')
  const inputTema = document.getElementById('inputTema')
  const inputNumero = document.getElementById('inputNumero')
  const prompt = crearPrompt(inputArea.value, inputTema.value, inputNumero.value)
  if (inputArea.value == '' || inputTema.value == '') {
    alert('No olvide poner el Area y Tema')
    return
  }
  if (Number(inputNumero.value) > 10 || Number(inputNumero.value) < 5) {
    alert('Por favor el número de preguntas no puede ser menor a 5 y mayor que 10')
    return
  }
  cantidadPreguntas = Number(inputNumero.value)
  mostrarCard(false)
  mostrarCargando(true)
  ActivarButton(false)
  const respuestaSringChatGPT = await llamarAchatGpt(prompt)
  json = JSON.parse(respuestaSringChatGPT)
  mostrarRespuesta(false)
  let pregunta = json[index].pregunta
  let htmlPregunta = document.getElementById('txtPregunta')
  htmlPregunta.innerHTML = pregunta
  mostrarCard(true)
  mostrarCargando(false)
  ActivarButton(true)
}

function ActivarButton(activo) {
  const btnPreguntas = document.getElementById('btnPreguntas')
  if (activo) {
    btnPreguntas.disabled = false
    btnPreguntas.style.backgroundColor = '#A0BCC2'
    btnPreguntas.style.cursor = 'pointer'
  } else {
    btnPreguntas.disabled = true
    btnPreguntas.style.backgroundColor = 'gray'
    btnPreguntas.style.cursor = 'auto'
  }
}

function onClickCard() {
  if (index == cantidadPreguntas) {
    alert("Llegaste a la ultima pregunta Si gustas te genero nuevas preguntas")
    mostrarCard(false)
    index = 0
  }

  if (!needShowQuestion) {
    mostrarPregunta(true)
    mostrarRespuesta(false)
    const pregunta = json[index].pregunta
    const spanNumero = document.getElementById('txtNumero')
    const htmlPregunta = document.getElementById('txtPregunta')
    htmlPregunta.innerHTML = pregunta
    spanNumero.innerHTML = index + 1
  } else {
    mostrarPregunta(false)
    mostrarRespuesta(true)
    const respuesta = json[index].respuesta
    const htmlRespuesta = document.getElementById('txtRespuesta')
    htmlRespuesta.innerHTML = respuesta
    index++
  }

  needShowQuestion = !needShowQuestion
}

// function llamarAchatGpt() {
//   return [
//     {
//       "pregunta": "¿Qué significa DOM en JavaScript?",
//       "respuesta": "El DOM, o Document Object Model, es una representación de la estructura de un documento HTML/XML que JavaScript utiliza para interactuar con la página web de manera dinámica."
//     },
//     {
//       "pregunta": "¿Cómo se accede a un elemento HTML específico mediante JavaScript?",
//       "respuesta": "Puedes acceder a un elemento HTML específico mediante JavaScript utilizando métodos como getElementById, getElementsByClassName o querySelector, proporcionando el identificador o la clase del elemento."
//     },
//     {
//       "pregunta": "¿Qué es un evento en el contexto del DOM?",
//       "respuesta": "Un evento en el contexto del DOM es una acción que ocurre en un elemento HTML, como hacer clic en un botón o mover el ratón, y que puede desencadenar una función JavaScript para responder a esa acción."
//     },
//     {
//       "pregunta": "¿Cómo se agrega un nuevo elemento al DOM con JavaScript?",
//       "respuesta": "Puedes agregar un nuevo elemento al DOM creando un elemento HTML en JavaScript, configurando sus atributos y contenido, y luego adjuntándolo a un elemento existente utilizando métodos como appendChild o insertBefore."
//     },
//     {
//       "pregunta": "¿Qué es la propagación de eventos en JavaScript?",
//       "respuesta": "La propagación de eventos en JavaScript se refiere al proceso mediante el cual un evento se propaga desde el elemento que lo desencadenó hacia arriba a través de la jerarquía del DOM. Esto permite que los eventos sean capturados y manejados por elementos padres o ancestros del elemento objetivo."
//     }
//   ]
// }


async function llamarAchatGpt(mensage) {
  const bodyRequest = {
    model: 'gpt-3.5-turbo',
    messages:[
      { role: 'user', content: mensage }
    ]
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CHATGPT_KEY}`
    },
    body: JSON.stringify(bodyRequest)
  })
  const data = await response.json()
  return data.choices[0].message.content
}

function crearPrompt(area, tema, numero) {
  return `
  Area: ${area}
  Tema: ${tema}
  Necesito que armes ${numero} preguntas con sus respectivas respuestas,
  pero que me lo devuelvas en JSON con la siguiente estructura.
    [
      {
        "pregunta": "¿pregunta1?",
        "respuesta": "reapuesta1"
      },
      {
        "pregunta": "¿pregunta2?",
        "respuesta": "reapuesta2"
      },
      {
        "pregunta": "¿pregunta3?",
        "respuesta": "reapuesta3"
      },
      {
        "pregunta": "¿pregunta4",
        "respuesta": "reapuesta4"
      },
      {
        "pregunta": "¿pregunta5?",
        "respuesta": "reapuesta5"
      },
    ]
    es sumamente importante que solo devuelvas el JSON sin decir nada previamente, ni aclarar nada
  `
}

