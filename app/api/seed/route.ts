import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting database seeding...')

    // Create admin user (password will be hashed in the API)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.O', // hashed 'admin123'
        role: 'ADMIN'
      }
    })
    console.log('✅ Admin user created:', admin.email)

    // Create regular user
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Test User',
        password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.O', // hashed 'user123'
        role: 'USER'
      }
    })
    console.log('✅ Regular user created:', user.email)

    // Sample products
    const products = [
      {
        name: 'Classic White T-Shirt',
        price: 29.99,
        description: 'A comfortable and versatile white t-shirt made from 100% cotton. Perfect for everyday wear.',
        images: ['/images/T-shirt1.png'],
        category: 'T-Shirts',
        features: ['100% Cotton', 'Machine Washable', 'Comfortable Fit'],
        inventory: 50
      },
      {
        name: 'Vintage Blue Jeans',
        price: 79.99,
        description: 'Classic blue jeans with a vintage wash. Durable and stylish for any occasion.',
        images: ['/images/pant1.png'],
        category: 'Pants',
        features: ['Denim', 'Vintage Wash', 'Regular Fit'],
        inventory: 30
      },
      {
        name: 'Elegant Summer Dress',
        price: 89.99,
        description: 'A beautiful summer dress perfect for warm weather and special occasions.',
        images: ['/images/dress1.png'],
        category: 'Dresses',
        features: ['Lightweight Fabric', 'Breathable', 'Elegant Design'],
        inventory: 25
      },
      {
        name: 'Leather Combat Boots',
        price: 149.99,
        description: 'Durable leather combat boots with excellent grip and comfort.',
        images: ['/images/boots1.png'],
        category: 'Boots',
        features: ['Genuine Leather', 'Non-slip Sole', 'Ankle Support'],
        inventory: 20
      },
      {
        name: 'Classic Leather Belt',
        price: 39.99,
        description: 'A timeless leather belt that complements any outfit.',
        images: ['/images/belt1.png'],
        category: 'Accessories',
        features: ['Genuine Leather', 'Adjustable', 'Classic Design'],
        inventory: 40
      },
      {
        name: 'Casual Black T-Shirt',
        price: 24.99,
        description: 'A comfortable black t-shirt for casual wear.',
        images: ['/images/T-shirt2.png'],
        category: 'T-Shirts',
        features: ['Cotton Blend', 'Soft Fabric', 'Casual Fit'],
        inventory: 45
      },
      {
        name: 'Formal Dress Pants',
        price: 69.99,
        description: 'Professional dress pants perfect for office wear.',
        images: ['/images/pant2.png'],
        category: 'Pants',
        features: ['Wrinkle Resistant', 'Professional Fit', 'Easy Care'],
        inventory: 35
      },
      {
        name: 'Floral Print Dress',
        price: 79.99,
        description: 'A charming dress with beautiful floral patterns.',
        images: ['/images/dress2.png'],
        category: 'Dresses',
        features: ['Floral Print', 'Comfortable Fit', 'Versatile Style'],
        inventory: 28
      }
    ]

    console.log('🛍️ Creating products...')
    for (const productData of products) {
      // Check if product already exists
      const existingProduct = await prisma.product.findFirst({
        where: { name: productData.name }
      })
      
      if (!existingProduct) {
        const product = await prisma.product.create({
          data: productData
        })
        console.log(`✅ Product created: ${product.name}`)
      } else {
        console.log(`⚠️ Product already exists: ${productData.name}`)
      }
    }

    // Create sample reviews
    const createdProducts = await prisma.product.findMany()
    console.log('⭐ Creating sample reviews...')
    
    const sampleReviews = [
      {
        productId: createdProducts[0].id,
        userId: user.id,
        userName: user.name || 'Anonymous',
        rating: 5,
        comment: 'Excellent quality t-shirt! Very comfortable and fits perfectly.'
      },
      {
        productId: createdProducts[1].id,
        userId: user.id,
        userName: user.name || 'Anonymous',
        rating: 4,
        comment: 'Great jeans, love the vintage look. Runs a bit small though.'
      },
      {
        productId: createdProducts[2].id,
        userId: user.id,
        userName: user.name || 'Anonymous',
        rating: 5,
        comment: 'Beautiful dress! Perfect for summer events.'
      }
    ]

    for (const reviewData of sampleReviews) {
      await prisma.review.create({
        data: reviewData
      })
    }
    console.log('✅ Sample reviews created')

    // Create a sample order
    console.log('📦 Creating sample order...')
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-SAMPLE`,
        customerName: user.name || 'Test Customer',
        customerEmail: user.email || 'test@example.com',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        total: 109.98,
        status: 'DELIVERED',
        items: {
          create: [
            {
              productId: createdProducts[0].id,
              quantity: 2,
              price: 29.99
            },
            {
              productId: createdProducts[4].id,
              quantity: 1,
              price: 39.99
            }
          ]
        }
      }
    })
    console.log('✅ Sample order created:', sampleOrder.orderNumber)

    console.log('🎉 Database seeding completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        usersCreated: 2,
        productsCreated: products.length,
        reviewsCreated: sampleReviews.length,
        ordersCreated: 1
      }
    })
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}