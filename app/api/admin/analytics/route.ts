import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current date and previous month for growth calculations
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    // Total counts
    const [totalRevenue, totalOrders, totalUsers, totalProducts] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } }
      }),
      prisma.order.count({ where: { status: { not: 'CANCELLED' } } }),
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } })
    ])

    // Previous month data for growth calculation
    const [prevMonthRevenue, prevMonthOrders, prevMonthUsers] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: { not: 'CANCELLED' },
          createdAt: {
            gte: twoMonthsAgo,
            lt: previousMonth
          }
        }
      }),
      prisma.order.count({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: {
            gte: twoMonthsAgo,
            lt: previousMonth
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: twoMonthsAgo,
            lt: previousMonth
          }
        }
      })
    ])

    // Current month data
    const [currentMonthRevenue, currentMonthOrders, currentMonthUsers] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: { not: 'CANCELLED' },
          createdAt: {
            gte: currentMonth
          }
        }
      }),
      prisma.order.count({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: {
            gte: currentMonth
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: currentMonth
          }
        }
      })
    ])

    // Calculate growth percentages
    const revenueGrowth = prevMonthRevenue._sum.total 
      ? ((currentMonthRevenue._sum.total || 0) - (prevMonthRevenue._sum.total || 0)) / (prevMonthRevenue._sum.total || 1) * 100
      : 0

    const ordersGrowth = prevMonthOrders 
      ? (currentMonthOrders - prevMonthOrders) / prevMonthOrders * 100
      : 0

    const usersGrowth = prevMonthUsers 
      ? (currentMonthUsers - prevMonthUsers) / prevMonthUsers * 100
      : 0

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true
      }
    })

    // Top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })

    // Get product details for top products
    const productIds = topProducts.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, images: true }
    })

    const topProductsWithDetails = topProducts.map(item => {
      const product = products.find(p => p.id === item.productId)
      return {
        id: item.productId,
        name: product?.name || 'Unknown Product',
        image: product?.images?.[0] || '',
        totalSold: item._sum.quantity || 0,
        revenue: item._sum.price || 0
      }
    })

    // Sales by category
    const salesByCategory = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        price: true,
        quantity: true
      },
      where: {
        order: {
          status: { not: 'CANCELLED' }
        }
      }
    })

    // Get categories for products
    const allProductIds = salesByCategory.map(item => item.productId)
    const allProducts = await prisma.product.findMany({
      where: { id: { in: allProductIds } },
      select: { id: true, category: true }
    })

    // Group by category
    const categoryStats = salesByCategory.reduce((acc, item) => {
      const product = allProducts.find(p => p.id === item.productId)
      if (product) {
        const category = product.category
        if (!acc[category]) {
          acc[category] = { revenue: 0, quantity: 0 }
        }
        acc[category].revenue += item._sum.price || 0
        acc[category].quantity += item._sum.quantity || 0
      }
      return acc
    }, {} as Record<string, { revenue: number; quantity: number }>)

    const categoryData = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      revenue: stats.revenue,
      quantity: stats.quantity
    }))

    // Monthly sales data for chart (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const monthlySales = await prisma.order.groupBy({
      by: ['createdAt'],
      _sum: { total: true },
      _count: { id: true },
      where: {
        status: { not: 'CANCELLED' },
        createdAt: {
          gte: sixMonthsAgo
        }
      }
    })

    // Process monthly data
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthSales = monthlySales.filter(sale => {
        const saleDate = new Date(sale.createdAt)
        return saleDate >= monthStart && saleDate <= monthEnd
      })

      const totalRevenue = monthSales.reduce((sum, sale) => sum + (sale._sum.total || 0), 0)
      const totalOrders = monthSales.reduce((sum, sale) => sum + sale._count.id, 0)

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: totalRevenue,
        orders: totalOrders
      })
    }

    return NextResponse.json({
      overview: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalUsers,
        totalProducts,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        ordersGrowth: Math.round(ordersGrowth * 100) / 100,
        usersGrowth: Math.round(usersGrowth * 100) / 100
      },
      recentOrders,
      topProducts: topProductsWithDetails,
      salesByCategory: categoryData,
      monthlySales: monthlyData
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}