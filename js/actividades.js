/* EDIT · Actividades con interacción real de cursor: no existen barras de estadísticas.
 * Se dibujan encima del escenario y no alteran la navegación ni la personalización. */
let actividadActiva = null;

const ACTIVIDADES = {
    dormir: { nombre: 'Hora de descansar', icono: '☾',
        instruccion: 'Mantené presionado y seguí las estrellas en orden.', color: '#f1d8ff' },
    lavar: { nombre: 'Baño de burbujas', icono: '✧',
        instruccion: 'Arrastrá el cursor por todas las burbujas.', color: '#c7f1ff' },
    comer: { nombre: 'Un bocadito rico', icono: '♥',
        instruccion: 'Arrastrá las tres manzanas hasta el corazón.', color: '#ffe8be' },
    tele: { nombre: 'Atrapá los destellos', icono: '✦',
        instruccion: 'Hacé clic en los destellos brillantes.', color: '#f9daed' }
};

const PUNTOS_ESTRELLAS = [[.14,.68],[.3,.28],[.47,.62],[.65,.23],[.84,.60]];
const PUNTOS_BURBUJAS = [[.11,.34],[.30,.72],[.43,.25],[.59,.63],[.77,.30],[.89,.72],[.22,.46],[.72,.84]];
const PUNTOS_DESTELLOS = [[.15,.60],[.31,.31],[.50,.70],[.68,.30],[.85,.57]];

function iniciarActividad(tipo) {
    if (!ACTIVIDADES[tipo]) return;
    actividadActiva = { tipo, progreso: 0, presionando: false, arrastrando: false,
        cursorX: 0, cursorY: 0, completada: false, marcadas: [] };
}

function medidasActividad() {
    const w = Math.min(width - 20, 620);
    const h = Math.min(height - 22, 430);
    const x = (width - w) / 2;
    const y = (height - h) / 2;
    return { x, y, w, h,
        area: { x: x + w * .095, y: y + h * .40, w: w * .81, h: h * .40 } };
}

function puntoArea(p, area) {
    return { x: area.x + p[0] * area.w, y: area.y + p[1] * area.h };
}

function dibujarActividad() {
    if (!actividadActiva) return;
    const a = actividadActiva;
    const info = ACTIVIDADES[a.tipo];
    const r = medidasActividad();
    push();
    noStroke();
    fill('#26162a9c');
    rect(0, 0, width, height);
    fill('#fffefb');
    stroke('#493d46');
    strokeWeight(2.5);
    rect(r.x, r.y, r.w, r.h, 25);
    noStroke();
    fill(info.color);
    rect(r.x + 6, r.y + 6, r.w - 12, 75, 19);
    fill(C.tinta);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(Math.min(23, r.w * .055));
    text(info.icono + '  ' + info.nombre, width / 2, r.y + 33);
    textStyle(NORMAL);
    textSize(Math.min(15, r.w * .031));
    text(info.instruccion, width / 2, r.y + 102);

    // Cierre accesible tanto antes como después de completar la actividad.
    fill('#fff');
    stroke('#b9a5bb');
    strokeWeight(1.8);
    circle(r.x + r.w - 27, r.y + 27, 33);
    noStroke();
    fill(C.tinta);
    textSize(22);
    text('×', r.x + r.w - 27, r.y + 25);

    if (a.completada) {
        fill('#e5f5df');
        stroke('#82ba88');
        strokeWeight(2);
        rect(r.x + 30, r.y + 145, r.w - 60, Math.max(120, r.h - 205), 23);
        noStroke();
        fill('#42764b');
        textStyle(BOLD);
        textSize(38);
        text('✦  ¡Muy bien!  ✦', width / 2, r.y + r.h * .56);
        textSize(17);
        text('¡Completaste la actividad!', width / 2, r.y + r.h * .69);
        textStyle(NORMAL);
        textSize(14);
        text('Hacé clic para volver a la casa', width / 2, r.y + r.h - 24);
        pop();
        return;
    }

    const area = r.area;
    if (a.tipo === 'dormir') {
        stroke('#cdb1de');
        strokeWeight(4);
        for (let i = 1; i < PUNTOS_ESTRELLAS.length; i++) {
            const anterior = puntoArea(PUNTOS_ESTRELLAS[i - 1], area);
            const siguiente = puntoArea(PUNTOS_ESTRELLAS[i], area);
            line(anterior.x, anterior.y, siguiente.x, siguiente.y);
        }
        PUNTOS_ESTRELLAS.forEach((p, i) => {
            const punto = puntoArea(p, area);
            noStroke();
            fill(i < a.progreso ? '#82ba88' : i === a.progreso ? '#ffd45b' : '#d9b8e8');
            circle(punto.x, punto.y, i === a.progreso ? 40 : 29);
            fill(C.tinta);
            textSize(22);
            text(i < a.progreso ? '✓' : '★', punto.x, punto.y - 1);
        });
    } else if (a.tipo === 'lavar') {
        PUNTOS_BURBUJAS.forEach((p, i) => {
            if (a.marcadas.includes(i)) return;
            const punto = puntoArea(p, area);
            stroke('#50b9da');
            strokeWeight(3);
            fill('#c9f4ffb8');
            circle(punto.x + Math.sin(frameCount * .04 + i) * 5, punto.y, 37);
            noStroke();
            fill('#fff');
            circle(punto.x - 6, punto.y - 6, 8);
        });
    } else if (a.tipo === 'comer') {
        const inicio = puntoArea([.21,.53], area);
        const meta = puntoArea([.80,.53], area);
        noFill();
        stroke('#e9a7ba');
        strokeWeight(6);
        circle(meta.x, meta.y, 80);
        noStroke();
        fill('#e57c97');
        textSize(36);
        text('♥', meta.x, meta.y);
        const frutaX = a.arrastrando ? a.cursorX : inicio.x;
        const frutaY = a.arrastrando ? a.cursorY : inicio.y;
        textSize(48);
        text('🍎', frutaX, frutaY);
    } else if (a.tipo === 'tele') {
        PUNTOS_DESTELLOS.forEach((p, i) => {
            if (a.marcadas.includes(i)) return;
            const punto = puntoArea(p, area);
            noStroke();
            fill('#ffe27c');
            circle(punto.x, punto.y, 36 + Math.sin(frameCount * .06 + i) * 8);
            fill('#8d64a6');
            textSize(27);
            text('✦', punto.x, punto.y);
        });
    }

    const total = a.tipo === 'lavar' ? PUNTOS_BURBUJAS.length
        : a.tipo === 'comer' ? 3 : 5;
    noStroke();
    fill('#eee6ed');
    rect(r.x + 36, r.y + r.h - 48, r.w - 72, 13, 8);
    fill('#82ba88');
    rect(r.x + 36, r.y + r.h - 48,
        (r.w - 72) * a.progreso / total, 13, 8);
    fill(C.tinta);
    textSize(12);
    text(a.progreso + ' / ' + total, width / 2, r.y + r.h - 64);
    pop();
}

function completarProgreso(a, total) {
    a.progreso++;
    if (a.progreso >= total) {
        a.completada = true;
        a.presionando = false;
        a.arrastrando = false;
    }
}

function registrarMovimientoActividad() {
    const a = actividadActiva;
    if (!a || a.completada || !a.presionando) return;
    const r = medidasActividad();
    const area = r.area;
    if (a.tipo === 'dormir') {
        const siguiente = PUNTOS_ESTRELLAS[a.progreso];
        if (!siguiente) return;
        const p = puntoArea(siguiente, area);
        if (Math.hypot(mouseX - p.x, mouseY - p.y) <= 29) completarProgreso(a, 5);
    } else if (a.tipo === 'lavar') {
        PUNTOS_BURBUJAS.forEach((pos, i) => {
            if (a.marcadas.includes(i)) return;
            const p = puntoArea(pos, area);
            if (Math.hypot(mouseX - p.x, mouseY - p.y) < 30) {
                a.marcadas.push(i);
                completarProgreso(a, PUNTOS_BURBUJAS.length);
            }
        });
    } else if (a.tipo === 'comer' && a.arrastrando) {
        a.cursorX = mouseX;
        a.cursorY = mouseY;
    }
}

function presionarActividad() {
    const a = actividadActiva;
    if (!a) return false;
    const r = medidasActividad();
    const botonCerrar = { x: r.x + r.w - 27, y: r.y + 27 };
    if (Math.hypot(mouseX - botonCerrar.x, mouseY - botonCerrar.y) < 23 || a.completada) {
        actividadActiva = null;
        return true;
    }
    a.presionando = true;
    if (a.tipo === 'comer') {
        const inicio = puntoArea([.21,.53], r.area);
        a.arrastrando = Math.hypot(mouseX - inicio.x, mouseY - inicio.y) < 62;
        a.cursorX = mouseX;
        a.cursorY = mouseY;
    } else if (a.tipo === 'tele') {
        PUNTOS_DESTELLOS.forEach((pos, i) => {
            if (a.marcadas.includes(i)) return;
            const p = puntoArea(pos, r.area);
            if (Math.hypot(mouseX - p.x, mouseY - p.y) < 33) {
                a.marcadas.push(i);
                completarProgreso(a, PUNTOS_DESTELLOS.length);
            }
        });
    } else {
        registrarMovimientoActividad();
    }
    return true;
}

function soltarActividad() {
    const a = actividadActiva;
    if (!a) return false;
    if (a.tipo === 'comer' && a.arrastrando && !a.completada) {
        const meta = puntoArea([.80,.53], medidasActividad().area);
        if (Math.hypot(mouseX - meta.x, mouseY - meta.y) < 62) {
            completarProgreso(a, 3);
        }
    }
    a.presionando = false;
    a.arrastrando = false;
    return true;
}
