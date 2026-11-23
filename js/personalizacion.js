/* EDIT · Opciones de personalización. Los PNG originales se conservan. */
const CATEGORIAS = [
  { key: 'hair', titulo: 'Pelucas', icono: '✿', desc: 'Elegí el peinado que más te guste.' },
  { key: 'skin', titulo: 'Piel', icono: '♡', desc: 'Cambiá el tono de piel.' },
  { key: 'eyes', titulo: 'Ojos', icono: '◉', desc: 'Elegí su mirada.' },
  { key: 'brows', titulo: 'Cejas', icono: '⌣', desc: 'Cambiá su expresión.' },
  { key: 'nose', titulo: 'Nariz', icono: '♥', desc: 'Elegí una nariz.' },
  { key: 'mouth', titulo: 'Boca', icono: '☺', desc: 'Elegí su sonrisa.' },
  { key: 'ears', titulo: 'Orejas', icono: '✧', desc: 'Elegí las orejas de tu mascota.' },
  { key: 'ropaSuperior', titulo: 'Remeras', icono: '♧', desc: 'Elegí la parte superior. Un conjunto se desactiva al elegir una remera.' },
  { key: 'ropaInferior', titulo: 'Faldas y shorts', icono: '✦', desc: 'Elegí la prenda inferior. Un conjunto se desactiva al elegir una falda o shorts.' },
  { key: 'conjunto', titulo: 'Conjuntos', icono: '★', desc: 'Los conjuntos reemplazan la remera y la prenda inferior, pero conservan el calzado.' },
  { key: 'calzado', titulo: 'Calzado', icono: '❀', desc: 'Elegí zapatos, zapatillas o dejá a Mishi descalzo.' }
];

const PRENDAS_POR_CATEGORIA = {
  ropaSuperior: ROPA.superiores,
  ropaInferior: ROPA.inferiores,
  conjunto: ROPA.conjuntos,
  calzado: ROPA.calzado
};
const elemento = id => document.getElementById(id);
let categoriaActual = 'hair';

function notificarAutoguardado() {
  guardarMascota();
  elemento('estado').textContent = '✓ Cambios guardados automáticamente';
}

function elegirCategoria(key) {
  categoriaActual = key;
  const categoria = CATEGORIAS.find(item => item.key === key);
  elemento('tituloOpciones').textContent = categoria.titulo;
  elemento('descripcionOpciones').textContent = categoria.desc;

  document.querySelectorAll('.cat').forEach(boton => {
    const activo = boton.dataset.key === key;
    boton.classList.toggle('active', activo);
    boton.setAttribute('aria-pressed', String(activo));
  });
  mostrarOpciones();
  mostrarColores();
}

function crearOpcion(nombre, src, elegido, alElegir) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'choice' + (elegido ? ' selected' : '');
  boton.setAttribute('aria-pressed', String(elegido));
  boton.setAttribute('aria-label', nombre);
  if (src) {
    const imagen = document.createElement('img');
    imagen.src = src;
    imagen.alt = '';
    imagen.loading = 'lazy';
    boton.append(imagen);
  } else {
    const icono = document.createElement('span');
    icono.className = 'opcion-sin-prenda';
    icono.textContent = '✧';
    boton.append(icono);
  }
  const texto = document.createElement('span');
  texto.textContent = nombre;
  boton.append(texto);
  boton.addEventListener('click', alElegir);
  return boton;
}

function mostrarOpciones() {
  const contenedor = elemento('opciones');
  contenedor.replaceChildren();

  if (categoriaActual === 'skin') {
    const texto = document.createElement('p');
    texto.className = 'muted';
    texto.textContent = 'Seleccioná un tono de la paleta inferior.';
    contenedor.append(texto);
    return;
  }

  if (PRENDAS_POR_CATEGORIA[categoriaActual]) {
    const puedeQuitar = categoriaActual !== 'ropaSuperior' && categoriaActual !== 'ropaInferior';
    if (puedeQuitar) {
      const etiqueta = categoriaActual === 'conjunto' ? 'Sin conjunto' : 'Descalzo';
      contenedor.append(crearOpcion(etiqueta, null,
        estadoMascota[categoriaActual] === 'ninguno', () => {
          estadoMascota[categoriaActual] = 'ninguno';
          notificarAutoguardado();
          mostrarOpciones();
        }));
    }
    PRENDAS_POR_CATEGORIA[categoriaActual].forEach(prenda => {
      const imagen = 'img/miniaturas/' + prenda.completa;
      contenedor.append(crearOpcion(prenda.nombre, imagen,
        estadoMascota[categoriaActual] === prenda.id, () => {
          estadoMascota[categoriaActual] = prenda.id;
          if (categoriaActual === 'ropaSuperior' || categoriaActual === 'ropaInferior') {
            estadoMascota.conjunto = 'ninguno';
          }
          notificarAutoguardado();
          mostrarOpciones();
        }));
    });
    return;
  }

  ARCHIVOS[categoriaActual].forEach((archivo, indice) => {
    const numero = indice + 1;
    contenedor.append(crearOpcion('Opción ' + numero,
      'img/partes/' + archivo,
      estadoMascota[categoriaActual] === numero,
      () => {
        estadoMascota[categoriaActual] = numero;
        notificarAutoguardado();
        mostrarOpciones();
      }));
  });
}

function mostrarColores() {
  let tipo = null;
  if (categoriaActual === 'skin') tipo = 'skin';
  else if (categoriaActual === 'hair') tipo = 'hairColor';
  else if (categoriaActual === 'nose') tipo = 'noseColor';

  elemento('colores').hidden = !tipo;
  if (!tipo) return;
  elemento('tituloColores').textContent = tipo === 'skin'
    ? 'Tono de piel' : tipo === 'hairColor' ? 'Color de pelo' : 'Color de nariz';

  const paleta = tipo === 'skin' ? COLORES_PIEL
    : tipo === 'hairColor' ? COLORES_PELO : COLORES_NARIZ;
  const contenedor = elemento('muestras');
  contenedor.replaceChildren();
  paleta.forEach(color => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'swatch' + (estadoMascota[tipo] === color ? ' selected' : '');
    boton.style.backgroundColor = color;
    boton.title = color;
    boton.setAttribute('aria-label', 'Color ' + color);
    boton.setAttribute('aria-pressed', String(estadoMascota[tipo] === color));
    boton.addEventListener('click', () => {
      estadoMascota[tipo] = color;
      notificarAutoguardado();
      mostrarColores();
    });
    contenedor.append(boton);
  });
}

function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

document.addEventListener('DOMContentLoaded', () => {
  CATEGORIAS.forEach(categoria => {
    const boton = document.createElement('button');
    const icono = document.createElement('span');
    const texto = document.createElement('span');
    boton.type = 'button';
    boton.className = 'cat';
    boton.dataset.key = categoria.key;
    icono.className = 'cat-icon';
    icono.textContent = categoria.icono;
    icono.setAttribute('aria-hidden', 'true');
    texto.className = 'cat-label';
    texto.textContent = categoria.titulo;
    boton.append(icono, texto);
    boton.addEventListener('click', () => elegirCategoria(categoria.key));
    elemento('categorias').append(boton);
  });

  elegirCategoria('hair');
  elemento('estado').textContent = '✓ Tus cambios se conservan en este navegador';
  elemento('nombre').addEventListener('input', notificarAutoguardado);
  elemento('animar').addEventListener('change', evento => {
    estadoMascota.animar = evento.target.checked;
  });
  elemento('saludar').addEventListener('click', () => { estadoMascota.saludo = 1; });
  elemento('sorpresa').addEventListener('click', () => {
    ['hair', 'eyes', 'brows', 'nose', 'mouth', 'ears'].forEach(tipo => {
      estadoMascota[tipo] = 1 + Math.floor(Math.random() * ARCHIVOS[tipo].length);
    });
    estadoMascota.skin = aleatorio(COLORES_PIEL);
    estadoMascota.hairColor = aleatorio(COLORES_PELO);
    estadoMascota.ropaSuperior = aleatorio(ROPA.superiores).id;
    estadoMascota.ropaInferior = aleatorio(ROPA.inferiores).id;
    estadoMascota.conjunto = Math.random() < 0.3 ? aleatorio(ROPA.conjuntos).id : 'ninguno';
    estadoMascota.calzado = Math.random() < 0.3 ? 'ninguno' : aleatorio(ROPA.calzado).id;
    notificarAutoguardado();
    mostrarOpciones();
    mostrarColores();
    elemento('estado').textContent = '¡Nueva combinación guardada! ✨';
  });
  elemento('guardarPersonaje').addEventListener('click', () => {
    guardarMascota();
    elemento('estado').textContent = '✓ Personaje guardado. ¡Ya podés ir a jugar!';
  });
  elemento('guardar').addEventListener('click', exportarMascota);
  elemento('vamosAJugar').addEventListener('click', guardarMascota);
});
