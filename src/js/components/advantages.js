export default class AdvantagesTabs {
	constructor() {
		this.tabsList = document.querySelectorAll('.advantages .advantages__block')
		this.init()
	}
	closeAllTabs() {
		for (const tab of this.tabsList) tab.classList.add('hide')
	}
	openCurrentTab(currentTab) {
		// if (!currentTab.closest('.hide'))
		// 	currentTab.classList.add('hide')
		// else
		currentTab.classList.remove('hide')
	}
	onTabClick(e) {
		const currentTab = e.target.closest('.advantages__block')
		if (!currentTab) return
		this.closeAllTabs()
		this.openCurrentTab(currentTab)
	}
	init() {
		for (const tab of this.tabsList) {
			tab.classList.add('hide')
			tab.addEventListener('click', (e) => this.onTabClick(e))
		}
	}
}