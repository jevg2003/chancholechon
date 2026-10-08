<div align="center">

<img src="public/media/logoChanchoLechon3.webp" alt="Logo Lechonería Chancho el Lechón" width="120" />

# 🐷 Lechonería Chancho el Lechón

**Landing page inmersiva para un restaurante de lechona tradicional en Cali, Colombia.**

[![Sitio en vivo](https://img.shields.io/badge/sitio-en_vivo-brightgreen?style=flat-square)](https://lechoneriachanchoellechon.com/)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-black?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue?style=flat-square)](LICENSE)

[🌐 Ver sitio](https://lechoneriachanchoellechon.com/) · [🐛 Reportar un problema](../../issues)

</div>

---

## Sobre el proyecto

Sitio web para **Lechonería Chancho el Lechón**, negocio caleño (Barrio 7 de Agosto) especializado en lechona tolimense, cojines, tamales y pernil. El objetivo del sitio es generar pedidos y cotizaciones directamente por WhatsApp, con una experiencia de scroll cuidada de principio a fin — nada de la típica landing "navbar → hero → secciones → footer".

## ✨ Características

- **Hero con carrusel interactivo** — fotos de productos que rotan solas, se arrastran con el dedo/mouse, y un badge físico ("Desde 2019") que se agarra y se lanza con inercia real (GSAP Draggable + InertiaPlugin).
- **Storytelling con scroll horizontal** — Quiénes Somos, Misión y Visión en un recorrido pineado con figuras decorativas que se arrastran, chocan entre sí y cambian de forma (`clip-path`).
- **Galería tipo bento con zoom cinematográfico** — el scroll acerca la cámara hacia la foto central hasta llenar la pantalla, sin bordes ni cortes, en cualquier tamaño de pantalla.
- **Modal de productos con transición Flip** — cada producto vuela desde la grilla hasta un panel de detalle con su información y un botón de cotización que abre WhatsApp con un mensaje pre-armado por producto.
- **Botón de WhatsApp flotante** con animaciones vivas y un tooltip que no estorba.
- **100% responsive** — verificado en móvil, tablet y desktop, incluyendo el cruce de breakpoints sin recargar la página.
- **Accesible** — respeta `prefers-reduced-motion` en todas las animaciones, sin congelar contenido.
- **SEO técnico completo** — Open Graph, Twitter Cards, JSON-LD (`LocalBusiness`/`FoodEstablishment`), sitemap automático, favicons completos y Web App Manifest.
- **Rendimiento** — Lighthouse 100/100/100/100 en desktop, 91+ en mobile.

## 🛠️ Stack técnico

| Área | Tecnología |
|---|---|
| Framework | [Astro 7](https://astro.build) (salida estática) |
| Componentes interactivos | [React 19](https://react.dev) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com) |
| Animación | [GSAP 3](https://gsap.com) (ScrollTrigger, Draggable, Flip, InertiaPlugin) |
| Imágenes | [Sharp](https://sharp.pixelplumbing.com) vía `astro:assets` |
| Hosting | [Vercel](https://vercel.com) |

## 📁 Estructura del proyecto

```
src/
├── components/     # Componentes Astro (una sección = un componente)
│   └── icons/      # Íconos SVG reutilizables
├── data/           # Fuente única de datos (productos, carrusel del hero)
├── layouts/        # Layouts de página (Layout.astro, LegalLayout.astro)
├── lib/            # Lógica GSAP reutilizable (carrusel, físicas, modal, SEO)
├── pages/          # Rutas del sitio (index, términos, privacidad)
├── styles/         # Tema global de Tailwind
└── types/          # Tipos TypeScript compartidos
public/             # Assets estáticos, favicons, manifest, robots.txt
scripts/            # Scripts de generación de assets (favicons, OG image)
```

## 🚀 Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:4321)
npm run dev

# Build de producción
npm run build

# Previsualizar el build de producción
npm run preview
```

## 📱 Contacto del negocio

Lechonería Chancho el Lechón — Barrio 7 de Agosto, Diagonal 15 #71A-56, Santiago de Cali.
Pedidos y cotizaciones: [WhatsApp](https://wa.me/573128839301) · [Instagram](https://www.instagram.com/chanchoellechon/) · [Facebook](https://www.facebook.com/franciaelena.gonzalez)

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).

---

<div align="center">

🐷 **Lechonería Chancho el Lechón** — la del 7 de Agosto, desde 2019.

</div>
