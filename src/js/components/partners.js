import Swiper from 'swiper';
import { EffectFade, Navigation } from 'swiper/modules';
export default function initPartnersSlider() {
	const sliders = document.querySelectorAll('.partners__slider');
	if (sliders.length === 0) return;

	sliders.forEach(sliderEl => {
		const swiper = new Swiper(sliderEl, {
			modules: [EffectFade, Navigation],
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			grabCursor: true,
			// loop: true,
			speed: 1200,
			navigation: {
				prevEl: sliderEl.querySelector('.navigation__btn--prev'),
				nextEl: sliderEl.querySelector('.navigation__btn--next'),
			},
		});
	});
};
