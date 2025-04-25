"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { sumBy, throttle } from "lodash";

export default function CartPage() {
  const { toast } = useToast();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  // Use useMemo with Lodash's sumBy for more efficient subtotal calculation
  const subtotal = useMemo(() => {
    return sumBy(cart, (item) => item.price * item.quantity);
  }, [cart]);

  // Calculate shipping cost - free if subtotal is above ₮50,000, otherwise ₮5,000
  const shippingCost = useMemo(() => {
    return subtotal >= 50000 ? 0 : 5000;
  }, [subtotal]);

  // Calculate total (subtotal + shipping)
  const total = useMemo(() => {
    return subtotal + shippingCost;
  }, [subtotal, shippingCost]);

  // Create throttled functions for quantity updates to prevent UI lag with rapid clicks
  const throttledIncrement = useMemo(
    () =>
      throttle(
        (id: string, quantity: number) => updateQuantity(id, quantity + 1),
        300
      ),
    [updateQuantity]
  );

  const throttledDecrement = useMemo(
    () =>
      throttle(
        (id: string, quantity: number) =>
          updateQuantity(id, Math.max(1, quantity - 1)),
        300
      ),
    [updateQuantity]
  );

  // Clean up throttled functions when component unmounts
  useEffect(() => {
    return () => {
      throttledIncrement.cancel();
      throttledDecrement.cancel();
    };
  }, [throttledIncrement, throttledDecrement]);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Таны сагс</h1>
        <p className="text-gray-500 mb-8">Таны сагс хоосон байна.</p>
        <Link href="/shop">
          <Button>Дэлгүүр хэсэх</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen flex flex-col justify-center px-6 py-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 border-b border-gray-200 py-4"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => throttledDecrement(item.id, item.quantity)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => throttledIncrement(item.id, item.quantity)}
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-4"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Захиалгын хураангуй
            </h2>
            <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300">
              <span>Барааны үнэ</span>
              <span>₮{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600 dark:text-gray-300 relative">
              <span>Хүргэлт</span>
              <div className="text-right">
                {shippingCost === 0 ? (
                  <span className="text-green-600 dark:text-green-400">
                    Free
                  </span>
                ) : (
                  <span>₮{shippingCost.toLocaleString()}</span>
                )}
                {subtotal < 50000 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    нэмж ₮{(50000 - subtotal).toLocaleString()}-ны худалдан
                    авалт хийвэл хүрглэт үнэгүй.
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between font-semibold text-gray-800 dark:text-white">
                <span>Нийт</span>
                <span>₮{total.toLocaleString()}</span>
              </div>
            </div>
            <Button
              className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => {
                // Implement checkout functionality
                if (cart.length > 0) {
                  // You would typically redirect to a checkout page
                  // For now, we'll show a toast notification
                  toast({
                    title: "Худалдан авах процесс эхэллээ!",
                    description: `${
                      cart.length
                    } ширхэг ₮${total.toLocaleString()} үнийн дүнтэй бараа (хүргэлтийн үнэ: ${
                      shippingCost > 0
                        ? `₮${shippingCost.toLocaleString()}`
                        : "үнэгүй хүргэлт"
                    })`,
                    variant: "default",
                  });

                  // Simulate a redirect to checkout page
                  setTimeout(() => {
                    window.location.href = "/checkout";
                  }, 1500);
                } else {
                  toast({
                    title: "Сагс хоосон байна!",
                    description:
                      "Худалдан авалт хийхийн тулд сагсан даа бараагаа хийнэ үү!",
                    variant: "destructive",
                  });
                }
              }}
            >
              Худалдан авах
            </Button>
            <Button
              variant="outline"
              className="w-full mt-2 border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-gray-600 dark:text-pink-400 dark:hover:bg-gray-800"
              onClick={() => {
                if (cart.length > 0) {
                  clearCart();
                  toast({
                    title: "Сагс цэвэрлэгдлээ!",
                    description: "Таны сагсан байсан бараанууд цэвэрлэгдлээ!",
                    variant: "default",
                  });
                } else {
                  toast({
                    title: "Сагс аль хоосон байна!",
                    description: "Устгах ямар ч бараа алга",
                    variant: "default",
                  });
                }
              }}
            >
              Сагс цэвэрлэх
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
