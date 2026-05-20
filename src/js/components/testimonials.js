
import Swiper from 'swiper';
import { EffectFade } from 'swiper/modules';

export default class TestimonialsSlider {
	constructor({
		sectionSelector = ".testimonials",
		swiperEl = ".testimonials__slider",
		stackSelector = ".testimonials__slider-items",
		thumbSelector = ".progress__thumb",
		fillSelector = ".progress__fill",
		progressSelector = ".progress",

	} = {}) {
		this.section = document.querySelector(sectionSelector);
		if (!this.section) return;

		this.swiperEl = this.section.querySelector(swiperEl);
		this.stack = this.section.querySelector(stackSelector);
		this.thumb = this.section.querySelector(thumbSelector);
		this.fill = this.section.querySelector(fillSelector);
		this.progress = this.section.querySelector(progressSelector);

		this.swiper = null;
		this.init();
	}

	destroy() {
		this.swiper?.destroy(true, true);
	}

	init() {
		// empty stack
		this.stack.innerHTML = "";

		this.swiper = new Swiper(this.swiperEl, {
			slidesPerView: "auto",
			modules: [EffectFade],
			grabCursor: true,
			fadeEffect: {
				crossFade: true,
			},
			spaceBetween: 10,
			speed: 600,
			allowTouchMove: true,
			on: {
				slideChange: () => this.onSlideChange(),
				resize: () => this.updateProgress(),
			},
		});

		this.thumb.addEventListener("click", () => {
			this.swiper.isEnd ? this.reset() : this.swiper.slideNext();
		});

		this.updateProgress();
	}

	onSlideChange() {
		const index = this.swiper.realIndex; // 0-based

		if (index === 0) {
			this.clearStack();
		} else {
			this.syncStack(index);
		}

		this.updateProgress();
	}

	syncStack(count) {
		const current = this.stack.children.length;

		if (count > current) {
			for (let i = current; i < count; i++) {
				this.addStackItem(i);
			}
		} else if (count < current) {
			for (let i = current; i > count; i--) {
				this.stack.lastElementChild?.remove();
			}
		}
	}

	addStackItem(colorIndex) {
		const el = document.createElement("div");
		el.className = "testimonials__slider-item";

		el.style.opacity = "0";
		el.style.transform = "translateX(50%) scaleY(0.8)";
		el.style.transition = "opacity 0.4s ease, transform 0.4s ease";

		this.stack.appendChild(el);

		el.getBoundingClientRect();
		el.style.opacity = "1";
		el.style.transform = "translateX(50%)";
	}

	clearStack() {
		const items = [...this.stack.children];
		items.forEach(item => {
			item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
			item.style.opacity = "0";
			item.style.transform = "translateX(50%) scaleY(0.8)";
		});
		setTimeout(() => { this.stack.innerHTML = ""; }, 350);
	}

	reset() {
		this.swiper.slideTo(0);
		this.clearStack();
		this.updateProgress();
	}

	updateProgress() {
		const total = this.swiper.slides.length;
		const index = this.swiper.realIndex;
		const pct = total > 1 ? index / (total - 1) : 0;

		const trackW = this.progress.offsetWidth;
		const thumbW = this.thumb.offsetWidth;
		const left = pct * (trackW - thumbW);

		this.fill.style.width = `${left + thumbW / 2}rem`;
		this.thumb.style.left = `${left}rem`;
	}
}