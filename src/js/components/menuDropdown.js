export default class MenuDropdown {
	constructor({
		menuSelector = ".menu__list",
		itemSelector = ".menu__item",
		linkSelector = ".menu__link",
		subListSelector = ".menu__sub-list",
		activeClass = "is-active",
		activeLinkClass = "menu__link--active",
	} = {}) {
		this.list = document.querySelector(menuSelector);
		if (!this.list) return;

		this.items = [...this.list.querySelectorAll(itemSelector)];
		this.linkSelector = linkSelector;
		this.subListSelector = subListSelector;
		this.activeClass = activeClass;
		this.activeLinkClass = activeLinkClass;

		this.activeItem = null;
		this.init();
	}


	open(item) {
		if (item === this.activeItem) return;
		this.closeAll();
		this.activeItem = item;
		item.classList.add(this.activeClass);
		item.querySelector(this.linkSelector)?.classList.add(this.activeLinkClass);
		item.querySelector(this.subListSelector)?.classList.add(this.activeClass);
	}

	close(item) {
		item.classList.remove(this.activeClass);
		item.querySelector(this.linkSelector)?.classList.remove(this.activeLinkClass);
		item.querySelector(this.subListSelector)?.classList.remove(this.activeClass);
		if (this.activeItem === item) this.activeItem = null;
	}

	closeAll() {
		this.items.forEach(i => this.close(i));
	}

	destroy() {
		this.items.forEach((item, i) => {
			item.querySelector(this.linkSelector)
				?.removeEventListener("click", this.handlers[i]);
		});
		document.removeEventListener("click", this.onDocClick);
		this.closeAll();
	}


	init() {
		this.handlers = [];

		this.items.forEach(item => {
			const link = item.querySelector(this.linkSelector);
			const hasSub = !!item.querySelector(this.subListSelector);

			if (!link || !hasSub) {
				this.handlers.push(null);
				return;
			}

			const handler = (e) => {
				e.preventDefault();
				this.activeItem === item ? this.close(item) : this.open(item);
			};

			link.addEventListener("click", handler);
			this.handlers.push(handler);
		});

		this.onDocClick = (e) => {
			if (!this.list.contains(e.target)) this.closeAll();
		};
		document.addEventListener("click", this.onDocClick);
	}
}