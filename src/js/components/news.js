import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

export default class NewsSlider {
	constructor({
		sectionSelector = '.news',
		swiperSelector = '.news__swiper',
		progressLineSelector = '.progress__line',
		progressFillSelector = '.progress__fill',
		thumbSelector = '.progress__thumb',
		prevBtnSelector = '.navigation__btn--prev',
		nextBtnSelector = '.navigation__btn--next',
	} = {}) {
		this.section = document.querySelector(sectionSelector);
		if (!this.section) return;

		this.swiperEl = this.section.querySelector(swiperSelector);
		this.progressLine = this.section.querySelector(progressLineSelector);
		this.progressFill = this.section.querySelector(progressFillSelector);
		this.thumb = this.section.querySelector(thumbSelector);

		this.swiper = null;
		this.prevBtn = this.section.querySelector(prevBtnSelector);
		this.nextBtn = this.section.querySelector(nextBtnSelector);

		this.init();
	}

	destroy() {
		this.swiper?.destroy(true, true);
	}

	init() {
		this.swiper = new Swiper(this.swiperEl, {
			modules: [Navigation],
			slidesPerView: 'auto',
			spaceBetween: 20,
			// grabCursor: true,
			// allowTouchMove: true,
			navigation: {
				prevEl: this.prevBtn,
				nextEl: this.nextBtn,
			},
			on: {
				progress: (swiper, progress) => this.updateThumb(progress),
			},
		});

		this.thumb.addEventListener('click', () => {
			this.swiper.isEnd ? this.swiper.slideTo(0) : this.swiper.slideNext();
		});


		// this.initDrag()
		// this.thumb.style.transition = 'none'
		// this.progressFill.style.transition = 'none'


		this.updateThumb(0);
	}

	updateThumb(progress) {
		const p = Math.max(0, Math.min(1, progress));
		const lineW = this.progressLine.offsetWidth;
		const thumbW = this.thumb.offsetWidth;
		const maxX = lineW - thumbW;
		const x = p * maxX;

		this.thumb.style.left = `${x}rem`;
		this.progressFill.style.width = `${p * 100}%`;
	}

	// initDrag() {

	// 	let isDragging = false;

	// 	this.thumb.addEventListener('mousedown', (e) => {
	// 		isDragging = true;
	// 		e.preventDefault();
	// 	});

	// 	document.addEventListener('mousemove', (e) => {
	// 		if (!isDragging) return;

	// 		const rect = this.progressLine.getBoundingClientRect();
	// 		const thumbW = this.thumb.offsetWidth;
	// 		const maxX = rect.width - thumbW;
	// 		const x = Math.max(0, Math.min(e.clientX - rect.left - thumbW / 2, maxX));
	// 		const progress = x / maxX;

	// 		const maxTranslate = this.swiper.maxTranslate();
	// 		const minTranslate = this.swiper.minTranslate();
	// 		this.swiper.setTranslate(minTranslate + (maxTranslate - minTranslate) * progress);
	// 		this.swiper.updateProgress();

	// 		this.updateThumb(progress);
	// 	});

	// 	document.addEventListener('mouseup', () => {
	// 		if (isDragging) {
	// 			this.swiper.updateProgress();
	// 			isDragging = false;
	// 		}
	// 	});
	// }
}