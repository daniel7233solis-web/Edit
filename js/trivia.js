
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
    },
    {
        pregunta: "¿Qué función cumple HTML en una página web?",
        opciones: [
            "Definir la estructura y el contenido de la página",
            "Controlar únicamente las animaciones",
            "Modificar la velocidad del procesador",
            "Crear exclusivamente efectos visuales"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué atributo se utiliza en una etiqueta <link> para vincular un archivo CSS?",
        opciones: [
            "src",
            "href",
            "class",
            "rel"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué atributo utiliza normalmente la etiqueta <script> para cargar un archivo JavaScript externo?",
        opciones: [
            "href",
            "rel",
            "src",
            "style"
        ],
        correcta: 2
    },
    {
        pregunta: "¿Para qué se utiliza la etiqueta <script> en HTML?",
        opciones: [
            "Para definir el tamaño de las imágenes",
            "Para crear exclusivamente títulos",
            "Para establecer los colores de la página",
            "Para incorporar o vincular código JavaScript"
        ],
        correcta: 3
    },
    {
        pregunta: "¿Qué significa DOM?",
        opciones: [
            "Document Object Model",
            "Digital Output Method",
            "Design Order Mode",
            "Data Operation Module"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué permite hacer el DOM desde JavaScript?",
        opciones: [
            "Cambiar únicamente la resolución de la pantalla",
            "Acceder a elementos HTML y modificarlos",
            "Editar automáticamente todos los archivos CSS del proyecto",
            "Reemplazar el navegador"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Para qué se utiliza querySelector() en JavaScript?",
        opciones: [
            "Para crear un ciclo de repetición",
            "Para dibujar figuras geométricas",
            "Para seleccionar un elemento del documento mediante un selector",
            "Para cargar automáticamente una imagen"
        ],
        correcta: 2
    },
    {
        pregunta: "¿Qué sucede al utilizar textContent en un elemento del DOM?",
        opciones: [
            "Se modifica el tamaño de la pantalla",
            "Se cambia automáticamente su color",
            "Se elimina el archivo HTML",
            "Se accede o modifica el contenido textual del elemento"
        ],
        correcta: 3
    },
    {
        pregunta: "¿Qué función cumple setup() en p5.js?",
        opciones: [
            "Se ejecuta una vez al comenzar el sketch y permite inicializarlo",
            "Se ejecuta continuamente para dibujar cada fotograma",
            "Se ejecuta únicamente cuando se mueve el mouse",
            "Se utiliza exclusivamente para cerrar el canvas"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Cuál es la función principal de draw() en p5.js?",
        opciones: [
            "Crear el archivo HTML",
            "Ejecutarse repetidamente para producir el dibujo y las animaciones",
            "Cargar la biblioteca CSS",
            "Ejecutarse una sola vez al iniciar"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué sucede cuando se utiliza background() dentro de draw()?",
        opciones: [
            "Se modifica el tamaño del canvas",
            "Se agrega una nueva figura",
            "Se pinta el fondo y puede cubrir los dibujos del fotograma anterior",
            "Se detiene la ejecución de draw()"
        ],
        correcta: 2
    },
    {
        pregunta: "En p5.js, ¿qué representa la variable width?",
        opciones: [
            "La posición vertical del mouse",
            "La cantidad de fotogramas",
            "El color de fondo",
            "El ancho del canvas"
        ],
        correcta: 3
    },
    {
        pregunta: "¿Qué permite realizar un ciclo for en JavaScript?",
        opciones: [
            "Repetir instrucciones una determinada cantidad de veces o mientras se cumpla una condición",
            "Crear únicamente variables de texto",
            "Cambiar automáticamente el HTML",
            "Detener todas las funciones"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué sucede si una variable x vale 10 y ejecutamos x += 5?",
        opciones: [
            "x pasa a valer 5",
            "x pasa a valer 15",
            "x pasa a valer 50",
            "x permanece en 10"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué operador representa la condición lógica OR (O) en JavaScript?",
        opciones: [
            "&&",
            "!",
            "||",
            "==="
        ],
        correcta: 2
    },
    {
        pregunta: "¿Qué ocurre cuando se utiliza push() y luego pop() en p5.js?",
        opciones: [
            "Se elimina todo el canvas",
            "Se reinician todas las variables",
            "Se detiene el ciclo draw()",
            "Se guarda y restaura el estado de dibujo y las transformaciones"
        ],
        correcta: 3
    },
    {
        pregunta: "¿Para qué se utiliza translate() en p5.js?",
        opciones: [
            "Para desplazar el origen del sistema de coordenadas",
            "Para cambiar automáticamente el color",
            "Para borrar una figura",
            "Para detener las animaciones"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué permite utilizar keyIsDown() dentro de draw()?",
        opciones: [
            "Detectar exclusivamente el clic del mouse",
            "Comprobar si una tecla está presionada y generar acciones mientras lo está",
            "Cambiar el contenido de un archivo CSS",
            "Crear una nueva página HTML"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué sucede si dibujamos primero un rectángulo y después un círculo opaco encima en el mismo canvas?",
        opciones: [
            "El rectángulo desaparece completamente",
            "Ambas figuras se trasladan",
            "El círculo cubre la zona del rectángulo donde se superponen",
            "El canvas cambia de tamaño"
        ],
        correcta: 2
    },
    {
        pregunta: "¿Cuál es la diferencia entre modificar una variable de JavaScript y modificar un elemento del DOM?",
        opciones: [
            "No existe ninguna diferencia",
            "Modificar una variable siempre modifica el HTML",
            "El DOM solo puede utilizarse desde CSS",
            "Modificar una variable cambia un dato del programa, mientras que modificar el DOM puede cambiar lo que se representa en la página"
        ],
        correcta: 3
    }

];

let preguntasPartida = [];

function elegirPreguntas() {
    const mezcladas = [...preguntas];

    for (let i = mezcladas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        const temporal = mezcladas[i];
        mezcladas[i] = mezcladas[j];
        mezcladas[j] = temporal;
    }

    preguntasPartida = mezcladas.slice(0, 10);
}

elegirPreguntas();


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
    const datos = preguntasPartida[preguntaActual];
    document.querySelector('.trivia-juego')
        .classList.remove('terminada');
    respondida = false;

    progreso.textContent =
        `Pregunta ${preguntaActual + 1} de ${preguntasPartida.length}`;

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

    const correcta = preguntasPartida[preguntaActual].correcta;
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
        window.EDITAudio?.efecto('correcto', .33);
        resultado.textContent = '¡Muy bien! Respuesta correcta.';

        estadoMascota.saludo = 1;
        reaccionarMascota('feliz', 1650);
    } else {
        window.EDITAudio?.efecto('error', .33);
        resultado.textContent = '¡Casi! Seguí intentando.';

        sorpresaHasta = millis() + 650;
        reaccionarMascota(['triste', 'molesto', 'llorar'][preguntaActual % 3], 1750);
    }

    botonSiguiente.disabled = false;
}

function finalizarTrivia() {


    juegoTerminado = true;

    progreso.textContent = '¡Resultado final!';
    textoPregunta.textContent = '¡Completaste la trivia!';

    contenedorOpciones.replaceChildren();


    const total = preguntasPartida.length;

    const estrellas =
        '★'.repeat(puntos) +
        '☆'.repeat(total - puntos);

    let mensaje = '';

    if (puntos === total) {
        mensaje = '¡Excelente! ¡Respondiste todo correctamente!';
    } else if (puntos >= 7) {
        mensaje = '¡Muy bien! Tenés grandes conocimientos.';
    } else {
        mensaje = '¡Buen intento! Podés volver a jugar.';
    }

    resultado.textContent =
        `${estrellas}\n${puntos} de ${total} puntos\n${mensaje}`;

    document.querySelector('.trivia-juego')
        .classList.add('terminada');

    botonSiguiente.textContent = 'Volver a jugar';

    estadoMascota.saludo = 1;
    reaccionarMascota(puntos === total ? 'feliz' : puntos < 2 ? 'llorar' : 'juego', 2700);
}



botonSiguiente.addEventListener('click', () => {
    if (juegoTerminado) {
        preguntaActual = 0;
        puntos = 0;
        respondida = false;
        juegoTerminado = false;

        elegirPreguntas();
        mostrarPregunta();
        return;
    }

    if (!respondida) {
        return;
    }

    if (preguntaActual + 1 >= preguntasPartida.length) {
        finalizarTrivia();
        return;
    }

    preguntaActual++;
    mostrarPregunta();
});


mostrarPregunta();
