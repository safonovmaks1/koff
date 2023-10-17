import Navigo from 'navigo';
import { Pagination } from './features/Pagination/Pagination';
import { Catalog } from './modules/Catalog/Catalog';
import { Footer } from './modules/Footer/Footer';
import { Header } from './modules/Header/Header';
import { Main } from './modules/Main/Main';
import { ProductList } from './modules/ProductList/ProductList';
import { ApiService } from './services/ApiService';
import { FavoriteService } from './services/StorageService';
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
	// new Order().mount();
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
				already(match) {
					match.route.handler(match);
				},
			},
		)
		.on(
			'/category',
			async ({ params: { slug, page } }) => {
				const { data: products, pagination } = await api.getProducts({
					category: slug,
					page: page || 1,
				});

				new ProductList().mount(new Main().element, products, slug);
				new Pagination().mount(new ProductList().containerElement).update(pagination);
				router.updatePageLinks();
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
				const favorite = new FavoriteService().get();
				const { data: product } = await api.getProducts({ list: favorite });
				new ProductList().mount(
					new Main().element,
					product,
					'Избранное',
					'Вы ничего не добавили в избранное, пожалуйста, добавьте что-нибудь...',
				);
				router.updatePageLinks();
			},
			{
				leave(done) {
					new ProductList().unmount();
					done();
				},
				already(match) {
					match.route.handler(match);
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
			// new Order().mount(new Main().element);
			// router.updatePageLinks();
			console.log('Order');
		})
		.notFound(() => {
			new Main().element.innerHTML = `
			<div class="container">
				<h2>Page not found</h2>
				<p>через 5 секунд вы будете на
					<a href="/">главную страницу</a>
				</p>
			</div>
			`;

			setTimeout(() => {
				router.navigate('/');
			}, 5000);
		});
	router.resolve();
};
init();
