'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Edit, Trash2, Eye, Upload, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  images: string[]
  inventory: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ProductFormData {
  name: string
  price: string
  description: string
  category: string
  images: string
  inventory: string
  isActive: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    description: '',
    category: '',
    images: '',
    inventory: '',
    isActive: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Fetch all products for admin view (including inactive ones)
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        // Fallback to regular products endpoint if admin endpoint doesn't exist
        const fallbackResponse = await fetch('/api/products?limit=100')
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          setProducts(data.products || [])
        } else {
          toast({
            title: "Алдаа",
            description: "Бүтээгдэхүүн ачаалахад алдаа гарлаа",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Алдаа",
        description: "Бүтээгдэхүүн ачаалахад алдаа гарлаа",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.price || !formData.description) {
      toast({
        title: "Алдаа",
        description: "Шаардлагатай талбаруудыг бөглөнө үү",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      // Handle image uploads
      let imageUrls: string[] = []
      
      if (imageFiles.length > 0) {
        // Upload images to Cloudinary or your preferred service
        // For demo purposes, we'll use placeholder images
        imageUrls = imageFiles.map((_, index) => 
          `https://via.placeholder.com/400x400?text=Product+Image+${index + 1}`
        )
      } else if (formData.images) {
        // Use URL images if provided
        imageUrls = formData.images.split(',').map(img => img.trim()).filter(img => img)
      }
      
      if (imageUrls.length === 0) {
        toast({
          title: "Алдаа",
          description: "Дор хаяж нэг зургийн URL оруулна уу",
          variant: "destructive",
        })
        setSubmitting(false)
        return
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          images: imageUrls,
          inventory: parseInt(formData.inventory) || 0,
          isActive: formData.isActive,
        }),
      })

      if (response.ok) {
        toast({
          title: "Амжилт",
          description: "Бүтээгдэхүүн амжилттай үүсгэгдлээ! Жагсаалтыг шинэчилж байна...",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        // Add a small delay to ensure the product is saved before fetching
        setTimeout(() => {
          fetchProducts()
        }, 500)
      } else {
        const error = await response.json()
        toast({
          title: "Алдаа",
          description: error.error || "Бүтээгдэхүүн үүсгэхэд алдаа гарлаа",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Product creation error:', error)
      toast({
        title: "Алдаа",
        description: "Бүтээгдэхүүн үүсгэхэд алдаа гарлаа",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    if (!formData.name || !formData.price || !formData.description) {
      toast({
        title: "Алдаа",
        description: "Шаардлагатай талбаруудыг бөглөнө үү",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const imageUrls = formData.images.split(',').map(img => img.trim()).filter(img => img)
      
      if (imageUrls.length === 0) {
        toast({
          title: "Алдаа",
          description: "Дор хаяж нэг зургийн URL оруулна уу",
          variant: "destructive",
        })
        setSubmitting(false)
        return
      }

      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          images: imageUrls,
          inventory: parseInt(formData.inventory) || 0,
          isActive: formData.isActive,
        }),
      })

      if (response.ok) {
        toast({
          title: "Амжилт",
          description: "Бүтээгдэхүүн амжилттай шинэчлэгдлээ! Жагсаалтыг шинэчилж байна...",
        })
        setIsEditDialogOpen(false)
        setEditingProduct(null)
        resetForm()
        // Add a small delay to ensure the product is saved before fetching
        setTimeout(() => {
          fetchProducts()
        }, 500)
      } else {
        const error = await response.json()
        toast({
          title: "Алдаа",
          description: error.error || "Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Product update error:', error)
      toast({
        title: "Алдаа",
        description: "Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }

      toast({
        title: 'Амжилт',
        description: 'Бүтээгдэхүүн амжилттай устгагдлаа',
      })

      // Refresh the products list
      setTimeout(() => {
        fetchProducts()
      }, 500)
    } catch (error) {
      console.error('Delete product error:', error)
      toast({
        title: 'Алдаа',
        description: error instanceof Error ? error.message : 'Бүтээгдэхүүн устгахад алдаа гарлаа',
        variant: 'destructive',
      })
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      images: product.images.join(', '),
      inventory: product.inventory.toString(),
      isActive: product.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      images: '',
      inventory: '',
      isActive: true,
    })
    setUploadedImages([])
    setImageFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Алдаа",
        description: "Зөвхөн зургийн файл сонгоно уу (JPEG, PNG, WebP)",
        variant: "destructive",
      })
      return
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      toast({
        title: "Алдаа",
        description: "5MB-аас бага хэмжээтэй зураг сонгоно уу",
        variant: "destructive",
      })
      return
    }

    // Create preview URLs
    const newImageUrls = files.map(file => URL.createObjectURL(file))
    setUploadedImages(prev => [...prev, ...newImageUrls])
    setImageFiles(prev => [...prev, ...files])

    // Update form data with placeholder URLs (will be replaced with actual URLs after upload)
    const currentImages = formData.images ? formData.images.split(',').map(img => img.trim()).filter(img => img) : []
    const allImages = [...currentImages, ...newImageUrls]
    setFormData(prev => ({ ...prev, images: allImages.join(', ') }))
  }

  const removeUploadedImage = (index: number) => {
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index)
    const newImageFiles = imageFiles.filter((_, i) => i !== index)
    
    setUploadedImages(newUploadedImages)
    setImageFiles(newImageFiles)
    
    // Update form data
    const urlImages = formData.images.split(',').map(img => img.trim()).filter(img => img && !img.startsWith('blob:'))
    const allImages = [...urlImages, ...newUploadedImages]
    setFormData(prev => ({ ...prev, images: allImages.join(', ') }))
  }

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'ml_default') // You'll need to set this up in Cloudinary
      
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) throw new Error('Upload failed')
        
        const data = await response.json()
        return data.secure_url
      } catch (error) {
        console.error('Image upload error:', error)
        throw error
      }
    })
    
    return Promise.all(uploadPromises)
  }

  const filteredProducts = (products || []).filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Бүтээгдэхүүнүүд</h1>
            <p className="text-gray-600 mt-2">Бүтээгдэхүүний нөөцийг удирдах</p>
          </div>
          <Skeleton className="h-10 w-32" />
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Бүтээгдэхүүнүүд</h1>
          <p className="text-gray-600 mt-2">Бүтээгдэхүүний нөөцийг удирдах</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Шинэ бүтээгдэхүүн
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Шинэ бүтээгдэхүүн нэмэх</DialogTitle>
              <DialogDescription>
                Шинэ бүтээгдэхүүний мэдээллийг оруулна уу
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Нэр
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  placeholder="Бүтээгдэхүүний нэр"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Үнэ
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="col-span-3"
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Ангилал
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="col-span-3"
                  placeholder="Жишээ: Цамц, Өмд, Гутал"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inventory" className="text-right">
                  Нөөц
                </Label>
                <Input
                  id="inventory"
                  type="number"
                  value={formData.inventory}
                  onChange={(e) => setFormData(prev => ({ ...prev, inventory: e.target.value }))}
                  className="col-span-3"
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Тайлбар
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="images" className="text-right">
                  Зургийн URL
                </Label>
                <Textarea
                  id="images"
                  value={formData.images}
                  onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                  className="col-span-3"
                  placeholder="Зургийн URL-уудыг таслалаар тусгаарлан оруулна уу"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file-upload" className="text-right">
                  Зураг оруулах
                </Label>
                <div className="col-span-3">
                  <Input
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*"
                    className="mb-2"
                  />
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeUploadedImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Идэвхтэй
                </Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateProduct}
                disabled={submitting}
              >
                {submitting ? 'Үүсгэж байна...' : 'Үүсгэх'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Бүтээгдэхүүний жагсаалт</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Бүтээгдэхүүн хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Зураг</TableHead>
                <TableHead>Нэр</TableHead>
                <TableHead>Ангилал</TableHead>
                <TableHead>Үнэ</TableHead>
                <TableHead>Нөөц</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead>Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Зураг байхгүй</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.inventory}</TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Бүтээгдэхүүн олдсонгүй</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Бүтээгдэхүүн засах</DialogTitle>
            <DialogDescription>
              Бүтээгдэхүүний мэдээллийг шинэчлэх
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Нэр
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Үнэ
              </Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Ангилал
              </Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-inventory" className="text-right">
                Нөөц
              </Label>
              <Input
                id="edit-inventory"
                type="number"
                value={formData.inventory}
                onChange={(e) => setFormData(prev => ({ ...prev, inventory: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Тайлбар
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-images" className="text-right">
                Зургийн URL
              </Label>
              <Textarea
                id="edit-images"
                value={formData.images}
                onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                className="col-span-3"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isActive" className="text-right">
                Идэвхтэй
              </Label>
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateProduct}
              disabled={submitting}
            >
              {submitting ? 'Шинэчилж байна...' : 'Шинэчлэх'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}