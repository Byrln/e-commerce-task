import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const { referenceCode } = await request.json()
    
    // Validate required fields
    if (!referenceCode) {
      return NextResponse.json(
        { error: 'Reference code is required' },
        { status: 400 }
      )
    }
    
    // Verify payment
    const result = await verifyPayment(referenceCode)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        payment: result.payment ? {
          id: result.payment.id,
          orderId: result.payment.orderId,
          status: result.payment.status,
          verifiedAt: result.payment.verifiedAt,
          order: {
            id: result.payment.order.id,
            orderNumber: result.payment.order.orderNumber,
            status: result.payment.order.status
          }
        } : null
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}