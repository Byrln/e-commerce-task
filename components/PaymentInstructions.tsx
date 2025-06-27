'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface PaymentData {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  amount: number
  referenceCode: string
  status: 'PENDING' | 'VERIFIED' | 'FAILED'
  createdAt: string
}

interface PaymentInstructionsProps {
  payment: PaymentData
  onVerifyPayment: () => Promise<void>
  isVerifying: boolean
}

export default function PaymentInstructions({
  payment,
  onVerifyPayment,
  isVerifying
}: PaymentInstructionsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.success(`${fieldName} хуулагдлаа`) // Copied
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error('Хуулахад алдаа гарлаа') // Error copying
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('mn-MN').format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Хүлээгдэж байна</Badge>
      case 'VERIFIED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Баталгаажсан</Badge>
      case 'FAILED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Амжилтгүй</Badge>
      default:
        return <Badge variant="outline">Тодорхойгүй</Badge>
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Төлбөрийн заавар
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Та төлбөрөө төлж захиалгаа баталгаажуулна уу
        </p>
        {getStatusBadge(payment.status)}
      </div>

      {/* Bank Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Банкны мэдээлэл
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bank Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Банк
            </label>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-mono text-gray-900 dark:text-white">
                {payment.bankName}
              </span>
            </div>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Дансны дугаар
            </label>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-mono text-gray-900 dark:text-white">
                {payment.accountNumber}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(payment.accountNumber, 'Дансны дугаар')}
                className="ml-2"
              >
                {copiedField === 'Дансны дугаар' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {/* IBAN (Optional) */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              IBAN: 650005005771180385 (сонголттой)
            </div>
          </div>

          {/* Account Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Данс эзэмшигч
            </label>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-mono text-gray-900 dark:text-white">
                {payment.accountName}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Шилжүүлэх дүн
            </label>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="font-mono text-xl font-bold text-blue-900 dark:text-blue-100">
                ₮{formatAmount(payment.amount)}
              </span>
            </div>
          </div>

          {/* Reference Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Гүйлгээний утга
            </label>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <span className="font-mono text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {payment.referenceCode}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(payment.referenceCode, 'Гүйлгээний утга')}
                className="ml-2"
              >
                {copiedField === 'Гүйлгээний утга' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Төлбөр төлөх заавар:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Мобайл банкны апп нээнэ үү</li>
              <li>"Мөнгө шилжүүлэх" хэсгийг сонгоно уу</li>
              <li>Дээрх дансны дугаарыг оруулна уу</li>
              <li>Шилжүүлэх дүнг оруулна уу: <strong>₮{formatAmount(payment.amount)}</strong></li>
              <li>Гүйлгээний утгад <strong>{payment.referenceCode}</strong> гэж бичнэ үү</li>
              <li>Гүйлгээг баталгаажуулна уу</li>
              <li>Доорх "Төлбөр шалгах" товчийг дарна уу</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Verify Payment Button */}
      {payment.status === 'PENDING' && (
        <div className="text-center">
          <Button
            onClick={onVerifyPayment}
            disabled={isVerifying}
            size="lg"
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Шалгаж байна...
              </>
            ) : (
              'Төлбөр шалгах'
            )}
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Төлбөр хийсний дараа энэ товчийг дарна уу
          </p>
        </div>
      )}

      {payment.status === 'VERIFIED' && (
        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 mb-2">
            <Check className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
            Төлбөр амжилттай баталгаажлаа!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            Таны захиалга боловсруулагдаж эхэллээ.
          </p>
        </div>
      )}

      {payment.status === 'FAILED' && (
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
            Төлбөр баталгаажуулахад алдаа гарлаа
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">
            Дахин оролдоно уу эсвэл манай тусламжийн төвтэй холбогдоно уу.
          </p>
          <Button
            onClick={onVerifyPayment}
            disabled={isVerifying}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Дахин шалгах
          </Button>
        </div>
      )}
    </div>
  )
}