export default class FixedMenu {
	constructor({
		menuSelector = ".fixed-menu",
		btnSelector = ".fixed-menu__btn",
		navSelector = ".fixed-menu__nav",
		openClass = "is-open",
		invertClass = "is-inverted",
		watchSelector = "section, [class*='__block']",
		bgVar = "--section-bg",
		accentVar = "--accent",
	} = {}) {
		this.menu = document.querySelector(menuSelector);
		if (!this.menu) return;

		this.btn = this.menu.querySelector(btnSelector);
		this.nav = this.menu.querySelector(navSelector);
		this.openClass = openClass;
		this.invertClass = invertClass;
		this.watchSelector = watchSelector;
		this.bgVar = bgVar;

		this.accentColor = this.readCssVar(document.documentElement, accentVar);

		this.isOpen = false;
		this.init();
	}


	open() { this.isOpen = true; this.menu.classList.add(this.openClass); }
	close() { this.isOpen = false; this.menu.classList.remove(this.openClass); }
	toggle() { this.isOpen ? this.close() : this.open(); }

	destroy() {
		this.btn.removeEventListener("click", this.onBtnClick);
		document.removeEventListener("click", this.onDocClick);
		this.observer?.disconnect();
	}


	init() {
		this.onBtnClick = (e) => { e.preventDefault(); this.toggle(); };
		this.btn.addEventListener("click", this.onBtnClick);

		this.onDocClick = (e) => {
			if (this.isOpen && !this.menu.contains(e.target)) this.close();
		};
		document.addEventListener("click", this.onDocClick);

		this.initColorWatch();
	}
	initColorWatch() {
		const targets = [...document.querySelectorAll(this.watchSelector)];
		if (!targets.length) return;

		this.accentElements = targets.filter(el => this.isAccentBg(el));
		if (!this.accentElements.length) return;

		const OFFSET = 50;

		const check = () => {
			const menuRect = this.menu.getBoundingClientRect();
			const menuY = (menuRect.top + menuRect.bottom) / 2;

			const isOnGreen = this.accentElements.some(el => {
				const rect = el.getBoundingClientRect();
				return menuY >= rect.top - OFFSET && menuY <= rect.bottom + OFFSET;
			});

			this.menu.classList.toggle(this.invertClass, isOnGreen);
		};

		let ticking = false;
		this.onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => { check(); ticking = false; });
		};

		check();
		window.addEventListener("scroll", this.onScroll, { passive: true });
	}
	// initColorWatch() {
	// 	const targets = [...document.querySelectorAll(this.watchSelector)];
	// 	if (!targets.length) return;

	// 	this.accentElements = targets.filter(el => this.isAccentBg(el));
	// 	if (!this.accentElements.length) return;

	// 	this.observer = new IntersectionObserver(
	// 		(entries) => {
	// 			const anyVisible = entries.some(e => e.isIntersecting);
	// 			this.menu.classList.toggle(this.invertClass, anyVisible);
	// 		},
	// 		{
	// 			root: null,
	// 			rootMargin: "-85% 0px 0% 0px",
	// 			threshold: 0,
	// 		}
	// 	);

	// 	this.accentElements.forEach(el => this.observer.observe(el));
	// }

	isAccentBg(el) {
		const elBg = this.readCssVar(el, this.bgVar);
		if (!elBg || !this.accentColor) return false;
		return this.normalizeColor(elBg) === this.normalizeColor(this.accentColor);
	}

	readCssVar(el, varName) {
		const name = varName.startsWith("--") ? varName : `--${varName}`;
		const raw = getComputedStyle(el).getPropertyValue(name).trim();
		if (!raw) return null;
		const nested = raw.match(/^var\((--[\w-]+)\)/);
		if (nested) return this.readCssVar(el, nested[1]);
		return raw;
	}


	normalizeColor(str) {
		str = str.trim().toLowerCase();

		const hex = str.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
		if (hex) return `${parseInt(hex[1], 16)},${parseInt(hex[2], 16)},${parseInt(hex[3], 16)}`;

		const rgb = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
		if (rgb) return `${rgb[1]},${rgb[2]},${rgb[3]}`;

		const raw = str.match(/^(\d+),\s*(\d+),\s*(\d+)$/);
		if (raw) return `${raw[1]},${raw[2]},${raw[3]}`;

		return str;
	}
}