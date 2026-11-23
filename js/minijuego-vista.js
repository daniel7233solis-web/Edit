const juegoSeleccionado = new URLSearchParams(location.search).get('juego') || 'dorrego';
console.log('Minijuego recibido:', juegoSeleccionado);
let sorpresaHasta = 0;

function preload() {
    preloadMascota();
    if (juegoSeleccionado === 'daract2') {
        corazonLleno = loadImage('img/minijuegos/corazon-lleno.png');
    }
}

function setup() {
    cargarMascota();
    pixelDensity(1);
    angleMode(RADIANS);
    const panel = document.getElementById('panelMinijuego');
    if (juegoSeleccionado === 'historico') {
        document.body.classList.add('pagina-trivia');
        panel.hidden = true;
        document.getElementById('panelTrivia').hidden = false;
        createCanvas(247, 288).parent('lienzo-trivia');
        const script = document.createElement('script');
        script.src = 'js/trivia.js';
        document.body.appendChild(script);
    } else if (juegoSeleccionado === 'daract2') {
        panel.classList.add('minijuego-carrera');
        const pantalla = document.getElementById('pantallaCarrera');
        pantalla.hidden = false;
        document.getElementById('tableroJuego').hidden = true;
        document.getElementById('pieProgreso').hidden = true;
        document.getElementById('tituloJuego').textContent = '¡Esquivá las malas notas!';
        document.getElementById('mensajeJuego').textContent = 'Saltá las malas notas y conseguí la mayor puntuación.';
        createCanvas(900, 550).parent('lienzoCarrera');
        iniciarEsquivarNotas();
    } else {
        createCanvas(240, 300).parent('lienzo-mishi');
        window.EDITCanvasMascota = document.querySelector('#lienzo-mishi canvas');
        dibujarAvatarPersonalizado();
        iniciarMinijuego(TITULOS_JUEGOS[juegoSeleccionado] ? juegoSeleccionado : 'dorrego');
    }
}

function dibujarAvatarPersonalizado() {
    clear();
    push();
    translate((width - ANCHO * .24) / 2, (height - ALTO * .24) / 2);
    scale(.24);
    dibujarMascota({ caminando: false, intensidad: 0, fase: 0 });
    pop();
}

function draw() {
    if (juegoSeleccionado === 'historico') {
        clear();
        push();
        scale(.22);
        translate(140, 40);
        if (millis() < sorpresaHasta) {
            translate(sin(frameCount * .8) * 12, 0);
        }
        dibujarMascota();
        pop();
    } else if (juegoSeleccionado === 'daract2') {
        dibujarEsquivarNotas();
    } else {
        dibujarAvatarPersonalizado();
    }
}

function keyPressed() {
    if (juegoSeleccionado !== 'daract2') return;
    if (key === 'r' || key === 'R') {
        iniciarEsquivarNotas();
        return false;
    }
    if (keyCode === ESCAPE) {
        location.href = 'escenario.html?ir=universidad';
        return false;
    }
    if ((keyCode === 32 || keyCode === UP_ARROW) && !carreraNotas.terminado) {
        saltarEsquivarNotas();
        return false;
    }
}

function mousePressed() {
    if (juegoSeleccionado !== 'daract2') return;
    if (!carreraNotas.terminado && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        saltarEsquivarNotas();
        return false;
    }
}

document.getElementById('saltarJuego').addEventListener('click', saltarEsquivarNotas);
document.getElementById('reiniciarCarrera').addEventListener('click', iniciarEsquivarNotas);
