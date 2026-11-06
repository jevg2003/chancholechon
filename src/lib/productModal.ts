/**
 * Product detail ("container transform"): the photo grows out of the card the
 * visitor tapped into the centered panel, and flies back into the same card on
 * close (X, Esc, or tapping outside).
 *
 * FLIP technique with the Web Animations API, no library: measure the card and
 * the panel's final position, start each element at the card's rect with a
 * transform, and animate to its natural place. Only transform/opacity animate,
 * so it stays smooth on phones. A floating copy of the photo makes the flight
 * (card and panel photo share the 4:3 ratio, so it scales without distortion);
 * the panel's surface grows behind it and the text fades in as it lands.
 */

const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.4, 0, 0.2, 1)';

export function initProductModal() {
	const dialog = document.getElementById('producto-modal') as HTMLDialogElement | null;
	if (!dialog) return;

	const panel = dialog.querySelector<HTMLElement>('.pm-panel')!;
	const backdrop = dialog.querySelector<HTMLElement>('.pm-backdrop')!;
	const media = dialog.querySelector<HTMLElement>('.pm-media')!;
	const img = dialog.querySelector<HTMLImageElement>('.pm-img')!;
	const ref = dialog.querySelector<HTMLElement>('.pm-ref')!;
	const title = dialog.querySelector<HTMLElement>('#producto-modal-title')!;
	const info = dialog.querySelector<HTMLElement>('.pm-info')!;
	const cta = dialog.querySelector<HTMLAnchorElement>('.producto-modal-cta')!;
	const closeBtn = dialog.querySelector<HTMLElement>('.pm-close')!;
	const fades = Array.from(dialog.querySelectorAll<HTMLElement>('.pm-fade'));
	const waBase = cta.href.split('?')[0];

	const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	let card: HTMLElement | null = null;
	let busy = false;

	/** Transform that moves/scales an element sitting at `to` onto `from`. */
	function invert(from: DOMRect, to: DOMRect, uniform = false) {
		const sx = from.width / to.width;
		const sy = uniform ? sx : from.height / to.height;
		return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${sx}, ${sy})`;
	}

	/** Fixed-position copy of the photo, used only for the flight. */
	function makeFlyer(src: string, rect: DOMRect) {
		const flyer = document.createElement('img');
		flyer.src = src;
		flyer.alt = '';
		Object.assign(flyer.style, {
			position: 'fixed',
			left: `${rect.left}px`,
			top: `${rect.top}px`,
			width: `${rect.width}px`,
			height: `${rect.height}px`,
			objectFit: 'cover',
			transformOrigin: '0 0',
			zIndex: '2',
			pointerEvents: 'none',
			borderRadius: '1rem',
		});
		dialog!.appendChild(flyer);
		return flyer;
	}

	function fill(source: HTMLElement) {
		const cardImg = source.querySelector<HTMLImageElement>('.producto-img')!;
		img.src = cardImg.currentSrc || cardImg.src;
		img.alt = cardImg.alt;
		title.textContent = source.dataset.name ?? '';
		info.textContent = source.dataset.info ?? '';
		cta.href = `${waBase}?text=${encodeURIComponent(source.dataset.message ?? '')}`;
		ref.classList.toggle('hidden', source.dataset.reference !== 'true');

		// Swap in a sharper file once the panel is up (the card's copy shows
		// instantly because it is already cached).
		if (cardImg.srcset) {
			const hi = new Image();
			hi.sizes = '(min-width: 768px) 32rem, 100vw';
			hi.srcset = cardImg.srcset;
			hi.decode()
				.then(() => {
					if (card === source) img.src = hi.currentSrc;
				})
				.catch(() => {});
		}
	}

	async function open(source: HTMLElement) {
		if (busy || dialog!.open) return;
		busy = true;
		card = source;
		fill(source);

		document.documentElement.style.overflow = 'hidden';
		dialog!.showModal();
		closeBtn.focus({ preventScroll: true });

		if (reduce()) {
			await dialog!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 }).finished;
			busy = false;
			return;
		}

		const from = source.getBoundingClientRect();
		const panelRect = panel.getBoundingClientRect();
		const mediaRect = media.getBoundingClientRect();
		const flyer = makeFlyer(img.src, mediaRect);

		source.style.visibility = 'hidden';
		img.style.opacity = '0';

		const dur = 460;
		const anims = [
			backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' }),
			flyer.animate(
				[
					{ transform: invert(from, mediaRect, true), borderRadius: '1rem' },
					{ transform: 'none', borderRadius: '0' },
				],
				{ duration: dur, easing: EASE_OUT }
			),
			panel.animate([{ transform: invert(from, panelRect), opacity: 0.6 }, { transform: 'none', opacity: 1 }], {
				duration: dur,
				easing: EASE_OUT,
			}),
			closeBtn.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: dur - 120, fill: 'backwards' }),
			...fades.map((el, i) =>
				el.animate(
					[
						{ opacity: 0, transform: 'translateY(12px)' },
						{ opacity: 1, transform: 'none' },
					],
					{ duration: 320, delay: dur * 0.55 + i * 50, easing: EASE_OUT, fill: 'backwards' }
				)
			),
		];

		// Unlock as soon as the photo lands (the text may still be fading in),
		// so a quick X / Esc / tap outside is never ignored.
		await Promise.all([anims[1], anims[2]].map((a) => a.finished.catch(() => {})));
		img.style.opacity = '';
		flyer.remove();
		busy = false;
	}

	async function close(after?: () => void) {
		if (busy || !dialog!.open || !card) return;
		busy = true;
		const target = card;

		const finish = () => {
			dialog!.close();
			target.style.visibility = '';
			document.documentElement.style.overflow = '';
			card = null;
			busy = false;
			if (after) after();
			else target.focus({ preventScroll: true });
		};

		if (reduce()) {
			await dialog!.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120 }).finished;
			finish();
			return;
		}

		const to = target.getBoundingClientRect();
		const panelRect = panel.getBoundingClientRect();
		const mediaRect = media.getBoundingClientRect();
		const flyer = makeFlyer(img.src, mediaRect);
		flyer.style.borderRadius = '0';
		img.style.opacity = '0';

		const dur = 380;
		fades.forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }));
		closeBtn.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, fill: 'forwards' });

		const anims = [
			backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: 'ease-in', fill: 'forwards' }),
			flyer.animate(
				[
					{ transform: 'none', borderRadius: '0' },
					{ transform: invert(to, mediaRect, true), borderRadius: '1rem' },
				],
				{ duration: dur, easing: EASE_IN_OUT, fill: 'forwards' }
			),
			panel.animate(
				[
					{ transform: 'none', opacity: 1 },
					{ transform: invert(to, panelRect), opacity: 0 },
				],
				{ duration: dur, easing: EASE_IN_OUT, fill: 'forwards' }
			),
		];

		await Promise.all(anims.map((a) => a.finished.catch(() => {})));
		// The card reappears under the flyer's last frame, so the swap is invisible.
		target.style.visibility = '';
		dialog!.getAnimations({ subtree: true }).forEach((a) => a.cancel());
		img.style.opacity = '';
		flyer.remove();
		finish();
	}

	document.querySelectorAll<HTMLElement>('.producto-card').forEach((c) => {
		c.addEventListener('click', () => open(c));
	});

	dialog.querySelectorAll('[data-pm-close]').forEach((el) => el.addEventListener('click', () => close()));
	// Esc: run the animated close instead of the instant native one.
	dialog.addEventListener('cancel', (e) => {
		e.preventDefault();
		close();
	});

	// "Llenar solicitud": close, then jump to the form with this product picked.
	dialog.querySelector<HTMLAnchorElement>('[data-pm-form]')?.addEventListener('click', (e) => {
		e.preventDefault();
		const productId = card?.dataset.product;
		close(() => {
			const select = document.getElementById('sol-producto') as HTMLSelectElement | null;
			if (select && productId && !select.disabled) {
				select.value = productId;
				select.dispatchEvent(new Event('change', { bubbles: true }));
			}
			document.getElementById('solicitar-pedido')?.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth' });
		});
	});
}
