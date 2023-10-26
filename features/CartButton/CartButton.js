import { Header } from '../../modules/Header/Header';
import { ApiService } from '../../services/ApiService';

export class CartButton {
	constructor(className, text) {
		this.text = text;
		this.className = className;
	}

	create(id) {
		const button = document.createElement('button');
		button.classList.add('btn', 'btn--inverse', this.className);
		button.dataset.id = id;
		button.textContent = this.text;

		button.addEventListener('click', async () => {
			const { totalCount } = await new ApiService().postProductToCart(id);
			new Header().changeCount(totalCount);
		});

		return button;
	}
}
