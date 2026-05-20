export default class TailwindThemeColor {
	constructor(triggerSelector = '[data-theme]') {
		this.body = document.body
		this.triggers = document.querySelectorAll(triggerSelector)
		this.storageKey = 'theme'

		this.init()
	}

	getStorageValue(prop) {
		return localStorage.getItem(prop)
	}

	setStorageValue(prop, value) {
		localStorage.setItem(prop, value)
	}

	getPreferredTheme() {
		const savedTheme = this.getStorageValue(this.storageKey)

		if (savedTheme) return savedTheme

		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light'
	}

	setTheme(theme) {
		this.body.classList.remove('light', 'dark')
		this.body.classList.add(theme)
		this.setStorageValue(this.storageKey, theme)
		this.updateActiveButton(theme)
	}

	updateActiveButton(theme) {
		this.triggers.forEach(button => {
			button.classList.toggle(
				'active',
				button.dataset.theme === theme
			)
		})
	}

	buttonActions() {
		this.triggers.forEach(button => {
			button.addEventListener('click', () => {
				const theme = button.dataset.theme

				if (!theme) return

				this.setTheme(theme)
			})
		})
	}

	init() {
		const theme = this.getPreferredTheme()

		this.setTheme(theme)

		if (this.triggers.length) {
			this.buttonActions()
		}
	}
}