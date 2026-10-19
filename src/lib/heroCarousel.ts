import gsap from 'gsap';

const ROTATION_INTERVAL = 4;

// Carousel slots relative to the active image: center stage, dimmed side
// previews, and a hidden "backstage" slot new images emerge from.
const SLOTS = {
	center: { xPercent: 0, scale: 1, autoAlpha: 1, zIndex: 30 },
	right: { xPercent: 74, scale: 0.4, autoAlpha: 0.35, zIndex: 10 },
	left: { xPercent: -74, scale: 0.4, autoAlpha: 0.35, zIndex: 10 },
	back: { xPercent: 0, scale: 0.3, autoAlpha: 0, zIndex: 0 },
};

/**
 * The hero's side-peek photo carousel: auto-rotates on a timer, supports
 * swipe/drag to advance manually, a pause toggle (WCAG 2.2.2), and pauses
 * automatically on hover/focus, when offscreen, or when the tab is hidden.
 */
export class HeroCarousel {
	private cutouts = gsap.utils.toArray<HTMLElement>('.hero-cutout');
	private currentIndex = 0;
	private rotationTimer: gsap.core.Tween | null = null;
	private manuallyPaused = false;
	private hoverPaused = false;
	private offscreen = false;
	private rotationDuration = 0.8;
	private rotationEase = 'power2.inOut';
	private onVisibility = () => this.syncRotation();

	constructor() {
		this.wireToggleButton();
		this.wireSwipe();
		this.wireHoverPause();
		document.addEventListener('visibilitychange', this.onVisibility);
	}

	private get isPaused() {
		return this.manuallyPaused || this.hoverPaused || this.offscreen || document.hidden;
	}

	setOffscreen(offscreen: boolean) {
		this.offscreen = offscreen;
		this.syncRotation();
	}

	/** Snap or tween every cutout into its slot relative to `active`. */
	layout(active: number, duration: number, ease: string) {
		const stackEl = document.querySelector<HTMLElement>('.hero-cutout-stack');
		const n = this.cutouts.length;
		this.cutouts.forEach((el, i) => {
			const rel = (i - active + n) % n;
			const slot = rel === 0 ? SLOTS.center : rel === 1 ? SLOTS.right : rel === n - 1 ? SLOTS.left : SLOTS.back;
			const zoom = parseFloat(el.dataset.zoom || '1');
			// xPercent is relative to EACH element's width: narrower images
			// (the framed photo) would sit closer to the center than the rest,
			// so scale the offset by how much narrower they are.
			const factor = stackEl && el.offsetWidth > 0 ? gsap.utils.clamp(1, 2.5, stackEl.offsetWidth / el.offsetWidth) : 1;
			gsap.to(el, {
				...slot,
				xPercent: slot.xPercent * factor,
				scale: slot.scale * zoom,
				duration,
				ease,
				overwrite: 'auto',
			});
		});
		this.currentIndex = active;
	}

	startRotation(duration: number, ease: string) {
		this.rotationTimer?.kill();
		this.rotationDuration = duration;
		this.rotationEase = ease;
		this.layout(this.currentIndex, 0, 'none');
		this.scheduleRotation();
	}

	private scheduleRotation() {
		// A sleeping delayed call replaces the perpetual per-frame timer.
		this.rotationTimer = gsap.delayedCall(ROTATION_INTERVAL, () => {
			if (!this.isPaused && this.cutouts.length > 1) {
				this.layout((this.currentIndex + 1) % this.cutouts.length, this.rotationDuration, this.rotationEase);
			}
			this.scheduleRotation();
		});
		this.syncRotation();
	}

	private syncRotation() {
		this.rotationTimer?.paused(this.isPaused);
	}

	destroy() {
		this.rotationTimer?.kill();
	}

	private wireToggleButton() {
		const toggleBtn = document.getElementById('hero-rotation-toggle');
		const iconPause = document.querySelector('.hero-icon-pause');
		const iconPlay = document.querySelector('.hero-icon-play');

		toggleBtn?.addEventListener('click', () => {
			this.manuallyPaused = !this.manuallyPaused;
			this.syncRotation();
			toggleBtn.setAttribute('aria-pressed', String(this.manuallyPaused));
			toggleBtn.setAttribute(
				'aria-label',
				this.manuallyPaused ? 'Reanudar rotación automática de imágenes' : 'Pausar rotación automática de imágenes'
			);
			iconPause?.classList.toggle('hidden', this.manuallyPaused);
			iconPlay?.classList.toggle('hidden', !this.manuallyPaused);
		});
	}

	/** Swipe / drag to advance the carousel manually (mouse or touch). */
	private wireSwipe() {
		const stack = document.querySelector<HTMLElement>('.hero-cutout-stack');
		if (!stack) return;

		stack.style.touchAction = 'pan-y';
		stack.style.cursor = 'grab';
		stack.style.userSelect = 'none';
		// Native image dragging swallows the pointerup that ends our swipe.
		stack.addEventListener('dragstart', (e) => e.preventDefault());

		let dragStartX: number | null = null;
		stack.addEventListener('pointerdown', (e) => {
			dragStartX = e.clientX;
		});
		window.addEventListener('pointerup', (e) => {
			if (dragStartX === null) return;
			const dx = e.clientX - dragStartX;
			dragStartX = null;
			if (Math.abs(dx) < 40 || this.cutouts.length < 2) return;
			const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const n = this.cutouts.length;
			const next = dx < 0 ? (this.currentIndex + 1) % n : (this.currentIndex - 1 + n) % n;
			this.layout(next, reduce ? 0.15 : 0.6, reduce ? 'none' : 'power2.out');
			// Restart the auto-rotation clock so the manual pick gets full stage time.
			this.rotationTimer?.restart(true);
			this.syncRotation();
		});
	}

	private wireHoverPause() {
		const pedestalWrap = document.querySelector('.hero-pedestal-wrap');
		pedestalWrap?.addEventListener('mouseenter', () => { this.hoverPaused = true; this.syncRotation(); });
		pedestalWrap?.addEventListener('mouseleave', () => { this.hoverPaused = false; this.syncRotation(); });
		pedestalWrap?.addEventListener('focusin', () => { this.hoverPaused = true; this.syncRotation(); });
		pedestalWrap?.addEventListener('focusout', () => { this.hoverPaused = false; this.syncRotation(); });
	}
}
