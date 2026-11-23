# EDIT · Versión de identidad y casa corregida (23/11/2026)

Esta entrega usa como base `EDIT_INTERFAZ_ORIGINAL_SIN_ARBUSTOS.zip` y mantiene los PNG originales de Iris, la personalización, la caminata, la casa, los 5 edificios y sus minijuegos.

## Abrir

1. Descomprimir el ZIP y abrir la carpeta `Edit` en Visual Studio Code.
2. Ejecutar `index.html` con Live Server. No se usa npm ni paquetes externos; `lib/p5.js` está incluido.
3. En portada, «Crear mi personaje» abre el creador. La barra superior conserva «Crear personaje» y «Jugar», además del control de música. Tocá la nariz de Mishi en la portada para escuchar su risita.
4. Crear personaje: elegí las partes, prendas y colores; confirmá «Guardar personaje» o entrá a Jugar para guardar la combinación. El personaje se guarda localmente en `localStorage`, con la clave `edit_mascota`. «Descargar imagen PNG» exporta una imagen.
5. En Jugar, el botón central comienza la exploración. Se puede caminar con A/D, flechas del teclado o botones de flecha con mouse o pantalla táctil.
6. En la casa: arrastrá el jabón sobre Mishi, entregale la manzana, tocá la cama para dormir o el televisor para encenderlo. Los cuatro indicadores de necesidades se actualizan con estas interacciones. El televisor muestra un modal preparado para el video.
7. La puerta de la tercera habitación lleva al campus: Dorrego, Daract I, Daract II, Laboratorios y Edificio Histórico. Los edificios dan acceso a sus fichas y minijuegos, incluida la trivia.

## Organización

- `index.html`: portada, logo, mascota y decoraciones originales sin arbustos.
- `css/styles.css`: estilos compartidos, identidad visual y reglas responsive. No hay otra hoja CSS.
- `js/mascota.js`: modelo y render de Mishi; funciones `reaccionarMascota`, `dibujarExpresion` y dibujo de rasgos temporales.
- `js/personalizacion.js`: elección y guardado de rasgos y prendas.
- `js/casa.js`: dibujo e interacción con los muebles, flechas, necesidades y video opcional.
- `js/mapa.js`: plano ilustrado, edificios rectangulares y vuelta a la casa.
- `js/minijuegos.js`: actividades del campus.
- `js/audio-edit.js`: música y efectos de sonido originales de Iris, incluido el easter egg de la nariz.
- `js/efectos-ui.js`: corazones y destellos al hacer clic.
- `img/expresiones/`: nueve PNG originales para ojos y bocas de reacción, sin alterar el rostro guardado.

## Video del televisor pendiente

**El video original de Iris ya está incluido** en `EDIT/video/television.mp4`. Se reproduce dentro de la TV, se apaga al salir de la casa y no silencia los minijuegos. La TV tiene un control propio de volumen.

## Fuentes tipográficas

Se utilizan los nombres Super Unicorn, Butterpop y Pulang según el diseño del proyecto. Las fuentes privadas no se redistribuyen en este ZIP: copiá los originales de tus ZIP a `EDIT/tipografia/` según `tipografia/COMO_INSTALAR_TIPOGRAFIAS.txt`. Cuando no estén en esa carpeta ni instaladas, el CSS utiliza una fuente de respaldo; los textos p5 utilizan Trebuchet MS como alternativa. Los PNG del logo y subtítulo de la portada sí son los originales, por lo que esos dibujos no dependen de la instalación de las fuentes.

## Base para Dani y Martín

Mantener los PNG originales en `img/partes/`, `img/ropa/` e `img/portada/capas/`. Para próximos cambios de identidad usar `styles.css`; para nuevas interacciones usar el JS del módulo correspondiente. Para unificar ramas, comparar cambios específicos antes de sobreescribir archivos.

## Verificación

Se comprobó sintaxis JavaScript, existencia de archivos, render del creador, casa, mapa y portada con Chromium, incluyendo tamaños móvil y escritorio, el encastre de la sonrisa temporal y la posición de sueño. Los recursos externos no modificados y el audio deben verificarse también con Live Server en el navegador de entrega.


## Última revisión (23/11/2026): TV, música y expresiones

Se incorporó el video aportado en `video/television.mp4`: clic en la TV para reproducirlo en la pantalla; clic en el parlante de la propia TV para activar/desactivar su sonido. Al activar sonido de TV se pausa la música de fondo. La trivia utiliza los sonidos de respuesta correcta y error proporcionados. El mapa conserva proporciones uniformes al redimensionar. Para el detalle consultá `CAMBIOS_REVISION_2026-11-23.md`.

## Botones de la nueva portada

«Crear mi personaje» abre el creador siempre; «Vamos a jugar» y «Jugar» de la navegación de portada sólo entran al juego si `localStorage` contiene una mascota guardada; de lo contrario abren el creador. Los corazones y decoraciones siguen siendo los dibujos originales, sin arbustos. Ver `CAMBIOS_2026-11-23_PORTADA_Y_AUDIO.md`.
