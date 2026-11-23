/* EDIT · Efectos visuales globales. No altera el comportamiento de p5.js. */
(() => {
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
  function mostrarCorazones(evento) {
    if (reducir.matches || evento.pointerType === 'mouse' && evento.button !== 0) return;
    const colores = ['#FAA4B5', '#FFF183', '#70C1E1', '#F8B77C'];
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('span');
      el.className = 'corazon-click';
      el.textContent = i === 2 ? '✦' : '♥';
      el.setAttribute('aria-hidden', 'true');
      el.style.left = evento.clientX + 'px';
      el.style.top = evento.clientY + 'px';
      el.style.color = colores[i % colores.length];
      el.style.setProperty('--mover-x', `${(i - 2) * 24 + Math.random() * 14}px`);
      el.style.setProperty('--mover-y', `${-72 - Math.random() * 48}px`);
      el.style.setProperty('--retraso', `${i * 25}ms`);
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }
  }
  document.addEventListener('pointerdown', mostrarCorazones);
  // Jugar entra directamente sólo cuando existe una mascota realmente guardada.
  // Sin datos válidos, el mismo enlace lleva al creador, sin guardar por su cuenta.
  function destinoConMascota(enlace) {
    if (!enlace.hasAttribute('data-ruta-mascota')) return enlace.href;
    try {
      const guardado = JSON.parse(localStorage.getItem('edit_mascota') || 'null');
      const existe = guardado && typeof guardado === 'object' &&
        Number.isInteger(guardado.hair) && Number.isInteger(guardado.eyes);
      return new URL(existe ? 'escenario.html' : 'personaje.html', document.baseURI).href;
    } catch (_) {
      return new URL('personaje.html', document.baseURI).href;
    }
  }

  // En portada se ve brevemente la respuesta antes de navegar.

  document.querySelectorAll('.boton-caramelo, a[data-ruta-mascota]').forEach(enlace => {
    enlace.addEventListener('click', evento => {
      if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      // Si se reduce movimiento, igual hay que resolver la ruta condicional.
      if (reducir.matches && !enlace.hasAttribute('data-ruta-mascota')) return;
      evento.preventDefault();
      const url = destinoConMascota(enlace);
      window.setTimeout(() => { window.location.href = url; }, reducir.matches ? 0 : 190);
    });
  });
})();
