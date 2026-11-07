# Lechonería Chancho el Lechón

## Resumen

Sitio de la lechonería Chancho el Lechón, en el barrio Siete de Agosto de Cali. Los visitantes pueden consultar productos y ubicación, cotizar por WhatsApp o enviar una solicitud desde el formulario cuando está configurado.

## Experiencia del cliente

- Consulta el catálogo con fotos y detalles de los productos.
- Encuentra respuestas frecuentes, la ubicación del negocio y los accesos a WhatsApp.
- Envía una solicitud desde el formulario cuando el sitio tiene configurada la integración. La solicitud entra al flujo de revisión del negocio.

[Visitar la lechonería](https://lechoneriachanchoellechon.com/)

## Desarrollo local

Usa Node.js 22.12 o posterior y la versión de pnpm indicada en [package.json](package.json).

```bash
pnpm install
pnpm dev --background
```

La terminal indica la URL local. Usa `pnpm astro dev status` para consultar el estado y `pnpm astro dev stop` para detenerlo. Para preparar producción usa `pnpm build`; para revisarla en local, `pnpm preview`.

## Estructura e integración

- [src/pages/index.astro](src/pages/index.astro) reúne las secciones de la portada.
- [src/components](src/components) contiene el catálogo, el formulario y los accesos de contacto. El sitio usa Astro, React, Tailwind CSS y GSAP.
- [docs/solicitudes-web.md](docs/solicitudes-web.md) explica la API de solicitudes, App Check y la alternativa por WhatsApp.

## Licencia

Consulta la [licencia MIT](LICENSE).

## English summary

The website for Chancho el Lechón, a Colombian roast pork restaurant in Cali's Siete de Agosto neighborhood. Visitors can browse products, find the restaurant, request a quote via WhatsApp, or submit a request through the configured form.
