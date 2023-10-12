export const likeSvg = async () => {
	const response = await fetch('/img/heart.svg');
	const svg = await response.text();
	return new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('svg');
};
