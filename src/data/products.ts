import type { Product } from '../types/product';

export const products: Product[] = [
  {
    id: 101,
    title: 'Structured Coat',
    price: 240,
    description:
      'A tailored, seasonless coat with soft shoulder architecture and a clean front closure.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    ],
    category: {
      id: 1,
      name: 'Outerwear',
      image:
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 102,
    title: 'Silk Blend Tunic',
    price: 180,
    description:
      'A fluid silhouette in a silk-cotton blend designed for elevated daily wear.',
    images: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
    ],
    category: {
      id: 2,
      name: 'Dresses',
      image:
        'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 103,
    title: 'Merino Column Knit',
    price: 165,
    description:
      'A vertical rib merino knit with an elongated line and hand-finished cuffs.',
    images: [
      'https://images.unsplash.com/photo-1525450824786-227cbef70703?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1525450824786-227cbef70703?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=1200&q=80',
    ],
    category: {
      id: 3,
      name: 'Knitwear',
      image:
        'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 104,
    title: 'Minimalist Leather Bag',
    price: 210,
    description:
      'Compact leather crossbody with clean seams, magnetic closure, and tonal strap.',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575722290270-626b0208df99?auto=format&fit=crop&w=1200&q=80',
    ],
    category: {
      id: 4,
      name: 'Accessories',
      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    },
  },
];