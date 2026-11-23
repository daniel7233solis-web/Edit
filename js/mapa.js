/* EDIT · Campus UNM ilustrado. Referencia espacial: mapas aportados por Iris.
 * Se dibuja directamente con p5.js; ningún mapa institucional es copiado.
 * Las posiciones mantienen Dorrego al noroeste, Daract I/II y laboratorios al
 * este, y el Edificio Histórico en el centro-sur del campus. */
const EDIFICIOS_UNM = [
    {
        id: 'dorrego', nombre: 'Dorrego',
        juego: 'Memoria de programación',
        descripcion: 'Encontrá las parejas de palabras relacionadas con HTML, CSS y p5.js.',
        color: '#eac6fa', techo: '#a37ac6', x: 233, y: 191, icono: '✿'
    },
    { id: 'daract1', nombre: 'Daract I', juego: 'Ordená las formas', descripcion: 'Repetí una secuencia de figuras.', color: '#b8e5ff', techo: '#77b4d3', x: 753, y: 188, icono: '◆' },

    {
        id: 'daract2',
        nombre: 'Daract II',
        juego: '¡Esquivá las malas notas!',
        descripcion: '¡Ayudá a Mishi a escapar de las malas notas! Corré, saltá los obstáculos y conseguí la mayor cantidad de puntos sin perder tus tres corazones. Usá ESPACIO o ↑ para saltar.',
        color: '#ffe0a7',
        techo: '#e9a470',
        x: 899,
        y: 317,
        icono: '📄'
    },

    { id: 'laboratorios', nombre: 'Laboratorios', juego: 'Laboratorio cromático', descripcion: 'Combiná colores para encontrar la mezcla.', color: '#c9edd9', techo: '#86bb9c', x: 968, y: 452, icono: '✦' },
    { id: 'historico', nombre: 'Edificio Histórico', juego: 'Trivia de diseño', descripcion: 'Poné a prueba tus conocimientos.', color: '#ffcfdf', techo: '#e29ab1', x: 487, y: 404, icono: '♡' }
];
let vistaMapa = { escala: 1, offsetX: 0, offsetY: 0, modoMovil: false };
let hoverEdificio = null;
let modalEdificioId = null;
let botonesMapa = {};

function situarEdificio(e) {
    if (!vistaMapa.modoMovil) return { x: e.x, y: e.y };
    const p = {
        dorrego: [168, 216], daract1: [448, 223], daract2: [452, 435],
        laboratorios: [465, 668], historico: [204, 520]
    };
    const a = p[e.id];
    return { x: a[0], y: a[1] };
}

function transformarMapa() {
    const movil = width < 680;
    const W = movil ? 620 : 1100;
    const H = movil ? 900 : 650;
    const escala = Math.min(width / W, height / H);
    vistaMapa = {
        escala, offsetX: (width - W * escala) / 2,
        offsetY: (height - H * escala) / 2, modoMovil: movil
    };
    return { W, H };
}

function posicionMapaPantalla(x, y) {
    return {
        x: vistaMapa.offsetX + x * vistaMapa.escala,
        y: vistaMapa.offsetY + y * vistaMapa.escala
    };
}

function coordenadaMapa(mx, my) {
    return {
        x: (mx - vistaMapa.offsetX) / vistaMapa.escala,
        y: (my - vistaMapa.offsetY) / vistaMapa.escala
    };
}

function dibujarMapa() {
    background('#d7f1ee');
    const { W, H } = transformarMapa();
    push();
    translate(vistaMapa.offsetX, vistaMapa.offsetY);
    scale(vistaMapa.escala);
    noStroke();
    fill('#8accc1');
    rect(0, 0, W, H, 34);
    // Cielo decorativo y terreno de campus.
    fill('#cbeff0');
    rect(0, 0, W, 104, 30);
    fill('#a8d895');
    rect(0, 90, W, H - 90, 38);
    fill('#83c8dc');
    beginShape();
    vertex(0, H * .71); bezierVertex(W * .18, H * .78, W * .10, H * .93, 0, H * .98);
    vertex(0, H); vertex(W * .21, H); bezierVertex(W * .08, H * .87, W * .28, H * .82, 0, H * .74);
    endShape(CLOSE);

    // Caminos conectan visualmente los cinco edificios en el parque.
    const caminos = vistaMapa.modoMovil ? [
        [[126, 835], [220, 721], [235, 575], [260, 375], [168, 260]],
        [[220, 721], [420, 680], [448, 484], [449, 274], [418, 223]],
        [[235, 575], [204, 520], [287, 420], [448, 435]]
    ] : [
        [[520, 610], [500, 510], [489, 410], [510, 265], [710, 195]],
        [[489, 410], [380, 334], [240, 230]],
        [[710, 195], [785, 265], [895, 333], [967, 457]],
        [[489, 410], [680, 460], [967, 457]]
    ];
    for (const puntos of caminos) {
        noFill(); stroke('#d6bd8c'); strokeWeight(44); strokeCap(ROUND); strokeJoin(ROUND);
        beginShape(); for (const [x, y] of puntos) vertex(x, y); endShape();
        stroke('#fff0c5'); strokeWeight(35);
        beginShape(); for (const [x, y] of puntos) vertex(x, y); endShape();
    }
    noStroke();
    // Árboles y flores con posiciones deterministas; no cambian entre frames.
    for (let i = 0; i < 32; i++) {
        const x = 34 + (i * 139 + Math.sin(i * 15) * 37) % (W - 68);
        const y = 120 + (i * 217) % (H - 152);
        const lejos = EDIFICIOS_UNM.every(e => {
            const v = situarEdificio(e);
            return Math.hypot(x - v.x, y - v.y) > 85;
        });
        if (!lejos) continue;
        fill('#bd905f'); rect(x - 5, y, 10, 25, 3);
        fill(i % 4 === 0 ? '#f2a6c2' : i % 3 === 0 ? '#73bd8d' : '#69ae7b');
        circle(x, y, 45 + (i % 3) * 5);
        fill('#ffffff55'); circle(x - 8, y - 9, 12);
    }
    for (let i = 0; i < 26; i++) {
        const x = 20 + (i * 97) % W, y = 135 + (i * 137) % (H - 150);
        fill(i % 2 ? '#ffceda' : '#fff1b0'); circle(x, y, 7);
        fill('#ffffffc9'); circle(x + 4, y - 3, 3);
    }
    // Fuente central como punto de referencia.
    if (!vistaMapa.modoMovil) dibujarFuente(515, 285, 1);
    else dibujarFuente(316, 346, .75);
    for (const e of EDIFICIOS_UNM) {
        const pos = situarEdificio(e);
        dibujarEdificioMapa(e, pos.x, pos.y);
    }
    // Caminito de vuelta a casa, también clickeable.
    botonesMapa.casa = vistaMapa.modoMovil
        ? { x: 42, y: H - 88, w: 178, h: 56 } : { x: 30, y: H - 86, w: 178, h: 56 };
    fill('#ffffffed'); stroke('#775b7d'); strokeWeight(2);
    rect(botonesMapa.casa.x, botonesMapa.casa.y, botonesMapa.casa.w, botonesMapa.casa.h, 16);
    noStroke(); fill('#624d65'); textStyle(BOLD); textAlign(CENTER, CENTER); textSize(20);
    text('⌂  Volver a casa', botonesMapa.casa.x + 89, botonesMapa.casa.y + 27);
    pop();
    // Encabezado superpuesto en pantalla, siempre legible.
    noStroke(); fill('#fffdf3ef'); rect(14, 12, Math.min(width - 28, 412), 58, 16);
    fill(C.tinta); textAlign(LEFT, CENTER); textStyle(BOLD);
    textSize(Math.min(24, Math.max(16, width / 24)));
    text('✿  Universidad Nacional de Moreno', 27, 40);
    textStyle(NORMAL);
    fill('#fffdf3ee'); rect(width / 2 - Math.min(width / 2 - 12, 235), height - 58, Math.min(width - 24, 470), 45, 15);
    fill(C.tinta); textAlign(CENTER, CENTER); textSize(Math.min(15, width / 27));
    text('Elegí un edificio para descubrir su minijuego', width / 2, height - 36);
}

function dibujarFuente(x, y, s) {
    push(); translate(x, y); scale(s); noStroke();
    fill('#e6ccaf'); ellipse(0, 4, 108, 57);
    fill('#65bfd7'); ellipse(0, -2, 97, 43);
    fill('#c5f4ff'); ellipse(0, -4, 56, 26);
    fill('#85cee4'); rect(-4, -56, 8, 48, 5); ellipse(0, -55, 28, 39);
    fill('#eafcff'); circle(-7, -45, 8); circle(8, -31, 6);
    pop();
}
function dibujarEdificioMapa(e, x, y) {
    const resaltado = hoverEdificio === e.id;
    push(); translate(x, y);
    if (resaltado) scale(1.055);
    noStroke(); fill('#34504242'); ellipse(0, 64, 157, 28);
    // Paredes, techo, puertas y ventanas inspirados en los recursos de EDIT.
    stroke('#675476'); strokeWeight(3.4);
    fill('#fff9ed'); rect(-75, -7, 150, 87, 12);
    fill(e.color); rect(-67, 4, 134, 70, 8);
    fill(e.techo);
    beginShape(); vertex(-87, -4); vertex(-65, -58); vertex(0, -86); vertex(66, -58); vertex(87, -4); endShape(CLOSE);
    fill('#fff2d9'); rect(-9, 26, 26, 48, 8);
    fill('#6ec1d8'); rect(-53, 20, 31, 32, 6); rect(31, 20, 31, 32, 6);
    stroke('#ffffffbc'); strokeWeight(2); line(-37, 22, -37, 49); line(46, 22, 46, 49);
    noStroke(); fill('#715577'); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(35); text(e.icono, 0, -42);
    fill('#fffdf4'); stroke(resaltado ? '#e396ac' : '#b99bb6'); strokeWeight(resaltado ? 4 : 2);
    rect(-87, 81, 174, 34, 14);
    noStroke(); fill('#594866'); textSize(e.id === 'historico' ? 15 : 19); text(e.nombre, 0, 98);
    if (resaltado) { noFill(); stroke('#fff4a8'); strokeWeight(5); circle(0, 6, 211); }
    pop();
}

function mapaElementoEn(x, y) {
    const m = coordenadaMapa(x, y);
    if (botonesMapa.casa && m.x >= botonesMapa.casa.x &&
        m.x <= botonesMapa.casa.x + botonesMapa.casa.w &&
        m.y >= botonesMapa.casa.y && m.y <= botonesMapa.casa.y + botonesMapa.casa.h) return 'casa';
    for (const e of EDIFICIOS_UNM) {
        const pos = situarEdificio(e);
        if (Math.abs(m.x - pos.x) < 94 && m.y >= pos.y - 93 && m.y <= pos.y + 120) return e.id;
    }
    return null;
}
function presionarMapa(mx, my) {
    const id = mapaElementoEn(mx, my);
    if (id === 'casa') {
        lugarActual = 'casa'; personaje.x = 2450; personaje.velocidad = 0;
        personaje.intensidad = 0;
        camaraX = Math.max(0, CASA.ancho - width / escalaMundo);
        return true;
    }
    if (id) abrirModalEdificio(id);
    return Boolean(id);
}
function actualizarHoverMapa(mx, my) {
    hoverEdificio = mapaElementoEn(mx, my);
    cursor(hoverEdificio ? HAND : ARROW);
}
function abrirModalEdificio(id) {
    const e = EDIFICIOS_UNM.find(item => item.id === id);
    const dialogo = document.getElementById('dialogoEdificio');
    if (!e || !dialogo) return;
    modalEdificioId = id;
    document.getElementById('nombreEdificio').textContent = e.nombre;
    document.getElementById('nombreMinijuego').textContent = e.juego;
    document.getElementById('descripcionMinijuego').textContent = e.descripcion;
    const img = document.getElementById('imagenMinijuego');
    img.src = 'img/minijuegos/' + id + '.png';
    img.alt = 'Vista previa de ' + e.juego;
    dialogo.showModal();
}
