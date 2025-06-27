"use client"

import { useState, useEffect, useMemo} from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import ProductCard from "@/components/product-card"
import ProductFilter from "@/components/product-filter"
// import { products } from "@/lib/products" // Removed static import
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import {  
  paginateProducts
} from "@/lib/lodash-utils"

interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  category: string
  features: string[]
  inventory: number
  avgRating: number
  reviewCount: number
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
  })
  
  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/products?limit=100') // Fetch all products
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data.products)
      setFilteredProducts(data.products)
    } catch (err) {
      setError('Бараа ачаалахад алдаа гарлаа')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }
  const [currentPage, setCurrentPage] = useState(1)

  // Device-с хамаарч хуудас дээр хэдэн бараа харагдахыг тодорхойлно
  const productsPerPage = {
    desktop: 12, // Desktop/tablet: 1 хуудас дээр 12 бараа харагдана
    mobile: 9,   // Mobile: 1 хуудас дээр 9 бараа харагдана
  }

  // Гар утасны төхөөрөмж эсэхийг шалгана
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    // Дэлгэцийн хэмжээнд утга тохируулна
    handleResize()
    // Эвент сонсогч нэмэх
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Хуудаслалтыг тооцоолох
  const itemsPerPage = isMobile ? productsPerPage.mobile : productsPerPage.desktop
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  // Илүү үр дүнтэй хуудаслалтын тусламжтай функцийг ашиглах
  const currentProducts = useMemo(() => {
    return paginateProducts(filteredProducts, itemsPerPage, currentPage);
  }, [filteredProducts, itemsPerPage, currentPage]);
  
  // Дэлгэцэд харуулах зорилгоор эдгээр утгуудыг тооцоолох
  const indexOfFirstProduct = (currentPage - 1) * itemsPerPage + 1
  const indexOfLastProduct = Math.min(currentPage * itemsPerPage, filteredProducts.length)

  // Хуудаслалтын функцууд
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

  // Шүүлтүүр эсвэл бүтээгдэхүүн өөрчлөгдөх үед шүүлтүүрийг хэрэгжүүлэх
  useEffect(() => {
    try {
      console.log('Шүүлтүүр ажиллаж байна:', { 
        filters, 
        productsLength: products?.length,
        productsCategories: products?.map(p => p.category).filter((v, i, a) => a.indexOf(v) === i)
      });
      
      // Бүтээгдэхүүний массивыг өөрчлөхгүйн тулд хуулбарлах
      let filteredResult = [...products];
      
      // Ангилал шүүлтүүр хэрэгжүүлэх хэрэв 'all' биш бол
      if (filters.category !== 'all') {
        console.log(`Ангилалаар шүүж байна: ${filters.category}`);
        filteredResult = filteredResult.filter(product => product.category === filters.category);
        console.log(`Ангилалын шүүлтүүрийн дараа: ${filteredResult.length} бүтээгдэхүүн`);
      }
      
      // Үнийн хязгаарын шүүлтүүр хэрэгжүүлэх хэрэв 'all' биш бол
      if (filters.priceRange !== 'all') {
        console.log(`Үнийн хязгаараар шүүж байна: ${filters.priceRange}`);
        filteredResult = filteredResult.filter(product => {
          const price = product.price;
          if (filters.priceRange === 'under50') return price < 50000;
          if (filters.priceRange === '50to100') return price >= 50000 && price <= 100000;
          if (filters.priceRange === 'over100') return price > 100000;
          return true;
        });
        console.log(`Үнийн шүүлтүүрийн дараа: ${filteredResult.length} бүтээгдэхүүн`);
      }
      
      // Бүтээгдэхүүнүүдийг үнээр нь эрэмбэлэх (өсөх эрэмбээр)
      filteredResult.sort((a, b) => a.price - b.price);
      
      // Шүүсэн болон эрэмбэлсэн бүтээгдэхүүнүүдээр төлөвийг шинэчлэх
      console.log(`Эцсийн шүүсэн бүтээгдэхүүн: ${filteredResult.length}`);
      setFilteredProducts(filteredResult);
      setCurrentPage(1); // Шүүлтүүр өөрчлөгдөх үед эхний хуудас руу шилжих
    } catch (error) {
      console.error('Шүүлтүүр хэрэглэхэд алдаа гарлаа:', error);
      // Шүүлтүүр амжилтгүй болсон тохиолдолд бүх бүтээгдэхүүнийг харуулах
      setFilteredProducts(products);
    }
  }, [filters, products]);

  // Хуудасны тоог тооцоолох
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Бараа ачаалж байна...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchProducts} className="bg-pink-500 hover:bg-pink-600">
            Дахин оролдох
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 dark:from-pink-400 dark:to-violet-400">
            Дэлгүүрийн Цуглуулга
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Манай тусгайлан сонгосон дээд зэргийн загварын хувцаснуудыг олж мэдээрэй
          </p>
        </motion.div>

      {/* Гар утасны шүүлтүүр харуулах товч */}
      <div className="md:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 py-6"
            >
              <Filter size={18} />
              Шүүлтүүр харах
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 sm:max-w-sm p-0 overflow-auto">
            <div className="p-4">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-bold">Шүүлтүүр</SheetTitle>
              </SheetHeader>
              <ProductFilter filters={filters} setFilters={setFilters} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Компьютерийн наалддаг шүүлтүүр - зөвхөн дунд болон том дэлгэцэнд харагдана */}
        <div className="hidden md:block md:w-1/4">
          <div className="sticky top-24">
            <ProductFilter filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Бүтээгдэхүүний сүлжээ & хуудаслалт */}
        <div className="w-full md:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-pink-500 mb-4">
                  <X size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-medium mb-2">Бүтээгдэхүүн олдсонгүй</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Таны сонгосон шүүлтүүрт тохирох бүтээгдэхүүн байхгүй байна.
                </p>
                <Button 
                  onClick={() => setFilters({ category: "all", priceRange: "all" })}
                  variant="outline"
                >
                  Шүүлтүүр арилгах
                </Button>
              </motion.div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Хуудаслалт */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 mt-12">
                  <Button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <ChevronLeft size={18} />
                  </Button>
                  
                  {/* Компьютерийн хуудаслалт дугаартайгаар */}
                  <div className="hidden sm:flex gap-2">
                    {pageNumbers.map(number => (
                      <Button
                        key={number}
                        onClick={() => paginate(number)}
                        variant={currentPage === number ? "default" : "outline"}
                        className={cn(
                          "h-10 w-10",
                          currentPage === number 
                            ? "bg-pink-500 hover:bg-pink-600 text-white" 
                            : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                        )}
                      >
                        {number}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Гар утасны хуудаслалтын заалт */}
                  <div className="sm:hidden px-4 py-2 rounded-md bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-100">
                    {currentPage} / {totalPages}
                  </div>
                  
                  <Button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
              )}
              
              {/* Нийт хуудсан харагдах барааны тоон мэдээлэл харуулах */}
              <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
                Нийт {filteredProducts.length} бүтээгдэхүүнээс {indexOfFirstProduct}-{Math.min(indexOfLastProduct, filteredProducts.length)} харуулж байна
              </p>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
