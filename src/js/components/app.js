import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class AppSection {
	constructor(section) {
		if (!section) return;

		this.section = section;
		this.wrap = section.querySelector(".app__wrap");
		// this.track = section.querySelector(".app__track");
		this.track = section.querySelector(".app__content");
		this.progress = section.querySelector(".app__progress");

		if (!this.wrap || !this.track || !this.progress) return;

		this.fill = this.progress.querySelector(".progress__fill");
		this.thumb = this.progress.querySelector(".progress__thumb");
		this.endApp = section.querySelector(".app__end");
		this.image = section.querySelector(".app__image");
		this.imageMob = section.querySelector(".app__image--mob");
		this.dark = section.querySelector(".app__dark"); //app__content
		// app__dark

		this._phonePinned = false;
		this._phonePinnedAt = null;

		// Следующий сиблинг — якорь для возврата элемента на место
		this._imageNextSibling = this.image ? this.image.nextElementSibling : null;

		this.init();
	}

	init() {
		this._setupScroll();
	}

	_setupScroll() {
		const getMax = () => this.track.scrollWidth - window.innerWidth;
		const isDesktop = () => window.innerWidth >= 1024;

		// Кэшируем оверлей больше не нужен, но кэшируем thumb для класса
		this.overlayThumb = null; // убираем

		this.st = ScrollTrigger.create({
			trigger: this.section,
			start: "top top",
			// start: () => isDesktop() ? "top top" : "bottom bottom",
			end: () => `+=${getMax()}`,
			pin: true,
			scrub: 1,

			onUpdate: (self) => {
				const p = self.progress;
				const scrollPx = self.scroll() - self.start;

				this.section.classList.toggle(
					'is-scrolled',
					scrollPx > 20
				);
				const max = getMax();

				gsap.set(this.track, { x: -max * p });

				this._updateProgress(p, max);

				if (isDesktop()) {
					this._updatePhone(p);
				}


				if (window.innerWidth < 640 && this.imageMob) {
					const startProgress = 0.95;
					const endProgress = 0.99;
					if (p >= startProgress) {
						const progressInRange = Math.min(1, (p - startProgress) / (endProgress - startProgress));

						// начальная высота  изображения
						const startHeight = 800;
						// const startHeight = this.imageMob.offsetHeight;

						const currentHeight = startHeight - (startHeight - 265) * progressInRange;

						gsap.set(this.imageMob, { maxHeight: `${currentHeight}rem` });
					} else {
						gsap.set(this.imageMob, { maxHeight: "none" });
					}
				}
			},

			invalidateOnRefresh: true,
		});
	}

	_getEndAppBoundaryPx(max, progress) {
		if (!this.endApp) return Infinity;

		const scrolled = max * progress;
		const progressLeft = this.progress.offsetLeft;
		const endAppLeft = this.endApp.offsetLeft;
		const thumbSize = this.thumb.offsetWidth;

		// Граница = момент когда правый край thumb касается левого края end-app
		return endAppLeft - scrolled - progressLeft - thumbSize / 2 + (thumbSize / 2);
	}

	_updateProgress(progress, max) {
		const barWidth = this.progress.offsetWidth;
		const thumbSize = this.thumb.offsetWidth;
		const left = (barWidth - thumbSize) * progress;
		const fillRight = left + thumbSize / 2; // правый край fill в px

		this.thumb.style.left = `${left}rem`;
		this.fill.style.width = `${fillRight}rem`;

		// Граница в px — абсолютная точка переключения цвета
		const boundaryPx = this._getEndAppBoundaryPx(max, progress);

		// Переводим в % от текущей ширины fill для градиента
		// Градиент рисуется внутри fill (от 0 до fillRight px)
		// поэтому граница = boundaryPx / fillRight * 100%
		const boundaryInFill = fillRight > 0
			? Math.min(100, Math.max(0, (boundaryPx / fillRight) * 100))
			: 100;

		this.fill.style.backgroundImage = `linear-gradient(
        to right,
        #C0DB4D 0%,
        #C0DB4D ${boundaryInFill.toFixed(3)}%,
        #1C252D ${boundaryInFill.toFixed(3)}%,
        #1C252D 100%
    )`;

		// Класс на thumb — когда fillRight пересёк границу
		const thumbOnAccent = fillRight > boundaryPx;
		this.thumb.classList.toggle('is-dark', thumbOnAccent);
	}

	_updatePhone(progress) {
		if (!this.image) return;

		//Фиксируем
		if (!this._phonePinned) {
			const rect = this.image.getBoundingClientRect();
			const vpCenterX = window.innerWidth / 2;
			const imgCenterX = rect.left + rect.width / 2;

			if (imgCenterX > vpCenterX + 10) return; // ещё не доехал до центра

			this._phonePinned = true;
			this._phonePinnedAt = progress;

			// Фиксируем размеры до переноса
			const w = rect.width;
			const h = rect.height;

			// Координаты: секция запинена → top вьюпорта = top секции
			const pinTop = rect.top;
			const pinLeft = rect.left;

			// Резервируем место в потоке — вставляем пустой placeholder
			this._placeholder = document.createElement("div");
			this._placeholder.className = 'app__image-placeholder'
			this._placeholder.style.cssText = `
        width: ${w}rem;
        height: ${h}rem;
      `;
			this.image.parentNode.insertBefore(this._placeholder, this.image);
			// this.image.nextElementSibling.classList.add('add-margin')

			// Задаём позицию ДО переноса — элемент ещё в старом родителе,
			// if (this.dark) this.dark.classList.add("app__dark--phone-fixed");

			// но уже получает нужные координаты
			Object.assign(this.image.style, {
				position: "absolute",
				top: `${pinTop}rem`,
				left: `${pinLeft}rem`,
				width: `${w}rem`,
				height: `${h}rem`,
				margin: "0",
				zIndex: "10",
			});

			// Переносим в секцию — визуально ничего не меняется
			this.section.appendChild(this.image);
		}

		//Возвращаем при скролле назад
		if (this._phonePinned && progress < this._phonePinnedAt - 0.005) {
			this._releasePhone();
		}
	}

	_releasePhone() {
		if (!this._phonePinned || !this.image || !this._placeholder) return;

		// Снимаем inline-стили фиксации
		Object.assign(this.image.style, {
			position: "",
			top: "",
			left: "",
			width: "",
			height: "",
			margin: "",
			zIndex: "",
		});

		// Возвращаем на место placeholder
		this._placeholder.parentNode.insertBefore(this.image, this._placeholder);
		this._placeholder.remove();
		this._placeholder = null;

		// if (this.dark) this.dark.classList.remove("app__dark--phone-fixed");

		this._phonePinned = false;
		this._phonePinnedAt = null;
	}

	destroy() {
		this._releasePhone();
		if (this.st) this.st.kill();

		Object.assign(this.progress.style, {
			position: "",
			bottom: "",
			left: "",
			right: "",
			zIndex: "",
		});

		gsap.set(this.track, { clearProps: "x" });
		this.wrap.style.overflow = "";
	}
}