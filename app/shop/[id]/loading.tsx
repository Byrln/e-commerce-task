import React from "react";

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product images skeleton */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 gap-4">
              {/* Main image skeleton */}
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse shadow-sm"></div>
              
              {/* Thumbnail images skeleton */}
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse shadow-sm"
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Product details skeleton */}
          <div className="w-full lg:w-1/2">
            {/* Title skeleton */}
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-4"></div>
            
            {/* Rating skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            
            {/* Price skeleton */}
            <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-6"></div>
            
            {/* Description skeleton */}
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            
            {/* Color options skeleton */}
            <div className="mb-6">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Size options skeleton */}
            <div className="mb-6">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Add to cart button skeleton */}
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-6"></div>
            
            {/* Features skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}