import type { ImageMetadata } from 'astro';

export interface Product {
	id: string;
	name: string;
	image: ImageMetadata;
	/** Optional descriptive alt text; defaults to "<name> de Lechonería Chancho el Lechón en Cali". */
	imageAlt?: string;
	info: string;
	message: string;
	/** Set when the photo is a stand-in (not our own product yet): the card and
	 * the detail view then show a "Foto de referencia" label. */
	referencePhoto?: boolean;
}
