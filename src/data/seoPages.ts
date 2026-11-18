export interface SEOPage {
  slug: string;
  title: string;
  description: string;
  heading: string;
  eyebrow: string;
  intro: string;
  productId: string;
  imageAlt: string;
  teaser: string;
  highlights: { title: string; text: string }[];
  detailHeading: string;
  paragraphs: string[];
  questions: { q: string; a: string }[];
}
export const seoPages: SEOPage[] = [
  {
    slug: 'lechona-mixta-cali',
    title: 'Lechona mixta en Cali | Cerdo, pollo y costilla',
    description: 'Lechona mixta en Cali con cerdo, pollo, costilla, cabanos, arroz, arveja y cuero crocante. Compra en cajas o cotiza lechonas enteras.',
    heading: 'Lechona mixta en Cali: varios sabores en una sola',
    eyebrow: 'Lechona mixta',
    intro: 'Una mezcla de cerdo, pollo, costilla, cabanos, arroz y arveja, con el cuero crocante que tanto nos gusta. En caja individual o en lechona entera para compartir.',
    productId: 'lechona-mixta',
    imageAlt: 'Lechona mixta en caja con arroz, arveja, cerdo, pollo, costilla y cabanos',
    teaser: 'Cerdo, pollo, costilla y cabanos, disponible en caja o entera para compartir.',
    highlights: [
      { title: 'Varios tipos de carne', text: 'En el relleno encontrarás cerdo, pollo, costilla y cabanos, combinados con arroz y arveja.' },
      { title: 'Con cuero crocante', text: 'El cuero dorado y crocante acompaña el sabor casero de esta preparación.' },
      { title: 'Cajas o lechona entera', text: 'Tenemos cajas individuales y lechonas enteras desde 15 porciones para reuniones.' },
    ],
    detailHeading: '¿Qué hace especial a la lechona mixta?',
    paragraphs: [
      'Esta es nuestra alternativa para quienes quieren disfrutar diferentes carnes en la misma porción. El arroz conserva su textura, la arveja acompaña la mezcla y los trozos de cerdo, pollo, costilla y cabanos hacen que cada bocado tenga variedad.',
      'No necesitas organizar un evento para probarla: puedes consultar la lechona mixta en caja individual. Si vas a compartir con familiares o invitados, cotizamos una lechona entera según las porciones, la fecha y la entrega.',
      'En nuestra lechonería del barrio Siete de Agosto en Cali mantenemos el sabor casero y el cuero crocante de la casa. Escríbenos para confirmar disponibilidad de esta variedad antes de realizar tu pedido.',
    ],
    questions: [
      { q: '¿La lechona mixta se vende por caja?', a: 'Sí. Puedes pedir la lechona mixta en una caja individual o consultar una lechona entera desde 15 porciones.' },
      { q: '¿Qué carnes trae?', a: 'Cerdo, pollo, costilla y cabanos, acompañados de arroz y arveja.' },
      { q: '¿Hay domicilio en Cali?', a: 'Podemos revisar la entrega según tu barrio, la cantidad y la fecha. Consulta por WhatsApp para confirmar condiciones.' },
    ],
  },
  {
    slug: 'lechonas-para-eventos-cali',
    title: 'Lechonas para eventos en Cali | Desde 15 porciones',
    description: 'Cotiza lechonas para eventos en Cali, reuniones, cumpleaños y celebraciones. Lechona tradicional, cojines y mixta desde 15 porciones.',
    heading: 'Lechonas para eventos en Cali',
    eyebrow: 'Reuniones y celebraciones',
    intro: '¿Organizas una reunión familiar, un cumpleaños o una celebración? Cotiza lechonas y cojines desde 15 porciones, con sabor tradicional y cuero crocante.',
    productId: 'lechona-careta',
    imageAlt: 'Lechona con careta y cuero crocante para un evento en Cali',
    teaser: 'Cotizaciones de lechonas y cojines desde 15 porciones para celebraciones.',
    highlights: [
      { title: 'Desde 15 porciones', text: 'Ofrecemos lechonas y cojines desde 15 porciones. Indícanos cuántas personas asistirán para cotizar.' },
      { title: 'Escoge la preparación', text: 'Consulta lechona con careta, cojines rellenos o lechona mixta con diferentes carnes.' },
      { title: 'Organiza tu entrega', text: 'Revisamos fecha, cantidad, disponibilidad y si prefieres recoger el pedido o consultar domicilio.' },
    ],
    detailHeading: 'El sabor de la lechona para compartir',
    paragraphs: [
      'Desde 2019 preparamos lechona tradicional en el barrio Siete de Agosto de Cali. La carne, la sazón de casa y el cuero crocante forman parte de nuestra propuesta para disfrutar con familiares, amigos o invitados.',
      'Cada celebración necesita una cantidad diferente: no es lo mismo un almuerzo pequeño que un evento con numerosos asistentes. Por eso hacemos cotizaciones según el producto, la cantidad de porciones, la fecha y la forma de entrega.',
      'Si prefieres recibir las porciones ya empacadas para repartirlas, también puedes consultar cajas de lechona al por mayor. Y si buscas una mezcla de carnes, conoce nuestra lechona mixta de cerdo, pollo, costilla y cabanos.',
    ],
    questions: [
      { q: '¿Desde cuántas porciones hacen lechonas?', a: 'Las lechonas y los cojines se ofrecen desde 15 porciones.' },
      { q: '¿Cuánto cuesta la lechona para un evento?', a: 'Cotizamos según porciones, fecha, presentación y entrega. Escríbenos para confirmar el valor antes de hacer el pedido.' },
      { q: '¿Puedo pedir lechona en cajas?', a: 'Sí. Ofrecemos cajas individuales y pedidos al por mayor, listos para repartir.' },
    ],
  },
  {
    slug: 'cajas-de-lechona-cali',
    title: 'Cajas de lechona en Cali | Al detal y por mayor',
    description: 'Cajas de lechona en Cali para almuerzos y eventos. Compra al detal o solicita cotización al por mayor, con porciones empacadas listas para repartir.',
    heading: 'Cajas de lechona en Cali: al detal y por mayor',
    eyebrow: 'Raciones empacadas',
    intro: 'Elige una porción individual o pregunta por cajas de lechona al por mayor, empacadas y listas para repartir en reuniones y celebraciones.',
    productId: 'cajas-por-mayor',
    imageAlt: 'Varias cajas de lechona preparadas y empacadas para pedidos en Cali',
    teaser: 'Raciones individuales y pedidos por mayor para reuniones o eventos.',
    highlights: [
      { title: 'Cajas al detal', text: 'Puedes consultar una porción individual en caja con arepa y cuero, disponible al detal en nuestro local.' },
      { title: 'Pedidos al por mayor', text: 'Preparamos pedidos de varias cajas empacadas para reuniones, fiestas y actividades.' },
      { title: 'Cotización por cantidad', text: 'Confirma cantidad, fecha, precio y disponibilidad del domicilio o recogida antes del pedido.' },
    ],
    detailHeading: 'Lechona lista para servir o repartir',
    paragraphs: [
      'Las cajas de lechona son una opción práctica cuando quieres una porción personal o necesitas atender a varias personas sin repartir una lechona entera en el lugar. Las cajas al detal se ofrecen en nuestro local, según disponibilidad.',
      'Para eventos y reuniones preparamos pedidos de cajas al por mayor, empacadas para distribuir fácilmente. Indícanos cuántas necesitas y cuándo las quieres recibir: confirmamos el valor y las condiciones antes de cerrar el pedido.',
      'Si buscas otro sabor, nuestra lechona mixta también está disponible en caja: combina carne de cerdo, pollo, costilla y cabanos con arroz, arveja y cuero crocante. Escríbenos para consultar esta presentación.',
    ],
    questions: [
      { q: '¿Puedo comprar una caja de lechona?', a: 'Sí, las cajas al detal se venden en el local según disponibilidad. Los fines de semana tenemos lechona hasta agotar existencias.' },
      { q: '¿Venden cajas de lechona al por mayor?', a: 'Sí. Atendemos pedidos de cajas para reuniones y eventos; cotizamos según la cantidad, la fecha y la entrega.' },
      { q: '¿Hay caja de lechona mixta?', a: 'Sí, la lechona mixta también tiene presentación en caja individual; consulta disponibilidad antes de pedir.' },
    ],
  },
];
