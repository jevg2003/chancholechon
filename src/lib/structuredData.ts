import {
	SITE_URL,
	BUSINESS_NAME,
	SITE_DESCRIPTION,
	BUSINESS_ADDRESS,
	BUSINESS_GEO,
	BUSINESS_HOURS,
	BUSINESS_PHONE,
	SOCIAL_LINKS,
	OG_IMAGE_PATH,
} from './siteMeta';

/** FoodEstablishment + LocalBusiness: the schema Google reads to show
 * hours/phone/map directly in search results for local queries. */
export function buildLocalBusinessSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': ['FoodEstablishment', 'LocalBusiness'],
		name: BUSINESS_NAME,
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		telephone: BUSINESS_PHONE,
		image: `${SITE_URL}${OG_IMAGE_PATH}`,
		address: {
			'@type': 'PostalAddress',
			streetAddress: BUSINESS_ADDRESS.street,
			addressLocality: BUSINESS_ADDRESS.locality,
			addressRegion: BUSINESS_ADDRESS.region,
			addressCountry: BUSINESS_ADDRESS.country,
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: BUSINESS_GEO.latitude,
			longitude: BUSINESS_GEO.longitude,
		},
		openingHoursSpecification: BUSINESS_HOURS.map((h) => ({
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: h.days,
			opens: h.opens,
			closes: h.closes,
		})),
		servesCuisine: ['Colombian', 'Lechona tolimense'],
		areaServed: { '@type': 'City', name: 'Cali' },
		priceRange: '$$',
		sameAs: SOCIAL_LINKS,
	};
}

/** BreadcrumbList: single-page site, so just the home crumb — still valid
 * and gives Google a clean site-name breadcrumb in results. */
export function buildBreadcrumbSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Inicio',
				item: SITE_URL,
			},
		],
	};
}

export function buildWebsiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: BUSINESS_NAME,
		url: SITE_URL,
	};
}
