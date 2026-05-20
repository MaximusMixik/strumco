export default class HeroMedia {
	constructor({
		sectionSelector = ".hero",
		cardSelector = ".media-hero__item",
		mediaSelector = ".hero__media-item",
		activeCardClass = "is-active",
		activeMediaClass = "is-active",
		activeSectionClass = "hero--media-open",
	} = {}) {
		this.section = document.querySelector(sectionSelector);
		if (!this.section) return;

		this.cards = [...this.section.querySelectorAll(cardSelector)];
		this.mediaItems = [...this.section.querySelectorAll(mediaSelector)];

		this.activeCardClass = activeCardClass;
		this.activeMediaClass = activeMediaClass;
		this.activeSectionClass = activeSectionClass;

		this.activeIndex = null;
		this.init();
	}


	open(index) {
		if (index === this.activeIndex) return;
		this.apply(index);
	}

	close() {
		this.apply(null);
	}

	destroy() {
		this.cards.forEach((card, i) => {
			card.removeEventListener("click", this.handlers[i].click);
			card.removeEventListener("mouseenter", this.handlers[i].enter);
			card.removeEventListener("mouseleave", this.handlers[i].leave);
		});
		document.removeEventListener("click", this.onDocClick);
		this.close();
	}


	init() {
		this.handlers = [];

		this.cards.forEach((card, i) => {
			const targetIndex = this.resolveIndex(card, i);

			const handlers = {
				click: (e) => { e.preventDefault(); this.toggle(targetIndex); },
				enter: () => this.previewEnter(targetIndex),
				leave: () => this.previewLeave(),
			};

			card.addEventListener("click", handlers.click);

			this.handlers.push(handlers);
		});

		this.onDocClick = (e) => {
			const inSection = this.section.contains(e.target);
			const onCard = this.cards.some(c => c.contains(e.target));
			if (!inSection || (inSection && !onCard)) {
				this.close();
			}
		};
		document.addEventListener("click", this.onDocClick);
	}

	resolveIndex(card, fallback) {
		if (card.dataset.mediaIndex !== undefined) return +card.dataset.mediaIndex;
		const href = card.getAttribute("href") || "";
		const match = href.match(/#media-(\d+)/);
		if (match) return +match[1] - 1;
		return fallback;
	}

	toggle(index) {
		this.activeIndex === index ? this.close() : this.open(index);
	}

	apply(index) {
		this.activeIndex = index;

		this.cards.forEach((card, i) => {
			const resolved = this.resolveIndex(card, i);
			card.classList.toggle(this.activeCardClass, resolved === index);
		});

		this.mediaItems.forEach((item, i) => {
			item.classList.toggle(this.activeMediaClass, i === index);
		});

		this.section.classList.toggle(this.activeSectionClass, index !== null);
	}

	previewEnter(index) {
		if (this.activeIndex !== null) return;
		this.mediaItems.forEach((item, i) =>
			item.classList.toggle(`${this.activeMediaClass}--preview`, i === index)
		);
	}

	previewLeave() {
		this.mediaItems.forEach(item =>
			item.classList.remove(`${this.activeMediaClass}--preview`)
		);
	}
}

// window.heroMedia.open(0); // open 1st
// window.heroMedia.close(); // reset
// window.heroMedia.destroy(); // remove all  listeners
// document.addEventListener("DOMContentLoaded", () => {
// 	window.heroMedia = new HeroMedia();
// });