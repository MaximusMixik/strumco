export default class Menu {
	constructor() {
		this._lockStatus = true;
		this.init();
	}

	_lockPadding(value) {
		document.querySelectorAll('[data-lp]').forEach(el => {
			el.style.paddingRight = value;
		});
		document.body.style.paddingRight = value;
	}

	bodyLock(delay = 500) {
		if (!this._lockStatus) return;
		this._lockPadding(window.innerWidth - document.body.offsetWidth + 'px');
		document.documentElement.classList.add('lock');
		this._lockStatus = false;
		setTimeout(() => (this._lockStatus = true), delay);
	}

	bodyUnlock(delay = 500) {
		if (!this._lockStatus) return;
		setTimeout(() => {
			this._lockPadding('');
			document.documentElement.classList.remove('lock');
		}, delay);
		this._lockStatus = false;
		setTimeout(() => (this._lockStatus = true), delay);
	}

	bodyLockToggle(delay = 500) {
		document.documentElement.classList.contains('lock')
			? this.bodyUnlock(delay)
			: this.bodyLock(delay);
	}

	menuInit() {
		if (!document.querySelector('.icon-menu')) return;
		document.addEventListener('click', e => {
			if (this._lockStatus && e.target.closest('.icon-menu')) {
				this.bodyLockToggle();
				document.documentElement.classList.toggle('menu-open');
			}
		});
	}

	init() {
		this.menuInit();
	}
}

// menu start
// let bodyLockStatus = true
// let bodyUnlock = (delay = 500) => {
// 	if (bodyLockStatus) {
// 		const lockPaddingElements = document.querySelectorAll("[data-lp]");
// 		setTimeout(() => {
// 			lockPaddingElements.forEach(lockPaddingElement => {
// 				lockPaddingElement.style.paddingRight = ''
// 			});
// 			document.body.style.paddingRight = ''
// 			document.documentElement.classList.remove("lock")
// 		}, delay)
// 		bodyLockStatus = false
// 		setTimeout(function () {
// 			bodyLockStatus = true
// 		}, delay)
// 	}
// }
// let bodyLock = (delay = 500) => {
// 	if (bodyLockStatus) {
// 		const lockPaddingElements = document.querySelectorAll("[data-lp]")
// 		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px'
// 		lockPaddingElements.forEach(lockPaddingElement => {
// 			lockPaddingElement.style.paddingRight = lockPaddingValue
// 		});

// 		document.body.style.paddingRight = lockPaddingValue
// 		document.documentElement.classList.add("lock")

// 		bodyLockStatus = false
// 		setTimeout(function () {
// 			bodyLockStatus = true
// 		}, delay)
// 	}
// }
// let bodyLockToggle = (delay = 500) => {
// 	if (document.documentElement.classList.contains('lock')) {
// 		bodyUnlock(delay)
// 	} else {
// 		bodyLock(delay)
// 	}
// }
// function menuInit() {
// 	if (document.querySelector(".icon-menu")) {
// 		document.addEventListener("click", function (e) {
// 			if (bodyLockStatus && e.target.closest('.icon-menu')) {
// 				bodyLockToggle();
// 				document.documentElement.classList.toggle("menu-open");
// 			}
// 		});
// 	};
// }
// menu end