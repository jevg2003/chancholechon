import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

// 8-point polygons (same vertex count) so clip-path morphs smoothly between
// clearly different silhouettes.
const MORPH_POLYGONS = [
	'polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)', // circle-ish
	'polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)', // square
	'polygon(50% 0%, 75% 50%, 100% 100%, 75% 100%, 50% 100%, 25% 100%, 0% 100%, 25% 50%)', // triangle
	'polygon(50% 0%, 100% 38%, 100% 38%, 81% 100%, 50% 100%, 19% 100%, 0% 38%, 0% 38%)', // pentagon
	'polygon(50% 0%, 75% 25%, 100% 50%, 75% 75%, 50% 100%, 25% 75%, 0% 50%, 25% 25%)', // rhombus
];

/**
 * Playful physics for decorative shapes (Somos' Misión/Visión panels): drag
 * & fling them (Draggable + inertia), they spin on release, get expelled if
 * they land over the text, knock into each other, and wander/morph on their
 * own when idle. Returns a cleanup function that kills everything created.
 */
export function initInteractiveShapes(): () => void {
	const idleTweens: gsap.core.Animation[] = [];
	const allShapes = gsap.utils.toArray<HTMLElement>('.somos-shape');
	const wanderOf = new Map<HTMLElement, gsap.core.Tween>();
	const draggables: Draggable[] = [];
	const panels = new Map<Element, gsap.core.Animation[]>();

	// Dragging is desktop-pointer only: on touch screens a draggable shape
	// (touch-action: none) would swallow scroll gestures.
	const canDrag = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

	function expelFromText(shape: HTMLElement) {
		const inner = shape.closest('.somos-panel')?.querySelector('.somos-inner');
		if (!inner) return;
		const s = shape.getBoundingClientRect();
		const t = inner.getBoundingClientRect();
		const m = 20;
		const overlaps = s.right > t.left - m && s.left < t.right + m && s.bottom > t.top - m && s.top < t.bottom + m;
		if (!overlaps) return;
		const pushes = [
			{ axis: 'x', v: t.left - m - s.right },
			{ axis: 'x', v: t.right + m - s.left },
			{ axis: 'y', v: t.top - m - s.bottom },
			{ axis: 'y', v: t.bottom + m - s.top },
		];
		const best = pushes.reduce((a, b) => (Math.abs(a.v) < Math.abs(b.v) ? a : b));
		gsap.to(shape, { [best.axis]: `+=${best.v}`, duration: 0.65, ease: 'back.out(1.8)' });
	}

	// Arcade-style collision: a dragged/thrown shape knocks away any shape
	// it touches, sending it flying with a spin.
	function knockOthers(shape: HTMLElement) {
		const panel = shape.closest('.somos-panel');
		const a = shape.getBoundingClientRect();
		allShapes.forEach((other) => {
			if (other === shape || other.closest('.somos-panel') !== panel) return;
			const b = other.getBoundingClientRect();
			const dx = b.left + b.width / 2 - (a.left + a.width / 2);
			const dy = b.top + b.height / 2 - (a.top + a.height / 2);
			const dist = Math.hypot(dx, dy);
			const min = (a.width + b.width) / 2;
			if (dist === 0 || dist >= min) return;
			const force = (min - dist) * 1.6 + 50;
			wanderOf.get(other)?.pause();
			gsap.to(other, {
				x: `+=${(dx / dist) * force}`,
				y: `+=${(dy / dist) * force}`,
				rotation: `+=${gsap.utils.random(-180, 180)}`,
				duration: 0.7,
				ease: 'power2.out',
				overwrite: true,
				onComplete: () => {
					expelFromText(other);
					wanderOf.get(other)?.invalidate().play();
				},
			});
		});
	}

	function setupShape(shape: HTMLElement) {
		if (canDrag) {
			shape.style.pointerEvents = 'auto';
			shape.style.cursor = 'grab';
			shape.style.touchAction = 'none';
		}
		const panel = shape.closest<HTMLElement>('.somos-panel')!;
		if (!panels.has(panel)) panels.set(panel, []);

		// Idle wander: small random strolls, re-rolled on every repeat.
		const wander = gsap.to(shape, {
			x: () => `+=${gsap.utils.random(-45, 45)}`,
			y: () => `+=${gsap.utils.random(-35, 35)}`,
			rotation: () => `+=${gsap.utils.random(-50, 50)}`,
			duration: () => gsap.utils.random(2.5, 4.5),
			ease: 'sine.inOut',
			repeat: -1,
			repeatRefresh: true,
			// On touch screens the faint shapes may drift behind the text —
			// that's fine there, so only desktop expels them.
			onRepeat: () => canDrag && expelFromText(shape),
		});
		wanderOf.set(shape, wander);
		idleTweens.push(wander);
		panels.get(panel)!.push(wander);

		// Idle morph: cycle through visibly different silhouettes.
		if (shape.classList.contains('somos-morph')) {
			gsap.set(shape, { clipPath: MORPH_POLYGONS[0] });
			const order = gsap.utils.shuffle([...MORPH_POLYGONS.slice(1), MORPH_POLYGONS[0]]);
			const morph = gsap.timeline({ repeat: -1 });
			order.forEach((poly) => {
				morph.to(shape, { clipPath: poly, duration: gsap.utils.random(1.6, 2.6), ease: 'sine.inOut' });
			});
			idleTweens.push(morph);
			panels.get(panel)!.push(morph);
		}

		if (!canDrag) return;

		draggables.push(
			...Draggable.create(shape, {
				type: 'x,y',
				bounds: panel,
				inertia: true,
				edgeResistance: 0.7,
				onPress() {
					wander.pause();
					gsap.to(shape, { scale: 1.25, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
				},
				onDrag() {
					knockOthers(shape);
				},
				onRelease() {
					gsap.to(shape, {
						scale: 1,
						rotation: `+=${gsap.utils.random(-240, 240)}`,
						duration: 0.9,
						ease: 'power2.out',
					});
				},
				onThrowUpdate() {
					knockOthers(shape);
				},
				onThrowComplete() {
					gsap.fromTo(
						shape,
						{ scaleX: 1.25, scaleY: 0.8 },
						{ scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.35)' }
					);
					expelFromText(shape);
					// Re-record the wander from wherever the shape landed —
					// resuming the stale tween used to drag it back home.
					wander.invalidate().restart(true);
				},
			})
		);
	}

	allShapes.forEach(setupShape);

	// Observe each panel, including horizontal transforms. Previously every
	// panel's wander and clip-path morph ran throughout the whole section.
	const visible = new Set<Element>();
	idleTweens.forEach((t) => t.pause());
	const syncIdle = () => panels.forEach((tweens, panel) => {
		tweens.forEach((t) => t.paused(document.hidden || !visible.has(panel)));
	});
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
		syncIdle();
	});
	panels.forEach((_, panel) => observer.observe(panel));
	document.addEventListener('visibilitychange', syncIdle);

	return () => {
		draggables.forEach((d) => d.kill());
		observer.disconnect();
		document.removeEventListener('visibilitychange', syncIdle);
		idleTweens.forEach((t) => t.kill());
		gsap.set(allShapes, { clearProps: 'all' });
	};
}
