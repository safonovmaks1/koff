let like = null;

export const likeSvg = async () => {
	if (!like) {
		const response = await fetch('/img/heart.svg');
		const svg = await response.text();
		like = new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('svg');
	}
	return like.cloneNode(true);
};
