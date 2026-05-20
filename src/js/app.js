import '../scss/app.scss'

import TailwindThemeColor from './components/TailwindThemeColor.js';
import Menu from './components/header-menu.js';
import MenuDropdown from "./components/menuDropdown.js";
import FixedMenu from './components/fixedMenu.js';

import HeroMedia from './components/hero.js';
import AdvantagesTabs from './components/advantages.js';
import initPartnersSlider from './components/partners.js';
import NewsSlider from './components/news.js';
import TestimonialsSlider from './components/testimonials.js';
import AppSection from "./components/app.js";

function addLoadedClass() {
	if (document.documentElement.classList.contains('loading')) return;
	window.addEventListener('load', () => {
		setTimeout(function () { document.documentElement.classList.add('loaded') }, 0);
		;
	});
}

document.addEventListener('DOMContentLoaded', () => {
	new TailwindThemeColor() // '[data-theme] -default  trigger selector 
	addLoadedClass()
	new Menu();
	new MenuDropdown();
	new FixedMenu(); //{ greenSections: ".section-green, .hero--accent" }
	new HeroMedia()
	new AdvantagesTabs()
	new TestimonialsSlider();
	initPartnersSlider();
	new AppSection(document.querySelector(".app"));
	new NewsSlider();
});

// import Game from './components/example-component.vue';

// import { createApp, ref } from 'vue';
// const app = createApp({
//   setup() {
//     return {
//       count: ref(0),
//     };
//   }
// });

// app.component('mav-game', Game);
// app.mount('#app');

