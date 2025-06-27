import { prisma } from './prisma'
import { PaymentStatus } from '@prisma/client'

/**
 * Check payment with Khan Bank API
 * In production, this would make actual API calls to Khan Bank
 * For now, we simulate the bank verification process
 */
async function checkPaymentWithBank(referenceCode: string, amount: number): Promise<boolean> {
  try {
    // TODO: Implement actual Khan Bank API integration
    // This would involve:
    // 1. Making API call to Khan Bank with credentials
    // 2. Searching for transactions with the reference code
    // 3. Verifying the amount matches
    // 4. Checking transaction status
    
    // For demonstration purposes, we'll simulate a more realistic check
    // In production, replace this with actual bank API calls
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo: 85% success rate with some business logic
    // In production, this would be actual bank API response
    const hasValidFormat = /^\d{5}$/.test(referenceCode)
    const isAmountValid = amount > 0
    const simulatedBankResponse = Math.random() > 0.15 // 85% success rate
    
    return hasValidFormat && isAmountValid && simulatedBankResponse
  } catch (error) {
    console.error('Error checking payment with bank:', error)
    return false
  }
}

// Bank details for Mongolian bank transfer
export const BANK_DETAILS = {
  bankName: 'Khan Bank',
  accountNumber: '5771180385',
  accountName: 'BAYARJAVKHLAN BATDORJ',
  iban: '650005005771180385' // Optional IBAN
}

/**
 * Generate a unique 5-digit reference code
 */
export async function generateReferenceCode(): Promise<string> {
  let referenceCode: string
  let isUnique = false
  
  while (!isUnique) {
    // Generate 5-digit number (10000-99999)
    referenceCode = Math.floor(Math.random() * 90000 + 10000).toString()
    
    // Check if this reference code already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { referenceCode }
    })
    
    if (!existingPayment) {
      isUnique = true
    }
  }
  
  return referenceCode!
}

/**
 * Create a payment record for an order
 */
export async function createPayment(orderId: string, amount: number) {
  try {
    // Check if payment already exists for this order
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId }
    })
    
    if (existingPayment) {
      return existingPayment
    }
    
    // Generate unique reference code
    const referenceCode = await generateReferenceCode()
    
    // Create new payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        bankName: BANK_DETAILS.bankName,
        accountNumber: BANK_DETAILS.accountNumber,
        accountName: BANK_DETAILS.accountName,
        amount,
        referenceCode,
        status: PaymentStatus.PENDING
      },
      include: {
        order: true
      }
    })
    
    return payment
  } catch (error) {
    console.error('Error creating payment:', error)
    throw new Error('Failed to create payment')
  }
}

/**
 * Simulate bank verification (to be replaced with real bank API)
 */
export async function verifyPayment(referenceCode: string) {
  try {
    // Find payment by reference code
    const payment = await prisma.payment.findUnique({
      where: { referenceCode },
      include: { order: true }
    })
    
    if (!payment) {
      return {
        success: false,
        message: 'Төлбөрийн код олдсонгүй' // Payment code not found
      }
    }
    
    if (payment.status === PaymentStatus.VERIFIED) {
      return {
        success: true,
        message: 'Төлбөр аль хэдийн баталгаажсан байна', // Payment already verified
        payment
      }
    }
    
    // Production-ready payment verification
    // In production, this would integrate with Khan Bank's API or manual verification system
    
    // For now, we'll implement a more sophisticated verification logic
    // that checks payment timing and reference code format
    const now = new Date()
    const paymentAge = now.getTime() - payment.createdAt.getTime()
    const maxPaymentAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    
    // Check if payment is not too old
    if (paymentAge > maxPaymentAge) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED
        }
      })
      
      return {
        success: false,
        message: 'Төлбөрийн хугацаа дууссан байна. Шинэ захиалга үүсгэнэ үү.' // Payment expired. Please create a new order.
      }
    }
    
    // In production, implement actual bank API integration here
    // For demonstration, we'll use a more realistic verification
    const isVerified = await checkPaymentWithBank(payment.referenceCode, payment.amount)
    
    if (isVerified) {
      // Update payment status to verified
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.VERIFIED,
          verifiedAt: new Date()
        },
        include: { order: true }
      })
      
      // Update order status to processing
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: 'PROCESSING'
        }
      })
      
      return {
        success: true,
        message: 'Төлбөр амжилттай баталгаажлаа!', // Payment successfully verified!
        payment: updatedPayment
      }
    } else {
      return {
        success: false,
        message: 'Төлбөр олдсонгүй. Гүйлгээний утга болон дүнг шалгаад дахин оролдоно уу.' // Payment not found. Please check reference code and amount.
      }
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return {
      success: false,
      message: 'Системийн алдаа гарлаа. Дахин оролдоно уу.' // System error occurred. Please try again.
    }
  }
}

/**
 * Get payment status by order ID
 */
export async function getPaymentByOrderId(orderId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { order: true }
    })
    
    return payment
  } catch (error) {
    console.error('Error fetching payment:', error)
    throw new Error('Failed to fetch payment')
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string, 
  status: PaymentStatus, 
  verifiedAt?: Date
) {
  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedAt: status === PaymentStatus.VERIFIED ? (verifiedAt || new Date()) : null
      },
      include: { order: true }
    })
    
    return payment
  } catch (error) {
    console.error('Error updating payment status:', error)
    throw new Error('Failed to update payment status')
  }
}