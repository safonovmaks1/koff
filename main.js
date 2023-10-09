import { Footer } from './modules/Footer/Footer';
import { Main } from './modules/Main/Main';
import { Header } from './modules/Header/Header';
import './style.scss';
import Navigo from 'navigo';
import { Order } from './modules/Order/Order';

const productSlider = () => {
	Promise.all([import('swiper/modules'), import('swiper'), import('swiper/css')]).then(
		([{ Navigation, Thumbs }, Swiper]) => {
			const swiperThumbnails = new Swiper.default('.product__slider-thumbnails', {
				spaceBetween: 10,
				slidesPerView: 4,
				freeMode: true,
				watchSlidesProgress: true,
			});
			new Swiper.default('.product__slider-main', {
				spaceBetween: 10,
				navigation: {
					nextEl: '.product__arrow-next',
					prevEl: '.product__arrow-prev',
				},
				modules: [Navigation, Thumbs],
				thumbs: {
					swiper: swiperThumbnails,
				},
			});
		}
	);
};

const init = () => {
	new Header().mount();
	new Main().mount();
	new Order().mount(new Main().element);
	new Footer().mount();
	productSlider();

	const router = new Navigo('/', { linkSelector: 'a[href^="/"]' });
	router
		.on('/', () => {
			console.log('Main Page');
		})
		.on('/category', obj => {
			console.log('obj: ', obj);
			console.log('Category');
		})
		.on('/favorite', () => {
			console.log('Favorite');
		})
		.on('/search', () => {
			console.log('Search');
		})
		.on('/product/:id', obj => {
			console.log('obj: ', obj);
		})
		.on('/cart', () => {
			console.log('Cart');
		})
		.on('/order', () => {
			console.log('Order');
		})
		.notFound(() => {
			document.body.innerHTML = '<h2>Page not found</h2>';
		});
	router.resolve();
};
init();
