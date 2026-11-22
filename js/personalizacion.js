/* EDIT · Interfaz de personalización. No contiene coordenadas ni dibuja la mascota. */
const CATEGORIAS = [
  { key: 'hair', titulo: 'Pelucas', icono: '✿', desc: 'Elegí el peinado que más te guste.' },
  { key: 'skin', titulo: 'Piel', icono: '♡', desc: 'Cambiá el tono de piel.' },
  { key: 'eyes', titulo: 'Ojos', icono: '◉', desc: 'Elegí su mirada.' },
  { key: 'brows', titulo: 'Cejas', icono: '⌣', desc: 'Cambiá su expresión.' },
  { key: 'nose', titulo: 'Nariz', icono: '♥', desc: 'Elegí una nariz.' },
  { key: 'mouth', titulo: 'Boca', icono: '☺', desc: 'Elegí su sonrisa.' },
  { key: 'ears', titulo: 'Orejas', icono: '✧', desc: 'Elegí las orejas de tu mascota.' }
];

let categoriaActual = 'hair';
const elemento = id => document.getElementById(id);

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

  ARCHIVOS[categoriaActual].forEach((archivo, indice) => {
    const numero = indice + 1;
    const boton = document.createElement('button');
    const imagen = document.createElement('img');
    const texto = document.createElement('span');

    boton.type = 'button';
    boton.className = 'choice' + (estadoMascota[categoriaActual] === numero ? ' selected' : '');
    boton.setAttribute('aria-label', 'Opción ' + numero);
    imagen.src = 'img/partes/' + archivo;
    imagen.alt = '';
    texto.textContent = 'Opción ' + numero;

    boton.append(imagen, texto);
    boton.addEventListener('click', () => {
      estadoMascota[categoriaActual] = numero;
      guardarMascota();
      mostrarOpciones();
    });
    contenedor.append(boton);
  });
}

function mostrarColores() {
  let tipo = null;

  if (categoriaActual === 'skin') {
    tipo = 'skin';
  } else if (categoriaActual === 'hair') {
    tipo = 'hairColor';
  } else if (categoriaActual === 'nose') {
    tipo = 'noseColor';
  }

  elemento('colores').hidden = !tipo;
  if (!tipo) return;

  if (tipo === 'skin') {
    elemento('tituloColores').textContent = 'Tono de piel';
  } else if (tipo === 'hairColor') {
    elemento('tituloColores').textContent = 'Color de pelo';
  } else {
    elemento('tituloColores').textContent = 'Color de nariz';
  }
  const contenedor = elemento('muestras');
  contenedor.replaceChildren();
  let paleta;

  if (tipo === 'skin') {
    paleta = COLORES_PIEL;
  } else if (tipo === 'hairColor') {
    paleta = COLORES_PELO;
  } else {
    paleta = COLORES_NARIZ;
  }

  paleta.forEach(color => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'swatch' + (estadoMascota[tipo] === color ? ' selected' : '');
    boton.style.backgroundColor = color;
    boton.title = color;
    boton.setAttribute('aria-label', 'Color ' + color);
    boton.addEventListener('click', () => {
      estadoMascota[tipo] = color;
      guardarMascota();
      mostrarColores();
    });
    contenedor.append(boton);
  });
}

function mensaje(texto) {
  elemento('estado').textContent = texto;
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
  elemento('animar').addEventListener('change', event => {
    estadoMascota.animar = event.target.checked;
  });
  elemento('saludar').addEventListener('click', () => {
    estadoMascota.saludo = 1;
  });
  elemento('sorpresa').addEventListener('click', () => {
    ['hair', 'eyes', 'brows', 'nose', 'mouth', 'ears'].forEach(tipo => {
      estadoMascota[tipo] = 1 + Math.floor(Math.random() * ARCHIVOS[tipo].length);
    });
    estadoMascota.skin = aleatorio(COLORES_PIEL);
    estadoMascota.hairColor = aleatorio(COLORES_PELO);

    guardarMascota();

    mostrarOpciones();
    mostrarColores();
    mensaje('¡Nueva combinación! ✨');
  });

  elemento('guardar').addEventListener('click', exportarMascota);

  elemento('guardarConfig').addEventListener('click', async () => {
    const configuracion = JSON.stringify({
      nombre: elemento('nombre').value,
      ...estadoMascota
    }, null, 2);

    try {
      await navigator.clipboard.writeText(configuracion);
      mensaje('¡Configuración copiada!');
    } catch (error) {
      mensaje('No se pudo copiar automáticamente.');
    }
  });

});
