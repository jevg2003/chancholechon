import type { ImageMetadata } from 'astro';

export interface Product {
	id: string;
	name: string;
	image: ImageMetadata;
	info: string;
	message: string;
	/** Set when the photo is a stand-in (not our own product yet): the card and
	 * the detail view then show a "Foto de referencia" label. */
	referencePhoto?: boolean;
}
