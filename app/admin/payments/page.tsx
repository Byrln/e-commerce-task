'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Search, Check, X, Clock, AlertCircle } from 'lucide-react'

interface Payment {
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
    customerEmail: string
    total: number
    status: string
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [verificationNote, setVerificationNote] = useState('')
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments)
      } else {
        toast.error('Төлбөр ачаалахад алдаа гарлаа')
      }
    } catch (error) {
      toast.error('Төлбөр ачаалахад алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  const handleManualVerification = async (paymentId: string, action: 'verify' | 'reject') => {
    try {
      setProcessingPayment(paymentId)
      const response = await fetch('/api/admin/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId,
          action,
          note: verificationNote
        })
      })

      if (response.ok) {
        toast.success(`Төлбөр ${action === 'verify' ? 'баталгаажлаа' : 'татгалзлаа'}`)
        setSelectedPayment(null)
        setVerificationNote('')
        fetchPayments()
      } else {
        toast.error(`Төлбөр ${action === 'verify' ? 'баталгаажуулахад' : 'татгалзахад'} алдаа гарлаа`)
      }
    } catch (error) {
      toast.error('Төлбөр боловсруулахад алдаа гарлаа')
    } finally {
      setProcessingPayment(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Хүлээгдэж буй</Badge>
      case 'VERIFIED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="w-3 h-3 mr-1" />Баталгаажсан</Badge>
      case 'FAILED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="w-3 h-3 mr-1" />Амжилтгүй</Badge>
      default:
        return <Badge variant="outline">Тодорхойгүй</Badge>
    }
  }

  const filteredPayments = payments.filter(payment => 
    payment.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('mn-MN').format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('mn-MN')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Төлбөр ачааллаж байна...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Төлбөр удирдлага</h1>
          <p className="text-gray-600">Үйлчлүүлэгчдийн төлбөр удирдах болон баталгаажуулах</p>
        </div>
        <Button onClick={fetchPayments} variant="outline">
          Шинэчлэх
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Лавлагааны код, захиалгын дугаар, үйлчлүүлэгчийн нэр эсвэл и-мэйлээр хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{payments.filter(p => p.status === 'PENDING').length}</div>
            <p className="text-sm text-gray-600">Хүлээгдэж буй төлбөр</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === 'VERIFIED').length}</div>
            <p className="text-sm text-gray-600">Баталгаажсан төлбөр</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{payments.filter(p => p.status === 'FAILED').length}</div>
            <p className="text-sm text-gray-600">Амжилтгүй төлбөр</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₮{formatAmount(payments.filter(p => p.status === 'VERIFIED').reduce((sum, p) => sum + p.amount, 0))}</div>
            <p className="text-sm text-gray-600">Нийт баталгаажсан</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Төлбөр ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-lg font-bold">{payment.referenceCode}</span>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Order: {payment.order.orderNumber} | Customer: {payment.order.customerName}
                    </div>
                    <div className="text-sm text-gray-600">
                      Email: {payment.order.customerEmail}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">₮{formatAmount(payment.amount)}</div>
                    <div className="text-sm text-gray-600">{formatDate(payment.createdAt)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Bank:</span>
                    <div className="font-medium">{payment.bankName}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Account:</span>
                    <div className="font-mono">{payment.accountNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Account Name:</span>
                    <div className="font-medium">{payment.accountName}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Order Status:</span>
                    <div className="font-medium">{payment.order.status}</div>
                  </div>
                </div>

                {payment.status === 'PENDING' && (
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedPayment(payment)}
                      variant="outline"
                    >
                      Manual Verify
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No payments found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Verification Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Manual Payment Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Reference Code</Label>
                <div className="font-mono text-lg font-bold">{selectedPayment.referenceCode}</div>
              </div>
              
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="text-lg font-bold">₮{formatAmount(selectedPayment.amount)}</div>
              </div>
              
              <div className="space-y-2">
                <Label>Customer</Label>
                <div>{selectedPayment.order.customerName}</div>
                <div className="text-sm text-gray-600">{selectedPayment.order.customerEmail}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="note">Verification Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add any notes about this verification..."
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleManualVerification(selectedPayment.id, 'verify')}
                  disabled={processingPayment === selectedPayment.id}
                  className="flex-1"
                >
                  {processingPayment === selectedPayment.id ? 'Processing...' : 'Verify Payment'}
                </Button>
                <Button
                  onClick={() => handleManualVerification(selectedPayment.id, 'reject')}
                  disabled={processingPayment === selectedPayment.id}
                  variant="destructive"
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
              
              <Button
                onClick={() => {
                  setSelectedPayment(null)
                  setVerificationNote('')
                }}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}