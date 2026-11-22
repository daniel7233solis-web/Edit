/* EDIT · Mascota articulada con p5.js.
 * Las coordenadas se expresan en el lienzo de composición 844 × 1227.
 * El cuerpo original mide 801 × 1000 y se ubica en (21, 194).
 * Los dibujos NO se redibujan: solo se posicionan y animan los PNG de Iris.
 */

const ANCHO = 844;
const ALTO = 1227;
const estadoMascota = {
  hair: 2, eyes: 1, brows: 2, nose: 1, mouth: 2, ears: 1, ropaInferior: 'pantaloncito', ropaSuperior: 'remeraBlanca',
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
    skin: estadoMascota.skin,
    hairColor: estadoMascota.hairColor,
    noseColor: estadoMascota.noseColor
  };

  localStorage.setItem('edit_mascota', JSON.stringify(datos));
}

function cargarMascota() {
  const datosGuardados = localStorage.getItem('edit_mascota');

  if (datosGuardados) {
    try {
      const datos = JSON.parse(datosGuardados);
      Object.assign(estadoMascota, datos);
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

  const lienzo = createCanvas(ANCHO, ALTO);
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



function dibujarArticulacion(tipo, angulo, desplazamiento = 0) {
  const p = POSICIONES[tipo];

  push();

  translate(p.pivotX, p.pivotY + desplazamiento);
  rotate(angulo);

  // Dibujamos la parte original de la mascota.
  dibujarPieza(tipo, 1, p.x - p.pivotX, p.y - p.pivotY);

  // Dibujamos la manga de la ropa seleccionada.
  if (tipo === 'armL' || tipo === 'armR') {
    const remera = imagenesRopa[estadoMascota.ropaSuperior];

    if (remera) {
      const manga = tipo === 'armL'
        ? remera.brazoL
        : remera.brazoR;

      const ajuste = AJUSTES_ROPA[estadoMascota.ropaSuperior] || { x: 0, y: 0 };

      if (manga && manga.width > 1) {
        image(
          manga,
          -p.pivotX + ajuste.x,
          -p.pivotY + ajuste.y,
          manga.width,
          manga.height
        );
      }
    }
  }

  pop();
}

function dibujarPantaloncito() {
  const pantalonCentro = imagenesRopa[estadoMascota.ropaInferior]?.centro;

  if (pantalonCentro && pantalonCentro.width > 1) {
    image(
      pantalonCentro,
      427 - pantalonCentro.width / 2,
      670 - pantalonCentro.height / 2,
      pantalonCentro.width,
      pantalonCentro.height
    );
  }
}

function dibujarMascota(caminando = false) {

  const t = millis() / 1000;
  const activo = estadoMascota.animar;
  const respiracion = activo ? Math.sin(t * 2.1) * 2.3 : 0;
  const brazos = activo ? Math.sin(t * 1.4) * 0.025 : 0;
  const progresoSaludo = 1 - estadoMascota.saludo;

  const elevacionBrazo = estadoMascota.saludo > 0
    ? Math.min(1, progresoSaludo * 5, estadoMascota.saludo * 5)
    : 0;

  const saludo = elevacionBrazo * (
    1.2 + Math.sin(progresoSaludo * Math.PI * 4) * 0.15
  );
  const inclinacionSaludo = estadoMascota.saludo > 0
    ? Math.sin(progresoSaludo * Math.PI) * 0.14
    : 0;
  if (estadoMascota.saludo > 0) {
    estadoMascota.saludo = Math.max(0, estadoMascota.saludo - deltaTime / 1300);
  }

  // Piernas independientes: listas para reutilizarse al caminar o correr.
  const paso = caminando ? sin(frameCount * 0.17) * 0.20 : 0;

  dibujarArticulacion('legL', paso);
  dibujarArticulacion('legR', -paso);
  // Pantaloncito: no acompaña el saludo.

  // Torso y brazos comparten el desplazamiento vertical de respiración.
  push();

  // Todo el cuerpo superior comparte la misma inclinación.
  push();

  translate(422, 900);
  rotate(inclinacionSaludo);
  translate(-422, -900);

  // Torso y brazos.
  push();
  translate(0, -respiracion);


  dibujarPieza('torso', 1, POSICIONES.torso.x, POSICIONES.torso.y);


  // Dibujamos el torso de la ropa superior seleccionada.
  const remeraTorso = imagenesRopa[estadoMascota.ropaSuperior]?.torso;
  const ajusteRopa = AJUSTES_ROPA[estadoMascota.ropaSuperior] || { x: 0, y: 0 };

  if (remeraTorso && remeraTorso.width > 1) {
    image(
      remeraTorso,
      ajusteRopa.x,
      ajusteRopa.y,
      remeraTorso.width,
      remeraTorso.height
    );
  }


  const balanceoBrazos = caminando ? paso * 0.55 : brazos;

  dibujarArticulacion('armL', -balanceoBrazos);
  dibujarArticulacion('armR', balanceoBrazos - saludo);

  pop();

  // Cabeza, facciones y pelo.
  push();
  translate(0, -respiracion * 1.3);

  dibujarPieza('ears', estadoMascota.ears, POSICIONES.ears.x, POSICIONES.ears.y);
  dibujarPieza('head', 1, POSICIONES.head.x, POSICIONES.head.y);
  dibujarCentrada('brows', estadoMascota.brows);
  dibujarCentrada('eyes', estadoMascota.eyes);
  dibujarCentrada('nose', estadoMascota.nose);
  dibujarCentrada('mouth', estadoMascota.mouth);

  const pelo = POSICIONES.hair[estadoMascota.hair - 1];
  dibujarPieza('hair', estadoMascota.hair, pelo.x, pelo.y);

  pop();


  // Terminamos la inclinación del cuerpo superior.
  pop();

  // Cerramos la transformación exterior.
  pop();

  // Pantaloncito: permanece quieto durante el saludo.

}

function drawMascota() {
  clear();

  // Dibujamos a Mishi con sus animaciones.
  dibujarMascota();

  // Dibujamos el pantaloncito sin animación.
  dibujarPantaloncito();
}

function exportarMascota() {
  const nombre = (document.getElementById('nombre').value.trim() || 'mi-mascota')
    .replace(/[^a-z0-9áéíóúñ_-]/gi, '-');
  saveCanvas(nombre + '-EDIT', 'png');
}
