import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // In production, add proper authentication/authorization here
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { paymentId, action, note } = await request.json()

    if (!paymentId || !action) {
      return NextResponse.json(
        { error: 'Payment ID and action are required' },
        { status: 400 }
      )
    }

    if (!['verify', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "verify" or "reject"' },
        { status: 400 }
      )
    }

    // Find the payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    if (payment.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Payment has already been processed' },
        { status: 400 }
      )
    }

    const newStatus = action === 'verify' ? 'VERIFIED' : 'FAILED'
    const orderStatus = action === 'verify' ? 'PROCESSING' : 'CANCELLED'

    // Update payment and order in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update payment status
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: newStatus,
          verifiedAt: new Date(),
          verificationNote: note || null
        }
      })

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: orderStatus,
          updatedAt: new Date()
        }
      })

      // Log the manual verification
      await tx.paymentLog.create({
        data: {
          paymentId: paymentId,
          action: `MANUAL_${action.toUpperCase()}`,
          details: {
            note: note || null,
            timestamp: new Date().toISOString(),
            method: 'manual_admin_verification'
          }
        }
      })

      return { payment: updatedPayment, order: updatedOrder }
    })

    return NextResponse.json({
      success: true,
      message: `Payment ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
      payment: result.payment,
      order: result.order
    })
  } catch (error) {
    console.error('Error processing manual verification:', error)
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    )
  }
}