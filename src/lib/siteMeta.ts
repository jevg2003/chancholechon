import { PHONE_E164, PHONE_DISPLAY } from './contact';

// Single source of truth for all SEO/social metadata: JSON-LD, Open Graph,
// Twitter Cards, and the sitemap/robots generation all read from here.

// TODO: update once a custom domain is bought, or once the Vercel project
// is renamed to chancholechon (dashboard > Settings > General > Project
// Name) — must match `site` in astro.config.mjs either way.
export const SITE_URL = 'https://lechoneriachanchoellechon.com';

export const BUSINESS_NAME = 'Lechonería Chancho el Lechón';
export const SITE_TITLE = `${BUSINESS_NAME} | Restaurante Cali`;
export const SITE_DESCRIPTION =
	'La mejor lechona de Cali: lechona tolimense, cojines, tamales y pernil con cuero súper crocante. Barrio 7 de Agosto — pedidos y cotizaciones por WhatsApp.';
export const SITE_KEYWORDS =
	'lechonería Cali, lechona tolimense Cali, lechona para eventos Cali, domicilios lechona Cali, lechona 7 de agosto, lechona tradicional, Chancho el Lechón, lechona por raciones Cali';

export const OG_IMAGE_PATH = '/og-image.jpg';
export const OG_IMAGE_ALT = 'Lechona tolimense recién horneada, Lechonería Chancho el Lechón, Cali';

export const BUSINESS_ADDRESS = {
	street: 'Diagonal 15 #71A-58',
	locality: 'Santiago de Cali',
	region: 'Valle del Cauca',
	country: 'CO',
};

// Matches the pin in the Google Maps embed used in Ubicanos.astro.
export const BUSINESS_GEO = { latitude: 3.445028, longitude: -76.488641 };

export const BUSINESS_HOURS = [
	{ days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
	{ days: ['Saturday', 'Sunday'], opens: '09:00', closes: '20:00' },
];

export const SOCIAL_LINKS = [
	'https://www.facebook.com/franciaelena.gonzalez',
	'https://www.instagram.com/chanchoellechon/',
];

export const BUSINESS_PHONE = PHONE_E164;
export const BUSINESS_PHONE_DISPLAY = PHONE_DISPLAY;

// TODO: paste the verification code Google Search Console gives you after
// adding this site as a property (Settings > Ownership verification > HTML
// tag). Leave empty until then — the tag only renders when this is set.
export const GOOGLE_SITE_VERIFICATION = '';
