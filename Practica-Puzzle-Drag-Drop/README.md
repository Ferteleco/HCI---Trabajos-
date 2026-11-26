# Puzzle Drag & Drop con temporizador

Práctica de la API de Drag & Drop de HTML5: un puzzle en el que hay que arrastrar cada pieza a su hueco correcto, con un cronómetro visible que mide el tiempo hasta completarlo.

## Qué hace

1. Las piezas (1, 2 y 3) se arrastran a los huecos con el ratón.
2. El cronómetro arranca con el primer movimiento y se detiene al colocar la última pieza.
3. Cada pieza correcta se marca en verde; si es incorrecta, aparece un aviso.
4. El botón **Reiniciar** vuelve a dejar el puzzle en su estado inicial.

## Conceptos de la API de Drag & Drop

- `draggable="true"` en las piezas, para que se puedan arrastrar.
- `dragstart`: guarda el identificador de la pieza con `dataTransfer.setData`.
- `dragover`: con `preventDefault()` se permite soltar sobre el hueco.
- `drop`: lee el identificador con `dataTransfer.getData` y coloca la pieza si es correcta.

## Accesibilidad y móvil

- Las API de arrastrar y soltar no funcionan bien en móvil, así que también se puede pulsar una pieza y después su hueco.
- Piezas y huecos son enfocables con el teclado (Tab) y se activan con Enter o Espacio.
- El cronómetro se muestra en pantalla y el resultado final se anuncia con `aria-live`.

## Cómo verla

Abrir la URL de GitHub Pages del repositorio. Abrir el archivo directamente desde el disco funciona en la mayoría de navegadores, pero la URL publicada es más fiable.
