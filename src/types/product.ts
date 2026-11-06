import type { ImageMetadata } from 'astro';

export interface Product {
	id: string;
	name: string;
	image: ImageMetadata;
	info: string;
	message: string;
}
