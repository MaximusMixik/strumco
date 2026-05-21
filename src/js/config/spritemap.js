const spritemapUrl = import.meta.env.DEV
	? '/__spritemap'
	: import.meta.env.BASE_URL + 'spritemap.svg';

fetch(spritemapUrl)
	.then(r => r.text())
	.then(svg => {
		const div = document.createElement('div');
		div.style.cssText = 'display:none;position:absolute';
		div.innerHTML = svg;
		document.body.prepend(div);
	});