
const preguntas = [
    {
        pregunta: "¿Qué significa RGB en diseño digital?",
        opciones: [
            "Rojo, verde y azul",
            "Rojo, gris y blanco",
            "Rosa, gris y beige",
            "Rojo, verde y negro"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué caracteriza a una imagen vectorial?",
        opciones: [
            "Está formada únicamente por píxeles",
            "Pierde calidad al ampliarse",
            "Se construye con formas matemáticas",
            "Solo puede utilizarse en blanco y negro"
        ],
        correcta: 2
    },
    {
        pregunta: "¿Qué es la tipografía en diseño gráfico?",
        opciones: [
            "Una técnica de iluminación",
            "El diseño y uso de las letras",
            "Un formato de imagen",
            "Una herramienta de animación"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Para qué sirve el contraste visual?",
        opciones: [
            "Para eliminar todos los colores",
            "Para reducir el tamaño de una imagen",
            "Para convertir imágenes en vectores",
            "Para diferenciar y destacar elementos"
        ],
        correcta: 3
    },
    {
        pregunta: "¿Qué es un fotograma en una animación?",
        opciones: [
            "Una imagen individual de la secuencia",
            "Un efecto de sonido",
            "Una herramienta para editar texto",
            "Un formato de audio"
        ],
        correcta: 0
    }
];

let preguntaActual = 0;
let puntos = 0;
let respondida = false;
let juegoTerminado = false;

const textoPregunta = document.getElementById('pregunta');
const contenedorOpciones = document.getElementById('opciones-trivia');
const progreso = document.getElementById('progreso');
const resultado = document.getElementById('resultado');
const botonSiguiente = document.getElementById('siguiente');

function mostrarPregunta() {
    const datos = preguntas[preguntaActual];
    document.querySelector('.trivia-juego')
        .classList.remove('terminada');
    respondida = false;

    progreso.textContent =
        `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;

    textoPregunta.textContent = datos.pregunta;
    resultado.textContent = '';

    contenedorOpciones.replaceChildren();

    datos.opciones.forEach((opcion, indice) => {
        const boton = document.createElement('button');

        boton.type = 'button';
        boton.textContent = opcion;

        boton.addEventListener('click', () => {
            comprobarRespuesta(indice);
        });

        contenedorOpciones.appendChild(boton);
    });

    botonSiguiente.disabled = true;
    botonSiguiente.textContent = 'Siguiente pregunta';
}

function comprobarRespuesta(indice) {
    if (respondida) {
        return;
    }

    respondida = true;

    const correcta = preguntas[preguntaActual].correcta;
    const botones = contenedorOpciones.querySelectorAll('button');

    botones.forEach((boton, posicion) => {
        boton.disabled = true;

        if (posicion === correcta) {
            boton.classList.add('respuesta-correcta');
        } else if (posicion === indice) {
            boton.classList.add('respuesta-incorrecta');
        }
    });

    if (indice === correcta) {
        puntos++;
        resultado.textContent = '¡Muy bien! Respuesta correcta.';

        estadoMascota.saludo = 1;
    } else {
        resultado.textContent = '¡Casi! Seguí intentando.';

        sorpresaHasta = millis() + 650;
    }

    botonSiguiente.disabled = false;
}

function finalizarTrivia() {


    juegoTerminado = true;

    progreso.textContent = '¡Resultado final!';
    textoPregunta.textContent = '¡Completaste la trivia!';

    contenedorOpciones.replaceChildren();

    const estrellas =
        '★'.repeat(puntos) +
        '☆'.repeat(preguntas.length - puntos);

    let mensaje = '';

    if (puntos === preguntas.length) {
        mensaje = '¡Excelente! ¡Respondiste todo correctamente!';
    } else if (puntos >= 3) {
        mensaje = '¡Muy bien! Tenés grandes conocimientos.';
    } else {
        mensaje = '¡Buen intento! Podés volver a jugar.';
    }

    resultado.textContent =
        `${estrellas}\n${puntos} de ${preguntas.length} puntos\n${mensaje}`;

    document.querySelector('.trivia-juego')
        .classList.add('terminada');

    botonSiguiente.textContent = 'Volver a jugar';

    estadoMascota.saludo = 1;
}


botonSiguiente.addEventListener('click', () => {
    if (juegoTerminado) {
        preguntaActual = 0;
        puntos = 0;
        juegoTerminado = false;

        mostrarPregunta();
        return;
    }

    preguntaActual++;

    if (preguntaActual < preguntas.length) {
        mostrarPregunta();
    } else {
        finalizarTrivia();
    }
});

mostrarPregunta();
