"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AboutImg from "@/app/assets/images/place.jpg";
import Image from "next/image";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-pink-50 dark:from-gray-900 dark:to-pink-950/30">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Wave Fashion
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={itemVariants}
              className="relative aspect-square"
            >
              <Image
                src={AboutImg}
                alt="Wave Fashion"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-2xl font-semibold">Our Philosophy 💿✨</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Fashion бол зүгээр нэг хувцас биш — энэ бол чиний супер хүч.
                Манай цуглуулга бол comfy + iconic mix. Trendy yet timeless
                эдүүдээр чамайг өөрийнхөөрөө байхад урам өгнө.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Daily ootd чинь runway шиг санагдаж, mirror selfie чинь fire
                байх ёстой. Бид чамд илүү confident, baddie мэдрэмж өгөх хувцсыг
                л curate хийдэг.
              </p>
              <div className="pt-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-pink-600 dark:text-pink-400"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Be your own muse.</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ✨ Don’t follow the trend — be the trend. ✨ Загварaa
                      гялалзуул, queen! 💖
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
