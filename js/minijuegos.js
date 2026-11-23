/* EDIT · Juegos breves de campus. Cada edificio ofrece una actividad real.
 * Todos los minijuegos mantienen al usuario en el mismo recorrido.
 * La trivia original se conserva en trivia.html. */
let minijuegoActual = null;
function reaccionMishi(estado, textoPersonalizado = '') {
    const avatar = document.getElementById('miniMishiAvatar');
    const texto = document.getElementById('miniMishiTexto');

    if (!avatar || !texto) {
        return;
    }

    if (estado === 'inicio') {
        avatar.textContent = '🐱';
        texto.textContent = textoPersonalizado || '¡Vamos! Encontrá las parejas.';
    } else if (estado === 'bien') {
        avatar.textContent = '😺';
        texto.textContent = textoPersonalizado || '¡Muy bien! Seguís re bien.';
    } else if (estado === 'mal') {
        avatar.textContent = '😿';
        texto.textContent = textoPersonalizado || 'No pasa nada, probá otra vez.';
    } else if (estado === 'final') {
        avatar.textContent = '🎉';
        texto.textContent = textoPersonalizado || '¡Lo lograste! Estoy muy orgulloso.';
    }
}
function abrirMinijuegoActual() {
    const id = modalEdificioId;
    const ficha = document.getElementById('dialogoEdificio');
    if (ficha.open) ficha.close();
    if (id === 'historico') {
        window.location.href = 'trivia.html?desde=universidad';
        return;
    }
    const info = EDIFICIOS_UNM.find(e => e.id === id);
    if (!info) return;

    if (id === 'daract2') {
        iniciarEsquivarNotas();
        return;
    }

    const dlg = document.getElementById('dialogoJuego');
    document.getElementById('tituloJuego').textContent = info.juego;
    minijuegoActual = { id, pasos: 0, terminado: false, bloqueado: false, seleccion: [] };
    if (!dlg.open) dlg.showModal();
    if (id === 'dorrego') iniciarParejas();
    else if (id === 'daract1') iniciarFormas();
    else if (id === 'daract2') iniciarEstrellas();
    else if (id === 'laboratorios') iniciarMezclas();
}
function tableroJuego() { return document.getElementById('tableroJuego'); }
function mensajeJuego(t) { document.getElementById('mensajeJuego').textContent = t; }
function progresoJuego(actual, total) {
    document.getElementById('progresoJuego').textContent = actual + ' / ' + total;
}
function botonJuego(label, accion, clase = '') {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'pieza-mini ' + clase;
    b.textContent = label; b.addEventListener('click', accion); return b;
}
function finalizarJuego() {
    minijuegoActual.terminado = true;

    const board = tableroJuego();

    // Conservar a Mishi cuando termina el juego de memoria.
    const mishi = minijuegoActual.id === 'dorrego'
        ? board.querySelector('.mishi-laboratorio')
        : null;

    board.replaceChildren();


    if (mishi) {
        const mensajeMishi = mishi.querySelector('p');

        if (mensajeMishi) {
            mensajeMishi.textContent =
                '¡Lo logramos! ¡Encontraste todas las parejas!';
        }

        mishi.classList.remove('mishi-error', 'mishi-acierto');

        // Reiniciar la animación de festejo.
        void mishi.offsetWidth;
        mishi.classList.add('mishi-acierto');

        board.append(mishi);
    }
    const final = document.createElement('div'); final.className = 'mini-exito';
    final.textContent = '✦ ¡Lo lograste! ✦';
    tableroJuego().append(final);
    mensajeJuego('¡Terminaste el desafío! Podés volver al mapa o jugar otra vez.');
    const boton = document.createElement('button'); boton.type = 'button';
    boton.className = 'boton-vamos-jugar'; boton.textContent = '↻ Volver a jugar';
    boton.addEventListener('click', () => {
        const id = minijuegoActual.id;
        minijuegoActual = { id, pasos: 0, terminado: false, bloqueado: false, seleccion: [] };
        if (id === 'dorrego') iniciarParejas();
        else if (id === 'daract1') iniciarFormas();
        else if (id === 'daract2') iniciarEstrellas();
        else if (id === 'laboratorios') iniciarMezclas();
    });
    tableroJuego().append(boton);
}

function iniciarParejas() {

    const estado = minijuegoActual;

    // Grupos de tarjetas disponibles

    const grupos = [
        ['div', 'header', 'section', 'footer'],
        ['color', 'margin', 'padding', 'display'],
        ['createCanvas', 'background', 'ellipse', 'rect']
    ];

    // Elegimos palabras de HTML, CSS y p5.js.
    const grupoElegido = [
        grupos[0][Math.floor(Math.random() * grupos[0].length)],
        grupos[1][Math.floor(Math.random() * grupos[1].length)],
        grupos[2][Math.floor(Math.random() * grupos[2].length)]
    ];

    // La cuarta palabra se elige entre las restantes.
    const restantes = grupos.flat().filter(
        palabra => !grupoElegido.includes(palabra)
    );

    grupoElegido.push(
        restantes[Math.floor(Math.random() * restantes.length)]
    );




    // Duplicamos los símbolos para formar las parejas
    estado.cartas = [...grupoElegido, ...grupoElegido];

    // Mezclamos las tarjetas
    estado.cartas.sort(() => Math.random() - 0.5);

    estado.vistas = []; estado.acertadas = new Set();

    const board = tableroJuego();
    board.className = 'mini-tablero mini-memoria';
    board.replaceChildren();

    mensajeJuego('Encontrá las cuatro parejas iguales.');
    progresoJuego(0, 4);

    // Mostrar al Mishi personalizado.
    const mishi = crearMishiLaboratorio();

    mishi.mensaje.textContent =
        '¡Vamos! Encontrá las parejas de HTML, CSS y p5.js.';


    board.append(mishi.elemento);

    // Guardamos los botones de las tarjetas.
    const botones = [];

    estado.cartas.forEach((simbolo, i) => {

        const b = botonJuego('?', () => {
            if (minijuegoActual !== estado || estado.bloqueado || estado.acertadas.has(i) || estado.vistas.includes(i)) return;
            b.textContent = simbolo; b.classList.add('abierta'); estado.vistas.push(i);
            if (estado.vistas.length === 2) {
                const [a, z] = estado.vistas;
                if (estado.cartas[a] === estado.cartas[z]) {

                    mishi.mensaje.textContent = '¡Excelente! Encontraste una pareja.';

                    mishi.elemento.classList.remove('mishi-error');
                    mishi.elemento.classList.add('mishi-acierto');

                    estado.acertadas.add(a); estado.acertadas.add(z);
                    estado.vistas = [];
                    progresoJuego(estado.acertadas.size / 2, 4);
                    if (estado.acertadas.size === 8) finalizarJuego();
                } else {
                    mishi.mensaje.textContent =
                        '¡Ups! Esas palabras no coinciden. ¡Intentá otra vez!';

                    mishi.elemento.classList.remove('mishi-acierto');
                    mishi.elemento.classList.remove('mishi-error');

                    void mishi.elemento.offsetWidth;

                    mishi.elemento.classList.add('mishi-error');

                    estado.bloqueado = true;
                    window.setTimeout(() => {
                        if (minijuegoActual !== estado) return;

                        botones[a].textContent = '?';
                        botones[z].textContent = '?';

                        botones[a].classList.remove('abierta');
                        botones[z].classList.remove('abierta');

                        estado.vistas = []; estado.bloqueado = false;
                    }, 650);
                }
            }
        }); botones.push(b);
        board.appendChild(b);
    });
}


function iniciarFormas() {
    const estado = minijuegoActual;
    const board = tableroJuego();

    board.className = 'mini-tablero mini-formas';
    estado.pasos = 0;
    estado.bloqueado = false;

    // Banco de desafíos de Morfología
    const desafios = [
        {
            consigna: '¿Qué figura tiene tres lados?',
            respuesta: '▲'
        },
        {
            consigna: '¿Qué figura no tiene vértices?',
            respuesta: '●'
        },
        {
            consigna: '¿Qué figura tiene cuatro lados iguales y cuatro ángulos rectos?',
            respuesta: '■'
        },
        {
            consigna: '¿Cuál de estas figuras es un rombo?',
            respuesta: '◆'
        },
        {
            consigna: '¿Qué figura tiene cinco puntas?',
            respuesta: '★'
        },
        {
            consigna: '¿Qué sigue? ● → ▲ → ● → ▲ → ?',
            respuesta: '●'
        },
        {
            consigna: 'Completá: ■ → ◆ → ■ → ◆ → ?',
            respuesta: '■'
        },
        {
            consigna: '¿Qué falta? ★ → ● → ▲ → ★ → ● → ?',
            respuesta: '▲'
        },
        {
            consigna: '¿Qué sigue? ▲ → ▲ → ● → ▲ → ▲ → ?',
            respuesta: '●'
        },
        {
            consigna: 'Completá: ◆ → ■ → ★ → ◆ → ■ → ?',
            respuesta: '★'
        },
        {
            consigna: '¿Qué sigue? ● → ● → ■ → ● → ● → ?',
            respuesta: '■'
        },
        {
            consigna: 'Completá: ★ → ◆ → ▲ → ★ → ◆ → ?',
            respuesta: '▲'
        },
        {
            consigna: '¿Qué falta? ■ → ● → ● → ■ → ● → ?',
            respuesta: '●'
        },
        {
            consigna: '¿Qué sigue? ▲ → ◆ → ▲ → ◆ → ?',
            respuesta: '▲'
        },
        {
            consigna: 'Completá: ★ → ★ → ◆ → ★ → ★ → ?',
            respuesta: '◆'
        },
        {
            consigna: '¿Qué sigue? ● → ■ → ▲ → ● → ■ → ?',
            respuesta: '▲'
        },
        {
            consigna: '¿Qué falta? ◆ → ★ → ● → ◆ → ★ → ?',
            respuesta: '●'
        },
        {
            consigna: 'Completá: ■ → ▲ → ◆ → ■ → ▲ → ?',
            respuesta: '◆'
        },
        {
            consigna: '¿Qué sigue? ▲ → ● → ★ → ▲ → ● → ?',
            respuesta: '★'
        },
        {
            consigna: '¿Qué falta? ◆ → ◆ → ■ → ◆ → ◆ → ?',
            respuesta: '■'
        }
    ];

    // Mezclar las consignas
    const desafiosMezclados = [...desafios];

    for (let i = desafiosMezclados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        const temporal = desafiosMezclados[i];
        desafiosMezclados[i] = desafiosMezclados[j];
        desafiosMezclados[j] = temporal;
    }

    // Elegir 10 desafíos por partida
    desafiosMezclados.splice(10);

    const figuras = ['●', '▲', '■', '◆', '★'];

    progresoJuego(0, desafiosMezclados.length);

    function mostrarDesafio() {
        board.replaceChildren();

        const desafio = desafiosMezclados[estado.pasos];

        // Mostrar al Mishi personalizado
        const mishi = crearMishiLaboratorio();

        mishi.mensaje.textContent =
            '¡Vamos! Observá las figuras y elegí la respuesta.';

        board.append(mishi.elemento);
        const botones = [];
        mensajeJuego(desafio.consigna);

        // Mezclar posiciones de las respuestas
        const opciones = [...figuras];

        for (let i = opciones.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            const temporal = opciones[i];
            opciones[i] = opciones[j];
            opciones[j] = temporal;
        }

        opciones.forEach(figura => {
            const boton = botonJuego(figura, () => {
                if (estado.bloqueado || estado.terminado) {
                    return;
                }

                if (figura === desafio.respuesta) {
                    estado.bloqueado = true;
                    boton.classList.add('acertada');

                    mensajeJuego('¡Muy bien! ¡Respuesta correcta!');

                    mishi.mensaje.textContent =
                        '¡Excelente! ¡Descubriste la figura!';

                    mishi.elemento.classList.remove('mishi-error');
                    mishi.elemento.classList.add('mishi-acierto');

                    window.setTimeout(() => {
                        if (minijuegoActual !== estado ||
                            estado.terminado) {
                            return;
                        }

                        estado.pasos++;

                        progresoJuego(
                            estado.pasos,
                            desafiosMezclados.length
                        );

                        if (estado.pasos === desafiosMezclados.length) {
                            finalizarJuego();
                        } else {
                            estado.bloqueado = false;
                            mostrarDesafio();
                        }
                    }, 1200);

                } else {
                    mensajeJuego(
                        '¡Esa no es! Observá nuevamente las figuras.'
                    );

                    mishi.mensaje.textContent =
                        '¡No pasa nada! Intentemos otra vez.';

                    mishi.elemento.classList.remove('mishi-acierto');
                    mishi.elemento.classList.remove('mishi-error');

                    // Reiniciar la animación de error
                    void mishi.elemento.offsetWidth;

                    mishi.elemento.classList.add('mishi-error');
                }
            });

            board.append(boton);
        });
    }

    mostrarDesafio();
}


function iniciarEstrellas() {
    const estado = minijuegoActual, board = tableroJuego();
    board.className = 'mini-tablero mini-estrellas'; board.replaceChildren();
    mensajeJuego('Encontrá las cinco estrellas en orden, del 1 al 5.'); progresoJuego(0, 5);
    [4, 2, 5, 1, 3].forEach(n => {
        const b = botonJuego('★ ' + n, () => {
            if (estado.terminado || b.disabled) return;
            if (n !== estado.pasos + 1) { mensajeJuego('Buscá primero la estrella ' + (estado.pasos + 1) + '.'); return; }
            estado.pasos++; b.disabled = true; b.classList.add('acertada');
            progresoJuego(estado.pasos, 5); mensajeJuego('¡Estrella encontrada!');
            if (estado.pasos === 5) finalizarJuego();
        }); board.appendChild(b);
    });
}

function crearFrasco(color) {
    const frasco = document.createElement('span');
    frasco.className = 'frasco-mini';

    const liquido = document.createElement('span');
    liquido.className = 'liquido-mini';
    liquido.style.setProperty('--color-liquido', color);

    frasco.append(liquido);

    return frasco;
}

function crearMishiLaboratorio() {
    const ayudante = document.createElement('div');
    ayudante.className = 'mishi-laboratorio';

    const imagen = document.createElement('img');
    imagen.alt = 'Mishi, ayudante del laboratorio';

    // Capturamos al Mishi personalizado con p5.js
    const alto = 190;
    const ancho = Math.ceil(alto * ANCHO / ALTO);

    push();
    clear();
    scale(alto / ALTO);
    dibujarMascota({
        caminando: false,
        intensidad: 0,
        fase: 0
    });
    pop();

    const captura = get(0, 0, ancho, alto);
    imagen.src = captura.canvas.toDataURL('image/png');

    const mensaje = document.createElement('p');
    mensaje.textContent = '¡Hola! Soy Mishi. ¡Vamos a experimentar con los colores!';

    ayudante.append(imagen, mensaje);

    return {
        elemento: ayudante,
        mensaje: mensaje
    };
}


function iniciarMezclas() {
    const estado = minijuegoActual;
    const board = tableroJuego();

    board.className = 'mini-tablero mini-mezclas';
    estado.pasos = 0;


    const rondas = [
        {
            color: 'verde',
            par: ['amarillo', 'azul'],
            muestra: '#77c88a',
            opciones: ['rojo', 'azul', 'amarillo', 'blanco']
        },
        {
            color: 'violeta',
            par: ['rojo', 'azul'],
            muestra: '#bba1ea',
            opciones: ['rojo', 'azul', 'verde', 'amarillo']
        },
        {
            color: 'naranja',
            par: ['rojo', 'amarillo'],
            muestra: '#ffc16b',
            opciones: ['azul', 'amarillo', 'rojo', 'verde']
        },
        {
            color: 'rosa',
            par: ['rojo', 'blanco'],
            muestra: '#faa4b5',
            opciones: ['rojo', 'blanco', 'azul', 'amarillo']
        },
        {
            color: 'celeste',
            par: ['azul', 'blanco'],
            muestra: '#bcecf5',
            opciones: ['amarillo', 'azul', 'blanco', 'rojo']
        },
        {
            color: 'verde claro',
            par: ['verde', 'blanco'],
            muestra: '#b7e5a0',
            opciones: ['verde', 'violeta', 'blanco', 'azul']
        },
        {
            color: 'coral',
            par: ['naranja', 'rosa'],
            muestra: '#f6a18e',
            opciones: ['rosa', 'azul', 'naranja', 'verde']
        },
        {
            color: 'turquesa',
            par: ['azul', 'verde'],
            muestra: '#54c6b5',
            opciones: ['verde', 'rojo', 'azul', 'blanco']
        },

        {
            color: 'lila',
            par: ['violeta', 'blanco'],
            muestra: '#d9c1f1',
            opciones: ['violeta', 'amarillo', 'blanco', 'rojo']
        },
        {
            color: 'verde lima',
            par: ['verde', 'amarillo'],
            muestra: '#b6d96c',
            opciones: ['verde', 'azul', 'amarillo', 'rosa']
        },
        {
            color: 'durazno',
            par: ['naranja', 'blanco'],
            muestra: '#ffd0a6',
            opciones: ['naranja', 'violeta', 'blanco', 'verde']
        },
        {
            color: 'rosa claro',
            par: ['rosa', 'blanco'],
            muestra: '#ffd8e3',
            opciones: ['rosa', 'azul', 'blanco', 'amarillo']
        },
        {
            color: 'azul oscuro',
            par: ['azul', 'negro'],
            muestra: '#355888',
            opciones: ['azul', 'blanco', 'negro', 'verde']
        },
        {
            color: 'verde oscuro',
            par: ['verde', 'negro'],
            muestra: '#376f4a',
            opciones: ['verde', 'amarillo', 'negro', 'rosa']
        },
        {
            color: 'gris',
            par: ['blanco', 'negro'],
            muestra: '#a9a9ae',
            opciones: ['blanco', 'rojo', 'negro', 'amarillo']
        },
        {
            color: 'amarillo claro',
            par: ['amarillo', 'blanco'],
            muestra: '#fff5b2',
            opciones: ['amarillo', 'verde', 'blanco', 'violeta']
        }

    ];



    const tintes = {
        negro: '#33333d',
        rojo: '#ef7185',
        azul: '#73c2ea',
        amarillo: '#ffe273',
        blanco: '#ffffff',
        verde: '#77c88a',
        violeta: '#bba1ea',
        naranja: '#ffc16b',
        rosa: '#faa4b5'
    };


    const mezclasPartida = [...rondas]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

    progresoJuego(0, mezclasPartida.length);

    function ronda() {
        board.replaceChildren();
        estado.seleccion = [];

        // Mishi acompaña el experimento
        const mishi = crearMishiLaboratorio();
        board.append(mishi.elemento);

        const r = mezclasPartida[estado.pasos];

        mensajeJuego('Mezclá dos frascos para conseguir el color de la muestra.');



        // Frasco de muestra
        const muestra = document.createElement('div');
        muestra.className = 'muestra-objetivo';

        const titulo = document.createElement('span');
        titulo.textContent = 'Muestra: ' + r.color;



        muestra.append(titulo, crearFrasco(r.muestra));
        board.append(muestra);

        // Recipiente donde se mezclan los líquidos
        const zonaMezcla = document.createElement('div');
        zonaMezcla.className = 'zona-mezcla';

        const tituloMezcla = document.createElement('span');
        tituloMezcla.textContent = 'Tu mezcla';

        // Primero creamos el tubo
        const tuboMezcla = crearFrasco('#e8f8ff');
        tuboMezcla.classList.add('tubo-mezcla');

        // Después obtenemos su líquido
        const liquidoMezcla = tuboMezcla.querySelector('.liquido-mini');

        // Permitimos comenzar una nueva mezcla
        estado.bloqueado = false;

        zonaMezcla.append(tituloMezcla, tuboMezcla);
        board.append(zonaMezcla);


        // Mezclar aleatoriamente las posiciones de los tubos
        const opcionesMezcladas = [...r.opciones];

        for (let i = opcionesMezcladas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            const temporal = opcionesMezcladas[i];
            opcionesMezcladas[i] = opcionesMezcladas[j];
            opcionesMezcladas[j] = temporal;
        }

        // Crear los tubos en el nuevo orden
        opcionesMezcladas.forEach(nombre => {
            const tono = tintes[nombre];


            const boton = botonJuego(nombre, () => {
                // No permitir más selecciones mientras se mezcla
                if (estado.bloqueado || estado.seleccion.includes(nombre)) {
                    return;
                }

                estado.seleccion.push(nombre);
                boton.classList.add('acertada');

                // Primer líquido seleccionado
                if (estado.seleccion.length === 1) {
                    liquidoMezcla.style.background = tono;
                    liquidoMezcla.style.height = '32%';

                    mensajeJuego('¡Primer color agregado! Elegí el segundo tubo.');
                }

                // Segundo líquido seleccionado
                if (estado.seleccion.length === 2) {
                    estado.bloqueado = true;

                    const correcto = r.par.every(color =>
                        estado.seleccion.includes(color)
                    );

                    // Mostramos el resultado de la mezcla
                    liquidoMezcla.style.background = correcto
                        ? r.muestra
                        : '#9b8e91';

                    liquidoMezcla.style.height = '62%';



                    if (correcto) {
                        mensajeJuego('¡Excelente! ¡Conseguiste el color de la muestra!');

                        mishi.mensaje.textContent =
                            '¡Lo logramos! ¡Qué buen experimento!';

                        mishi.elemento.classList.add('mishi-acierto');
                    } else {
                        mensajeJuego('¡La mezcla no coincide! Intentá nuevamente.');

                        mishi.mensaje.textContent =
                            '¡Ups! Probemos con otros colores.';

                        mishi.elemento.classList.add('mishi-error');
                    }



                    // Dejamos que el jugador vea el resultado
                    window.setTimeout(() => {
                        if (minijuegoActual !== estado || estado.terminado) {
                            return;
                        }

                        if (correcto) {
                            estado.pasos++;
                            progresoJuego(estado.pasos, mezclasPartida.length);

                            if (estado.pasos === mezclasPartida.length) {
                                finalizarJuego();
                            } else {
                                ronda();
                            }
                        } else {
                            estado.seleccion = [];
                            estado.bloqueado = false;

                            liquidoMezcla.style.height = '0%';

                            board.querySelectorAll('.tinte-mini').forEach(b => {
                                b.classList.remove('acertada');
                            });
                        }
                    }, 1500);
                }
            }, 'tinte-mini');


            boton.replaceChildren();

            boton.append(crearFrasco(tono));

            const etiqueta = document.createElement('span');
            etiqueta.textContent = nombre;

            boton.append(etiqueta);
            board.append(boton);
        });
    }

    ronda();
}


document.getElementById('cerrarModalEdificio')?.addEventListener('click', () => {
    const ficha = document.getElementById('dialogoEdificio');
    if (ficha.open) ficha.close();
});
document.getElementById('irMinijuego')?.addEventListener('click', abrirMinijuegoActual);
document.getElementById('cerrarDialogoJuego')?.addEventListener('click', () => {
    minijuegoActual = null; document.getElementById('dialogoJuego').close();
});
