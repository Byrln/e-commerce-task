'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PaymentInstructions from '@/components/PaymentInstructions'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PaymentData {
  id: string
  orderId: string
  bankName: string
  accountNumber: string
  accountName: string
  amount: number
  referenceCode: string
  status: 'PENDING' | 'VERIFIED' | 'FAILED'
  createdAt: string
  verifiedAt?: string
  order: {
    id: string
    orderNumber: string
    customerName: string
    total: number
    status: string
  }
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params?.orderId as string
  
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  // Fetch or create payment for the order
  useEffect(() => {
    console.log('PaymentPage - orderId:', orderId, 'params:', params)
    if (!orderId || orderId === 'undefined') {
      setError('Захиалгын ID олдсонгүй')
      setLoading(false)
      return
    }
    
    fetchPayment()
  }, [orderId, params])

  const fetchPayment = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // First, try to get existing payment
      const statusResponse = await fetch(`/api/payments/status/${orderId}`)
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        setPayment(statusData.payment)
      } else if (statusResponse.status === 404) {
        // Payment doesn't exist, create one
        await createPayment()
      } else {
        throw new Error('Failed to fetch payment status')
      }
    } catch (error) {
      console.error('Error fetching payment:', error)
      setError('Төлбөрийн мэдээлэл татахад алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  const createPayment = async () => {
    try {
      console.log('Creating payment for orderId:', orderId)
      
      // Get order details from a public endpoint or use a different approach
      // Since we don't have the order total, we'll need to get it from the order creation flow
      // For now, let's try to create payment with a placeholder amount
      // The backend will validate the order exists
      
      const requestBody = {
        orderId: orderId,
        amount: 0 // This will be updated by the backend based on the actual order
      }
      
      console.log('Payment creation request:', requestBody)
      
      const orderResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      console.log('Payment creation response status:', orderResponse.status)
      
      if (!orderResponse.ok) {
        let errorMessage = 'Payment creation failed'
        try {
          const errorData = await orderResponse.json()
          console.error('Payment creation error:', errorData)
          errorMessage = errorData.error || errorData.message || `HTTP ${orderResponse.status}: ${orderResponse.statusText}`
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          errorMessage = `HTTP ${orderResponse.status}: ${orderResponse.statusText}`
        }
        throw new Error(errorMessage)
      }
      
      const paymentData = await orderResponse.json()
      
      // Fetch the complete payment data with order details
      const statusResponse = await fetch(`/api/payments/status/${orderId}`)
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        setPayment(statusData.payment)
      } else {
        // If status fetch fails, use the basic payment data
        setPayment({
          id: paymentData.payment.id,
          orderId: orderId,
          bankName: paymentData.payment.bankName,
          accountNumber: paymentData.payment.accountNumber,
          accountName: paymentData.payment.accountName,
          amount: paymentData.payment.amount,
          referenceCode: paymentData.payment.referenceCode,
          status: paymentData.payment.status,
          createdAt: paymentData.payment.createdAt,
          order: {
            id: orderId,
            orderNumber: orderId,
            customerName: '',
            total: paymentData.payment.amount,
            status: 'PENDING'
          }
        })
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      const errorMessage = error instanceof Error ? error.message : 'Төлбөр үүсгэхэд алдаа гарлаа'
      setError(errorMessage)
    }
  }

  const handleVerifyPayment = async () => {
    if (!payment) return
    
    try {
      setIsVerifying(true)
      
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          referenceCode: payment.referenceCode
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        
        // Update payment state
        if (data.payment) {
          setPayment(prev => prev ? {
            ...prev,
            status: data.payment.status,
            verifiedAt: data.payment.verifiedAt
          } : null)
        }
        
        // If verified, redirect to success page after a delay
        if (data.payment?.status === 'VERIFIED') {
          setTimeout(() => {
            router.push(`/checkout/success?orderId=${orderId}`)
          }, 2000)
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      toast.error('Төлбөр шалгахад алдаа гарлаа')
    } finally {
      setIsVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Төлбөрийн мэдээлэл ачааллаж байна...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
            <p className="text-red-600 dark:text-red-400 text-center mb-4">{error}</p>
            <button
              onClick={fetchPayment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Дахин оролдох
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-8 w-8 text-yellow-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-center">Төлбөрийн мэдээлэл олдсонгүй</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <PaymentInstructions
        payment={payment}
        onVerifyPayment={handleVerifyPayment}
        isVerifying={isVerifying}
      />
    </div>
  )
}