import { NextRequest, NextResponse } from 'next/server'
import { createPayment } from '@/lib/payment'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json()
    
    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // Verify order exists and get the actual amount
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Use the order total as the payment amount
    const paymentAmount = amount || order.total
    
    // Create payment
    const payment = await createPayment(orderId, paymentAmount)
    
    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        bankName: payment.bankName,
        accountNumber: payment.accountNumber,
        accountName: payment.accountName,
        amount: payment.amount,
        referenceCode: payment.referenceCode,
        status: payment.status,
        createdAt: payment.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}