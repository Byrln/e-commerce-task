'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-react'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  revenueGrowth: number
  ordersGrowth: number
  usersGrowth: number
  recentOrders: Array<{
    id: string
    customerName: string
    total: number
    status: string
    createdAt: string
  }>
  topProducts: Array<{
    id: string
    name: string
    totalSold: number
    revenue: number
  }>
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (!response.ok) {
        throw new Error('Аналитик мэдээлэл ачаалахад алдаа гарлаа')
      }
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatGrowth = (growth: number | undefined | null) => {
    if (growth === undefined || growth === null || isNaN(growth)) {
      return (
        <div className="flex items-center text-gray-500">
          <span className="text-sm font-medium">N/A</span>
        </div>
      )
    }
    
    const isPositive = growth >= 0
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        <span className="text-sm font-medium">
          {isPositive ? '+' : ''}{growth.toFixed(1)}%
        </span>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Удирдлагын самбар</h1>
          <p className="text-gray-600 mt-2">Админ удирдлагын самбарт тавтай морил</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Удирдлагын самбар</h1>
          <p className="text-gray-600 mt-2">Админ удирдлагын самбарт тавтай морил</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Аналитик мэдээлэл ачаалахад алдаа: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Удирдлагын самбар</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Админ удирдлагын самбарт тавтай морил</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нийт орлого</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            {formatGrowth(analytics.revenueGrowth)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нийт захиалга</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders?.toLocaleString() || '0'}</div>
            {formatGrowth(analytics.ordersGrowth)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нийт хэрэглэгч</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers?.toLocaleString() || '0'}</div>
            {formatGrowth(analytics.usersGrowth)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Идэвхтэй бүтээгдэхүүн</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground mt-1">Идэвхтэй жагсаалт</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Сүүлийн захиалгууд</CardTitle>
            <CardDescription>Хэрэглэгчдийн хамгийн сүүлийн захиалгууд</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentOrders?.length > 0 ? analytics.recentOrders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{order.customerName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(order.total)}</p>
                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Сүүлийн захиалга байхгүй</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Шилдэг бүтээгдэхүүнүүд</CardTitle>
            <CardDescription>Энэ сарын хамгийн их борлуулалттай бүтээгдэхүүнүүд</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts?.length > 0 ? analytics.topProducts.map((product) => (
                <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.totalSold} ширхэг зарагдсан
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Шилдэг бүтээгдэхүүн байхгүй</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}