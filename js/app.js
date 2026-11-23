(() => {
  const iframe = document.getElementById('editContenido');
  const permitidas = new Set([
    'index.html', 'personaje.html', 'escenario.html', 'minijuego.html', 'trivia.html', 'ayuda.html'
  ]);
  const parametro = new URLSearchParams(location.search).get('pagina') || 'index.html';
  const ruta = parametro.split('?')[0];
  iframe.src = permitidas.has(ruta) ? parametro : 'index.html';

  iframe.addEventListener('load', () => {
    try {
      const pagina = iframe.contentWindow.location.pathname.split('/').pop();
      const destino = pagina + iframe.contentWindow.location.search;
      history.replaceState(null, '', 'app.html?pagina=' + encodeURIComponent(destino));
      document.title = iframe.contentDocument.title;
      window.EDITAudio?.registrarPagina?.(pagina, iframe.contentWindow.location.search);
    } catch (_) {}
  });
})();
