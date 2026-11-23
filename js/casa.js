
/* EDIT · Casa explorable · p5.js 1.x
   A/D o flechas: caminar · Mouse: interactuar
   Las actividades del juego requieren interacción real con el cursor.
*/

const CASA = {
    ancho: 2700,
    alto: 550,
    vista: 900,
    suelo: 485
};

const C = {
    tinta: '#493d46',
    madera: '#d8a777',
    maderaOscura: '#aa795f',
    crema: '#fff9ed',
    rosa: '#FAA4B5',
    naranja: '#F8B77C',
    amarillo: '#FFF183',
    azul: '#70C1E1',
    verde: '#82BA88',
    dormitorio: '#e3f2dc',
    cocina: '#fff5cc',
    living: '#e6f5fc',
    piso: '#dcb58f'
};

let personaje = {
    x: 160,
    y: CASA.suelo,
    velocidad: 0,
    mirando: 1,
    caminando: false,
    intensidad: 0,
    fase: 0
};


let camaraX = 0;
let jugando = false;
let lugarActual = 'casa';

let tvEncendida = false;
let tvConSonido = false;
let heladeraAbierta = false;

let mensaje = '';
let mensajeHasta = 0;

let botones = {};
let escalaMundo = 1;
let objetoArrastrado = null;
const burbujasCasa = [];
// Indicadores livianos: las acciones cambian las necesidades de la mascota.
const NECESIDADES = { hambre: 78, higiene: 84, diversion: 70, sueno: 91 };
let ultimoCambioNecesidades = 0;
let ultimoMensaje = '';
let animacionEstrellasHasta = 0;
const OBJETO_COORDS = {
    jabon: {x:1167,y:327},
    manzana: {x:1340,y:324},
    cama: {x:370,y:327},
    tele: {x:2219,y:315},
    sentar: {x:1948,y:340},
    puerta: {x:2590,y:260}
};

const controlTactil = { izquierda: false, derecha: false };

const objetos = [
    { nombre: 'Cama', x: 245, y: 310, w: 260, h: 170, accion: 'dormir' },
    { nombre: 'Bacha', x: 1095, y: 320, w: 135, h: 130, accion: 'lavar' },
    { nombre: 'Heladera', x: 1585, y: 205, w: 155, h: 280, accion: 'comer' },
    { nombre: 'Televisor', x: 2110, y: 260, w: 220, h: 135, accion: 'tele' },
    { nombre: 'Puerta', x: 2520, y: 180, w: 135, h: 305, accion: 'salir' }
];
// Fuente instalada en el equipo; si no está, evitamos el serif por defecto
// de p5.js usando una alternativa redondeada y legible.
const FUENTES_EDIT = {};
const ROTULOS_INTERFAZ = {};
function precargarRotulos() {
    const recursos = {
        logo: 'img/portada/capas/edit 1.png',
        bienvenida: 'img/interfaz/bienvenida.png',
        jugar: 'img/interfaz/jugar.png',
        volver: 'img/interfaz/volver.png',
        universidad: 'img/interfaz/universidad.png',
        dorrego: 'img/interfaz/etiqueta_dorrego.png',
        daract1: 'img/interfaz/etiqueta_daract1.png',
        daract2: 'img/interfaz/etiqueta_daract2.png',
        laboratorios: 'img/interfaz/etiqueta_laboratorios.png'
    };
    for (const [clave, ruta] of Object.entries(recursos)) {
        ROTULOS_INTERFAZ[clave] = loadImage(ruta);
    }
}
// Dibujo de textos fijos en las fuentes originales, sin depender de las
// fuentes que tenga instaladas el visitante. El texto accesible permanece
// en los atributos del botón del HTML y en la documentación del proyecto.
function dibujarRotulo(rotulo, x, y, anchoMax, altoMax) {
    const img = ROTULOS_INTERFAZ[rotulo];
    if (!img || img.width <= 1 || img.height <= 1) return false;
    const factor = Math.min(anchoMax / img.width, altoMax / img.height);
    image(img, x - img.width * factor / 2, y - img.height * factor / 2,
        img.width * factor, img.height * factor);
    return true;
}
function fuenteEDIT(nombre) {
    if (FUENTES_EDIT[nombre]) return FUENTES_EDIT[nombre];
    const lienzo = document.createElement('canvas');
    const contexto = lienzo.getContext('2d');
    const frase = 'EDIT Mi mascota WW ii';
    contexto.font = '22px monospace';
    const base = contexto.measureText(frase).width;
    contexto.font = '22px "' + nombre + '", monospace';
    const medida = contexto.measureText(frase).width;
    FUENTES_EDIT[nombre] = Math.abs(base - medida) > .6 ? nombre : 'sans-serif';
    return FUENTES_EDIT[nombre];
}

function preload() {
    preloadMascota();
    precargarRotulos();
}
function setup() {
    cargarMascota();
    const destino = document.getElementById('escenario');
    if (new URLSearchParams(location.search).get('ir') === 'universidad') {
        jugando = true; lugarActual = 'mapa';
    }
    const lienzo = createCanvas(900, 550);
    if (destino) lienzo.parent(destino);
    pixelDensity(1);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    textFont(fuenteEDIT('Pulang'));
    // La fuente local puede terminar de cargarse después de setup().
    // Actualizar p5 cuando esté lista evita fijar el fallback inicial.
    if (document.fonts) {
        document.fonts.ready.then(() => {
            delete FUENTES_EDIT.Pulang;
            textFont(fuenteEDIT('Pulang'));
        });
    }
    ajustarLienzo();
    configurarControlesTactiles();
    if (window.ResizeObserver) {
        const observador = new ResizeObserver(() => ajustarLienzo());
        observador.observe(destino);
        window.addEventListener('pagehide', () => observador.disconnect(), { once: true });
    }
}

function ajustarLienzo() {
    const destino = document.getElementById('escenario');
    if (!destino) return;
    resizeCanvas(Math.max(300, Math.floor(destino.clientWidth)),
        Math.max(380, Math.floor(destino.clientHeight)));
    escalaMundo = height / CASA.alto;
}

function windowResized() {
    ajustarLienzo();
}

function configurarControlesTactiles() {
    for (const [selector, direccion] of [['#caminarIzquierda', 'izquierda'],
        ['#caminarDerecha', 'derecha']]) {
        const boton = document.querySelector(selector);
        if (!boton) continue;
        boton.addEventListener('pointerdown', evento => {
            evento.preventDefault();
            boton.setPointerCapture(evento.pointerId);
            controlTactil[direccion] = true;
        });
        const detener = () => { controlTactil[direccion] = false; };
        boton.addEventListener('pointerup', detener);
        boton.addEventListener('pointercancel', detener);
        boton.addEventListener('lostpointercapture', detener);
    }
}

function draw() {
    document.body.classList.toggle('juego-activo', jugando && lugarActual === 'casa');
    const destino = document.getElementById('escenario');
    if (destino && (Math.abs(destino.clientWidth-width)>1 ||
        Math.abs(destino.clientHeight-height)>1)) ajustarLienzo();
    background(C.crema);
    escalaMundo = height / CASA.alto;

    if ((!jugando || lugarActual !== 'casa') && (tvEncendida || tvConSonido)) {
        apagarTelevisor();
    }

    if (!jugando) {
        dibujarPortada();
        return;
    }

    if (lugarActual === 'mapa') {
        dibujarMapa();
        actualizarHoverMapa(mouseX, mouseY);
        return;
    }

    if (!objetoArrastrado && millis() > (personaje.durmiendoHasta || 0)) {
        actualizarMovimiento();
    }
    actualizarNecesidades();

    // El escenario mantiene proporciones uniformes, sin estirarse ni quedar
    // encerrado en los 900 x 550 px que antes dejaban márgenes enormes.
    const anchoVisible = width / escalaMundo;
    const objetivo = constrain(
        personaje.x - anchoVisible * .43,
        0, Math.max(0, CASA.ancho - anchoVisible)
    );
    camaraX = lerp(camaraX, objetivo, .11);

    push();
    scale(escalaMundo);
    translate(-camaraX, 0);
    dibujarCasa();
    dibujarPersonaje();
    if (personaje.sentado) dibujarFrenteSillon();
    pop();

    dibujarInterfaz();
    dibujarObjetoArrastrado();
    dibujarTooltipPuerta();
}

function actualizarMovimiento() {
    let direccion = 0;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW) || controlTactil.izquierda) direccion--;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW) || controlTactil.derecha) direccion++;

    if (direccion && personaje.sentado) {
        personaje.sentado = false;
        personaje.y = CASA.suelo;
    }
    const factorTiempo = constrain(deltaTime / (1000 / 60), .5, 2);
    const velocidadObjetivo = direccion * 3.8;
    const suavizado = 1 - Math.pow(direccion ? .78 : .75, factorTiempo);
    personaje.velocidad = lerp(personaje.velocidad, velocidadObjetivo, suavizado);
    if (abs(personaje.velocidad) < .06) personaje.velocidad = 0;
    personaje.x = constrain(personaje.x + personaje.velocidad * factorTiempo, 45, CASA.ancho - 45);
    const intensidadObjetivo = Math.min(1, Math.abs(personaje.velocidad) / 3.8);
    personaje.intensidad = lerp(personaje.intensidad, intensidadObjetivo,
        1 - Math.pow(.82, factorTiempo));
    personaje.caminando = personaje.intensidad > .035;
    if (personaje.intensidad > .025) {
        personaje.fase += (.075 + Math.abs(personaje.velocidad) * .039) * factorTiempo;
    }
    if (direccion) personaje.mirando = direccion;
}

function dibujarCasa() {
    noStroke();

    fill(C.dormitorio);
    rect(0, 0, 900, 485);

    fill(C.cocina);
    rect(900, 0, 900, 485);

    fill(C.living);
    rect(1800, 0, 900, 485);

    // Papel tapiz con pequeños detalles
    for (let x = 25; x < CASA.ancho; x += 75) {
        let color = x < 900
            ? '#c7e2c0'
            : x < 1800
                ? '#f4e4a7'
                : '#c8e8f4';

        fill(color);
        noStroke();

        for (let y = 30; y < 455; y += 80) {
            circle(x, y, 4);
            circle(x + 12, y + 9, 3);
            circle(x - 12, y + 9, 3);
        }
    }

    // Piso continuo
    fill('#fdf9f0');
    rect(0, 462, CASA.ancho, 23);

    fill(C.piso);
    rect(0, 485, CASA.ancho, 65);

    stroke('#c99b79');
    strokeWeight(2);

    for (let x = 0; x < CASA.ancho; x += 105) {
        line(x, 486, x - 30, 550);
    }

    line(0, 513, CASA.ancho, 513);
    noStroke();

    // Separación visual entre ambientes
    for (const x of [900, 1800]) {
        fill('#ffffff80');
        rect(x - 14, 0, 28, 460, 8);

        fill(C.maderaOscura);
        rect(x - 6, 0, 12, 460, 5);
    }

    dibujarDormitorio();
    dibujarCocina();
    dibujarLiving();
    dibujarIconosObjetos();
}

function caja(x, y, w, h, color, radio = 8) {
    stroke(C.tinta);
    strokeWeight(2.5);
    fill(color);
    rect(x, y, w, h, radio);
}

function ventana(x, y, w = 210, h = 175) {
    noStroke();
    fill('#ffffff70');
    rect(x - 13, y - 13, w + 26, h + 26, 12);

    caja(x, y, w, h, '#bdeafb', 9);

    noStroke();
    fill('#ffffffa8');
    ellipse(x + w * 0.75, y + 45, 80, 38);

    fill('#a7d3ac');
    // Fondo del paisaje dentro del marco: no debe tapar los bordes.
    push();
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(x + 2, y + 2, w - 4, h - 4);
    drawingContext.clip();
    arc(x + w / 2, y + h + 5, w + 50, 110, PI, TWO_PI);
    drawingContext.restore();
    pop();

    stroke('#fdf9f0');
    strokeWeight(12);
    line(x + w / 2, y, x + w / 2, y + h);
    line(x, y + h / 2, x + w, y + h / 2);

    noStroke();
    fill(C.verde);
    rect(x - 14, y - 5, 36, h * 0.72, 7);
    rect(x + w - 22, y - 5, 36, h * 0.72, 7);

    fill(C.madera);
    rect(x - 17, y + h - 2, w + 34, 12, 4);
}

function planta(x, y, esc = 1) {
    push();
    translate(x, y);
    scale(esc);

    stroke('#5d9767');
    strokeWeight(4);

    for (let i = -2; i <= 2; i++) {
        let sway = sin(frameCount * 0.018 + i) * 3;

        line(0, -12, sway + i * 15, -65 - abs(i) * 9);

        noStroke();
        fill(i % 2 ? '#9ed2a0' : C.verde);
        ellipse(sway + i * 15, -65 - abs(i) * 9, 29, 44);

        stroke('#5d9767');
        strokeWeight(4);
    }

    caja(-26, -35, 52, 38, C.naranja, 5);

    pop();
}

function lampara(x) {
    stroke(C.tinta);
    strokeWeight(2);
    line(x, 0, x, 58);

    noStroke();
    fill(C.amarillo);
    arc(x, 72, 95, 65, PI, TWO_PI, CHORD);

    // Sin óvalo de luz flotante: sólo queda la lámpara.
}

// ==========================================
// DORMITORIO
// ==========================================

function dibujarDormitorio() {
    ventana(575, 115, 210, 190);

    // Cuadro
    caja(55, 85, 120, 110, C.maderaOscura);

    noStroke();
    fill(C.rosa);
    rect(65, 95, 100, 90);

    fill(C.amarillo);
    circle(115, 136, 40);

    fill('#ffffffa0');
    ellipse(98, 123, 30, 16);

    // Repisa
    caja(330, 136, 175, 12, C.madera);

    for (let i = 0; i < 5; i++) {
        fill([C.azul, C.rosa, C.amarillo, C.verde][i % 4]);
        rect(346 + i * 24, 98, 20, 38, 3);
    }

    // Alfombra
    noStroke();
    fill('#c4dfb6');
    ellipse(440, 484, 610, 45);

    fill('#eaf6de');
    ellipse(440, 484, 520, 26);

    dibujarCama();

    // Mesa de luz
    caja(535, 376, 95, 94, C.madera, 7);
    caja(547, 394, 70, 28, C.crema, 5);

    fill(C.naranja);
    circle(582, 408, 7);

    stroke(C.tinta);
    line(582, 376, 582, 333);

    noStroke();
    fill(C.amarillo);
    arc(582, 333, 80, 65, PI, TWO_PI, CHORD);

    planta(105, 465, 0.8);
}

// La cama es una pieza independiente de p5.js. Mishi puede acostarse encima.
function dibujarCama() {
    // Cabecero, colchón, almohadas y manta. La pieza continúa siendo p5.js.
    // El extremo izquierdo es el cabecero y el derecho es el pie de cama.
    push();
    stroke('#6b4d61');
    strokeWeight(3.5);
    fill('#b9826c');
    rect(234, 302, 276, 162, 14);
    fill('#f9d7e3');
    rect(247, 320, 245, 121, 13);
    // Almohadas junto al cabecero.
    fill('#fffdf6');
    rect(257, 333, 85, 42, 17);
    rect(351, 333, 84, 42, 17);
    // Manta transversal: tapa la parte inferior del colchón.
    fill('#faa4b5');
    rect(247, 388, 245, 55, 8);
    stroke('#fffefa');strokeWeight(4);
    line(249, 391, 491, 391);
    // Cabecero alto, pie de cama bajo y patas sobre el suelo.
    stroke('#6b4d61');strokeWeight(3);
    fill('#f8b77c');
    rect(222, 280, 27, 191, 9);
    rect(491, 319, 21, 152, 9);
    noStroke();
    fill('#ffefc3');ellipse(234, 281, 17, 12);
    pop();
}

// ==========================================
// COCINA
// ==========================================

function dibujarCocina() {
    ventana(1040, 92, 185, 165);
    lampara(1420);

    // Alacenas
    caja(1260, 100, 280, 115, C.naranja);
    caja(1270, 110, 125, 95, C.crema);
    caja(1404, 110, 125, 95, C.crema);

    fill(C.azul);
    noStroke();
    rect(1380, 150, 8, 26, 4);
    rect(1409, 150, 8, 26, 4);

    // Mesada y bacha
    caja(1010, 355, 380, 124, C.madera);
    caja(1010, 343, 380, 22, '#f8e9d9');
    caja(1040, 369, 135, 85, C.crema);

    stroke(C.tinta);
    strokeWeight(4);
    noFill();

    arc(1105, 347, 50, 50, PI, TWO_PI);
    line(1130, 347, 1130, 358);

    noStroke();
    fill(C.azul);
    ellipse(1106, 366, 65, 8);

    for (let i = 0; i < 3; i++) {
        caja(1200, 370 + i * 30, 160, 24, C.naranja, 4);

        fill(C.crema);
        noStroke();
        rect(1270, 381 + i * 30, 24, 5, 3);
    }

    // Cocina y horno
    caja(1400, 315, 165, 165, '#eef3f6');
    caja(1415, 389, 134, 67, C.azul);

    stroke(C.tinta);
    strokeWeight(4);
    line(1415, 381, 1550, 381);

    for (let i = 0; i < 4; i++) {
        fill(C.naranja);
        stroke(C.tinta);
        circle(1427 + i * 38, 359, 15);
    }

    // Heladera
    caja(1580, 195, 165, 280, C.azul, 13);

    stroke('#4c8ca6');
    strokeWeight(3);
    line(1580, 310, 1745, 310);

    fill('#d7f5ff');
    noStroke();
    rect(1593, 211, 12, 88, 5);
    rect(1593, 325, 12, 110, 5);

    fill(C.crema);
    rect(1609, 270, 12, 37, 6);
    rect(1609, 332, 12, 37, 6);

    if (heladeraAbierta) {
        fill('#fffdf5bd');
        rect(1630, 316, 98, 140, 6);
    }

    planta(955, 470, 0.62);
}

// ==========================================
// LIVING
// ==========================================

function dibujarLiving() {
    ventana(1845, 110, 210, 185);
    lampara(2220);

    // Estante liviano y equilibrado: más bajo, sin libros recargados.
    caja(2095, 144, 154, 11, C.madera);

    // Alfombra
    noStroke();
    fill('#c4e8ef');
    ellipse(2235, 485, 570, 47);

    fill('#e6faff');
    ellipse(2235, 485, 490, 28);

    // Sofá
    caja(1840, 355, 215, 100, C.rosa, 18);
    caja(1855, 370, 88, 48, '#ffd7df', 13);
    caja(1950, 370, 88, 48, '#ffd7df', 13);
    caja(1833, 398, 23, 64, C.rosa, 8);
    caja(2042, 398, 23, 64, C.rosa, 8);

    // Televisor y mueble: antenas visibles detrás de la carcasa.
    caja(2080, 393, 290, 82, C.madera);
    stroke('#594368');
    strokeWeight(4);
    line(2190, 260, 2168, 240);
    line(2250, 260, 2272, 240);
    noStroke();
    fill('#FAA4B5');
    circle(2168, 240, 9);
    circle(2272, 240, 9);
    caja(2100, 260, 240, 136, C.tinta, 12);

    caja(
        2111, 272, 218, 109,
        tvEncendida ? '#bdeefa' : '#313e4b',
        7
    );

    if (tvEncendida) {
        const video = document.getElementById('videoTele');
        if (video && video.readyState >= 2 && !video.paused) {
            // El video REAL se dibuja dentro de la pantalla p5 sin un modal.
            push();
            drawingContext.save();
            drawingContext.beginPath();
            drawingContext.rect(2117, 278, 206, 98);
            drawingContext.clip();
            drawingContext.drawImage(video, 2117, 278, 206, 98);
            drawingContext.restore();
            pop();
        } else {
            noStroke();fill('#ddf0f7');rect(2117,278,206,98,7);
            fill(C.tinta);textAlign(CENTER,CENTER);textFont(fuenteEDIT('Pulang'));
            textSize(14);text('Cargando video...',2220,325);
        }
    }
    // Ícono de sonido situado EN EL TELEVISOR, no en la barra general.
    push();
    noStroke();fill('#fff9eedf');circle(2303,292,27);
    fill('#594368');rect(2296,289,4,6,2);
    triangle(2300,288,2305,285,2305,299);
    if (tvConSonido && tvEncendida) {
        noFill();stroke('#594368');strokeWeight(2);
        arc(2305,292,11,13,-HALF_PI,HALF_PI);
    } else {
        stroke('#de6787');strokeWeight(3);
        line(2308,289,2313,297);line(2313,289,2308,297);
    }
    pop();

    planta(2400, 469, 1.15);

    // Puerta de salida
    caja(2520, 180, 145, 304, C.maderaOscura, 10);
    caja(2533, 193, 119, 285, C.naranja, 7);
    caja(2550, 215, 86, 104, C.crema, 7);
    caja(2550, 336, 86, 104, C.crema, 7);

    noStroke();
    fill(C.amarillo);
    circle(2553, 335, 13);

    fill(C.verde);
    rect(2553, 140, 80, 27, 6);

    fill(C.tinta);
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);

    textStyle(NORMAL);
}

// ==========================================
// MISHI · SPRITES ORIGINALES ARTICULADOS
// ==========================================

// El almohadón frontal queda delante de las piernas mientras está sentado.
// Se dibuja sólo en esta pose, sin alterar el sillón ni la animación normal.
function dibujarFrenteSillon() {
    stroke('#6b4d61');
    strokeWeight(3);
    fill('#FAA4B5');
    rect(1851, 418, 193, 44, 9);
}

function dibujarPersonaje() {
    if (millis() < (personaje.durmiendoHasta || 0)) {
        push();
        translate(425, 352);
        rotate(-HALF_PI);
        scale(.195);
        translate(-ANCHO / 2, -995);
        dibujarMascota({caminando:false,intensidad:0,fase:0});
        pop();
        push();noStroke();fill('#78649a');textAlign(CENTER,CENTER);
        textSize(22);text('Z z z ♡',430,252 + sin(frameCount*.035)*4);pop();
        return;
    }
    push();
    noStroke();fill('#4d405126');
    ellipse(personaje.x, CASA.suelo + 3, 88, 12);
    let salto = 0;
    // Sólo salta al alimentarse, no durante la caminata normal.
    if (millis() < (personaje.saltoHasta || 0)) {
        const progreso = 1 - (personaje.saltoHasta - millis()) / 850;
        salto = -19 * Math.sin(Math.PI * Math.max(0,Math.min(1,progreso)));
    }
    if (personaje.sentado) {
        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(personaje.x - 170, 0, 340, 435);
        drawingContext.clip();
    }
    translate(personaje.x, personaje.y + salto);
    scale(personaje.mirando,1);
    const escalaMishi = .28 * Math.min(1,Math.max(.64,width/750));
    scale(escalaMishi);
    // Los zapatos terminan cerca de Y=1198 y los pies descalzos en Y=1187.
    // Un solapamiento leve con el piso evita la sensación de que flota.
    const basePies = estadoMascota.calzado === 'ninguno' ? 1182 : 1191;
    translate(-ANCHO / 2,-basePies);
    dibujarMascota({caminando:personaje.caminando,
        intensidad:personaje.intensidad,fase:personaje.fase,
        sentado:Boolean(personaje.sentado)});
    pop();
    if (personaje.sentado) drawingContext.restore();
    if (millis() < (personaje.saltoHasta || 0)) {
        noStroke();fill('#e981a9');textSize(18);textAlign(CENTER,CENTER);
        text('♡',personaje.x+45,personaje.y-230+sin(frameCount*.09)*6);
    }
}

function dibujarIconosObjetos() {
    const pulso=1+sin(frameCount*.055)*.06;
    for (const [id,p] of Object.entries(OBJETO_COORDS)) {
        if (id === 'tele' && tvEncendida) continue;
        if (id==='cama' && millis()<(personaje.durmiendoHasta||0)) continue;
        push();translate(p.x,p.y);scale(pulso);
        noStroke();fill('#fff7b0a8');circle(0,0,62);
        fill('#fff9f0');stroke('#997997');strokeWeight(2);
        circle(0,0,46);noStroke();
        if(id==='jabon') {
            fill('#8bdce5');rect(-15,-9,30,20,8);
            fill('#fff');circle(-4,-3,6);circle(7,-5,5);
        } else if(id==='manzana') {
            fill('#ed6b79');circle(0,5,27);
            fill('#81b582');ellipse(8,-10,15,8);stroke('#826757');strokeWeight(2);line(0,-7,2,-15);
        } else {
            fill('#725878');textAlign(CENTER,CENTER);textStyle(BOLD);textSize(25);
            text(id==='cama'?'☾':id==='sentar'?'▤':id==='tele'?'▶':'➜',0,-2);
        }
        pop();
    }
    for(let i=burbujasCasa.length-1;i>=0;i--){
        const b=burbujasCasa[i];
        if(millis()>b.hasta){burbujasCasa.splice(i,1);continue;}
        push();noFill();stroke('#a8eff6a5');strokeWeight(3);
        circle(b.x,b.y-(b.hasta-millis())*.015,b.r);
        pop();
    }
}
function dibujarObjetoArrastrado() {
    if(!objetoArrastrado)return;
    push();noStroke();
    const x=mouseX,y=mouseY;
    fill('#fff9f0ea');stroke('#95749a');strokeWeight(2);
    circle(x,y,50);noStroke();
    if(objetoArrastrado.tipo==='jabon') {
        fill('#7cd2df');rect(x-15,y-10,30,21,7);
        fill('#fff');circle(x-7,y-4,6);
    }else{
        fill('#e86275');circle(x,y+3,28);
        stroke('#659c76');strokeWeight(3);line(x,y-12,x+5,y-19);
    }
    pop();
}
function coordenadasMundo(x=mouseX,y=mouseY) {
    return {x:x/escalaMundo+camaraX,y:y/escalaMundo};
}
function estaSobreMishi(p) {
    return Math.abs(p.x-personaje.x)<64 && p.y>235 && p.y<490;
}
function objetoEnPunto(p) {
    for(const id of ['jabon','manzana']){
        const pos=OBJETO_COORDS[id];
        if(Math.hypot(p.x-pos.x,p.y-pos.y)<37)return id;
    }
    return null;
}
function dibujarTooltipPuerta() {
    const p=coordenadasMundo();
    const sobrePuerta=p.x>=2515&&p.x<=2670&&p.y>=175&&p.y<=480;
    const sobreSillon=p.x>=1840&&p.x<=2065&&p.y>=335&&p.y<=466;
    const iconos=Object.values(OBJETO_COORDS).some(o=>Math.hypot(p.x-o.x,p.y-o.y)<37);
    cursor(sobrePuerta||sobreSillon||iconos?HAND:ARROW);
    if(!sobrePuerta && !sobreSillon)return;
    const texto = sobrePuerta ? 'Ir a la universidad'
        : personaje.sentado ? 'Levantarse' : 'Sentarse a mirar la tele';
    const ancho = sobreSillon ? 194 : 164;
    const px=Math.min(width-ancho-9,Math.max(12,mouseX-ancho/2));
    const py=Math.max(13,mouseY-58);
    noStroke();fill('#fffaf2f5');rect(px,py,ancho,38,11);
    fill(C.tinta);textFont(fuenteEDIT('Pulang'));textAlign(CENTER,CENTER);textSize(14);
    text(texto,px+ancho/2,py+19);
}



// ==========================================
// PANTALLA DE INICIO
// ==========================================

function dibujarPortada() {
    push();
    scale(escalaMundo);
    dibujarCasa();
    pop();

    // Titulares de la interfaz realizados con los archivos originales de
    // Butterpop, Pulang y el logo dibujado de EDIT, sin fuentes del sistema.
    const logoAncho = Math.min(width * .36, 225);
    dibujarRotulo('logo', width / 2, height * .31, logoAncho, height * .14);
    if (!dibujarRotulo('bienvenida', width / 2, height * .43,
        Math.min(width * .80, 440), height * .12)) {
        textFont(fuenteEDIT('Pulang'));
        textAlign(CENTER,CENTER);fill('#42304f');textSize(22);
        text('¡Bienvenido a tu casa!', width/2, height * .43);
    }
    const anchoBoton = Math.min(width * .65, 240);
    botones.play = {x: width / 2 - anchoBoton / 2,
        y: height * .57, w: anchoBoton, h: Math.min(64, height * .105)};
    boton(botones.play, '', C.amarillo);
    if (!dibujarRotulo('jugar', width / 2, botones.play.y + botones.play.h/2,
        botones.play.w *.49, botones.play.h*.62)) {
        textFont(fuenteEDIT('Butterpop'));
        fill(C.tinta);textAlign(CENTER,CENTER);textSize(19);
        text('▶ JUGAR',width/2, botones.play.y+botones.play.h/2);
    }
    // El símbolo de play se dibuja aparte del rótulo.
    noStroke();fill(C.tinta);
    triangle(botones.play.x+22,botones.play.y+botones.play.h*.32,
        botones.play.x+22,botones.play.y+botones.play.h*.68,
        botones.play.x+39,botones.play.y+botones.play.h*.50);
    textFont(fuenteEDIT('Pulang'));
}

function boton(b, t, color) {
    stroke(C.tinta);
    strokeWeight(2);
    fill(color);
    rect(b.x, b.y, b.w, b.h, 15);

    noStroke();
    fill(C.tinta);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(19);

    text(t, b.x + b.w / 2, b.y + b.h / 2);

    textStyle(NORMAL);
}

// ==========================================
// INTERFAZ DEL JUEGO
// ==========================================
function obtenerNombreMascota() {
    try {
        const datos = JSON.parse(localStorage.getItem('edit_mascota') || '{}');

        return typeof datos.nombre === 'string' && datos.nombre.trim()
            ? datos.nombre.trim()
            : 'Mishi';

    } catch (error) {
        return 'Mishi';
    }
}
function actualizarNecesidades() {
    if (!ultimoCambioNecesidades) ultimoCambioNecesidades = millis();
    if (millis() - ultimoCambioNecesidades < 6000) return;
    ultimoCambioNecesidades = millis();
    for (const clave of Object.keys(NECESIDADES)) {
        NECESIDADES[clave] = Math.max(8, NECESIDADES[clave] - 1);
    }
}
function mejorarNecesidad(clave, cantidad) {
    NECESIDADES[clave] = Math.min(100, NECESIDADES[clave] + cantidad);
}
function dibujarInterfaz() {
    push();
    noStroke();
    const nombreMascota = obtenerNombreMascota();
    fill('#fff9efed');
    rect(12, 12, Math.min(300, width * .36), 49, 14);
    fill('#42304f');
    textFont(fuenteEDIT('Butterpop'));
    textAlign(LEFT, CENTER);
    textSize(Math.min(19, Math.max(13, width / 48)));
    text('♡  La casa de ' + nombreMascota, 24, 36);

    // Las barras cambian al comer, bañarse, jugar o dormir.
    const indicadores = [
        ['Hambre', '♥', 'hambre', C.naranja],
        ['Limpieza', '✦', 'higiene', C.azul],
        ['Diversión', '★', 'diversion', C.rosa],
        ['Sueño', '☾', 'sueno', C.verde]
    ];
    const ancho = width > 850 ? 120 : Math.max(56, (width - 20) / 4 - 5);
    const altura = width > 850 ? 47 : 39;
    const x0 = width > 850 ? width - (ancho + 7) * 4 - 6 : 8;
    const y0 = width > 850 ? 14 : 68;
    indicadores.forEach(([nombre, icono, clave, color], i) => {
        const x = x0 + i * (ancho + 7);
        fill('#fffdf9ed'); rect(x, y0, ancho, altura, 11);
        fill('#5a4566');textFont(fuenteEDIT('Pulang'));textSize(width > 850 ? 12 : 10);
        textAlign(LEFT, CENTER);text(icono + ' ' + nombre, x + 7, y0 + 13);
        fill('#eee5ee');rect(x + 7, y0 + altura - 17, ancho - 14, 9, 7);
        fill(color);rect(x + 7, y0 + altura - 17, (ancho - 14) * NECESIDADES[clave] / 100, 9, 7);
    });
    if (millis() < mensajeHasta) {
        textFont(fuenteEDIT('Pulang'));
        const anchoMensaje = Math.min(width - 24, 430);
        noStroke();fill('#fff9efee');
        rect((width-anchoMensaje)/2, 118, anchoMensaje, 43, 12);
        fill('#42304f');textAlign(CENTER,CENTER);textSize(15);
        text(mensaje, width / 2, 140);
    }
    pop();
}

// ==========================================
// INTERACCIONES CON EL MOUSE
// ==========================================

function mousePressed(evento) {
    const lienzo = document.querySelector('#escenario canvas');

    if (evento && evento.target !== lienzo) {
        return;
    }

    const dialogo = document.getElementById('dialogoEdificio');

    if (dialogo && dialogo.open) {
        return;
    }

    if (!jugando) {
        if(enBoton(botones.play)) jugando=true;
        return;
    }
    if(lugarActual==='mapa') {
        presionarMapa(mouseX,mouseY);
        return;
    }
    
    const p=coordenadasMundo();
    if(p.x>=2515 && p.x<=2670 && p.y>=175 && p.y<=480) {
        personaje.sentado = false;
        lugarActual='mapa';
        apagarTelevisor();
        window.EDITAudio?.actualizarEscena();
        personaje.velocidad=0;personaje.intensidad=0;
        return;
    }
    const objeto=objetoEnPunto(p);
    if(objeto){
        if(Math.abs(personaje.x-p.x)>300){
            avisar('Acercá a ' + obtenerNombreMascota() + ' al objeto para usarlo.');return;
        }
        objetoArrastrado={tipo:objeto,pasadas:0,ultimaPasada:0};
        if (objeto === 'jabon') reaccionarMascota('sorpresa', 900);
        return false;
    }
    if(p.x>=225&&p.x<=515 && p.y>=265&&p.y<=467){
        if(Math.abs(personaje.x-380)>320){
            avisar('Acercate a la cama para descansar.');return;
        }
        personaje.durmiendoHasta=millis()+4200;
        reaccionarMascota('dormir', 4200);
        mejorarNecesidad('sueno', 34);
        personaje.caminando=false;personaje.velocidad=0;personaje.intensidad=0;
        avisar(obtenerNombreMascota() + ' se acurrucó en su cama... Zzz');
        return false;
    }
    if (p.x>=2289 && p.x<=2319 && p.y>=277 && p.y<=307) {
        cambiarSonidoTele();
        return false;
    }
    // Tocar el sillón hace que Mishi se siente a mirar la televisión.
    // Las flechas para caminar lo vuelven a levantar.
    if (p.x >= 1840 && p.x <= 2065 && p.y >= 335 && p.y <= 466) {
        if (Math.abs(personaje.x - 1950) > 330) {
            avisar('Acercate al sillón para sentarte.');
            return false;
        }
        personaje.sentado = !personaje.sentado;
        personaje.velocidad = 0;
        personaje.intensidad = 0;
        personaje.caminando = false;
        if (personaje.sentado) {
            personaje.x = 1950;
            personaje.mirando = 1;
            reaccionarMascota('juego', 2000);
            avisar('¡' + obtenerNombreMascota() + ' se sentó a mirar la tele! Tocá las flechas para levantarte.');
        } else {
            avisar('¡' + obtenerNombreMascota() + ' se levantó!');
        }
        return false;
    }
    if (p.x>=2090 && p.x<=2345 && p.y>=257 && p.y<=398) {
        alternarVideoTele();
        return false;
    }

}
function mouseDragged() {
    if(!objetoArrastrado)return;
    const p=coordenadasMundo();
    if(objetoArrastrado.tipo==='jabon' && estaSobreMishi(p)){
        if(millis()-objetoArrastrado.ultimaPasada>125){
            objetoArrastrado.pasadas++;
            objetoArrastrado.ultimaPasada=millis();
            for(let i=0;i<4;i++)burbujasCasa.push({x:p.x+random(-35,35),
                y:p.y+random(-35,35),r:random(14,28),hasta:millis()+1200});
            if(objetoArrastrado.pasadas>=6){
                avisar('¡' + obtenerNombreMascota() + ' quedó reluciente! ✦');
                estadoMascota.saludo=1;
                reaccionarMascota('bano', 2300);
                mejorarNecesidad('higiene', 37);
                objetoArrastrado=null;
            }
        }
    }
    return false;
}
function mouseReleased() {
    if(!objetoArrastrado)return;
    const p=coordenadasMundo();
    if(objetoArrastrado.tipo==='manzana' && estaSobreMishi(p)){
        personaje.saltoHasta=millis()+850;
        reaccionarMascota('comer', 1750);
        mejorarNecesidad('hambre', 36);
        estadoMascota.saludo=1;
        avisar('¡Qué rica manzana! ♡');
    }else if(objetoArrastrado.tipo==='jabon' && objetoArrastrado.pasadas>0){
        avisar('¡Seguí pasando el jabón sobre ' + obtenerNombreMascota() + '!');
    }
    objetoArrastrado=null;
    return false;
}
function touchMoved(){return mouseDragged();}
function touchEnded(){return mouseReleased();}

function enBoton(b) {
    return b && mouseX >= b.x && mouseX <= b.x + b.w &&
        mouseY >= b.y && mouseY <= b.y + b.h;
}

function avisar(t) {
    mensaje = t;
    mensajeHasta = millis() + 2700;
}

function keyPressed() {
    if ([LEFT_ARROW, RIGHT_ARROW, 32].includes(keyCode)) return false;
}

// La televisión sólo existe mientras el jugador permanece en la casa.
// Apagada, no bloquea la pista de los minijuegos ni sigue reproduciendo audio.
function apagarTelevisor() {
    const video = document.getElementById('videoTele');
    if (video) {
        video.pause();
        video.muted = true;
        // La próxima vez que se encienda la TV comienza desde el inicio.
        if (video.readyState >= 1) video.currentTime = 0;
    }
    tvEncendida = false;
    tvConSonido = false;
    const boton = document.getElementById('volumenTeleAccesible');
    if (boton) boton.setAttribute('aria-label', 'Activar sonido del televisor');
    window.EDITAudio?.televisorConSonido(false);
}

// Reproduce el video dentro de la pantalla de p5.
// El sonido se activa sólo cuando se pulsa el parlante: en ese momento
// se pausa la música general, y se restaura al volver a mutear.
function alternarVideoTele() {
    const video = document.getElementById('videoTele');
    if (!video) return;
    if (tvEncendida) {
        apagarTelevisor();
        avisar('Apagaste el televisor.');
        return;
    }
    tvEncendida = true;
    tvConSonido = false;
    video.muted = true;
    window.EDITAudio?.televisorConSonido(false);
    if (!video.getAttribute('src')) {
        video.src = 'video/television.mp4';
    }
    video.play().catch(error => {
        console.warn('No se pudo iniciar la reproducción del video:', error);
        avisar('Tocá la televisión para reintentar el video.');
        apagarTelevisor();
    });
    reaccionarMascota('juego', 1500);
    mejorarNecesidad('diversion', 24);
    avisar('¡La tele está encendida! Tocá el parlante para activar el sonido.');
}
function cambiarSonidoTele() {
    const video = document.getElementById('videoTele');
    if (!video) return;
    if (!tvEncendida) {
        alternarVideoTele();
        return;
    }
    tvConSonido = !tvConSonido;
    video.muted = !tvConSonido;
    video.volume = .7;
    window.EDITAudio?.televisorConSonido(tvConSonido);
    const boton = document.getElementById('volumenTeleAccesible');
    if (boton) boton.setAttribute('aria-label',
        tvConSonido ? 'Silenciar televisor' : 'Activar sonido del televisor');
    avisar(tvConSonido ? 'Sonido de la tele activado. Música pausada.' :
        'Televisión silenciada.');
}
document.getElementById('volumenTeleAccesible')?.addEventListener('click', cambiarSonidoTele);
document.getElementById('videoTele')?.addEventListener('ended', apagarTelevisor);
window.addEventListener('pagehide', apagarTelevisor);
