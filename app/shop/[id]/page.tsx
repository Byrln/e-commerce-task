"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { products } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";
import { Star, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import { reviews } from "@/lib/reviews";
import WriteReviewModal from "@/components/write-review-modal";
import _ from "lodash";
import { Product } from "@/lib/types";
import SvgIcon from "@/components/svg-icon";
import BubbleSvg from "@/app/assets/icons/chart-bubble.svg";
import IronSvg from "@/app/assets/icons/electric-iron.svg";
import WashSvg from "@/app/assets/icons/washing-machine.svg";
import SizeGuideModal from "@/components/size-guide-modal";
import { useParams } from "next/navigation";


export default function ProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const params = useParams();
  const productId = params?.id as string;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [userReviews, setUserReviews] = useState<typeof reviews>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isFullScreenCarousel, setIsFullScreenCarousel] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  
  // Find product using the ID from params
  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    if (product) {
      // Ижил category-тэй product-уудыг санал болгох
      const similar = _(products)
        .filter((p) => p.category === product.category && p.id !== product.id)
        .take(4) // lodash ашиглаад 4 н ижил product-уудыг санал болгох
        .value();
      setSimilarProducts(similar);
    }
  }, [product]);

  // хэрвээ params-н id-р product-ыг олоогүй бол өгөх handler
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Бүтээгдэхүүн олдсонгүй</h1>
        <Button onClick={() => router.push("/shop")}>Дэлгүүрлүү буцах</Button>
      </div>
    );
  }

  // Тухайн id тай product-н review-үүдийг шүүж авах
  const originalReviews = reviews.filter(
    (review) => review.productId === product.id
  );
  
  // өмнөх review дээр хэрэглэгчийн оруулсан review-г нэмнэ.
  const productReviews = [
    ...originalReviews,
    ...(userReviews ? userReviews.filter(review => review.productId === product.id) : [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // хамгийн сүүлд оруулсан нь эхэндээ харагдана
  // Бүтээгдэхүүний дундаж үнэлгээг тооцоолох
  const averageRating =
    productReviews.length > 0
      ? (_.sumBy(productReviews, "rating") / productReviews.length).toFixed(1) // lodash-р rating-үүдийг нэгтгэсэн
      : "0.0"; // Хэрвээ ямарч review байхгүй үед харуулна

  // Өнгө болон хэмжээг тодорхойлох
  const colors = [
    { name: "Black", value: "black" },
    { name: "White", value: "white" },
    { name: "Navy", value: "navy" },
    { name: "Red", value: "red" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Сагсанд бүтээгдэхүүн нэмэх
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      // Simulate a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addToCart({
        ...product,
        quantity,
        selectedColor,
        selectedSize,
      });
      
      toast({
        title: "Сагсанд нэмэгдлээ",
        description: `${product.name} амжилттай таны сагсанд нэмэгдлээ.`,
      });
    } catch (error) {
      toast({
        title: "Алдаа гарлаа",
        description: "Сагсанд нэмэх үед алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Open and close review modal
  const openReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };
  
  const handleReviewSubmit = (newReview: typeof reviews[0]) => {
    setUserReviews(prevReviews => [...prevReviews, newReview]);
  };
  
  const openSizeGuide = () => {
    setIsSizeGuideOpen(true);
  };

  const closeSizeGuide = () => {
    setIsSizeGuideOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Breadcrumb navigation */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
          Нүүр
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link
          href="/shop"
          className="hover:text-gray-700 dark:hover:text-gray-300"
        >
          Дэлгүүр
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-gray-700 dark:hover:text-gray-300"
        >
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {product.name}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2"
        >
          <div className="grid grid-cols-1 gap-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              
              {/* Carousel Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? product.images!.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-black transition-all"
                    aria-label="Previous image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev === product.images!.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-black transition-all"
                    aria-label="Next image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 3).map((img, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-md bg-white dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-all ${
                    currentImageIndex === index ? 'ring-2 ring-pink-500 dark:ring-pink-400' : 'border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ))}
              
              {/* Last thumbnail with count if more than 4 images */}
              {product.images.length > 3 ? (
                <div
                  onClick={() => {
                    setIsFullScreenCarousel(true);
                    setFullScreenImageIndex(3);
                  }}
                  className="relative aspect-square overflow-hidden rounded-md bg-white dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-all border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={product.images[3]}
                    alt={`${product.name} view 4`}
                    className="w-full h-full object-contain p-1 opacity-60"
                  />
                  {product.images.length > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-white font-bold text-lg">+{product.images.length - 3}</span>
                    </div>
                  )}
                </div>
              ) : product.images.length === 4 ? (
                <div
                  key={3}
                  onClick={() => setCurrentImageIndex(3)}
                  className={`relative aspect-square overflow-hidden rounded-md bg-white dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-all ${
                    currentImageIndex === 3 ? 'ring-2 ring-pink-500 dark:ring-pink-400' : 'border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <img
                    src={product.images[3]}
                    alt={`${product.name} view 4`}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex flex-col h-full">
            {/* Product Title and Rating */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(Number(averageRating))
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{averageRating}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({productReviews.length}{" "}
                  {productReviews.length === 1 ? "сэтгэгдэл" : "сэтгэгдэл"})
                </span>
              </div>
              <p className="text-2xl font-semibold">
                ₮{product.price.toLocaleString()}
              </p>
            </div>

            {/* Product Description */}
            <div className="prose prose-sm dark:prose-invert mb-6 max-w-none">
              <p className="text-gray-700 dark:text-gray-300">
                {product.description}
              </p>
              <ul className="list-disc pl-5 mt-4 text-gray-700 dark:text-gray-300">
                {product.features ? (
                  product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                ) : (
                  <>
                    <li>Өндөр чанартай материал</li>
                    <li>Байгалд ээлтэй үйлдвэрлэл</li>
                    <li>Төгс тохирох баталгаа</li>
                    <li>₮50,000-с дээш захиалгад үнэгүй хүргэлт</li>
                  </>
                )}
              </ul>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">
                Өнгө: <span className="capitalize">{selectedColor}</span>
              </h3>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.value
                        ? "border-black dark:border-white scale-110"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select ${color.name} color`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Хэмжээ: {selectedSize}</h3>
                <button 
                  onClick={openSizeGuide}
                  className="text-sm text-pink-600 dark:text-pink-400 hover:underline"
                >
                  Хэмжээний заавар
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 border rounded-md transition-all ${
                      selectedSize === size
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-3">Тоо хэмжээ</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  -
                </Button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart and Wishlist */}
            <div className="flex gap-4 mb-8">
              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                size="lg"
                onClick={handleAddToCart}
                isLoading={isAddingToCart}
                loadingText="Сагсанд нэмж байна..."
              >
                Сагсанд нэмэх
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
                <p>SKU: Shop-{product.id.padStart(6, "0")}</p>
                <p>
                  Ангилал:{" "}
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </p>
                <p>Tag: {product.category}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="reviews">
          <TabsList className="w-full flex flex-col md:flex-row justify-start border-b rounded-none bg-transparent h-auto p-0 overflow-x-auto">
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:shadow-none py-3 text-sm sm:text-base transition-all duration-300 ease-in-out flex-shrink-0"
            >
              Сэтгэгдэл ({productReviews.length})
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:shadow-none py-3 text-sm sm:text-base transition-all duration-300 ease-in-out flex-shrink-0"
            >
              Хүргэлт ба Буцаалт
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:shadow-none py-3 text-base"
            >
              Дэлгэрэнгүй
            </TabsTrigger>
          </TabsList>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TabsContent value="reviews" className="pt-6">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <motion.div
                        className="text-center"
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <h3 className="text-5xl font-bold mb-2">
                          {averageRating}
                        </h3>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={
                                i < Math.round(Number(averageRating))
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {productReviews.length}{" "}
                          {productReviews.length === 1
                            ? "сэтгэгдэл"
                            : "сэтгэгдэл"}{" "}
                          дээр үндэслэв
                        </p>
                      </motion.div>

                      <div className="mt-6 space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = productReviews.filter(
                            (r) => r.rating === rating
                          ).length;
                          const percentage =
                            productReviews.length > 0
                              ? (count / productReviews.length) * 100
                              : 0;
                          return (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center">
                                {rating}{" "}
                                <Star
                                  size={14}
                                  className="ml-1 text-yellow-400 fill-yellow-400"
                                />
                              </div>
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 w-8">
                                {count}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <Button className="w-full mt-6" onClick={openReviewModal}>
                        Сэтгэгдэл бичих
                      </Button>
                    </div>

                    <div className="w-full md:w-2/3">
                      <h3 className="text-xl font-semibold mb-6">
                        Хэрэглэгчдийн сэтгэгдэл
                      </h3>
                      {productReviews.length > 0 ? (
                        <div className="space-y-6">
                          {productReviews
                            .slice(0, showAllReviews ? productReviews.length : visibleReviews)
                            .map((review) => (
                              <div
                                key={review.id}
                                className="border-b border-gray-200 dark:border-gray-800 pb-6"
                              >
                                <div className="flex justify-between mb-2">
                                  <h4 className="font-medium">
                                    {review.userName}
                                  </h4>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(review.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center mb-3">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={
                                        i < review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }
                                    />
                                  ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {review.comment}
                                </p>
                              </div>
                            ))}
                            
                          {/* Show "See More" button if there are more than 3 reviews */}
                          {productReviews.length > visibleReviews && !showAllReviews && (
                            <div className="text-center mt-6">
                              <Button 
                                variant="outline" 
                                onClick={() => setShowAllReviews(true)}
                                className="px-6"
                              >
                                Бүх сэтгэгдлийг харах ({productReviews.length})
                              </Button>
                            </div>
                          )}
                          
                          {/* Show "See Less" button if showing all reviews */}
                          {showAllReviews && productReviews.length > visibleReviews && (
                            <div className="text-center mt-6">
                              <Button 
                                variant="outline" 
                                onClick={() => setShowAllReviews(false)}
                                className="px-6"
                              >
                                Хаах
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          Одоогоор сэтгэгдэл алга байна. Энэ бүтээгдэхүүнд анхны
                          сэтгэгдлээ үлдээгээрэй!
                        </p>
                      )}
                      {/* Write Review Modal */}
                      <WriteReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={closeReviewModal}
                        productId={product.id}
                        productName={product.name}
                        onReviewSubmit={handleReviewSubmit}
                      />
                      
                      {/* Size Guide Modal */}
                      <SizeGuideModal
                        isOpen={isSizeGuideOpen}
                        onClose={closeSizeGuide}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            <TabsContent value="shipping" className="pt-6">
                <motion.div
                  className="space-y-8"
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left side - Shipping information with icon */}
                    <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold">Хүргэлтийн мэдээлэл</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                          <h4 className="font-medium mb-2">Энгийн хүргэлт</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Бид ₮50,000-с дээш бүх захиалгад <span className="font-semibold text-green-600 dark:text-green-400">үнэгүй</span> хүргэлт санал болгодог.
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            ₮50,000-с доош захиалгад ₮5,000 төгрөг хүргэлтийн төлбөр авна.
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            Хүргэлтийн хугацаа: 3-5 ажлын өдөр
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                          <h4 className="font-medium mb-2">Шуурхай хүргэлт</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Шуурхай хүргэлт нэмэлт төлбөртэй бөгөөд ихэвчлэн 1-2 ажлын өдөрт хүргэлт хийдэг.
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            Хүргэлтийн хугацаа: 1-2 ажлын өдөр
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                          <h4 className="font-medium mb-2">Олон улсын хүргэлт</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Олон улсын хүргэлт сонгосон улс орнуудад боломжтой.
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            Хүргэлтийн хугацаа: 7-14 ажлын өдөр
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Return policy */}
                    <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold">Буцаалтын бодлого</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                          <h4 className="font-medium mb-2">Буцаалтын нөхцөл</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Бид хүргэлт хийснээс хойш <span className="font-semibold">14 хоногийн дотор</span> буцаалтыг хүлээн авдаг.
                          </p>
                          <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300 space-y-1">
                            <li>Бүтээгдэхүүн нь шошготой, анхны байдалдаа байх ёстой</li>
                            <li>Солилцоо эсвэл буцаалт нь манай алдаанаас болсон бол буцаалтын хүргэлт үнэгүй</li>
                            <li>Хэрэглэгчийн буруутай буцаалтын хүргэлтийн төлбөрийг хэрэглэгч хариуцна</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                          <h4 className="font-medium mb-2">Буцаалт хийх</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Буцаалт хийхийн тулд манай хэрэглэгчийн үйлчилгээний багтай холбогдох эсвэл дэлгэрэнгүй мэдээллийг сошиол хуудаснаас авна уу.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
            </TabsContent>
            <TabsContent value="details" className="pt-6">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left side - Product Details */}
                  <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold">Бүтээгдэхүүний дэлгэрэнгүй</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                        <h4 className="font-medium mb-2">Тайлбар</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {product.description} Манай бүтээгдэхүүнүүд нь нарийн хийцтэй,
                          өндөр чанарын материалаар хийгдсэн бөгөөд тав тухтай, удаан
                          эдэлгээтэй байхаар бүтээгдсэн.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                        <h4 className="font-medium mb-2">Онцлог шинж чанарууд</h4>
                        <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                          {product.features ? (
                            product.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))
                          ) : (
                            <>
                              <li>Өндөр чанартай материал</li>
                              <li>Байгалд ээлтэй үйлдвэрлэл</li>
                              <li>Төгс тохирох баталгаа</li>
                              <li>₮50,000-с дээш захиалгад үнэгүй хүргэлт</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Care Instructions */}
                  <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold">Материал ба Арчилгаа</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                        <h4 className="font-medium mb-2">Материалын найрлага</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {product.category === "clothing" ? (
                            "95% хөвөн, 5% эластан. Зөөлөн, уян хатан, тав тухтай."
                          ) : product.category === "shoes" ? (
                            "Гадна талд: Жинхэнэ арьс. Дотор талд: Нэхмэл даавуу. Улавч: Резин."
                          ) : (
                            "Өндөр чанарын материалаар хийгдсэн, удаан эдэлгээтэй."
                          )}
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                        <h4 className="font-medium mb-2">Арчилгааны зөвлөмж</h4>
                        <div className="flex flex-wrap gap-3 mb-3">
                          <div className="w-6 h-6 border border-gray-200 dark:border-gray-600 rounded flex items-center justify-center text-center" title="Бага температурт угаах">
                            <SvgIcon src={WashSvg} alt="Бага температурт угаах" className="h-4 w-4" />
                          </div>
                          <div className="w-6 h-6 border border-gray-200 dark:border-gray-600 rounded flex items-center justify-center" title="Цайруулагч хэрэглэхгүй">
                            <SvgIcon src={BubbleSvg} alt="Цайруулагч хэрэглэхгүй" className="h-4 w-4" />
                          </div>
                          <div className="w-6 h-6 border border-gray-200 dark:border-gray-600 rounded flex items-center justify-center" title="Индүүдэж болно">
                            <SvgIcon src={IronSvg} alt="Индүүдэж болно" className="h-4 w-4" />
                          </div>
                        </div>
                        <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                          <li>Хүйтэн усаар угаах</li>
                          <li>Сүүдэрт хатаах</li>
                          <li>Бага температурт индүүдэх</li>
                          <li>Цайруулагч бодис хэрэглэхгүй байх</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                        <h4 className="font-medium mb-2">Хэмжээний заавар</h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Энэ бүтээгдэхүүн хэмжээндээ таарч байдаг. Илүү тухтай байлгахын тулд нэг хэмжээ том сонгоно уу.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
          </motion.div>
        </Tabs>
      </div>

      {/* Similar Products */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-8">Танд бас таалагдаж магадгүй</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Full Screen Carousel */}
      {isFullScreenCarousel && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setIsFullScreenCarousel(false)}
              className="text-white hover:text-gray-300 p-2"
              aria-label="Хаах"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={product.images[fullScreenImageIndex]}
                alt={`${product.name} view ${fullScreenImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => setFullScreenImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white"
              aria-label="Өмнөх зураг"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button 
              onClick={() => setFullScreenImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white"
              aria-label="Дараагийн зураг"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          
          {/* Thumbnail Navigation */}
          <div className="flex justify-center mt-4 gap-2 px-4 overflow-x-auto max-w-full">
            {product.images.map((img, index) => (
              <div
                key={index}
                onClick={() => setFullScreenImageIndex(index)}
                className={`relative w-16 h-16 overflow-hidden rounded-md bg-white dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-all ${
                  fullScreenImageIndex === index ? 'ring-2 ring-pink-500' : 'opacity-60'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {fullScreenImageIndex + 1} / {product.images.length}
          </div>
        </div>
      )}
    </div>
  );
}
