/* EDIT · Mascota articulada con p5.js.
 * Las coordenadas se expresan en el lienzo de composición 844 × 1227.
 * El cuerpo original mide 801 × 1000 y se ubica en (21, 194).
 * Los dibujos NO se redibujan: solo se posicionan y animan los PNG de Iris.
 */

const ANCHO = 844;
const ALTO = 1227;
const estadoMascota = {
  hair: 2, eyes: 1, brows: 2, nose: 1, mouth: 2, ears: 1, ropaInferior: 'pantaloncito', ropaSuperior: 'remeraBlanca', conjunto: 'ninguno', calzado: 'ninguno',
  skin: '#ffebd9', hairColor: '#ffffff', noseColor: '#e8b9b4', animar: true, saludo: 0
};

/* Posiciones del dibujo visible, no del margen transparente de los archivos.
 * Las pelucas están medidas contra los seis ejemplos de la carpeta Ejemplos.
 * Si modifican una ilustración, ajusten únicamente esta tabla. */
const POSICIONES = {
  head: { x: 143, y: 203 },
  torso: { x: 287, y: 714 },
  armL: { x: 143, y: 725, pivotX: 306, pivotY: 738 },
  armR: { x: 495, y: 725, pivotX: 538, pivotY: 738 },
  legL: { x: 200, y: 929, pivotX: 349, pivotY: 944 },
  legR: { x: 459, y: 929, pivotX: 495, pivotY: 944 },
  ears: { x: 150, y: 175 },
  eyes: { x: 239, y: 443, centerX: 422 },
  brows: { x: 253, y: 389, centerX: 422, scale: 0.90 },
  nose: { x: 403, y: 540, centerX: 421 },
  mouth: { x: 332, y: 589, centerX: 422 },
  hair: [
    { x: 65, y: 48 },
    { x: 14, y: 106 },
    { x: 39, y: 143 },
    { x: 78, y: 71 },
    { x: 69, y: 128 },
    { x: 108, y: 117 }
  ]
};
const AJUSTES_ROPA = {
  remeraPistacho: { x: -2, y: 100 },
  remeraBlanca: { x: 5, y: 99 },
  blusa: { x: 0, y: 100 }
};
const AJUSTES_ROPA_INFERIOR = {
  pantaloncito: { x: 0, y: 0 }
};

function guardarMascota() {
  const datos = {
    hair: estadoMascota.hair,
    eyes: estadoMascota.eyes,
    brows: estadoMascota.brows,
    nose: estadoMascota.nose,
    mouth: estadoMascota.mouth,
    ears: estadoMascota.ears,
    ropaSuperior: estadoMascota.ropaSuperior,
    ropaInferior: estadoMascota.ropaInferior,
    conjunto: estadoMascota.conjunto,
    calzado: estadoMascota.calzado,
    skin: estadoMascota.skin,
    hairColor: estadoMascota.hairColor,
    noseColor: estadoMascota.noseColor,
    nombre: document.getElementById('nombre')?.value.trim() || 'Mishi'
  };

  localStorage.setItem('edit_mascota', JSON.stringify(datos));
}

function cargarMascota() {
  const datosGuardados = localStorage.getItem('edit_mascota');

  if (datosGuardados) {
    try {
      const datos = JSON.parse(datosGuardados);
      const claves = ['hair', 'eyes', 'brows', 'nose', 'mouth', 'ears',
        'ropaSuperior', 'ropaInferior', 'conjunto', 'calzado',
        'skin', 'hairColor', 'noseColor'];
      claves.forEach(clave => {
        if (Object.prototype.hasOwnProperty.call(datos, clave)) {
          estadoMascota[clave] = datos[clave];
        }
      });
      const campoNombre = document.getElementById('nombre');
      if (campoNombre && typeof datos.nombre === 'string') {
        campoNombre.value = datos.nombre.slice(0, 24);
      }
    } catch (error) {
      console.error('Error al recuperar la mascota:', error);
    }
  }
}

const imagenes = {};
const coloreadas = {
  skin: {},
  hair: {},
  nose: {}
};
let erroresDeCarga = [];

// p5.js espera a que terminen estas cargas antes de ejecutar setup() y draw().
function cargarRecursosMascota() {
  cargarImagenesRopa();

  Object.keys(ARCHIVOS).forEach(tipo => {
    imagenes[tipo] = [];

    ARCHIVOS[tipo].forEach((archivo, indice) => {
      imagenes[tipo][indice] = loadImage(
        'img/partes/' + archivo,
        undefined,
        () => erroresDeCarga.push(archivo)
      );
    });
  });
}

function preloadMascota() {
  cargarRecursosMascota();
}
function setupMascota() {
  cargarMascota();

  // El saludo puede salirse del rectángulo original. Añadimos una zona
  // transparente a ambos lados SIN mover las coordenadas de las piezas.
  const lienzo = createCanvas(ANCHO + 280, ALTO + 80);
  lienzo.parent('lienzo');
  pixelDensity(1);
  angleMode(RADIANS);

  if (erroresDeCarga.length > 0) {
    const detalle = erroresDeCarga.join(', ');
    console.error('EDIT: no se cargaron estos PNG:', detalle);
    document.getElementById('estado').textContent =
      'No se pudieron cargar estas imágenes: ' + detalle;
  }
}

/* Colorea únicamente los píxeles de piel o pelo.
 * La tinta negra de los contornos de las pelucas sigue siendo negra. */
function imagenConColor(tipo, numero, color) {
  const cache = coloreadas[tipo] || coloreadas.skin;
  const clave = tipo + '-' + numero + '-' + color;
  if (cache[clave]) return cache[clave];

  const original = imagenes[tipo] && imagenes[tipo][numero - 1];
  if (!original || original.width <= 1 || original.height <= 1) return null;

  const copia = original.get();
  copia.loadPixels();
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  for (let i = 0; i < copia.pixels.length; i += 4) {
    if (copia.pixels[i + 3] === 0) continue;
    if (tipo === 'hair') {
      // Conservar las sombras, pero colorear también los contornos.
      const gris = copia.pixels[i] / 255;
      const intensidad = 0.25 + gris * 0.75;

      copia.pixels[i] = Math.round(r * intensidad);
      copia.pixels[i + 1] = Math.round(g * intensidad);
      copia.pixels[i + 2] = Math.round(b * intensidad);
    } else if (tipo === 'nose') {
      // Cambiar el color de la nariz sin modificar su transparencia.
      copia.pixels[i] = r;
      copia.pixels[i + 1] = g;
      copia.pixels[i + 2] = b;
    } else {
      // Colorear las piezas de piel.
      copia.pixels[i] = r;
      copia.pixels[i + 1] = g;
      copia.pixels[i + 2] = b;
    }
  }

  copia.updatePixels();
  cache[clave] = copia;
  return copia;
}

function obtenerImagen(tipo, numero) {
  if (tipo === 'hair') return imagenConColor(tipo, numero, estadoMascota.hairColor);
  if (['head', 'torso', 'armL', 'armR', 'legL', 'legR', 'ears'].includes(tipo)) {
    return imagenConColor(tipo, numero, estadoMascota.skin);
  } if (tipo === 'nose') {
    return imagenConColor(tipo, numero, estadoMascota.noseColor);
  }
  return imagenes[tipo] && imagenes[tipo][numero - 1];
}

function dibujarPieza(tipo, numero, x, y, escala = 1) {
  const img = obtenerImagen(tipo, numero);
  if (!img || !img.width) return;
  image(img, x, y, img.width * escala, img.height * escala);
}

function dibujarCentrada(tipo, numero) {
  const p = POSICIONES[tipo];
  const img = obtenerImagen(tipo, numero);
  if (!img || !img.width) return;
  const escala = p.scale || 1;
  const x = p.centerX ? p.centerX - img.width * escala / 2 : p.x;
  dibujarPieza(tipo, numero, x, p.y, escala);
}



// Todas las prendas fueron dibujadas sobre una plantilla original 844 x 1121.
// Se compensan sus 100 px de diferencia respecto de la composición del cuerpo.
const DESFASE_VESTUARIO_Y = 100;

function imagenDePrenda(id, parte) {
  return imagenesRopa[id] && imagenesRopa[id][parte];
}

function dibujarPrenda(id, parte, desplazamientoY = DESFASE_VESTUARIO_Y) {
  const recurso = imagenDePrenda(id, parte);
  if (recurso && recurso.width > 1) {
    const ajuste = AJUSTES_ROPA[id];
    const x = ajuste ? ajuste.x : 0;
    const y = ajuste ? ajuste.y : desplazamientoY;
    const ajusteRuedo = parte === 'torso' && ['remeraPistacho', 'remeraBlanca', 'blusa'].includes(id) ? 6 : 0;
    image(recurso, x, y, recurso.width, recurso.height + ajusteRuedo);
  }
}

// Los archivos de indumentaria usan una plantilla completa de 844 x 1121.
// Su pivote coincide con la articulación del cuerpo. Un pequeño aumento en
// las perneras cubre las uniones sin alterar ni volver a dibujar los PNG.
const AJUSTES_PERNERAS = {
  pantaloncito: 1.035,
  enterizo: 1.025
};

function dibujarPrendaEnArticulacion(id, parte, p) {
  const recurso = imagenDePrenda(id, parte);
  if (!recurso || recurso.width <= 1) return;
  const ajuste = AJUSTES_ROPA[id];
  const x = ajuste ? ajuste.x : 0;
  const y = ajuste ? ajuste.y : DESFASE_VESTUARIO_Y;

  // Escalamos desde el pivote REAL de la pierna, no desde la esquina del
  // lienzo transparente de la prenda. Así el encastre permanece estable.
  const escala = (parte === 'piernaL' || parte === 'piernaR')
    ? (AJUSTES_PERNERAS[id] || 1) : 1;
  push();
  scale(escala);
  image(recurso, x - p.pivotX, y - p.pivotY, recurso.width, recurso.height);
  pop();
}

// Sólo la articulación se mueve. No aplicamos escalado ni rotación a la
// cabeza o a la peluca. El orden de las capas se decide en dibujarMascota().
function dibujarArticulacion(tipo, angulo, intensidad = 0) {
  const p = POSICIONES[tipo];
  const brazo = tipo === 'armL' || tipo === 'armR';
  const parte = tipo === 'armL' ? 'brazoL'
    : tipo === 'armR' ? 'brazoR'
    : tipo === 'legL' ? 'piernaL' : 'piernaR';

  push();
  translate(p.pivotX, p.pivotY);
  rotate(angulo);
  if (brazo && intensidad > 0) {
    // Elasticidad muy leve SOLO en brazos y mangas para evitar rigidez.
    const flexion = Math.abs(Math.sin(angulo * 3)) * intensidad;
    scale(1 + flexion * 0.01, 1 - flexion * 0.02);
  }
  dibujarPieza(tipo, 1, p.x - p.pivotX, p.y - p.pivotY);

  if (brazo) {
    const remera = estadoMascota.conjunto !== 'ninguno'
      ? 'remeraBlanca' : estadoMascota.ropaSuperior;
    dibujarPrendaEnArticulacion(remera, parte, p);
  } else {
    // Primero el calzado: queda por DEBAJO del pantalón/enterizo.
    dibujarPrendaEnArticulacion(estadoMascota.calzado, parte, p);
    const inferior = estadoMascota.conjunto !== 'ninguno'
      ? estadoMascota.conjunto : estadoMascota.ropaInferior;
    dibujarPrendaEnArticulacion(inferior, parte, p);
  }
  pop();
}

// Dibujo interno de la cintura. Se conserva el nombre para compatibilidad
// con las otras pantallas, pero ahora se llama ANTES de la ropa superior.
function dibujarPantaloncito() {
  if (estadoMascota.conjunto === 'ninguno' &&
      estadoMascota.ropaInferior === 'pantaloncito') {
    dibujarPrenda('pantaloncito', 'centro');
  }
}

// Las perneras pueden abrir pequeños triángulos al rotar. Se cubre sólo
// la cintura con el PNG ORIGINAL completo, sin duplicar los bajos de las
// piernas (que permanecen independientes). Esto evita huecos al caminar.
function dibujarUnionCintura() {
  let id = null;
  if (estadoMascota.conjunto === 'enterizo') id = 'enterizo';
  else if (estadoMascota.conjunto === 'ninguno' &&
      estadoMascota.ropaInferior === 'pantaloncito') id = 'pantaloncito';
  if (!id) return;
  const recurso = imagenDePrenda(id, 'completa');
  if (!recurso || recurso.width <= 1) return;
  const yInicio = 824;
  const alto = 100;
  image(recurso, 0, DESFASE_VESTUARIO_Y + yInicio,
    recurso.width, alto, 0, yInicio, recurso.width, alto);
}

function dibujarMascota(movimiento = false) {
  const andando = typeof movimiento === 'object'
    ? Boolean(movimiento.caminando) : Boolean(movimiento);
  const intensidad = typeof movimiento === 'object'
    ? Math.max(0, Math.min(1, movimiento.intensidad ?? (andando ? 1 : 0)))
    : (andando ? 1 : 0);
  const fase = typeof movimiento === 'object' && Number.isFinite(movimiento.fase)
    ? movimiento.fase : frameCount * 0.1;
  const pisada = Math.sin(fase);
  const t = millis() / 1000;
  const reposo = estadoMascota.animar && intensidad < .05;
  const respiracion = reposo ? Math.sin(t * 2.1) * 3.5 : 0;

  // Saludo: se anima sólo el brazo, nunca la silueta de la cabeza.
  let saludo = 0;
  if (estadoMascota.saludo > 0) {
    const progreso = 1 - estadoMascota.saludo;
    const entrada = Math.min(1, progreso * 7, estadoMascota.saludo * 7);
    saludo = entrada * (1.12 + Math.sin(progreso * Math.PI * 6) * .11);
    estadoMascota.saludo = Math.max(0, estadoMascota.saludo - deltaTime / 1350);
  }

  // Pasos suaves y medidos. Los pies permanecen cerca del piso fijo y no
  // hay rebote de cuerpo entero ni escala horizontal dependiente de caminar.
  const anguloPierna = pisada * .145 * intensidad;
  const anguloBrazo = pisada * .21 * intensidad;
  const oscilacionTorso = pisada * 2.0 * intensidad;
  const prendaSuperior = estadoMascota.conjunto !== 'ninguno'
    ? 'remeraBlanca' : estadoMascota.ropaSuperior;

  // 1. Piernas -> zapatos -> tela de perneras. Las zapatillas no pueden
  //    tapar los ruedos. Los PNG de la pierna rotan junto con su pantalón.
  dibujarArticulacion('legL', anguloPierna, intensidad);
  dibujarArticulacion('legR', -anguloPierna, intensidad);

  // 2. Un brazo va por detrás de la silueta cuando camina.
  //    El derecho queda atrás al mirar a la derecha; al espejarse cambia lado.
  const caminando = intensidad > .04;
  if (caminando && saludo === 0) {
    push();
    translate(-12 * intensidad, 0);
    dibujarArticulacion('armR', anguloBrazo, intensidad);
    pop();
  }

  // 3. Piel del torso, DETRÁS de ambas prendas. Dibujar el torso por
  //    encima de la pollera generaba los parches visibles de piel en cintura.
  push();
  translate(oscilacionTorso, -respiracion);
  dibujarPieza('torso', 1, POSICIONES.torso.x, POSICIONES.torso.y);
  pop();

  // 4. Capa inferior sobre la piel, sin huecos al flexionar las piernas.
  dibujarUnionCintura();
  dibujarPantaloncito();
  if (estadoMascota.conjunto === 'ninguno' && estadoMascota.ropaInferior === 'pollera') {
    dibujarPrenda('pollera', 'completa');
  }

  // 5. Prenda superior EN PRIMER PLANO sobre la capa inferior. Así el
  //    ruedo tapa el borde de pollera/short y no quedan cortes en la cintura.
  push();
  translate(oscilacionTorso, -respiracion);
  dibujarPrenda(prendaSuperior, 'torso');
  if (estadoMascota.conjunto === 'enterizo') {
    dibujarPrenda('enterizo', 'torso');
  } else if (estadoMascota.conjunto === 'vestido') {
    dibujarPrenda('vestido', 'completa');
  }
  pop();

  // 6. Brazo delantero, con manga unida al mismo pivote.
  dibujarArticulacion('armL', -anguloBrazo, intensidad);
  if (!caminando || saludo > 0) {
    dibujarArticulacion('armR', anguloBrazo - saludo, intensidad);
  }

  // 7. Cabeza + orejas + facciones + peluca: conjunto completamente rígido.
  //    No hereda rebote, rotación, escala ni oscilación del torso al caminar.
  push();
  translate(0, -respiracion * 0.8);
  dibujarPieza('ears', estadoMascota.ears, POSICIONES.ears.x, POSICIONES.ears.y);
  dibujarPieza('head', 1, POSICIONES.head.x, POSICIONES.head.y);
  dibujarCentrada('brows', estadoMascota.brows);
  dibujarCentrada('eyes', estadoMascota.eyes);
  dibujarCentrada('nose', estadoMascota.nose);
  dibujarCentrada('mouth', estadoMascota.mouth);
  const pelo = POSICIONES.hair[estadoMascota.hair - 1];
  if (pelo) dibujarPieza('hair', estadoMascota.hair, pelo.x, pelo.y);
  pop();
}

function drawMascota() {
  clear();
  push();
  translate(140, 40);
  dibujarMascota();
  pop();
}

function exportarMascota() {
  const nombre = (document.getElementById('nombre').value.trim() || 'mi-mascota')
    .replace(/[^a-z0-9áéíóúñ_-]/gi, '-');
  saveCanvas(nombre + '-EDIT', 'png');
}
