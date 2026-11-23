const carreraNotas = {

    salto: 0,
    velocidadVertical: 0,
    suelo: 430,
    fase: 0,
    obstaculos: [],
    tiempoObstaculo: 0,
    velocidadObstaculos: 5,
    vidas: 5,
    puntos: 0,
    terminado: false,
    invulnerableHasta: 0

};
let corazonLleno;

function iniciarEsquivarNotas() {

    carreraNotas.vidas = 5;
    carreraNotas.puntos = 0;
    carreraNotas.terminado = false;
    carreraNotas.invulnerableHasta = 0;

    carreraNotas.salto = 0;
    carreraNotas.velocidadVertical = 0;
    carreraNotas.fase = 0;
    carreraNotas.obstaculos = [];
    carreraNotas.tiempoObstaculo = 0;
}

function saltarEsquivarNotas() {
    // Solo puede saltar cuando está tocando el suelo.
    if (!carreraNotas.terminado && carreraNotas.salto === 0) {
        carreraNotas.velocidadVertical = -13;
    }
}

function comprobarColisionNota(obstaculo) {
    // Zona de colisión aproximada de las piernas de Mishi.
    const mishiX = 135;
    const mishiAncho = 70;

    const mishiAbajo = carreraNotas.suelo + carreraNotas.salto;
    const mishiArriba = mishiAbajo - 45;

    const choqueHorizontal =
        mishiX < obstaculo.x + obstaculo.ancho &&
        mishiX + mishiAncho > obstaculo.x;

    const choqueVertical =
        mishiArriba < obstaculo.y + obstaculo.alto &&
        mishiAbajo > obstaculo.y;

    return choqueHorizontal && choqueVertical;
}

function dibujarNotasMalas() {

    if (!carreraNotas.terminado) {
        carreraNotas.tiempoObstaculo++;
    }


    // Generar una nota aproximadamente cada 105 fotogramas.

    if (!carreraNotas.terminado && carreraNotas.tiempoObstaculo >= 105) {

        const nota = Math.floor(Math.random() * 4) + 1;

        carreraNotas.obstaculos.push({
            x: 920,
            y: carreraNotas.suelo - 60,
            ancho: 48,
            alto: 60,
            nota: nota
        });

        carreraNotas.tiempoObstaculo = 0;
    }

    // Actualizar y dibujar cada obstáculo.
    for (const obstaculo of carreraNotas.obstaculos) {

        if (!carreraNotas.terminado) {
            obstaculo.x -= carreraNotas.velocidadObstaculos;
        }

        // Comprobamos el choque una sola vez por hoja.
        if (
            !carreraNotas.terminado &&
            !obstaculo.golpeo &&
            frameCount >= carreraNotas.invulnerableHasta &&
            comprobarColisionNota(obstaculo)
        ) {
            obstaculo.golpeo = true;

            carreraNotas.vidas--;
            window.EDITAudio?.efecto('error', .23);
            reaccionarMascota(carreraNotas.vidas <= 0 ? 'llorar' : 'triste', carreraNotas.vidas <= 0 ? 4500 : 1300);

            // Un segundo de protección aproximadamente.
            carreraNotas.invulnerableHasta = frameCount + 60;

            if (carreraNotas.vidas <= 0) {
                carreraNotas.terminado = true;
            }
        }

        // Sumamos puntos por las notas esquivadas.
        if (
            !carreraNotas.terminado &&
            !obstaculo.contado &&
            obstaculo.x + obstaculo.ancho < 125
        ) {
            obstaculo.contado = true;

            if (!obstaculo.golpeo) {
                carreraNotas.puntos += 10;
                reaccionarMascota('contento', 1000);
            }
        }

        push();

        translate(obstaculo.x, obstaculo.y);

        // Hoja de examen.
        stroke('#423451');
        strokeWeight(2.5);
        fill('#fffaf0');
        rect(0, 0, obstaculo.ancho, obstaculo.alto, 5);

        // Renglones.
        stroke('#b9c8d3');
        strokeWeight(1.5);
        line(8, 12, 39, 12);
        line(8, 19, 39, 19);

        // Calificación.
        noStroke();
        fill('#e7657b');
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        textSize(30);
        text(obstaculo.nota, 24, 41);
        textStyle(NORMAL);

        pop();
    }

    // Eliminar las hojas que ya salieron de la pantalla.
    carreraNotas.obstaculos = carreraNotas.obstaculos.filter(
        obstaculo => obstaculo.x + obstaculo.ancho > 0
    );
}



function dibujarEsquivarNotas() {
    push();

    // Mantenemos un área de juego proporcional.
    scale(width / 900, height / 550);

    // Cielo.
    background('#DDF4FF');

    noStroke();
    fill('#FFF183');
    circle(785, 85, 80);

    // Pasto.
    fill('#82BA88');
    rect(0, 430, 900, 120);

    // Camino.
    fill('#D8B28D');
    rect(0, 465, 900, 85);

    // Líneas que se desplazan para simular velocidad.
    stroke('#B58D6D');
    strokeWeight(4);

    const desplazamiento = (frameCount * 6) % 100;

    for (let x = -100; x < 1000; x += 100) {
        line(x - desplazamiento, 510,
            x + 45 - desplazamiento, 510);
    }
    // Dibujar y mover las malas notas.
    dibujarNotasMalas();

    if (!carreraNotas.terminado) {
        // Física del salto.
        carreraNotas.salto += carreraNotas.velocidadVertical;
        carreraNotas.velocidadVertical += 0.65;

        if (carreraNotas.salto > 0) {
            carreraNotas.salto = 0;
            carreraNotas.velocidadVertical = 0;
        }

        // La animación continúa mientras corre.
        carreraNotas.fase += 0.32;
    }


    // Sombra de Mishi.
    noStroke();
    fill(66, 52, 81, 35);
    ellipse(170, carreraNotas.suelo + 3, 75, 12);

    // Mishi personalizado.
    push();

    translate(
        170,
        carreraNotas.suelo + carreraNotas.salto
    );

    scale(0.22);
    translate(-ANCHO / 2, -1190);

    dibujarMascota({
        caminando: carreraNotas.salto === 0,
        intensidad: carreraNotas.salto === 0 ? 1 : 0,
        fase: carreraNotas.fase,
        mirando: 1
    });

    pop();


    // Vidas disponibles.
    for (let i = 0; i < carreraNotas.vidas; i++) {
        image(corazonLleno, 30 + i * 43, 93, 34, 34);
    }

    // Puntuación.
    noStroke();
    fill('#423451');
    textAlign(LEFT, CENTER);
    textSize(19);
    textStyle(NORMAL);
    text('Puntos: ' + carreraNotas.puntos, 30, 140);


    // Instrucciones.
    noStroke();
    fill('#423451');
    textAlign(LEFT, CENTER);
    textSize(24);
    textStyle(BOLD);
    text('¡Esquivá las malas notas!', 30, 38);

    textSize(16);
    textStyle(NORMAL);
    text('ESPACIO o ↑ para saltar', 30, 73);

    textAlign(RIGHT, CENTER);
    text('ESC para volver al mapa', 870, 38);

    if (carreraNotas.terminado) {
        // Fondo semitransparente.
        noStroke();
        fill(66, 52, 81, 170);
        rect(0, 0, 900, 550);

        // Tarjeta de resultado.
        fill('#fffaf0');
        stroke('#FAA4B5');
        strokeWeight(5);
        rect(245, 140, 410, 260, 25);

        noStroke();
        fill('#423451');
        textAlign(CENTER, CENTER);

        textStyle(BOLD);
        textSize(37);
        text('¡Fin del juego!', 450, 200);

        textSize(24);
        text('Puntos: ' + carreraNotas.puntos, 450, 260);

        textStyle(NORMAL);
        textSize(17);
        text('Presioná R para volver a jugar', 450, 325);
        text('ESC para regresar al mapa', 450, 355);
    }

    pop();
}



