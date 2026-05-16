import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { productService } from '../services/productService';
import type { Product } from '../types/product';

export default function Wishlist() {
	const { ids, toggleWishlist } = useWishlist();
	const { addItem } = useCart();
	const [items, setItems] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const loadWishlistProducts = async () => {
			if (ids.length === 0) {
				if (mounted) {
					setItems([]);
					setIsLoading(false);
				}
				return;
			}

			setIsLoading(true);

			const products = await Promise.all(
				ids.map((id) => productService.getById(String(id))),
			);

			if (mounted) {
				setItems(products.filter((product): product is Product => Boolean(product)));
				setIsLoading(false);
			}
		};

		void loadWishlistProducts();

		return () => {
			mounted = false;
		};
	}, [ids]);

	return (
		<div className="page">
			<SectionHeading
				eyebrow="Wishlist"
				title="Saved for later"
				description="Keep track of pieces you love and move them to cart anytime."
			/>

			{isLoading ? (
				<section className="empty-state">
					<p>Loading your wishlist...</p>
				</section>
			) : items.length === 0 ? (
				<section className="empty-state">
					<p>Your wishlist is empty.</p>
					<Link className="hero-link" to="/catalog">
						Browse catalog
					</Link>
				</section>
			) : (
				<section className="wishlist-grid" aria-label="Wishlist products">
					{items.map((product) => (
						<article className="product-card" key={product.id}>
							<Link className="product-image-wrap" to={`/product/${product.id}`}>
								<img
									alt={product.title}
									className="product-image"
									src={product.images[0] ?? ''}
								/>
							</Link>
							<div className="product-meta">
								<div>
									<p className="product-category">{product.category.name}</p>
									<h3>{product.title}</h3>
								</div>
								<p className="product-price">₹{product.price}</p>
							</div>
							<div className="wishlist-actions">
								<Button onClick={() => addItem(product)}>Add to cart</Button>
								<Button
									className="remove-btn"
									onClick={() => toggleWishlist(product.id)}
									variant="ghost"
								>
									Remove
								</Button>
							</div>
						</article>
					))}
				</section>
			)}
		</div>
	);
}
