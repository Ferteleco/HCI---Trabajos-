# TechLab Academia: web de reservas accesible

Actividad práctica de HCI: interfaz responsive para reservar plaza en talleres tecnológicos.

## Qué hace

1. El usuario elige un taller entre tres tarjetas.
2. Completa un formulario con nombre, correo, número de plazas y aceptación de condiciones.
3. Recibe una confirmación clara con el resumen de la reserva.

## Requisitos cubiertos

- **HTML semántico:** `header`, `nav`, `main`, `section`, `fieldset`, `legend`, `label`, `footer`.
- **Diseño Mobile First:** los estilos base son para móvil; `min-width` añade la disposición de tablet y escritorio.
- **Validación de campos:** al salir de cada campo y al enviar, con mensajes de error junto al campo.
- **Navegación por teclado:** enlace para saltar al formulario, foco visible y el foco va al primer campo con error.
- **Mensajes de feedback:** errores con `aria-live`, `aria-invalid` y `aria-describedby`, y confirmación con foco al resumen.

## Capturas

- `captura-escritorio.png` (ancho 1200 px)
- `captura-movil.png` (ancho 360 px)

## Cómo verla

Abrir `index.html` en el navegador, o usar la URL de GitHub Pages del repositorio.
