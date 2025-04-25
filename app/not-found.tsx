import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gradient-to-br from-white to-pink-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-pink-100 dark:bg-pink-900/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-100 dark:bg-pink-900/20 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="relative w-full h-64 mb-8">
            <Image
              src="/assets/images/not-found-stylish.svg"
              alt="Page not found"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-600">
            404 - Хуудас олдсонгүй
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
            Таны хайж буй хуудас олдсонгүй. Хаяг буруу эсвэл хуудас устгагдсан байж магадгүй.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-all">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Нүүр хуудас руу буцах
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-pink-500 text-pink-600 hover:bg-pink-50 dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-950/50">
              <Link href="/shop" className="flex items-center gap-2">
                <ShoppingBag size={18} />
                Дэлгүүр рүү очих
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}