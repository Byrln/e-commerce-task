import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { memoize, debounce, throttle } from "lodash"

/**
 * Utility function for combining Tailwind CSS classes
 * Memoized for better performance
 */
export const cn = memoize((...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
})

/**
 * Create a debounced function
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 */
export function createDebouncedFunction<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): {
  (...args: Parameters<T>): ReturnType<T>;
  cancel: () => void;
} {
  return debounce(fn, delay) as any;
}

/**
 * Create a throttled function
 * @param fn Function to throttle
 * @param limit Limit in milliseconds
 */
export function createThrottledFunction<T extends (...args: any[]) => any>(
  fn: T,
  limit = 300
): {
  (...args: Parameters<T>): ReturnType<T>;
  cancel: () => void;
} {
  return throttle(fn, limit) as any;
}

/**
 * Format price with currency symbol
 */
export const formatPrice = memoize((price: number): string => {
  return `₮${price.toLocaleString()}`
})

/**
 * Format date string
 */
export const formatDate = memoize((date: string): string => {
  return new Date(date).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
