"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { ChevronLeft, CreditCard, Truck, Check } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Mongolia",

    // Payment information
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",

    // Shipping method
    shippingMethod: "standard",

    // Payment method
    paymentMethod: "credit",
  });

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Calculate order totals
    const newSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const newShipping =
      formData.shippingMethod === "express" ? 15 : newSubtotal >= 50 ? 0 : 5.99;

    setSubtotal(newSubtotal);
    setShipping(newShipping);
    setTotal(newSubtotal + newShipping);
  }, [cart, formData.shippingMethod]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Захиалга амжилттай",
        description: "Таны захиалгыг хүлээн авлаа. Баярлалаа!",
      });
      clearCart();
      setIsSubmitting(false);
      router.push("/checkout/success");
    }, 2000);
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Таны сагс хоосон байна</h1>
        <p className="text-gray-500 mb-8">
          Төлбөр төлөхийн өмнө сагсандаа бүтээгдэхүүн нэмнэ үү.
        </p>
        <Link href="/shop">
          <Button>Дэлгүүрлэлтээ үргэлжлүүлэх</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Төлбөр төлөх
      </motion.h1>

      {/* Checkout Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-center">
          <div
            className={`flex flex-col items-center ${
              step >= 1 ? "text-black dark:text-white" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 1
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <Truck size={20} />
            </div>
            <span className="text-sm">Хүргэлт</span>
          </div>

          <div
            className={`w-20 h-0.5 mx-2 ${
              step >= 2
                ? "bg-black dark:bg-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />

          <div
            className={`flex flex-col items-center ${
              step >= 2 ? "text-black dark:text-white" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 2
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <CreditCard size={20} />
            </div>
            <span className="text-sm">Төлбөр</span>
          </div>

          <div
            className={`w-20 h-0.5 mx-2 ${
              step >= 3
                ? "bg-black dark:bg-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />

          <div
            className={`flex flex-col items-center ${
              step >= 3 ? "text-black dark:text-white" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 3
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <Check size={20} />
            </div>
            <span className="text-sm">Баталгаажуулах</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-6">
                  Хүргэлтийн мэдээлэл
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Нэр</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Овог</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Имэйл</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Утасны дугаар</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Хаяг</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="city">Хот</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Аймаг/Дүүрэг</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Шуудангийн код</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Улс</Label>
                    <Input value="Монгол" disabled />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="font-medium">Хүргэлтийн төрөл</h3>
                    <RadioGroup
                      value={formData.shippingMethod}
                      onValueChange={(value) =>
                        handleRadioChange("shippingMethod", value)
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 border p-4 rounded-md">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label
                          htmlFor="standard"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">Энгийн хүргэлт</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            3-5 ажлын өдөр
                          </div>
                        </Label>
                        <div className="font-medium">
                          {subtotal >= 50 ? "Үнэгүй" : "$5.99"}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 border p-4 rounded-md">
                        <RadioGroupItem value="express" id="express" />
                        <Label
                          htmlFor="express"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">Шуурхай хүргэлт</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            1-2 ажлын өдөр
                          </div>
                        </Label>
                        <div className="font-medium">₮15,000</div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button onClick={nextStep}>Үргэлжлүүлэх</Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-6">
                  Төлбөрийн мэдээлэл
                </h2>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Төлбөрийн хэлбэр</h3>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        handleRadioChange("paymentMethod", value)
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 border p-4 rounded-md">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label
                          htmlFor="credit"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">Кредит карт</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Visa, Mastercard, American Express
                          </div>
                        </Label>
                        <div className="flex space-x-2">
                          <div className="w-10 h-6 bg-blue-600 rounded"></div>
                          <div className="w-10 h-6 bg-red-500 rounded"></div>
                          <div className="w-10 h-6 bg-green-600 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 border p-4 rounded-md">
                        <RadioGroupItem value="qpay" id="qpay" />
                        <Label htmlFor="qpay" className="flex-1 cursor-pointer">
                          <div className="font-medium">QPay</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Монгол банк, Хаан банк, Голомт банк
                          </div>
                        </Label>
                        <div className="w-10 h-6 bg-blue-500 rounded"></div>
                      </div>
                      <div className="flex items-center space-x-3 border p-4 rounded-md">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div className="font-medium">Бэлнээр төлөх</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Хүргэлтийн үед бэлнээр төлөх
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.paymentMethod === "credit" && (
                    <div className="space-y-6 mt-6 border-t pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Картын нэр</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          placeholder="Картан дээрх нэр"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Картын дугаар</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Дуусах хугацаа</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft size={16} className="mr-2" />
                      Буцах
                    </Button>
                    <Button onClick={nextStep}>Үргэлжлүүлэх</Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-6">
                  Захиалга баталгаажуулах
                </h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Хүргэлтийн мэдээлэл</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                      <p>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>{formData.address}</p>
                      <p>
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                      <p>{formData.country}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Хүргэлтийн төрөл</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                      <p>
                        {formData.shippingMethod === "standard"
                          ? "Энгийн хүргэлт (3-5 ажлын өдөр)"
                          : "Шуурхай хүргэлт (1-2 ажлын өдөр)"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Төлбөрийн хэлбэр</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                      {formData.paymentMethod === "credit" && (
                        <p>
                          Кредит карт (**** **** ****{" "}
                          {formData.cardNumber.slice(-4)})
                        </p>
                      )}
                      {formData.paymentMethod === "qpay" && <p>QPay</p>}
                      {formData.paymentMethod === "cash" && (
                        <p>Бэлнээр төлөх</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Захиалгын бүтээгдэхүүн</h3>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-md"
                        >
                          <div className="relative w-16 h-16">
                            <Image
                              src={item.images[0] || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.selectedColor &&
                                `Өнгө: ${item.selectedColor}, `}
                              {item.selectedSize &&
                                `Хэмжээ: ${item.selectedSize}, `}
                              Тоо: {item.quantity}
                            </p>
                          </div>
                          <div className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep}>
                    <ChevronLeft size={16} className="mr-2" />
                    Буцах
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Боловсруулж байна..." : "Захиалга хийх"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Захиалгын дүн</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-2 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Тоо: {item.quantity}
                    </p>
                  </div>
                  <div className="font-medium">
                    ₮{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Нийт дүн</span>
                <span>₮{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Хүргэлт</span>
                <span>
                  {shipping === 0 ? "Үнэгүй" : `₮${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Нийт төлөх</span>
                  <span>₮{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-2">
                "Захиалга хийх" товчийг дарснаар та манай{" "}
                <Link href="/terms-of-service" className="underline">
                  үйлчилгээний нөхцөл
                </Link>{" "}
                болон{" "}
                <Link href="/privacy-policy" className="underline">
                  нууцлалын бодлого
                </Link>
                -г хүлээн зөвшөөрч байна.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
