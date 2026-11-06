import { getImage } from 'astro:assets';
import {
	SITE_URL,
	SITE_TITLE,
	BUSINESS_NAME,
	BUSINESS_ALT_NAMES,
	SITE_DESCRIPTION,
	BUSINESS_ADDRESS,
	BUSINESS_GEO,
	BUSINESS_HOURS,
	BUSINESS_PHONE,
	SOCIAL_LINKS,
	OG_IMAGE_PATH,
	LOGO_PATH,
	MAPS_URL,
	FOUNDING_YEAR,
} from './siteMeta';
import { WHATSAPP_URL } from './contact';
import { products } from '../data/products';
import { faqs } from '../data/faq';

// Stable @ids let the nodes below reference each other, so Google reads one
// connected entity (business ↔ website ↔ page ↔ menu ↔ FAQ) instead of
// unrelated fragments.
const ids = {
	business: `${SITE_URL}/#negocio`,
	website: `${SITE_URL}/#sitio`,
	webpage: `${SITE_URL}/#pagina`,
	menu: `${SITE_URL}/#menu`,
	faq: `${SITE_URL}/#preguntas`,
	logo: `${SITE_URL}/#logo`,
};

const abs = (path: string) => new URL(path, SITE_URL).toString();

/** Home page JSON-LD as a single @graph. */
export async function buildHomeSchema() {
	const productImages = await Promise.all(
		products.map((p) => getImage({ src: p.image, width: 960, format: 'webp' }).then((img) => abs(img.src)))
	);

	const business = {
		'@type': ['Restaurant', 'LocalBusiness'],
		'@id': ids.business,
		name: BUSINESS_NAME,
		alternateName: BUSINESS_ALT_NAMES,
		description: SITE_DESCRIPTION,
		slogan: 'La mejor lechona de Cali, la del 7 de Agosto',
		url: SITE_URL,
		telephone: BUSINESS_PHONE,
		foundingDate: FOUNDING_YEAR,
		logo: { '@type': 'ImageObject', '@id': ids.logo, url: abs(LOGO_PATH), width: 512, height: 512 },
		image: [abs(OG_IMAGE_PATH), ...productImages.slice(0, 3)],
		address: {
			'@type': 'PostalAddress',
			streetAddress: `${BUSINESS_ADDRESS.street}, ${BUSINESS_ADDRESS.neighborhood}`,
			addressLocality: BUSINESS_ADDRESS.locality,
			addressRegion: BUSINESS_ADDRESS.region,
			addressCountry: BUSINESS_ADDRESS.country,
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: BUSINESS_GEO.latitude,
			longitude: BUSINESS_GEO.longitude,
		},
		hasMap: MAPS_URL,
		openingHoursSpecification: BUSINESS_HOURS.map((h) => ({
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: h.days,
			opens: h.opens,
			closes: h.closes,
		})),
		servesCuisine: ['Colombiana', 'Lechona tradicional', 'Comida típica colombiana'],
		hasMenu: { '@id': ids.menu },
		acceptsReservations: false,
		currenciesAccepted: 'COP',
		priceRange: '$$',
		areaServed: [
			{ '@type': 'City', name: 'Cali' },
			{ '@type': 'AdministrativeArea', name: 'Valle del Cauca' },
		],
		knowsAbout: ['Lechona', 'Lechona tradicional', 'Lechona mixta', 'Cojín de lechona', 'Tamales vallunos', 'Tamales tolimenses', 'Pernil de cerdo'],
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: BUSINESS_PHONE,
			contactType: 'pedidos',
			areaServed: 'CO',
			availableLanguage: 'es',
		},
		potentialAction: {
			'@type': 'OrderAction',
			target: { '@type': 'EntryPoint', urlTemplate: WHATSAPP_URL, actionPlatform: ['http://schema.org/MobileWebPlatform', 'http://schema.org/DesktopWebPlatform'] },
			deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet', 'http://purl.org/goodrelations/v1#DeliveryModePickUp'],
		},
		sameAs: SOCIAL_LINKS,
	};

	const menu = {
		'@type': 'Menu',
		'@id': ids.menu,
		name: `Productos de ${BUSINESS_NAME}`,
		inLanguage: 'es-CO',
		hasMenuSection: {
			'@type': 'MenuSection',
			name: 'Lechonas, cojines, tamales y pernil',
			hasMenuItem: products.map((p, i) => ({
				'@type': 'MenuItem',
				name: p.name,
				description: p.info,
				image: productImages[i],
			})),
		},
	};

	const website = {
		'@type': 'WebSite',
		'@id': ids.website,
		name: BUSINESS_NAME,
		alternateName: BUSINESS_ALT_NAMES[0],
		url: SITE_URL,
		inLanguage: 'es-CO',
		publisher: { '@id': ids.business },
	};

	const webpage = {
		'@type': 'WebPage',
		'@id': ids.webpage,
		url: SITE_URL,
		name: SITE_TITLE,
		description: SITE_DESCRIPTION,
		inLanguage: 'es-CO',
		isPartOf: { '@id': ids.website },
		about: { '@id': ids.business },
		primaryImageOfPage: { '@type': 'ImageObject', url: abs(OG_IMAGE_PATH), width: 1200, height: 630 },
	};

	const faq = {
		'@type': 'FAQPage',
		'@id': ids.faq,
		isPartOf: { '@id': ids.webpage },
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a },
		})),
	};

	return { '@context': 'https://schema.org', '@graph': [business, website, webpage, menu, faq] };
}

/** Inner pages (legal): page node tied to the same site and business. */
export function buildPageSchema(path: string, title: string, description: string) {
	const url = abs(path);
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebPage',
				'@id': `${url}#pagina`,
				url,
				name: title,
				description,
				inLanguage: 'es-CO',
				isPartOf: { '@id': ids.website },
				publisher: { '@id': ids.business },
				breadcrumb: {
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
						{ '@type': 'ListItem', position: 2, name: title, item: url },
					],
				},
			},
		],
	};
}
