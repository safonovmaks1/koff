import Navigo from 'navigo';
import { BreadCrumbs } from './features/Breadcrumbs/Breadcrumbs';
import { Pagination } from './features/Pagination/Pagination';
import { productSlider } from './features/productSlider/productSlider';
import { Catalog } from './modules/Catalog/Catalog';
import { Footer } from './modules/Footer/Footer';
import { Header } from './modules/Header/Header';
import { Main } from './modules/Main/Main';
import { PageNotFound } from './modules/PageNotFound/PageNotFound';
import { ProductCard } from './modules/ProductCard/ProductCard';
import { ProductList } from './modules/ProductList/ProductList';
import { ApiService } from './services/ApiService';
import { FavoriteService } from './services/StorageService';
import './style.scss';

export const router = new Navigo('/', { linkSelector: 'a[href^="/"]' });

const init = () => {
	const api = new ApiService();

	new Header().mount();
	new Main().mount();
	// new Order().mount();
	new Footer().mount();

	// api.getProductCategories().then(data => {
	// 	new Catalog().mount(new Main().element, data);
	// 	router.updatePageLinks();
	// });

	router
		.on(
			'/',
			async () => {
				new Catalog().mount(new Main().element);
				const product = await api.getProducts();
				new ProductList().mount(new Main().element, product);
				router.updatePageLinks();
			},
			{
				leave(done) {
					new ProductList().unmount();
					new Catalog().unmount();
					done();
				},
				already(match) {
					match.route.handler(match);
				},
			},
		)
		.on(
			'/category',
			async ({ params: { slug, page = 1 } }) => {
				new Catalog().mount(new Main().element);
				const { data: products, pagination } = await api.getProducts({
					category: slug,
					page: page,
				});

				new BreadCrumbs().mount(new Main().element, [{ text: slug }]);
				new ProductList().mount(new Main().element, products, slug);
				if (pagination?.totalProducts > pagination?.limit) {
					new Pagination().mount(new ProductList().containerElement).update(pagination);
				}
				router.updatePageLinks();
			},
			{
				leave(done) {
					new BreadCrumbs().unmount();
					new ProductList().unmount();
					new Catalog().unmount();
					done();
				},
				already(match) {
					match.route.handler(match);
				},
			},
		)
		.on(
			'/favorite',
			async ({ params }) => {
				new Catalog().mount(new Main().element);
				const favorite = new FavoriteService().get();
				const { data: product, pagination } = await api.getProducts({
					list: favorite,
					page: params?.page || 1,
				});

				new BreadCrumbs().mount(new Main().element, [{ text: 'Избранное' }]);
				new ProductList().mount(
					new Main().element,
					product,
					'Избранное',
					'Вы ничего не добавили в избранное, пожалуйста, добавьте что-нибудь...',
				);
				if (pagination?.totalProducts > pagination?.limit) {
					new Pagination().mount(new ProductList().containerElement).update(pagination);
				}
				router.updatePageLinks();
			},
			{
				leave(done) {
					new BreadCrumbs().unmount();
					new ProductList().unmount();
					new Catalog().unmount();
					done();
				},
				already(match) {
					match.route.handler(match);
				},
			},
		)
		.on(
			'/search',
			async ({ params: { q } }) => {
				new Catalog().mount(new Main().element);
				const { data: product, pagination } = await api.getProducts({ q });

				new BreadCrumbs().mount(new Main().element, [{ text: 'Поиск' }]);
				new ProductList().mount(
					new Main().element,
					product,
					`Поиск: ${q}`,
					`Ничего не найдено по вашему запросу "${q}"`,
				);
				if (pagination?.totalProducts > pagination?.limit) {
					new Pagination().mount(new ProductList().containerElement).update(pagination);
				}
				router.updatePageLinks();
			},
			{
				leave(done) {
					new BreadCrumbs().unmount();
					new ProductList().unmount();
					new Catalog().unmount();
					done();
				},
				already(match) {
					match.route.handler(match);
				},
			},
		)
		.on(
			'/product/:id',
			async obj => {
				new Catalog().mount(new Main().element);
				const data = await api.getProductById(obj.data.id);
				console.log('data: ', data);
				new BreadCrumbs().mount(new Main().element, [
					{ text: data.category, href: `/category?slug=${data.category}` },
					{ text: data.name },
				]);
				new ProductCard().mount(new Main().element, data);
				productSlider();
			},
			{
				leave(done) {
					new Catalog().unmount();
					new BreadCrumbs().unmount();
					new ProductCard().unmount();
					done();
				},
			},
		)
		.on('/cart', () => {
			console.log('Cart');
		})
		.on('/order', () => {
			// new Order().mount(new Main().element);
			// router.updatePageLinks();
			console.log('Order');
		})
		.notFound(
			() => {
				new PageNotFound().mount(new Main().element);

				setTimeout(() => {
					router.navigate('/');
				}, 5000);
			},
			{
				leave(done) {
					new PageNotFound().unmount();
					done();
				},
			},
		);
	router.resolve();
};
init();
