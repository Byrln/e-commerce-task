'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Search, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Хүлээгдэж буй', icon: Package },
  { value: 'PROCESSING', label: 'Боловсруулж буй', icon: Package },
  { value: 'SHIPPED', label: 'Илгээсэн', icon: Truck },
  { value: 'DELIVERED', label: 'Хүргэсэн', icon: CheckCircle },
  { value: 'CANCELLED', label: 'Цуцалсан', icon: XCircle },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      toast({
        title: 'Алдаа',
        description: 'Захиалга ачаалахад алдаа гарлаа',
        variant: 'destructive',
      })
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update order status')

      toast({
        title: 'Амжилттай',
        description: 'Захиалгын төлөв амжилттай шинэчлэгдлээ',
      })

      fetchOrders()
    } catch (error) {
      toast({
        title: 'Алдаа',
        description: 'Захиалгын төлөв шинэчлэхэд алдаа гарлаа',
        variant: 'destructive',
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailDialogOpen(true)
  }

  const filteredOrders = (orders || []).filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
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

  const getOrderTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Захиалга</h1>
          <p className="text-gray-600 mt-2">Үйлчлүүлэгчдийн захиалга удирдах</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Захиалга</h1>
        <p className="text-gray-600 mt-2">Үйлчлүүлэгчдийн захиалга удирдах</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Захиалга удирдлага</CardTitle>
              <CardDescription>Захиалгын төлөв харах болон шинэчлэх</CardDescription>
            </div>
            <div className="flex space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Захиалга хайх..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Төлөвөөр шүүх" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Бүх төлөв</SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Захиалгын ID</TableHead>
                <TableHead>Үйлчлүүлэгч</TableHead>
                <TableHead>Бараа</TableHead>
                <TableHead>Нийт дүн</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead>Огноо</TableHead>
                <TableHead>Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className="font-mono text-sm">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {order.items.length} бараа
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusUpdate(order.id, value)}
                      disabled={updatingStatus === order.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openOrderDetail(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Захиалга #{selectedOrder?.id.slice(-8).toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Захиалгын дэлгэрэнгүй мэдээлэл болон барааны жагсаалт
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Үйлчлүүлэгчийн мэдээлэл</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Нэр:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-medium">И-мэйл:</span> {selectedOrder.customerEmail}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Захиалгын мэдээлэл</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Төлөв:</span> {getStatusBadge(selectedOrder.status)}</p>
                    <p><span className="font-medium">Захиалгын огноо:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Сүүлд шинэчилсэн:</span> {new Date(selectedOrder.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-4">Захиалгын бараа</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Бүтээгдэхүүн</TableHead>
                        <TableHead>Тоо ширхэг</TableHead>
                        <TableHead>Үнэ</TableHead>
                        <TableHead>Нийт</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {item.product.images[0] && (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="h-12 w-12 rounded-md object-cover"
                                />
                              )}
                              <span className="font-medium">{item.product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Нийт дүн: {formatCurrency(selectedOrder.total)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}