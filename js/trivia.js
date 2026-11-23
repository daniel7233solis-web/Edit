
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
    },

    {
        pregunta: "¿Para qué se utiliza el modelo CMYK?",
        opciones: [
            "Para animaciones 3D",
            "Para impresión a color",
            "Para editar sonidos",
            "Para crear páginas web"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué es la jerarquía visual?",
        opciones: [
            "Usar siempre el mismo tamaño",
            "Eliminar los espacios vacíos",
            "Organizar los elementos según su importancia",
            "Colocar todas las imágenes en el centro"
        ],
        correcta: 2
    },
    {
        pregunta: "¿Qué formato permite guardar imágenes con transparencia?",
        opciones: [
            "JPG",
            "MP3",
            "TXT",
            "PNG"
        ],
        correcta: 3
    },
    {
        pregunta: "¿Qué es el espacio negativo en una composición?",
        opciones: [
            "El espacio libre que rodea o separa elementos",
            "Una imagen con colores oscuros",
            "Un error de impresión",
            "Una capa eliminada"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Para qué sirve una retícula en diseño?",
        opciones: [
            "Para modificar el brillo",
            "Para organizar y alinear elementos",
            "Para convertir archivos en PDF",
            "Para dibujar únicamente círculos"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué es un storyboard?",
        opciones: [
            "Una herramienta para mezclar colores",
            "Un tipo de archivo de audio",
            "Una secuencia de dibujos para planificar escenas",
            "Una técnica de impresión"
        ],
        correcta: 2
    },
    {
        pregunta: "¿Qué sucede al ampliar demasiado una imagen de mapa de bits?",
        opciones: [
            "Puede verse pixelada",
            "Se convierte automáticamente en vector",
            "Aumenta su resolución original",
            "Se transforma en una animación"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué es la saturación de un color?",
        opciones: [
            "La cantidad de píxeles",
            "El tamaño de una imagen",
            "La distancia entre letras",
            "La intensidad o pureza del color"
        ],
        correcta: 3
    },
    {
        pregunta: "¿Para qué se utilizan las capas en un programa de diseño?",
        opciones: [
            "Para disminuir la resolución",
            "Para organizar y editar elementos por separado",
            "Para imprimir sin tinta",
            "Para agregar sonido a una imagen"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué es la legibilidad de un texto?",
        opciones: [
            "La cantidad de colores que contiene",
            "El tamaño total del archivo",
            "La facilidad con la que se pueden distinguir y leer sus letras",
            "La cantidad de imágenes que lo acompañan"
        ],
        correcta: 2
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
