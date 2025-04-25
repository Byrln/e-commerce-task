import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface BlurImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  className?: string;
}

export function BlurImage({ className, alt, ...props }: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(props.src);
  const [imgError, setImgError] = useState(false);
  
  // Reset loading state when image source changes
  useEffect(() => {
    setIsLoading(true);
    setImgError(false);
    setImgSrc(props.src);
    console.log('Image source:', props.src);
  }, [props.src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {(isLoading || imgError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-100 dark:bg-pink-900 animate-pulse">
          <svg 
            className="w-10 h-10 text-pink-300 dark:text-pink-600" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      {!imgError && (
        <Image
          {...props}
          src={imgSrc}
          alt={alt || "Product image"}
          className={cn(
            "transition-opacity duration-300 object-contain",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoadingComplete={() => setIsLoading(false)}
          onError={(e) => {
            console.error("Image load error:", e);
            // If image fails to load, show the placeholder
            setImgError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}