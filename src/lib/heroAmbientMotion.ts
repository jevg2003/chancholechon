import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

/**
 * Ambient hero motion: the floating/draggable "Desde 2019" badge, drifting
 * steam particles, and the glow pulse. All of it pauses automatically once
 * the hero scrolls offscreen so nothing animates unseen.
 *
 * @param onOffscreenChange notified so the carousel can also pause rotation.
 */
export function initHeroAmbientMotion(onOffscreenChange: (offscreen: boolean) => void) {
	const ambient: gsap.core.Tween[] = [];

	// Ambient badge float
	const badgeFloat = gsap.to('.hero-badge', {
		y: '+=8',
		rotation: 4,
		duration: 2.4,
		yoyo: true,
		repeat: -1,
		ease: 'sine.inOut',
		delay: 2.2,
	});
	ambient.push(badgeFloat);

	// The badge is a toy: grab it, throw it around the hero, and it lands
	// with a springy bounce.
	const draggables = Draggable.create('.hero-badge', {
		type: 'x,y',
		bounds: '.hero-section',
		inertia: true,
		edgeResistance: 0.75,
		onPress() {
			badgeFloat.kill();
			gsap.to(this.target, { scale: 1.15, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
		},
		onRelease() {
			gsap.to(this.target, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' });
		},
		onThrowComplete() {
			gsap.fromTo(
				this.target,
				{ scaleX: 1.25, scaleY: 0.8 },
				{ scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.3)' }
			);
		},
	});

	// Ambient particle drift (steam/spice feel)
	gsap.utils.toArray<HTMLElement>('.hero-particle').forEach((particle, i) => {
		ambient.push(
			gsap.to(particle, {
				y: '+=18',
				x: i % 2 === 0 ? '+=10' : '-=10',
				opacity: 0.6,
				duration: 3 + i * 0.6,
				yoyo: true,
				repeat: -1,
				ease: 'sine.inOut',
				delay: i * 0.4,
			})
		);
	});

	ambient.push(
		gsap.to('.hero-glow', {
			scale: 1.3,
			opacity: 0.55,
			duration: 3,
			yoyo: true,
			repeat: -1,
			ease: 'sine.inOut',
		})
	);

	let onscreen = false;
	const sync = () => {
		const active = onscreen && !document.hidden;
		onOffscreenChange(!active);
		ambient.forEach((t) => t.paused(!active));
	};
	const observer = new IntersectionObserver(([entry]) => {
		onscreen = entry.isIntersecting;
		sync();
	});
	const hero = document.getElementById('hero');
	if (hero) observer.observe(hero);
	document.addEventListener('visibilitychange', sync);
	sync();
	return () => {
		observer.disconnect();
		document.removeEventListener('visibilitychange', sync);
		draggables.forEach((d) => d.kill());
		ambient.forEach((t) => t.kill());
	};
}
