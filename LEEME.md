# EDIT — Base del creador de mascotas

## Abrir
Abrir `index.html` con Live Server desde VS Code. No se necesita npm ni conexión para p5.js (la biblioteca está incluida). La tipografía Nunito se carga desde Google Fonts si hay conexión.

## Origen de los dibujos
Los 28 PNG de `img/partes/` son las ilustraciones originales de Iris tomadas de `EDIT(1).rar`, carpeta `body en tamaño original`. Solo se eliminaron **márgenes transparentes externos** para simplificar la colocación; los trazos y las formas NO se redibujaron ni deformaron. `peluca 1.png` y `peluca 5.png` son las versiones independientes; `peluca 1-01.png` contiene el cuerpo y no sirve como capa.

## Cómo se ubican
El lienzo lógico de composición es de 844 × 1227, igual que los ejemplos de pelucas. El cuerpo de 801 × 1000 se ubica dentro de ese lienzo; no se estira. Las seis pelucas están colocadas con las coordenadas visibles de sus respectivos ejemplos. Las facciones siguen la referencia del rostro.

Para cambiar posiciones, editar **solo `POSICIONES`** en `js/mascota.js`. Cada pieza se dibuja con su tamaño original; las cejas usan escala proporcional 0,90 para ajustarse a la guía facial.

## Archivos
- `index.html`: estructura de tres columnas.
- `css/styles.css`: estilos y diseño adaptable.
- `js/assets.js`: nombres de PNG y paletas.
- `js/mascota.js`: composición, coloración y animación en p5.js.
- `js/personalizacion.js`: botones y controles.
- `img/partes/`: ilustraciones de Iris.

## Animaciones y evolución
`draw()` llama a `dibujarMascota()`. Cada brazo y pierna tiene un pivote separado para incorporar estados `walk`, `run` y `jump` más adelante. En esta versión se implementan respiración y saludo leve. Los futuros movimientos todavía **no están implementados**.

## Comprobación realizada
Se verificó la sintaxis de los tres archivos JavaScript y se generó una composición estática a partir de las piezas recortadas, incluida en `referencias/composicion_estatica_prueba.png`. La prueba automatizada del navegador no pudo confirmar la carga de las imágenes en el entorno aislado: comprobar en Live Server antes de darlo por definitivo.

## Pruebas recomendadas
Verificar todas las pelucas y expresiones, cambiar los colores, activar/desactivar animación, saludar, aleatorizar y exportar PNG. Los controles usan JavaScript nativo y la biblioteca p5.js local.
