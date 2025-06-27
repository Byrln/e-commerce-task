"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useClientDate } from "@/hooks/use-client-only";

export default function Footer() {
  // Use client-only date to prevent hydration errors
  const clientDate = useClientDate();
  return (
    <footer id="contact" className="bg-gray-100 dark:bg-gray-900 pt-16 pb-8" suppressHydrationWarning>
      <div className="container mx-auto px-4" suppressHydrationWarning>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8" suppressHydrationWarning>
          <div className="md:col-span-1" suppressHydrationWarning>
            <Link href="/" className="text-2xl font-bold" suppressHydrationWarning>
              Долгион Загвар
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400" suppressHydrationWarning>
              Орчин үеийн загварт дурлагсад зориулсан. Гялалзах
              хүсэлтэй бол манайхыг сонгон үйлчилээрэй. Чи бол гол дүр. 💿💖✨
            </p>
            <div className="flex space-x-4 mt-6" suppressHydrationWarning>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                suppressHydrationWarning
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                suppressHydrationWarning
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                suppressHydrationWarning
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </div>

          <div suppressHydrationWarning>
            <h3 className="text-lg font-semibold mb-4" suppressHydrationWarning>Дэлгүүр</h3>
            <ul className="space-y-2" suppressHydrationWarning>
              <li suppressHydrationWarning>
                <Link
                  href="/shop?category=tops"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Цамц
                </Link>
              </li>
              <li suppressHydrationWarning>
                <Link
                  href="/shop?category=bottoms"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Өмд
                </Link>
              </li>
              <li suppressHydrationWarning>
                <Link
                  href="/shop?category=dresses"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Даашинз
                </Link>
              </li>
              <li suppressHydrationWarning>
                <Link
                  href="/shop?category=accessories"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Гоёл чимэглэл
                </Link>
              </li>
            </ul>
          </div>

          <div suppressHydrationWarning>
            <h3 className="text-lg font-semibold mb-4" suppressHydrationWarning>Компани</h3>
            <ul className="space-y-2" suppressHydrationWarning>
              <li suppressHydrationWarning>
                <Link
                  href="/#about"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Бидний тухай
                </Link>
              </li>
              <li suppressHydrationWarning>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Ажлын байр
                </Link>
              </li>
              <li suppressHydrationWarning>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Нууцлалын бодлого
                </Link>
              </li>
              <li suppressHydrationWarning>
                <Link
                  href="/terms-of-service"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Үйлчилгээний нөхцөл
                </Link>
              </li>
            </ul>
          </div>

          <div suppressHydrationWarning>
            <h3 className="text-lg font-semibold mb-4" suppressHydrationWarning>Холбоо барих</h3>
            <ul className="space-y-2" suppressHydrationWarning>
              <li className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                Имэйл: info@wavefashionstore.com
              </li>
              <li className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                Утас: +976 9900 8800
              </li>
              <li className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                Хаяг: 123 BZD, Ulaanbaatar, Mongolia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm" suppressHydrationWarning>
          <p suppressHydrationWarning>
            &copy; {clientDate ? clientDate.getFullYear() : ''} Долгион Загвар. Бүх эрх хуулиар
            хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
}