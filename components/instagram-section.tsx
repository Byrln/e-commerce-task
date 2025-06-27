"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, ExternalLink, Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock Instagram posts data
const instagramPosts = [
  {
    id: "1",
    imageUrl: "/images/T-shirt1.png",
    caption: "Шинэ цамцны цуглуулга маань одоо худалдаанд гарлаа! Таны хувцасны шүүгээг өргөжүүлэх гайхалтай загваруудыг шалгаарай. #FashionStore #NewCollection #StyleTips",
    likes: 245,
    comments: 32,
    date: "2 өдрийн өмнө"
  },
  {
    id: "2",
    imageUrl: "/images/dress3.png",
    caption: "Зун ирлээ, манай үзэсгэлэнт даашинзнууд ч мөн адил! Энгийн уулзалтаас эхлээд онцгой үйл явдал хүртэл ямар ч үйл явдалд тохиромжтой. #SummerFashion #Dresses #FashionInspo",
    likes: 312,
    comments: 45,
    date: "5 өдрийн өмнө"
  },
  {
    id: "3",
    imageUrl: "/images/belt4.png",
    caption: "Манай гайхалтай хэрэгслүүдээр өөрийн төрхийг гүйцээ. Жижиг зүйлс том өөрчлөлт гаргадаг! #Accessories #FashionDetails #StyleGuide",
    likes: 189,
    comments: 21,
    date: "1 долоо хоногийн өмнө"
  }
]

export default function InstagramSection() {
  const instagramUrl = "https://www.instagram.com/y2k_online_shop/"

  return (
    <section className="py-32 bg-gradient-to-b from-pink-50 to-white dark:from-pink-950/30 dark:to-gray-950/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-3 mb-4">
            <Instagram size={28} className="text-pink-500" />
            <span className="text-xl font-medium">@dolgion_zagvar</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 dark:from-pink-400 dark:to-violet-400">
            Инстаграм хуудсаар дагаарай
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Шинэ цуглуулга, тайзны ард болж буй үйл явдал, онцгой санал зэргийг Инстаграм хуудсаар дагаж мэдээлэл аваарай.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {instagramPosts.map((post) => (
            <div key={post.id} className="group">
              <Link 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt="Instagram post"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Heart size={18} className="fill-white text-white" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={18} />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <p className="text-sm line-clamp-2">{post.caption}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center">
                        <Instagram size={16} className="text-white" />
                      </div>
                      <span className="font-medium">dolgion_zagvar</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{post.caption}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Heart size={18} />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <MessageCircle size={18} />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <ExternalLink size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <Button className="group text-lg px-8 py-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white">
              <Instagram size={20} className="mr-2" />
              Инстаграм хуудас руу очих
              <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}