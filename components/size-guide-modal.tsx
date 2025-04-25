"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Хэмжээний заавар</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Хэмжээгээ зөв сонгохын тулд доорх хүснэгтийг ашиглана уу.
          </p>
          
          {/* Size Guide Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Хэмжээ</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Цээж (см)</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Бүсэлхий (см)</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Өндөр (см)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">XS</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">82-86</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">60-64</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">155-160</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">S</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">86-90</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">64-68</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">160-165</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">M</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">90-94</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">68-72</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">165-170</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">L</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">94-98</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">72-76</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">170-175</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">XL</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">98-102</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">76-80</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">175-180</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">XXL</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">102-106</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">80-84</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">180-185</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* How to Measure */}
          <div>
            <h3 className="font-medium mb-2">Хэрхэн хэмжих вэ?</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>Цээж: Цээжний хамгийн өргөн хэсгээр хэмжинэ.</li>
              <li>Бүсэлхий: Бүсэлхийн хамгийн нарийн хэсгээр хэмжинэ.</li>
              <li>Өндөр: Шалнаас толгойн оройг хүртэл хэмжинэ.</li>
            </ul>
          </div>
          
          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-md">
            <p className="text-sm text-pink-600 dark:text-pink-400">
              Хэрэв та хоёр хэмжээний хооронд байгаа бол, илүү тухтай байх үүднээс том хэмжээг сонгохыг зөвлөж байна.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}