import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useWishlist } from '../../hooks/useWishlist';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img
          src={product.images[0] ?? ''}
          alt={product.title}
          className="product-image"
        />
      </Link>
      <div className="product-meta">
        <div>
          <p className="product-category">{product.category.name}</p>
          <h3>{product.title}</h3>
        </div>
        <p className="product-price">₹{product.price}</p>
      </div>
      <p className="product-description ">{product.description}</p>
      <div className="product-actions">
        <button
          className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          type="button"
        >
          {isInWishlist(product.id) ? 'Wishlisted' : 'Add to wishlist'}
        </button>
        <Button className="product-add" onClick={() => onAddToCart(product)}>
          Add to cart
        </Button>
      </div>
    </article>
  );
}
