# EDIT · Base compartida para Dani y Martín

Abrí la carpeta `EDIT` en VS Code y ejecutá `index.html` con **Live Server**. No hace falta npm: `lib/p5.js` está incluido.

## Recorrido

1. `personaje.html`: personalizá a Mishi, elegí ropa, guardá y presioná **¡Vamos a jugar!**. El guardado se almacena en `localStorage` de ese navegador; el PNG es una descarga distinta.
2. `escenario.html`: presioná **JUGAR**. Mové a Mishi con **A/D** o las flechas (en celular, botones táctiles).
3. Acercate a la cocina: **arrastrá el jabón** desde la bacha sobre Mishi hasta generar burbujas, o **arrastrá la manzana** hasta él. Hacé clic en la **cama** para dormir o en el **televisor** para encenderlo.
4. En el extremo derecho de la casa, pasá el cursor por la **puerta**. Verás «Ir a la universidad». Hacé clic para entrar al mapa.
5. Elegí entre **Dorrego, Daract I, Daract II, Laboratorios o Edificio Histórico**. Cada edificio abre su ficha; el botón «Ir al minijuego» inicia la actividad. La casa y el mapa permiten volver.

La universidad puede abrirse directamente en `escenario.html?ir=universidad`.

## Archivos para continuar

- `js/assets.js`: catálogo de imágenes de piezas y ropa.
- `js/mascota.js`: dibujo de Mishi y su animación articulada. La cabeza y el pelo conservan su encastre.
- `js/personalizacion.js`: creador, selecciones y guardado.
- `js/casa.js`: dibujo e interacción de la casa. Coordenadas de iconos: `OBJETO_COORDS`.
- `js/mapa.js`: dibujo del parque y edificios. Lista de datos: `EDIFICIOS_UNM`.
- `js/minijuegos.js`: memoria, formas, estrellas y colores.
- `js/trivia.js`: trivia que ya existía, reutilizada para el Edificio Histórico.
- `css/styles.css`: hoja de estilos de todo el proyecto.

Los **PNG de Iris no fueron redibujados ni reemplazados**. Las miniaturas de prendas se conservan. Las imágenes `img/minijuegos/` son **previews ilustrativas** de los desafíos, reemplazables por capturas reales del juego cuando esté terminado.

## Trabajo en paralelo

Para evitar conflictos, conviene que **Dani** siga con el funcionamiento p5 de Mishi, casa y actividades (`mascota.js`, `casa.js`, `mapa.js`, `minijuegos.js`). **Martín** puede continuar con la interfaz HTML/CSS, diseño responsive y modales. Coordinar antes de modificar el mismo archivo.

### Todavía pendiente

Iris ofreció aportar nuevos PNG para expresiones de Mishi (ojos cerrados, sonrisa, tristeza y otras bocas). No están incorporados porque no forman parte de los PNG recibidos. La caminata sigue usando piezas frontales articuladas: un perfil 2D dibujado fielmente necesitará dibujos adicionales de perfil.

**Verificación:** sintaxis, recursos y pruebas de lógica realizadas. La apertura local en Chromium estuvo bloqueada por una política de navegador; probar también el proyecto en Live Server antes de darlo por cerrado visualmente. Consultá `CAMBIOS_UNM_2026-11-22.md` para el detalle.
