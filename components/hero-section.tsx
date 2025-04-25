"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import grainImage from "@/app/assets/images/grain.jpg";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-pink-200 dark:bg-pink-900 mix-blend-multiply dark:mix-blend-screen filter blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 8,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-purple-200 dark:bg-purple-900 mix-blend-multiply dark:mix-blend-screen filter blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 10,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-indigo-200 dark:bg-indigo-900 mix-blend-multiply dark:mix-blend-screen filter blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 12,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Өөрийн{" "}
          <span className="text-pink-600 dark:text-pink-400">Хэв маягаа</span>{" "}
          Илэрхийл
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-700 dark:text-gray-300"
        >
          Залуу үеийнхэнд зориулсан орчин үеийн загвар. Таны хэн болохыг
          тодорхойлох хамгийн сүүлийн үеийн чиг хандлагыг нээгээрэй.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/shop">
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-6 rounded-full"
            >
              Дэлгүүртэй танилцах
            </Button>
          </Link>
        </motion.div>
        {/* Grain */}
        <div
          className="absolute inset-0 -z-30 opacity-10"
          style={{ backgroundImage: `url(${grainImage.src})` }}
        ></div>
      </div>
    </div>
  );
}
