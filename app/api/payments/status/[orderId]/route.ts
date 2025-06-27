import { NextRequest, NextResponse } from 'next/server'
import { getPaymentByOrderId } from '@/lib/payment'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // Get payment by order ID
    const payment = await getPaymentByOrderId(orderId)
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found for this order' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        bankName: payment.bankName,
        accountNumber: payment.accountNumber,
        accountName: payment.accountName,
        amount: payment.amount,
        referenceCode: payment.referenceCode,
        status: payment.status,
        createdAt: payment.createdAt,
        verifiedAt: payment.verifiedAt,
        order: {
          id: payment.order.id,
          orderNumber: payment.order.orderNumber,
          customerName: payment.order.customerName,
          total: payment.order.total,
          status: payment.order.status
        }
      }
    })
  } catch (error) {
    console.error('Error fetching payment status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment status' },
      { status: 500 }
    )
  }
}