# Mi TV: vídeo de YouTube con controles personalizados

Práctica de HTML5 y JavaScript que integra un vídeo de YouTube dentro de una televisión dibujada con HTML y CSS.

## Qué hace

1. Inserta un vídeo de YouTube mediante la **API de iframes** de YouTube.
2. Dibuja la televisión con HTML y CSS: marco, pantalla, base y patas, con estilo propio.
3. Añade controles personalizados en JavaScript: ▶ Play, ⏸ Pausa, 🔇 Mute / 🔊 Unmute y ⏹ Stop (opcional).
4. Conecta cada botón con la API de YouTube (`playVideo`, `pauseVideo`, `mute`, `unMute`, `stopVideo`).

## Cómo cambiar el vídeo

En el script de `index.html`, cambia el valor de `VIDEO_ID` por el ID de tu vídeo, que es la parte de la URL después de `v=`.

## Accesibilidad

- Botones con texto visible y estado `aria-pressed` en Mute.
- Foco visible al navegar con el teclado.
- Mensaje de estado con `aria-live` para que lo anuncien los lectores de pantalla.

## Cómo verla

Abrir la URL de GitHub Pages del repositorio. La API de YouTube no funciona bien abriendo el archivo directamente desde el disco (`file://`), así que es mejor usar la URL publicada.
