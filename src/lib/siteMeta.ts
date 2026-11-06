import { PHONE_E164, PHONE_DISPLAY } from './contact';

// Single source of truth for all SEO/social metadata: JSON-LD, Open Graph,
// Twitter Cards, and the sitemap/robots generation all read from here.

// Must match `site` in astro.config.mjs.
export const SITE_URL = 'https://lechoneriachanchoellechon.com';

export const BUSINESS_NAME = 'Lechonería Chancho el Lechón';
export const SITE_TITLE = 'Lechonería Chancho el Lechón, la del 7 de Agosto | Lechona en Cali';
export const SITE_DESCRIPTION =
	'La mejor lechona de Cali: lechona tradicional carnuda con cuero súper crocante, cojines, tamales y pernil. Barrio 7 de Agosto, con domicilios. Pide por WhatsApp.';
// Other names people search for the business by (Google Business Profile,
// social handles, word of mouth). Feeds `alternateName` in the JSON-LD.
export const BUSINESS_ALT_NAMES = ['Chancho el Lechón', 'Lechonería Chancho el Lechón 7 de Agosto', 'Chancho el Lechón Cali'];
export const FOUNDING_YEAR = '2019';
export const LOGO_PATH = '/android-chrome-512x512.png';

export const OG_IMAGE_PATH = '/og/chancho-el-lechon-og.jpg';
export const OG_IMAGE_ALT = 'Lechonería Chancho el Lechón en Cali: lechona tradicional con cuero súper crocante, pedidos por WhatsApp';

export const BUSINESS_ADDRESS = {
	street: 'Diagonal 15 #71A-56',
	neighborhood: 'Siete de Agosto',
	locality: 'Cali',
	region: 'Valle del Cauca',
	country: 'CO',
};

// Matches the pin in the Google Maps embed used in Ubicanos.astro.
export const BUSINESS_GEO = { latitude: 3.445028, longitude: -76.488641 };

// The business's Google Maps place (same CID as the embed in Ubicanos.astro):
// opens the listing, with "Cómo llegar", in the Maps app on phones.
export const MAPS_URL = 'https://www.google.com/maps?cid=6968820177917511499';

export const BUSINESS_HOURS = [
	{ days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
	{ days: ['Saturday', 'Sunday'], opens: '09:00', closes: '20:00' },
];

export const SOCIAL_LINKS = [
	'https://www.facebook.com/franciaelena.gonzalez',
	'https://www.instagram.com/chanchoellechon2019/',
];

export const BUSINESS_PHONE = PHONE_E164;
export const BUSINESS_PHONE_DISPLAY = PHONE_DISPLAY;

// Search Console is already verified through a DNS TXT record in Cloudflare,
// so this stays empty; the meta tag only renders when it is set.
export const GOOGLE_SITE_VERIFICATION = '';
