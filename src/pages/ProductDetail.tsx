import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import ImageGallery from '../components/product/ImageGallery';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { productService } from '../services/productService';
import type { Product } from '../types/product';

export default function ProductDetail() {
  const { productId } = useParams();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      if (!productId) {
        if (mounted) {
          setProduct(undefined);
          setIsLoading(false);
        }
        return;
      }

      const item = await productService.getById(productId);
      if (mounted) {
        setProduct(item);
        setIsLoading(false);
      }
    };

    void loadProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <div className="page">
        <section className="empty-state">
          <p>Loading product...</p>
        </section>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <section className="empty-state">
          <p>Product not found.</p>
          <Link to="/catalog" className="hero-link">
            Back to catalog
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page detail-page">
      <ImageGallery images={product.images} title={product.title} />
      <section className="detail-meta">
        <p className="section-eyebrow">{product.category.name}</p>
        <h1>{product.title}</h1>
        <p className="detail-price">₹{product.price}</p>
        <p className="detail-description">{product.description}</p>
        <button
          className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          type="button"
        >
          {isInWishlist(product.id) ? 'Wishlisted' : 'Add to wishlist'}
        </button>
        <Button onClick={() => addItem(product)}>Add to cart</Button>
      </section>
    </div>
  );
}
