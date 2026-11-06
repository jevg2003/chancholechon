import { BUSINESS_ADDRESS } from '../lib/siteMeta';

// Single source for the visible FAQ section AND its FAQPage JSON-LD, so the
// structured data always matches what the page actually says.
export const faqs: { q: string; a: string }[] = [
	{
		q: '¿Dónde queda Lechonería Chancho el Lechón?',
		a: `Estamos en la ${BUSINESS_ADDRESS.street}, barrio 7 de Agosto, en Cali (Valle del Cauca). Puedes recoger tu pedido en el local o pedir domicilio.`,
	},
	{
		q: '¿Cuál es el horario de atención?',
		a: 'Atendemos de martes a viernes de 8:00 a.m. a 6:00 p.m., y sábados y domingos de 9:00 a.m. a 8:00 p.m. Los lunes estamos cerrados.',
	},
	{
		q: '¿Hacen domicilios de lechona en Cali?',
		a: 'Sí. Llevamos lechona a domicilio en Cali y sus alrededores. Escríbenos por WhatsApp con tu barrio o municipio y te confirmamos la entrega.',
	},
	{
		q: '¿Desde cuántas porciones se puede pedir una lechona?',
		a: 'Las lechonas y los cojines se piden desde 15 porciones en adelante. También vendemos cajas de lechona al detal y cajas al por mayor para eventos.',
	},
	{
		q: '¿Venden lechona los fines de semana sin encargo?',
		a: 'Sí. Los sábados y domingos siempre sacamos lechona, hasta agotar existencias. Te recomendamos escribirnos o llamarnos antes de venir.',
	},
	{
		q: '¿Qué hace diferente a su lechona?',
		a: 'Nuestra lechona pasa por un proceso de drenaje del aceite que la deja seca, sin grasa y con el cuero súper crocante, con muy buena carne y la sazón de la casa.',
	},
	{
		q: '¿Qué otros productos tienen además de la lechona?',
		a: 'Hacemos lechona con careta, cojín de lechona, lechona mixta (arroz, arveja, cerdo, pollo, costilla y cabanos), pernil de cerdo asado y tamales vallunos y tolimenses.',
	},
	{
		q: '¿Cómo hago un pedido o una cotización?',
		a: 'Escríbenos por WhatsApp, llámanos o llena la solicitud de pedido en esta página. Acordamos contigo el precio, la disponibilidad y la entrega antes de confirmar. Si quieres, te damos una prueba del producto: solo pregúntanos.',
	},
];
