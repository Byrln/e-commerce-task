'use client';

import React, { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface SvgIconProps {
  src: StaticImageData;
  alt: string;
  className?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({ src, alt, className }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only render after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className={cn('relative flex items-center justify-center', className)}>
        <div className="w-4 h-4" />
      </div>
    );
  }
  
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <Image 
        src={src} 
        alt={alt} 
        className="object-contain"
        width={16}
        height={16}
        style={{
          filter: isDark 
            ? 'brightness(0) invert(0.8)' // Simple white-ish filter for dark mode
            : 'brightness(0) invert(0.4)' // Simple gray filter for light mode
        }}
      />
    </div>
  );
};

export default SvgIcon;