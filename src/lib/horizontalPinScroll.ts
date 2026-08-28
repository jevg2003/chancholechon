import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Desktop pin distance for the Somos horizontal scroll — exported so the
 * shape physics' offscreen-pause trigger can account for the same span. */
export const SOMOS_PIN_DISTANCE = 4200;

/**
 * Pins `.somos-historia` and scrubs `.somos-track` horizontally across its
 * panels, dwelling on each one so it can be read before advancing. Each
 * panel's content fades/slides in as it arrives — the first via a normal
 * ScrollTrigger, the rest via containerAnimation since they never cross a
 * vertical trigger point on their own.
 */
export function initSomosHorizontalScroll(): void {
	const panelCount = gsap.utils.toArray('.somos-panel').length;
	const stepPercent = 100 / panelCount;

	const scrollTween = gsap.timeline({
		scrollTrigger: {
			trigger: '.somos-historia',
			start: 'top top',
			end: `+=${SOMOS_PIN_DISTANCE}`,
			pin: true,
			scrub: 1,
		},
	});

	// Dwell on each panel so it can be read before the track moves on.
	scrollTween.to({}, { duration: 0.4 });
	for (let step = 1; step < panelCount; step++) {
		scrollTween
			.to('.somos-track', { xPercent: -stepPercent * step, duration: 0.5, ease: 'none' })
			.to({}, { duration: 0.45 });
	}

	gsap.utils.toArray<HTMLElement>('.somos-panel').forEach((panel, i) => {
		const inner = panel.querySelector('.somos-inner');
		if (i === 0) {
			gsap.from(inner, {
				autoAlpha: 0,
				y: 40,
				duration: 0.8,
				ease: 'power3.out',
				scrollTrigger: { trigger: panel, start: 'top 70%', toggleActions: 'play none none none' },
			});
			return;
		}
		gsap.from(inner, {
			autoAlpha: 0,
			y: 60,
			scale: 0.96,
			duration: 0.9,
			ease: 'power3.out',
			scrollTrigger: {
				containerAnimation: scrollTween,
				trigger: panel,
				start: 'left 65%',
				toggleActions: 'play none none none',
			},
		});
	});
}

/** Mobile/reduced-motion fallback: panels reveal as a plain vertical stack. */
export function initSomosVerticalReveal(reduceMotion: boolean): void {
	gsap.utils.toArray<HTMLElement>('.somos-panel').forEach((panel) => {
		gsap.from(panel, {
			autoAlpha: 0,
			y: reduceMotion ? 0 : 40,
			duration: reduceMotion ? 0.3 : 0.8,
			ease: 'power3.out',
			scrollTrigger: { trigger: panel, start: 'top 80%', toggleActions: 'play none none reverse' },
		});
	});
}
