import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import ProductGrid from '../components/product/ProductGrid';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/productService';
import type { Product } from '../types/product';

export default function Home() {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadFeaturedProducts = async () => {
      const items = await productService.getProducts({ limit: 8 });
      if (mounted) {
        setFeaturedProducts(items.slice(0, 8));
      }
    };

    void loadFeaturedProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <h1 className="hero-title">Discover Your Style</h1>
        <p className="hero-description">
          Explore our curated collection of fashion essentials and timeless pieces.
        </p>
        <Link to="/catalog" className="hero-link">
          Shop Now
        </Link>
      </section>

      <SectionHeading
        eyebrow="Featured"
        title="Pick what suits you best"
        description="Handpicked selection of pieces you'll love."
      />
      {featuredProducts.length === 0 ? (
        <section className="empty-state">
          <p>Loading featured pieces...</p>
        </section>
      ) : (
        <ProductGrid products={featuredProducts} onAddToCart={addItem} />
      )}
    </div>
  );
}