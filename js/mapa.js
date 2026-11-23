/* EDIT · Campus UNM ilustrado. Referencia espacial: mapas aportados por Iris.
 * Se dibuja directamente con p5.js; ningún mapa institucional es copiado.
 * Las posiciones mantienen Dorrego al noroeste, Daract I/II y laboratorios al
 * este, y el Edificio Histórico en el centro-sur del campus. */
const EDIFICIOS_UNM = [
    { id: 'dorrego', nombre: 'Dorrego', juego: 'Memoria de colores', descripcion: 'Descubrí cuatro parejas escondidas.', color: '#eac6fa', techo: '#a37ac6', x: 233, y: 191, icono: '✿' },
    { id: 'daract1', nombre: 'Daract I', juego: 'Ordená las formas', descripcion: 'Repetí una secuencia de figuras.', color: '#b8e5ff', techo: '#77b4d3', x: 753, y: 188, icono: '◆' },
    { id: 'daract2', nombre: 'Daract II', juego: 'Camino de estrellas', descripcion: 'Seguí el camino de estrellas en orden.', color: '#ffe0a7', techo: '#e9a470', x: 898, y: 304, icono: '★' },
    { id: 'laboratorios', nombre: 'Laboratorios', juego: 'Laboratorio cromático', descripcion: 'Combiná colores para encontrar la mezcla.', color: '#c9edd9', techo: '#86bb9c', x: 975, y: 486, icono: '✦' },
    { id: 'historico', nombre: 'Edificio Histórico', juego: 'Trivia de diseño', descripcion: 'Poné a prueba tus conocimientos.', color: '#ffcfdf', techo: '#e29ab1', x: 487, y: 404, icono: '♡' }
];
let vistaMapa = { escala: 1, offsetX: 0, offsetY: 0, modoMovil: false };
let hoverEdificio = null;
let modalEdificioId = null;
let botonesMapa = {};

function situarEdificio(e) {
    if (!vistaMapa.modoMovil) return { x: e.x, y: e.y };
    const p = { dorrego: [168,216], daract1: [448,223], daract2: [452,435],
        laboratorios: [465,705], historico: [204,520] };
    const a = p[e.id];
    return { x: a[0], y: a[1] };
}

function transformarMapa() {
    const movil = width < 680;
    const W = movil ? 620 : 1100;
    const H = movil ? 900 : 650;
    const escala = Math.min(width / W, height / H);
    vistaMapa = {
        escala,
        offsetX: (width - W * escala) / 2,
        offsetY: (height - H * escala) / 2,
        modoMovil: movil
    };
    return {W,H};
}
function posicionMapaPantalla(x, y) {
    return {x: vistaMapa.offsetX + x * vistaMapa.escala,
        y: vistaMapa.offsetY + y * vistaMapa.escala};
}
function coordenadaMapa(mx, my) {
    return {x: (mx - vistaMapa.offsetX) / vistaMapa.escala,
        y: (my - vistaMapa.offsetY) / vistaMapa.escala};
}

function dibujarMapa() {
    background('#aedc95'); // mismo césped para el área exterior del plano
    const { W,H } = transformarMapa();
    // El cielo se prolonga hacia los lados libres: no quedan franjas de otro
    // color aunque cambien la relación de aspecto o abran DevTools.
    noStroke();fill('#d4eee8');
    rect(0, 0, width, Math.max(0, vistaMapa.offsetY + 90 * vistaMapa.escala));
    push();
    translate(vistaMapa.offsetX, vistaMapa.offsetY);
    scale(vistaMapa.escala);
    noStroke();
    fill('#a9d994');
    rect(0,0,W,H);
    // Cielo decorativo y terreno de campus.
    fill('#d4eee8');
    rect(0,0,W,90);
    fill('#aedc95');
    rect(0,90,W,H-90);
    fill('#83c8dc');
    // Río continuo: entra por el borde izquierdo y sale por el inferior.
    // La forma anterior se cruzaba sobre sí misma y formaba triángulos azules.
    beginShape();
    vertex(-25, H*.70);
    bezierVertex(W*.03,H*.71, W*.10,H*.78, W*.16,H*.84);
    bezierVertex(W*.20,H*.90, W*.26,H*.96, W*.30,H+25);
    vertex(-25,H+25);
    endShape(CLOSE);

    // Caminos conectan visualmente los cinco edificios en el parque.
    const caminos = vistaMapa.modoMovil ? [
        [[126,835],[220,721],[235,575],[260,375],[168,260]],
        [[220,721],[420,680],[448,484],[449,274],[418,223]],
        [[235,575],[204,520],[287,420],[448,435]]
    ] : [
        [[520,610],[500,510],[489,410],[510,265],[710,195]],
        [[489,410],[380,334],[240,230]],
        [[710,195],[785,265],[895,333],[967,457]],
        [[489,410],[680,460],[967,457]]
    ];
    for (const puntos of caminos) {
        noFill(); stroke('#d6bd8c'); strokeWeight(44); strokeCap(ROUND); strokeJoin(ROUND);
        beginShape(); for (const [x,y] of puntos) vertex(x,y); endShape();
        stroke('#fff0c5'); strokeWeight(35);
        beginShape(); for (const [x,y] of puntos) vertex(x,y); endShape();
    }
    noStroke();
    // Árboles y flores con posiciones deterministas; no cambian entre frames.
    for(let i=0;i<32;i++) {
        const x=34+(i*139 + Math.sin(i*15)*37)%(W-68);
        const y=120+(i*217)%(H-152);
        const lejos = EDIFICIOS_UNM.every(e=>{
            const v=situarEdificio(e);
            return Math.hypot(x-v.x,y-v.y)>85;
        });
        if (!lejos) continue;
        fill('#bd905f'); rect(x-5,y,10,25,3);
        fill(i%4===0?'#f2a6c2':i%3===0?'#73bd8d':'#69ae7b');
        circle(x,y,45+(i%3)*5);
        fill('#ffffff55'); circle(x-8,y-9,12);
    }
    for(let i=0;i<26;i++) {
        const x=20+(i*97)%W, y=135+(i*137)%(H-150);
        fill(i%2?'#ffceda':'#fff1b0'); circle(x,y,7);
        fill('#ffffffc9');circle(x+4,y-3,3);
    }
    // Fuente central como punto de referencia.
    if(!vistaMapa.modoMovil) dibujarFuente(515,285,1);
    else dibujarFuente(316,346,.75);
    for (const e of EDIFICIOS_UNM) {
        const pos=situarEdificio(e);
        dibujarEdificioMapa(e,pos.x,pos.y);
    }
    // Caminito de vuelta a casa, también clickeable.
    botonesMapa.casa = vistaMapa.modoMovil
        ? {x:42,y:H-88,w:178,h:56} : {x:30,y:H-86,w:178,h:56};
    fill('#ffffffed'); stroke('#775b7d');strokeWeight(2);
    rect(botonesMapa.casa.x,botonesMapa.casa.y,botonesMapa.casa.w,botonesMapa.casa.h,16);
    noStroke();fill('#624d65');textStyle(BOLD);textAlign(CENTER,CENTER);textSize(20);
    if (!dibujarRotulo('volver',botonesMapa.casa.x+89,botonesMapa.casa.y+27,164,29)) {
        textFont(fuenteEDIT('Butterpop'));
        text('Volver a casa',botonesMapa.casa.x+89,botonesMapa.casa.y+27);
    }
    pop();
    // Encabezado superpuesto en pantalla, siempre legible.
    noStroke();fill('#fffdf3ef');rect(14,12,Math.min(width-28,455),58,16);
    fill('#42304f');textAlign(LEFT,CENTER);textStyle(BOLD);textFont(fuenteEDIT('Butterpop'));
    textSize(Math.min(24,Math.max(14,width/28)));
    if (!dibujarRotulo('universidad', 14+Math.min(width-28,455)/2, 41, Math.min(width-55,420),35)) {
        text('Universidad Nacional de Moreno',27,40);
    }
    textStyle(NORMAL);textFont(fuenteEDIT('Pulang'));

}

function dibujarFuente(x,y,s) {
    push();translate(x,y);scale(s);noStroke();
    fill('#e6ccaf');ellipse(0,4,108,57);
    fill('#65bfd7');ellipse(0,-2,97,43);
    fill('#c5f4ff');ellipse(0,-4,56,26);
    fill('#85cee4');rect(-4,-56,8,48,5);ellipse(0,-55,28,39);
    fill('#eafcff');circle(-7,-45,8);circle(8,-31,6);
    pop();
}
function dibujarEdificioMapa(e,x,y) {
    const resaltado = hoverEdificio === e.id;
    push();
    translate(x,y);
    if(resaltado) scale(1.045);
    noStroke();fill('#284c4440');ellipse(0,76,175,28);
    stroke('#665477');strokeWeight(3.5);
    // Campus UNM: edificios geométricos, con techos planos y ventanales.
    // No se dibujan como casitas de cuento.
    if(e.id==='historico') {
        fill(e.techo);rect(-92,-54,184,21,4);
        fill(e.color);rect(-82,-35,164,123,5);
        fill('#fff9ef');rect(-24,8,48,80,2);
        for (let i=0;i<4;i++) {fill('#7ac9e1');rect(-67+i*36,-16,26,23,2);}
    } else if(e.id==='laboratorios') {
        fill(e.techo);rect(-87,-52,174,145,7);
        fill(e.color);rect(-79,-41,158,123,4);
        for(let i=0;i<3;i++)for(let j=0;j<2;j++){
            fill('#84c8e1');rect(-62+i*49,-22+j*47,34,32,3);
        }
    } else if(e.id==='dorrego') {
        fill(e.techo);rect(-92,-52,184,18,4);
        fill(e.color);rect(-84,-33,168,116,4);
        for(let i=0;i<5;i++){
            fill('#8ac9df');rect(-71+i*29,-14,21,54,3);
        }
        fill('#fff9ed');rect(-19,46,39,38,2);
    } else {
        fill(e.techo);rect(-93,-50,186,21,3);
        fill(e.color);rect(-87,-29,174,113,4);
        for(let i=0;i<4;i++) {
            fill('#73bfdb');rect(-74+i*40,-10,30,35,3);
            fill('#f3fafb');rect(-74+i*40,34,30,17,2);
        }
        fill('#fff9ed');rect(-16,55,32,29,2);
    }
    noStroke();fill('#fffefa');stroke(resaltado?'#e396ac':'#c39bc3');strokeWeight(resaltado?3.5:2);
    rect(-102,94,204,34,13);
    noStroke();fill('#42304f');textAlign(CENTER,CENTER);textFont(fuenteEDIT('Butterpop'));
    if (!dibujarRotulo(e.id, 0, 111, 188, 26)) {
        textSize(e.id==='historico' ? 16 : 19);
        text(e.nombre,0,111);
    }
    if(resaltado){noFill();stroke('#fff3a7');strokeWeight(4);rect(-105,-58,210,194,11);}
    pop();
}

function mapaElementoEn(x,y) {
    const m=coordenadaMapa(x,y);
    if(botonesMapa.casa && m.x>=botonesMapa.casa.x &&
        m.x<=botonesMapa.casa.x+botonesMapa.casa.w &&
        m.y>=botonesMapa.casa.y && m.y<=botonesMapa.casa.y+botonesMapa.casa.h) return 'casa';
    for (const e of EDIFICIOS_UNM) {
        const pos=situarEdificio(e);
        if(Math.abs(m.x-pos.x)<94 && m.y>=pos.y-93 && m.y<=pos.y+120) return e.id;
    }
    return null;
}
function presionarMapa(mx,my) {
    const id=mapaElementoEn(mx,my);
    if (id==='casa') {
        lugarActual='casa';
        window.EDITAudio?.actualizarEscena();
        personaje.x=2450; personaje.velocidad=0;
        personaje.intensidad=0;
        camaraX=Math.max(0,CASA.ancho-width/escalaMundo);
        return true;
    }
    if(id) abrirModalEdificio(id);
    return Boolean(id);
}
function actualizarHoverMapa(mx,my) {
    hoverEdificio=mapaElementoEn(mx,my);
    cursor(hoverEdificio ? HAND : ARROW);
}
function abrirModalEdificio(id) {
    const e=EDIFICIOS_UNM.find(item=>item.id===id);
    const dialogo=document.getElementById('dialogoEdificio');
    if(!e || !dialogo) return;
    modalEdificioId=id;
    document.getElementById('nombreEdificio').textContent=e.nombre;
    document.getElementById('nombreMinijuego').textContent=e.juego;
    document.getElementById('descripcionMinijuego').textContent=e.descripcion;
    const img=document.getElementById('imagenMinijuego');
    img.src='img/minijuegos/'+id+'.png';
    img.alt='Vista previa de '+e.juego;
    dialogo.showModal();
}
