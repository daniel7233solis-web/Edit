
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
let heladeraAbierta = false;

let mensaje = '';
let mensajeHasta = 0;

let botones = {};
let escalaMundo = 1;
const controlTactil = { izquierda: false, derecha: false };

const objetos = [
    { nombre: 'Cama', x: 245, y: 310, w: 260, h: 170, accion: 'dormir' },
    { nombre: 'Bacha', x: 1095, y: 320, w: 135, h: 130, accion: 'lavar' },
    { nombre: 'Heladera', x: 1585, y: 205, w: 155, h: 280, accion: 'comer' },
    { nombre: 'Televisor', x: 2110, y: 260, w: 220, h: 135, accion: 'tele' },
    { nombre: 'Puerta', x: 2520, y: 180, w: 135, h: 305, accion: 'salir' }
];
function preload() {
    preloadMascota();
}
function setup() {
    cargarMascota();
    const destino = document.getElementById('escenario');
    const lienzo = createCanvas(900, 550);
    if (destino) lienzo.parent(destino);
    pixelDensity(1);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    textFont('Arial');
    ajustarLienzo();
    configurarControlesTactiles();
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
    background(C.crema);
    escalaMundo = height / CASA.alto;

    if (!jugando) {
        dibujarPortada();
        return;
    }

    if (lugarActual === 'mapa') {
        dibujarMapa();
        dibujarIndicacionMapa();
        return;
    }

    if (!actividadActiva) actualizarMovimiento();

    // El escenario mantiene proporciones uniformes, sin estirarse ni quedar
    // encerrado en los 900 x 550 px que antes dejaban márgenes enormes.
    const anchoVisible = width / escalaMundo;
    const objetivo = constrain(
        personaje.x - anchoVisible * .43,
        0, Math.max(0, CASA.ancho - anchoVisible)
    );
    camaraX = lerp(camaraX, objetivo, .075);

    push();
    scale(escalaMundo);
    translate(-camaraX, 0);
    dibujarCasa();
    dibujarPersonaje();
    pop();

    dibujarInterfaz();
    if (actividadActiva) dibujarActividad();
}

function actualizarMovimiento() {
    let direccion = 0;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW) || controlTactil.izquierda) direccion--;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW) || controlTactil.derecha) direccion++;

    const velocidadObjetivo = direccion * 2.85;
    personaje.velocidad = lerp(personaje.velocidad,
        velocidadObjetivo, direccion ? .15 : .20);
    if (abs(personaje.velocidad) < .06) personaje.velocidad = 0;
    personaje.x = constrain(personaje.x + personaje.velocidad, 45, CASA.ancho - 45);
    const intensidadObjetivo = Math.min(1, Math.abs(personaje.velocidad) / 2.7);
    personaje.intensidad = lerp(personaje.intensidad, intensidadObjetivo, .18);
    personaje.caminando = personaje.intensidad > .035;
    // Cada ciclo corresponde a pasos tranquilos y no a una carrera.
    if (personaje.intensidad > .025) personaje.fase += .075 + Math.abs(personaje.velocidad) * .039;
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
    arc(x + w / 2, y + h + 5, w + 50, 110, PI, TWO_PI);

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

    fill('#fff4ae70');
    ellipse(x, 125, 125, 30);
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
    caja(330, 110, 175, 12, C.madera);

    for (let i = 0; i < 5; i++) {
        fill([C.azul, C.rosa, C.amarillo, C.verde][i % 4]);
        rect(346 + i * 24, 72, 20, 38, 3);
    }

    // Alfombra
    noStroke();
    fill('#c4dfb6');
    ellipse(440, 484, 610, 45);

    fill('#eaf6de');
    ellipse(440, 484, 520, 26);

    // Cama
    caja(225, 290, 285, 175, C.maderaOscura, 12);
    caja(241, 302, 252, 135, C.rosa, 12);

    caja(253, 313, 90, 53, '#fffdf7', 13);
    caja(354, 313, 90, 53, '#fffdf7', 13);

    noStroke();
    fill('#ffced8');
    rect(241, 382, 252, 55, 7);

    stroke('#fff9f0');
    strokeWeight(4);
    line(242, 393, 490, 393);

    caja(219, 265, 22, 204, C.madera, 8);
    caja(492, 265, 22, 204, C.madera, 8);

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

    // Reloj
    fill(C.crema);
    stroke(C.tinta);
    strokeWeight(3);
    circle(750, 72, 65);

    line(750, 72, 750, 53);
    line(750, 72, 764, 80);

    planta(105, 465, 0.8);
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

    // Repisa
    caja(2070, 110, 195, 12, C.madera);

    for (let i = 0; i < 6; i++) {
        noStroke();
        fill([C.rosa, C.verde, C.azul, C.amarillo][i % 4]);
        rect(2090 + i * 25, 76, 19, 34, 3);
    }

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

    // Televisor y mueble
    caja(2080, 393, 290, 82, C.madera);
    caja(2100, 260, 240, 136, C.tinta, 12);

    caja(
        2111, 272, 218, 109,
        tvEncendida ? '#bdeefa' : '#313e4b',
        7
    );

    if (tvEncendida) {
        noStroke();

        fill(C.amarillo);
        circle(2208 + sin(frameCount * 0.04) * 28, 324, 30);

        fill(C.rosa);
        rect(2152, 347, 118, 14, 7);

        fill('#ffffff70');
        quad(2125, 281, 2145, 281, 2200, 371, 2180, 371);
    }

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
    text('SALIR', 2593, 154);
    textStyle(NORMAL);
}

// ==========================================
// MISHI · SPRITES ORIGINALES ARTICULADOS
// ==========================================

function dibujarPersonaje() {
    push();
    noStroke();
    fill('#4d405135');
    ellipse(personaje.x, CASA.suelo + 3, 110, 12);

    // Los pies se apoyan siempre en el mismo suelo. Ni salto ni achatamiento
    // de cabeza/peluca al caminar. Sólo se espeja la dirección.
    translate(personaje.x, personaje.y);
    scale(personaje.mirando, 1);
    const escalaMishi = .28 * Math.min(1, Math.max(.64, width / 750));
    scale(escalaMishi);
    translate(-ANCHO / 2, -1195);
    dibujarMascota({ caminando: personaje.caminando,
        intensidad: personaje.intensidad, fase: personaje.fase });
    pop();
}


// ==========================================
// PANTALLA DE INICIO
// ==========================================

function dibujarPortada() {
    // Vista previa de la casa al tamaño REAL del escenario.
    push();
    scale(escalaMundo);
    dibujarCasa();
    pop();

    noStroke();
    fill('#ffffff90');
    rect(0, 0, width, height);

    const w = Math.min(width - 32, 515);
    const h = Math.min(height - 32, 325);
    const x = (width - w) / 2;
    const y = (height - h) / 2;
    fill('#fff9efed');
    stroke(C.rosa);
    strokeWeight(4);
    rect(x, y, w, h, 25);
    noStroke();
    fill(C.tinta);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(Math.min(61, w * .15));
    text('EDIT', width / 2, y + h * .26);
    textStyle(NORMAL);
    textSize(Math.min(21, w * .054));
    text('¡Bienvenido a tu casa!', width / 2, y + h * .43);
    textSize(Math.min(14, w * .033));
    text('Caminá con A/D o las flechas.', width / 2, y + h * .56);
    text('Elegí actividades e interactuá con el cursor.', width / 2, y + h * .65);

    botones.play = { x: width / 2 - Math.min(105, w * .25),
        y: y + h * .76, w: Math.min(210, w * .5), h: Math.min(54, h * .18) };
    boton(botones.play, '▶  JUGAR', C.azul);
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

function dibujarInterfaz() {
    noStroke();
    fill('#fff9efdc');
    rect(15, 14, Math.min(270, width * .48), 47, 15);
    fill(C.tinta);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(16);
    text('♡  La casa de Mishi', 29, 37);
    textStyle(NORMAL);

    botones.salir = { x: width - 155, y: 15, w: 139, h: 44 };
    boton(botones.salir, 'Salir', C.amarillo);

    // Barra inferior de actividades, inspirada en el ejemplo de interacción.
    const tipos = ['dormir', 'lavar', 'comer', 'tele'];
    const etiquetas = ['Dormir', 'Bañar', 'Comer', 'Jugar'];
    const iconos = ['☾', '✧', '🍎', '✦'];
    const total = Math.min(width - 24, 495);
    const separacion = 8;
    const tamanio = (total - separacion * 3) / 4;
    const xInicial = (width - total) / 2;
    const y = height - 80;
    botones.actividades = [];
    for (let i = 0; i < tipos.length; i++) {
        const b = { x: xInicial + i * (tamanio + separacion), y,
            w: tamanio, h: 66, tipo: tipos[i] };
        botones.actividades.push(b);
        stroke('#493d46');
        strokeWeight(2);
        fill([C.rosa, C.azul, C.naranja, C.verde][i]);
        rect(b.x, b.y, b.w, b.h, 16);
        noStroke();
        fill(C.tinta);
        textAlign(CENTER, CENTER);
        textSize(25);
        text(iconos[i], b.x + b.w / 2, b.y + 24);
        textStyle(BOLD);
        textSize(12);
        text(etiquetas[i], b.x + b.w / 2, b.y + 50);
        textStyle(NORMAL);
    }

    const cercano = objetos.find(o => Math.abs(personaje.x - (o.x + o.w / 2)) < 175);
    if (cercano) {
        fill('#fff9efe8');
        noStroke();
        const ancho = Math.min(width - 24, 340);
        rect((width - ancho) / 2, height - 131, ancho, 39, 12);
        fill(C.tinta);
        textAlign(CENTER, CENTER);
        textSize(14);
        text('Hacé clic en ' + cercano.nombre + ' para interactuar',
            width / 2, height - 111);
    }
    if (millis() < mensajeHasta) {
        noStroke();
        fill('#fff9eff5');
        const ancho = Math.min(width - 24, 470);
        rect((width - ancho) / 2, 77, ancho, 49, 14);
        fill(C.tinta);
        textAlign(CENTER, CENTER);
        textSize(15);
        text(mensaje, width / 2, 102);
    }
}

function dibujarIndicacionMapa() {
    noStroke();
    fill('#fff9efeb');
    rect(width / 2 - Math.min(210, width / 2 - 16), height - 69,
        Math.min(420, width - 32), 51, 14);
    fill(C.tinta);
    textAlign(CENTER, CENTER);
    textSize(15);
    text('Hacé clic en la casa para volver', width / 2, height - 44);
}

// ==========================================
// INTERACCIONES CON EL MOUSE
// ==========================================

function mousePressed() {
    if (actividadActiva) return presionarActividad();
    if (!jugando) {
        if (enBoton(botones.play)) jugando = true;
        return;
    }

    if (lugarActual === 'mapa') {
        if (mouseX >= 105 && mouseX <= 295 &&
            mouseY >= 148 && mouseY <= 350) {
            lugarActual = 'casa';
            personaje.x = 2450;
            personaje.velocidad = 0;
            camaraX = Math.max(0, CASA.ancho - width / escalaMundo);
        }
        return;
    }

    if (enBoton(botones.salir)) {
        jugando = false;
        return;
    }

    const actividadElegida = (botones.actividades || []).find(enBoton);
    if (actividadElegida) {
        iniciarActividad(actividadElegida.tipo);
        return;
    }

    const mundoX = mouseX / escalaMundo + camaraX;
    const mundoY = mouseY / escalaMundo;
    for (const objeto of objetos) {
        if (mundoX < objeto.x || mundoX > objeto.x + objeto.w ||
            mundoY < objeto.y || mundoY > objeto.y + objeto.h) continue;

        if (Math.abs(personaje.x - (objeto.x + objeto.w / 2)) > 175) {
            avisar('Acercate un poco más para interactuar.');
            return;
        }
        if (objeto.accion === 'salir') {
            lugarActual = 'mapa';
            personaje.velocidad = 0;
        } else {
            if (objeto.accion === 'comer') heladeraAbierta = !heladeraAbierta;
            iniciarActividad(objeto.accion);
        }
        return;
    }
}

function mouseDragged() {
    if (actividadActiva) {
        registrarMovimientoActividad();
        return false;
    }
}

function mouseReleased() {
    if (actividadActiva) return soltarActividad();
}

function touchMoved() {
    if (actividadActiva) {
        registrarMovimientoActividad();
        return false;
    }
}

function touchEnded() {
    if (actividadActiva) return soltarActividad();
}

function enBoton(b) {
    return b && mouseX >= b.x && mouseX <= b.x + b.w &&
        mouseY >= b.y && mouseY <= b.y + b.h;
}

function avisar(t) {
    mensaje = t;
    mensajeHasta = millis() + 2700;
}

function keyPressed() {
    if (keyCode === ESCAPE && actividadActiva) {
        actividadActiva = null;
        return false;
    }
    if ([LEFT_ARROW, RIGHT_ARROW, 32].includes(keyCode)) return false;
}
