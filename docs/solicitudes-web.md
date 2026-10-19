# Formulario de solicitudes conectado por API

Conserva el hero, carrusel, galería, modales y transiciones originales. Añade una sección después del catálogo. No hay carrito, pagos, facturas automáticas ni acceso del navegador público a pedidos/clientes.

El backend se incorpora en el PR de FacturacionChancho (`mejora/solicitudes-web`). El destino previsto es `https://facturacionchancholechon.web.app/api/solicitudes`; requiere desplegar primero su rewrite y función. No usar esta ruta hasta verificar su despliegue: antes puede responder la aplicación HTML.

## Configuración de compilación en Vercel

Crear una aplicación web pública separada en el mismo proyecto Firebase del administrador. Registrar esa app en App Check con proveedor reCAPTCHA Enterprise (Fraud Defense), con clave web basada en puntuación y autorizar el dominio público en la configuración del proveedor.

Variables públicas (configuración de cliente, no credenciales de administrador):

- `PUBLIC_SOLICITUDES_FIREBASE_API_KEY`
- `PUBLIC_SOLICITUDES_FIREBASE_PROJECT_ID`
- `PUBLIC_SOLICITUDES_FIREBASE_APP_ID`
- `PUBLIC_SOLICITUDES_RECAPTCHA_SITE_KEY`
- `PUBLIC_SOLICITUDES_ENDPOINT`: URL HTTPS verificada del endpoint desplegado.

Nunca poner una cuenta de servicio, clave privada ni secreto de reCAPTCHA en variables `PUBLIC_`. La API usa su identidad de servicio Firebase; el navegador solo lleva un token de App Check. Debe configurarse el mismo appId público en `SOLICITUDES_WEB_APP_ID` del backend.

Sin las cinco variables, el sitio muestra WhatsApp como alternativa y desactiva el formulario. No finge un envío exitoso. La política de privacidad incluye el tratamiento nuevo y se deben revisar sus textos antes de activar el envío directo.

## Validación previa a activar

1. Desplegar backend y reglas desde el proyecto administrativo.
2. Comprobar App Check y orígenes autorizados usando un entorno de prueba explícitamente autorizado, sin deshabilitar la verificación en producción.
3. Verificar lectura de la bandeja `/solicitudes` con un administrador y denegación pública/empleados.
4. Configurar variables de la web y generar vista previa. Los orígenes Vercel aleatorios no se aceptan por defecto: autorizar un origen de prueba concreto en backend y reCAPTCHA para la prueba visual integrada; retirarlo al terminar.
5. Registrar una solicitud identificada como prueba, comprobar referencia y bandeja; repetir con mismo id sin duplicado. Acordar el tratamiento del registro de prueba.
6. Comprobar 360/390/430px, controles de fecha/hora Android/iOS, errores de red, cambio de entrega y teclado.
7. Publicar la web solo después de revisar la vista previa.

El formulario carga el SDK de verificación al enviar, tras la autorización explícita. No guarda datos personales en localStorage ni sessionStorage. Mantiene los valores en pantalla tras un error y conserva la referencia mientras no se editen, para evitar duplicados al reintentar.
