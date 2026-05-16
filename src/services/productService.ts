import { products as localProducts } from '../data/products';
import { apiClient } from './apiClient';
import type { Category, Product, ProductSort } from '../types/product';

interface GetProductsOptions {
  categoryId?: number;
  title?: string;
  offset?: number;
  limit?: number;
  sort?: ProductSort;
}

function sortProducts(products: Product[], sort: ProductSort = 'none'): Product[] {
  if (sort === 'price-asc') {
    return [...products].sort((a, b) => a.price - b.price);
  }

  if (sort === 'price-desc') {
    return [...products].sort((a, b) => b.price - a.price);
  }

  return products;
}

function buildProductQuery(options: GetProductsOptions): string {
  const params = new URLSearchParams();

  if (typeof options.categoryId === 'number') {
    params.set('categoryId', String(options.categoryId));
  }

  if (options.title) {
    params.set('title', options.title);
  }

  if (typeof options.offset === 'number') {
    params.set('offset', String(options.offset));
  }

  if (typeof options.limit === 'number') {
    params.set('limit', String(options.limit));
  }

  const query = params.toString();
  return query ? `/products?${query}` : '/products';
}

export const productService = {
  async getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
    try {
      const endpoint = buildProductQuery(options);
      const response = await apiClient(endpoint);
      if (Array.isArray(response)) {
        return sortProducts(response as Product[], options.sort);
      }
      return sortProducts(localProducts, options.sort);
    } catch {
      return sortProducts(localProducts, options.sort);
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient('/categories');
      if (Array.isArray(response)) {
        return response as Category[];
      }
      return [];
    } catch {
      return [];
    }
  },

  async getById(productId: string): Promise<Product | undefined> {
    try {
      const response = await apiClient(`/products/${productId}`);
      if (response && typeof response === 'object') {
        return response as Product;
      }
      return localProducts.find((product) => String(product.id) === productId);
    } catch {
      return localProducts.find((product) => String(product.id) === productId);
    }
  },
};
