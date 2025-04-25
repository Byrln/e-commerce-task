"use client"

import type React from "react"
import { useState, useCallback, useEffect, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Tag, DollarSign } from "lucide-react"
import { cn, createDebouncedFunction } from "@/lib/utils"

interface FilterProps {
  filters: {
    category: string
    priceRange: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string
      priceRange: string
    }>
  >
}

export default function ProductFilter({ filters, setFilters }: FilterProps) {
  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Always expand sections on mobile when in sheet
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    priceRange: true,
  })

  // Use useMemo instead of memoize for React components
  const categories = useMemo(() => [
    { value: "all", label: "Бүх ангилал" },
    { value: "tops", label: "Цамц" },
    { value: "bottoms", label: "Өмд" },
    { value: "dresses", label: "Даашинз" },
    { value: "accessories", label: "Гоёл чимэглэл" },
    { value: "shoes", label: "Гутал" },
  ], []);

  const priceRanges = useMemo(() => [
    { value: "all", label: "Бүх үнэ" },
    { value: "under50", label: "₮50,000-с доош" },
    { value: "50to100", label: "₮50,000-с ₮100,000 хүртэл" },
    { value: "over100", label: "₮100,000-с дээш" },
  ], []);

  // Use our custom debounce function with proper typing
  const toggleSection = useCallback(
    createDebouncedFunction((section: keyof typeof expandedSections) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    }, 150),
    []
  );
  
  // Clean up debounced function when component unmounts
  useEffect(() => {
    return () => {
      if (toggleSection && typeof toggleSection.cancel === 'function') {
        toggleSection.cancel();
      }
    };
  }, [toggleSection]);

  // Memoize the reset filters function
  const resetFilters = useCallback(() => {
    console.log('Resetting filters');
    setFilters({
      category: "all",
      priceRange: "all",
    });
  }, [setFilters]);
  
  // Log when filters change
  useEffect(() => {
    console.log('Filter component received new filters:', filters);
  }, [filters]);

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 z-10 py-2">
        {/* Only show title on desktop view when not in sheet */}
        <h2 className="text-xl font-bold hidden md:block">Шүүлтүүр</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Арилгах
        </Button>
      </div>

      <Separator />

      {/* Categories Section */}
      <div className="space-y-2">
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => toggleSection('categories')}
        >
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-pink-500" />
            <h3 className="text-base font-medium">Ангилал</h3>
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          expandedSections.categories ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}>
          <RadioGroup
            value={filters.category}
            onValueChange={(value) => {
              console.log('Category changed to:', value);
              setFilters({ ...filters, category: value });
            }}
            className="space-y-1 pt-1 bg-pink-50 dark:bg-pink-900/20 rounded-md"
          >
            {categories.map((category) => (
              <div 
                key={category.value} 
                className={cn(
                  "flex items-center space-x-2 p-1.5 transition-colors",
                  filters.category === category.value
                )}
              >
                <RadioGroupItem value={category.value} id={`category-${category.value}`} />
                <Label 
                  htmlFor={`category-${category.value}`} 
                  className={cn(
                    "cursor-pointer w-full text-sm",
                    filters.category === category.value && "font-medium text-pink-600 dark:text-pink-400"
                  )}
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <Separator />

      {/* Price Range Section */}
      <div className="space-y-2">
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => toggleSection('priceRange')}
        >
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-pink-500" />
            <h3 className="text-base font-medium">Үнийн хязгаар</h3>
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            {expandedSections.priceRange ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          expandedSections.priceRange ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}>
          <RadioGroup
            value={filters.priceRange}
            onValueChange={(value) => {
              console.log('Price range changed to:', value);
              setFilters({ ...filters, priceRange: value });
            }}
            className="space-y-1 pt-1 bg-pink-50 dark:bg-pink-900/20 rounded-md"
          >
            {priceRanges.map((range) => (
              <div 
                key={range.value} 
                className={cn(
                  "flex items-center space-x-2 p-1.5 transition-colors",
                  filters.priceRange === range.value
                )}
              >
                <RadioGroupItem value={range.value} id={`price-${range.value}`} />
                <Label 
                  htmlFor={`price-${range.value}`} 
                  className={cn(
                    "cursor-pointer w-full text-sm",
                    filters.priceRange === range.value && "font-medium text-pink-600 dark:text-pink-400"
                  )}
                >
                  {range.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <Separator />

      <div className="pt-2">
        <Button 
          onClick={resetFilters}
          variant="outline" 
          className="w-full text-sm py-2"
        >
          Бүх шүүлтүүр арилгах
        </Button>
      </div>
    </div>
  )
}
