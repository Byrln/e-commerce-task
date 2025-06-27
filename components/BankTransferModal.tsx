'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface BankTransferModalProps {
  isOpen: boolean
  onClose: () => void
  amount?: number
  referenceCode?: string
}

export default function BankTransferModal({ 
  isOpen, 
  onClose, 
  amount, 
  referenceCode 
}: BankTransferModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const bankDetails = {
    bankName: 'Khan Bank',
    accountNumber: '5771180385',
    accountName: 'BAYARJAVKHLAN BATDORJ',
    iban: '650005005771180385'
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success('Хуулагдлаа!')
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error('Хуулахад алдаа гарлаа')
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('mn-MN').format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Банкны шилжүүлгийн заавар
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Bank Details Card */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 text-center">
                Банкны мэдээлэл
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Банк:</span>
                    <div className="font-medium dark:text-white">{bankDetails.bankName}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Дансны дугаар:</span>
                    <div className="font-mono text-lg font-bold dark:text-white">{bankDetails.accountNumber}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(bankDetails.accountNumber, 'account')}
                    className="ml-2"
                  >
                    {copiedField === 'account' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Данс эзэн:</span>
                    <div className="font-medium dark:text-white">{bankDetails.accountName}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">IBAN (сонголттой):</span>
                    <div className="font-mono text-sm dark:text-white">{bankDetails.iban}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(bankDetails.iban, 'iban')}
                    className="ml-2"
                  >
                    {copiedField === 'iban' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {amount && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div>
                      <span className="text-sm text-blue-600 dark:text-blue-400">Төлөх дүн:</span>
                      <div className="font-bold text-xl text-blue-700 dark:text-blue-300">₮{formatAmount(amount)}</div>
                    </div>
                  </div>
                )}
                
                {referenceCode && (
                  <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div>
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">Лавлагаа код:</span>
                      <div className="font-mono text-xl font-bold text-yellow-700 dark:text-yellow-300">{referenceCode}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(referenceCode, 'reference')}
                      className="ml-2 border-yellow-300"
                    >
                      {copiedField === 'reference' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Instructions */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">
                Төлбөр төлөх заавар
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Банкны апп эсвэл салбар руу очино уу</p>
                    <p className="text-gray-600">Khan Bank-ны аппликейшн эсвэл ойролцоох салбар руу очоод шилжүүлэг хийнэ үү.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Дээрх банкны мэдээллийг ашиглана уу</p>
                    <p className="text-gray-600">Дансны дугаар болон данс эзний нэрийг зөв бичнэ үү.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Лавлагаа кодыг заавал бичнэ үү!</p>
                    <p className="text-gray-600">
                      {referenceCode ? (
                        <>Гүйлгээний утгад <span className="font-mono font-bold">{referenceCode}</span> кодыг заавал бичнэ үү. Энэ кодгүйгээр таны төлбөрийг таних боломжгүй.</>
                      ) : (
                        'Захиалга үүсгэсний дараа лавлагаа код өгөгдөх бөгөөд үүнийг гүйлгээний утгад заавал бичнэ үү.'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Төлбөр баталгаажих хүртэл хүлээнэ үү</p>
                    <p className="text-gray-600">Төлбөр хийсний дараа 1-2 цагийн дотор баталгаажих болно. Захиалгын төлөв өөрчлөгдөх болно.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Important Notes */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-3 text-yellow-800">
                ⚠️ Анхаарах зүйлс
              </h3>
              
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Лавлагаа кодыг заавал зөв бичнэ үү. Буруу бичвэл төлбөр таних боломжгүй.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Төлбөрийн дүнг яг тохируулж төлнө үү.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Төлбөр баталгаажсаны дараа захиалга боловсруулагдах болно.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Асуудал гарвал бидэнтэй холбогдоно уу.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={onClose} className="px-8">
              Ойлголоо
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}