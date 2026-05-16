import { useEffect, useState, type FormEvent } from 'react';
import SectionHeading from '../components/common/SectionHeading';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { useCart } from '../hooks/useCart';
import type { Category, Product, ProductSort } from '../types/product';

const PAGE_SIZE = 12;

export default function Catalog() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingSearch, setPendingSearch] = useState('');
  const [sort, setSort] = useState<ProductSort>('none');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      const items = await productService.getCategories();
      if (mounted) {
        setCategories(items);
      }
    };

    void loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      const items = await productService.getProducts({
        categoryId: selectedCategoryId ?? undefined,
        title: searchTerm.trim() || undefined,
        offset: 0,
        limit: PAGE_SIZE,
        sort,
      });
      if (mounted) {
        setProducts(items);
        setOffset(items.length);
        setHasMore(items.length === PAGE_SIZE);
        setIsLoading(false);
      }
    };

    void loadProducts();

    return () => {
      mounted = false;
    };
  }, [searchTerm, selectedCategoryId, sort]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    const items = await productService.getProducts({
      categoryId: selectedCategoryId ?? undefined,
      title: searchTerm.trim() || undefined,
      offset,
      limit: PAGE_SIZE,
      sort,
    });

    setProducts((current) => [...current, ...items]);
    setOffset((current) => current + items.length);
    setHasMore(items.length === PAGE_SIZE);
    setIsLoadingMore(false);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(pendingSearch);
  };

  return (
    <div className="page">
      <SectionHeading
        eyebrow="Catalog"
        title="Quiet luxury, everyday utility"
        description="Browse refined essentials with modern cuts and tactile fabrics."
      />
      <section className="catalog-controls" aria-label="Catalog controls">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            onChange={(event) => setPendingSearch(event.target.value)}
            placeholder="Search by product title"
            type="search"
            value={pendingSearch}
          />
          <button className="search-btn" type="submit">
            Search
          </button>
        </form>

        <select
          aria-label="Sort products by price"
          className="sort-select"
          onChange={(event) => setSort(event.target.value as ProductSort)}
          value={sort}
        >
          <option value="none">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </section>

      <section className="category-scroll" aria-label="Categories">
        <button
          className={`category-pill ${selectedCategoryId === null ? 'active' : ''}`}
          onClick={() => setSelectedCategoryId(null)}
          type="button"
        >
          All
        </button>
        {categories.map((category) => (
          <button
            className={`category-pill ${selectedCategoryId === category.id ? 'active' : ''}`}
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            type="button"
          >
            {category.name}
          </button>
        ))}
      </section>

      {isLoading ? (
        <section className="empty-state">
          <p>Loading products...</p>
        </section>
      ) : (
        <>
          <ProductGrid products={products} onAddToCart={addItem} />
          {hasMore ? (
            <button
              className="load-more-btn"
              disabled={isLoadingMore}
              onClick={loadMore}
              type="button"
            >
              {isLoadingMore ? 'Loading more...' : 'Load more'}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}