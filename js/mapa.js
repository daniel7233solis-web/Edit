


function dibujarMapa() {
    background('#bcecf5');

    // Césped
    noStroke();
    fill('#a8d995');
    rect(0, 180, width, height - 180);

    // Camino principal
    fill('#f5d6a0');
    rect(0, 350, width, 75);

    // Sol
    fill('#ffe680');
    circle(780, 90, 90);

    dibujarCasaMapa(200, 260, 0.9);

    // Universidad EDIT
    dibujarUniversidad(650, 270, 0.7);
}
//prueba de subir
function dibujarCasaMapa(x, y, s) {
    push();
    translate(x, y);
    scale(s);
    translate(-190, -250);
    // Paredes

    stroke('#423451');
    strokeWeight(3);
    fill('#fff2cf');
    rect(100, 210, 180, 140);

    // Techo
    fill('#faa4b5');
    triangle(85, 210, 190, 125, 295, 210);

    // Puerta
    fill('#f8b77c');
    rect(170, 280, 45, 70);

    // Picaporte
    noStroke();
    fill('#423451');
    circle(205, 318, 7);

    // Ventanas
    stroke('#423451');
    strokeWeight(3);
    fill('#70c1e1');
    rect(115, 240, 40, 40);
    rect(230, 240, 35, 40);

    pop();

}



function dibujarUniversidad(x, y, s) {

    push();
    translate(x, y);
    scale(s);

    // Paleta de colores
    const cBorde = color(30, 30, 30);
    const cPared = color(255, 255, 255);
    const cVentana = color(135, 206, 250); // Celeste
    const cVentanaBrillo = color(176, 226, 255);

    stroke(cBorde);
    strokeWeight(4);
    strokeJoin(ROUND);

    // --- BASE / ESCALONES INFERIORES ---
    fill(cPared);
    rect(-265, 105, 530, 12); // Base general
    rect(-75, 105, 150, 7);   // Escalón superior entrada
    rect(-75, 112, 150, 7);   // Escalón inferior entrada

    // --- ALAS LATERALES (IZQUIERDA Y DERECHA) ---
    // Ala Izquierda
    fill(cPared);
    rect(-255, -75, 170, 180);
    rect(-268, -87, 183, 12); // Cornisa izquierda

    // Ala Derecha
    fill(cPared);
    rect(85, -75, 170, 180);
    rect(85, -87, 183, 12);   // Cornisa derecha

    // --- VENTANAS ALAS LATERALES ---
    const colsIzq = [-225, -170, -115];
    const colsDer = [115, 170, 225];
    const filasY = [-30, 45];

    for (let fy of filasY) {
        for (let cx of colsIzq) {
            dibujarVentana(cx, fy, 34, 58, cVentana, cVentanaBrillo);
        }
        for (let cx of colsDer) {
            dibujarVentana(cx, fy, 34, 58, cVentana, cVentanaBrillo);
        }
    }

    // --- CUERPO CENTRAL ---
    fill(cPared);
    rect(-85, -95, 170, 200);
    rect(-105, -108, 210, 13); // Cornisa central

    // --- CARTEL SUPERIOR ---
    fill(cBorde);
    rect(-78, -135, 156, 27, 3, 3, 0, 0);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(15);
    text("Universidad EDIT", 0, -121);

    // Restaurar trazo para el resto
    stroke(cBorde);
    strokeWeight(4);

    // --- VENTANAS CENTRALES SUPERIORES ---
    const colsCentro = [-54, 0, 54];
    for (let cx of colsCentro) {
        dibujarVentana(cx, -40, 38, 65, cVentana, cVentanaBrillo);
    }

    // --- PUERTA DOBLE PRINCIPAL ---
    dibujarPuertaDoble(0, 62, 104, 86, cVentana, cVentanaBrillo, cBorde, cPared);

    pop();
}

function dibujarVentana(x, y, w, h, cBase, cBrillo) {
    push();
    translate(x, y);
    rectMode(CENTER);

    // Fondo ventana celeste
    fill(cBase);
    rect(0, 0, w, h);

    // Franja de brillo diagonal sutil
    noStroke();
    fill(cBrillo);
    quad(-w / 2 + 3, -h / 2 + 3, 0, -h / 2 + 3, -w / 2 + 3, 5, -w / 2 + 3, 5);

    // Marco y travesaño inferior
    stroke(30);
    strokeWeight(4);
    noFill();
    rect(0, 0, w, h);
    line(-w / 2, h * 0.2, w / 2, h * 0.2);

    pop();
}

function dibujarPuertaDoble(x, y, w, h, cVentana, cBrillo, cBorde, cPared) {
    push();
    translate(x, y);
    rectMode(CENTER);

    // Marco exterior de la puerta (apoyada exactamente en y = 105)
    fill(cPared);
    stroke(cBorde);
    strokeWeight(4);
    rect(0, 0, w, h);

    // Mitad inferior oscura (zocalo de la puerta)


    // Contorno general y división central de las dos hojas
    stroke(cBorde);
    strokeWeight(4);
    noFill();
    rect(0, 0, w, h);
    line(0, -h / 2, 0, h / 2);

    // Ventanas celestes de cada hoja
    const winW = w * 0.30;
    const winH = h * 0.32;
    const winY = -h * 0.20;

    for (let side of [-1, 1]) {
        let winX = side * (w * 0.25);

        // Vidrio celeste
        fill(cVentana);
        noStroke();
        rect(winX, winY, winW, winH);

        // Brillo en el vidrio
        fill(cBrillo);
        quad(
            winX - winW / 2 + 2, winY - winH / 2 + 2,
            winX + 2, winY - winH / 2 + 2,
            winX - winW / 2 + 2, winY + 4,
            winX - winW / 2 + 2, winY + 4
        );

        // Marco de cada ventanita
        stroke(cBorde);
        strokeWeight(3.5);
        noFill();
        rect(winX, winY, winW, winH);
    }

    // Picaportes alineados sobre la franja blanca
    fill(cBorde);
    noStroke();
    circle(-8, -1, 5.5);
    circle(8, -1, 5.5);

    pop();
}




function dibujarInteriorUniversidad() {
    background('#bcecf5');

    // Título
    fill('#423451');
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(36);
    text('Universidad EDIT', width / 2, 105);

    textStyle(NORMAL);
    textSize(18);
    text('¡Elegí qué querés aprender hoy!', width / 2, 155);

    // Materias
    const materias = [
        { nombre: 'Teoría y Trivia', x: 130, y: 205 },
        { nombre: 'Edición', x: 470, y: 205 },
        { nombre: 'Morfología y Maquetas', x: 130, y: 325 },
        { nombre: 'Supervivencia Académica', x: 470, y: 325 }
    ];

    for (let materia of materias) {
        stroke('#423451');
        strokeWeight(3);
        fill('#fff2cf');
        rect(materia.x, materia.y, 300, 85, 15);

        noStroke();
        fill('#423451');
        textStyle(BOLD);
        textSize(18);
        text(
            materia.nombre,
            materia.x + 150,
            materia.y + 42
        );
    }

    // Botón para regresar al mapa
    stroke('#423451');
    strokeWeight(2);
    fill('#faa4b5');
    rect(20, 20, 180, 45, 12);

    noStroke();
    fill('#423451');
    textSize(17);
    text('Volver al mapa', 110, 42);
}
