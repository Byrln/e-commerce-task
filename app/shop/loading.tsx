import React from "react";

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-4"></div>
        <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>
      
      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        ))}
      </div>
      
      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            {/* Product image skeleton */}
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            
            {/* Product info skeleton */}
            <div className="p-4">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
              <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}