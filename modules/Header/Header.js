import { Logo } from '../../features/Logo/Logo';
import { likeSvg } from '../../features/likeSvg/likeSvg';
import { addContainer } from '../addContainer';

export class Header {
	static instance = null;

	constructor() {
		if (!Header.instance) {
			Header.instance = this;
			this.element = document.createElement('header');
			this.element.classList.add('header');
			this.containerElement = addContainer(this.element, 'header__container');
			this.isMounted = false;
		}

		return Header.instance;
	}

	mount() {
		if (this.isMounted) {
			return;
		}

		const logo = new Logo('header').create();
		const searchForm = this.getSearchForm();
		const navigation = this.getNavigation();

		this.containerElement.append(logo, searchForm, navigation);

		document.body.append(this.element);
		this.isMounted = true;
	}

	unmount() {
		this.element.remove();
		this.isMounted = false;
	}

	getSearchForm() {
		const searchForm = document.createElement('form');
		searchForm.classList.add('header__search');
		searchForm.method = 'get';

		const input = document.createElement('input');
		input.classList.add('header__input');
		input.type = 'search';
		input.name = 'search';
		input.placeholder = 'Введите запрос';

		const button = document.createElement('button');
		button.classList.add('header__btn');
		button.type = 'submit';
		button.innerHTML = `
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M7.66659 13.9999C11.1644 13.9999 13.9999 11.1644 13.9999 7.66659C13.9999 4.16878 11.1644 1.33325 7.66659 1.33325C4.16878 1.33325 1.33325 4.16878 1.33325 7.66659C1.33325 11.1644 4.16878 13.9999 7.66659 13.9999Z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M14.6666 14.6666L13.3333 13.3333"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		`;

		searchForm.append(input, button);
		return searchForm;
	}

	getNavigation() {
		const navigation = document.createElement('nav');
		navigation.classList.add('header__control');

		const favoriteLink = document.createElement('a');
		favoriteLink.classList.add('header__link');
		favoriteLink.href = '/favorite';

		const favoriteText = document.createElement('span');
		favoriteText.classList.add('header__link-text');
		favoriteText.textContent = 'Избранное';
		favoriteLink.append(favoriteText);

		likeSvg().then(svg => {
			favoriteLink.append(svg);
		});

		const cartLink = document.createElement('a');
		cartLink.classList.add('header__link');
		cartLink.href = '/cart';

		const linkText = document.createElement('span');
		linkText.classList.add('header__link-text');
		linkText.textContent = 'Корзина';

		const countElement = document.createElement('span');
		countElement.classList.add('header__count');
		countElement.textContent = '(5)';

		cartLink.append(linkText, countElement);

		cartLink.insertAdjacentHTML(
			'beforeend',
			`
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M5.87329 1.33325L3.45996 3.75325"
				stroke="#1C1C1C"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M10.1267 1.33325L12.54 3.75325"
				stroke="#1C1C1C"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M1.33325 5.23324C1.33325 3.9999 1.99325 3.8999 2.81325 3.8999H13.1866C14.0066 3.8999 14.6666 3.9999 14.6666 5.23324C14.6666 6.66657 14.0066 6.56657 13.1866 6.56657H2.81325C1.99325 6.56657 1.33325 6.66657 1.33325 5.23324Z"
				stroke="#1C1C1C"
			/>
			<path d="M6.50659 9.33325V11.6999" stroke="#1C1C1C" stroke-linecap="round" />
			<path d="M9.57324 9.33325V11.6999" stroke="#1C1C1C" stroke-linecap="round" />
			<path
				d="M2.33325 6.66675L3.27325 12.4267C3.48659 13.7201 3.99992 14.6667 5.90658 14.6667H9.92659C11.9999 14.6667 12.3066 13.7601 12.5466 12.5067L13.6666 6.66675"
				stroke="#1C1C1C"
				stroke-linecap="round"
			/>
		</svg>
		`,
		);

		navigation.append(favoriteLink, cartLink);
		this.countElement = countElement;
		return navigation;
	}

	changeCount(n) {
		// todo n - get
		this.countElement.textContent = `(${n})`;
	}
}
