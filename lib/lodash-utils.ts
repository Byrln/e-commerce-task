/**
 * Lodash utility functions for the e-commerce application
 * This file contains optimized helper functions using Lodash
 */

import {
  debounce,
  throttle,
  memoize,
  groupBy,
  orderBy,
  chunk,
  isEqual,
  pick,
  merge,
} from 'lodash';
import type { Product } from './types';

/**
 * Filter products by category
 */
export function filterByCategory(products: Product[], category: string): Product[] {
  console.log('filterByCategory called with:', { 
    productsLength: products?.length, 
    category,
    sampleProducts: products?.slice(0, 2)
  });
  
  // Safety checks
  if (!products || !Array.isArray(products)) {
    console.warn('Products is not an array in filterByCategory');
    return [];
  }
  
  // If category is 'all', return all products
  if (category === 'all') {
    console.log('Returning all products for category "all"');
    return [...products];
  }
  
  // Filter products by category
  const filtered = products.filter(product => {
    if (!product) return false;
    return product.category === category;
  });
  
  console.log(`Found ${filtered.length} products in category "${category}"`);
  return filtered;
}

/**
 * Filter products by price range
 */
export function filterByPriceRange(products: Product[], priceRange: string): Product[] {
  console.log('filterByPriceRange called with:', { 
    productsLength: products?.length, 
    priceRange,
    sampleProducts: products?.slice(0, 2)
  });
  
  // Safety checks
  if (!products || !Array.isArray(products)) {
    console.warn('Products is not an array in filterByPriceRange');
    return [];
  }
  
  // If priceRange is 'all', return all products
  if (priceRange === 'all') {
    console.log('Returning all products for price range "all"');
    return [...products];
  }
  
  // Filter products by price range
  const filtered = products.filter(product => {
    if (!product || typeof product.price !== 'number') {
      console.warn('Product or price is invalid:', product);
      return false;
    }
    
    // Price ranges in Mongolian Tugrik (₮)
    if (priceRange === 'under50' && product.price < 50000) {
      return true;
    }
    if (priceRange === '50to100' && product.price >= 50000 && product.price <= 100000) {
      return true;
    }
    if (priceRange === 'over100' && product.price > 100000) {
      return true;
    }
    return false;
  });
  
  console.log(`Found ${filtered.length} products in price range "${priceRange}"`);
  return filtered;
}

/**
 * Group products by category with memoization
 */
export const groupProductsByCategory = memoize((products: Product[]) => {
  return groupBy(products, 'category');
});

/**
 * Sort products by price (ascending or descending)
 */
export function sortProductsByPrice(products: Product[], direction: 'asc' | 'desc' = 'asc'): Product[] {
  console.log('sortProductsByPrice called with:', { 
    productsLength: products?.length, 
    direction,
    sampleProducts: products?.slice(0, 2)
  });
  
  // Safety checks
  if (!products || !Array.isArray(products)) {
    console.warn('Products is not an array in sortProductsByPrice');
    return [];
  }
  
  // Sort products by price
  try {
    const sorted = orderBy([...products], ['price'], [direction]);
    console.log(`Sorted ${sorted.length} products by price (${direction})`);
    return sorted;
  } catch (error) {
    console.error('Error sorting products by price:', error);
    return [...products]; // Return original array if sorting fails
  }
}

/**
 * Chunk products into pages for pagination
 */
export const paginateProducts = (products: Product[], pageSize: number, currentPage: number) => {
  const chunks = chunk(products, pageSize);
  return chunks[currentPage - 1] || [];
};

/**
 * Debounced function for search input
 */
export const debouncedSearch = debounce((searchTerm: string, callback: (results: Product[]) => void) => {
  // Implement search logic here and call the callback with results
  callback([]);
}, 300);

/**
 * Deep compare two objects (useful for React memoization)
 */
export const deepCompare = (objA: any, objB: any) => {
  return isEqual(objA, objB);
};

/**
 * Create a throttled function for handling frequent UI events
 */
export const createThrottledFunction = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
) => {
  return throttle(func, wait);
};

/**
 * Pick only needed fields from a product (useful for optimizing renders)
 */
export const pickProductFields = (product: Product, fields: (keyof Product)[]) => {
  return pick(product, fields);
};

/**
 * Merge product data safely
 */
export const mergeProductData = (original: Partial<Product>, updates: Partial<Product>) => {
  return merge({}, original, updates);
};