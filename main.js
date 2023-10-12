import Navigo from 'navigo';
import { Catalog } from './modules/Catalog/Catalog';
import { Footer } from './modules/Footer/Footer';
import { Header } from './modules/Header/Header';
import { Main } from './modules/Main/Main';
import { ProductList } from './modules/ProductList/ProductList';
import { ApiService } from './services/ApiService';
import './style.scss';

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
		},
	);
};

const init = () => {
	const api = new ApiService();
	const router = new Navigo('/', { linkSelector: 'a[href^="/"]' });

	new Header().mount();
	new Main().mount();
	// new Order().mount(new Main().element);
	new Footer().mount();

	api.getProductCategories().then(data => {
		new Catalog().mount(new Main().element, data);
		router.updatePageLinks();
	});
	productSlider();

	router
		.on(
			'/',
			async () => {
				const product = await api.getProducts();
				new ProductList().mount(new Main().element, product);
				router.updatePageLinks();
			},
			{
				leave(done) {
					new ProductList().unmount();
					done();
				},
				already() {
					console.log('already');
				},
			},
		)
		.on(
			'/category',
			async ({ params: { slug } }) => {
				const product = await api.getProducts();
				new ProductList().mount(new Main().element, product, slug);
			},
			{
				leave(done) {
					new ProductList().unmount();
					done();
				},
			},
		)
		.on(
			'/favorite',
			async () => {
				const product = await api.getProducts();
				new ProductList().mount(new Main().element, product, 'Favorite');
				router.updatePageLinks();
			},
			{
				leave(done) {
					new ProductList().unmount();
					done();
				},
			},
		)
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
			new Main().element.innerHTML = `
				<h2>Page not found</h2>
				<p>через 5 секунд вы будете на
					<a href="/">главную страницу</a>
				</p>
			`;

			setTimeout(() => {
				router.navigate('/');
			}, 5000);
		});
	router.resolve();
};
init();
