'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  Settings, 
  Store, 
  Mail, 
  Shield, 
  Database, 
  Trash2,
  Download,
  Upload,
  Save
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'

interface StoreSettings {
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  currency: string
  timezone: string
  taxRate: number
  shippingRate: number
}

interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
  enableEmailNotifications: boolean
}

interface SecuritySettings {
  enableTwoFactor: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  enableAuditLog: boolean
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'My E-commerce Store',
    storeDescription: 'Your one-stop shop for quality products',
    storeEmail: 'store@example.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Main St, City, State 12345',
    currency: 'USD',
    timezone: 'America/New_York',
    taxRate: 8.5,
    shippingRate: 9.99,
  })
  
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@example.com',
    fromName: 'My Store',
    enableEmailNotifications: true,
  })
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableAuditLog: true,
  })

  const handleSaveStoreSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Success',
        description: 'Store settings saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save store settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEmailSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Success',
        description: 'Email settings saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save email settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSecuritySettings = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Success',
        description: 'Security settings saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save security settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      toast({
        title: 'Export Started',
        description: 'Your data export is being prepared...',
      })
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Export Complete',
        description: 'Your data has been exported successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      })
    }
  }

  const handleClearCache = async () => {
    try {
      toast({
        title: 'Cache Cleared',
        description: 'Application cache has been cleared successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear cache',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Тохиргоо</h1>
        <p className="text-gray-600 mt-2">Дэлгүүрийн тохиргоо болон сонголтуудыг удирдах</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Дэлгүүр</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Имэйл</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Аюулгүй байдал</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Систем</span>
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Дэлгүүрийн тохиргоо</CardTitle>
              <CardDescription>
                Дэлгүүрийн үндсэн мэдээлэл болон тохиргоог хийх
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="storeName">Дэлгүүрийн нэр</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    placeholder="Дэлгүүрийн нэрийг оруулна уу"
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Дэлгүүрийн имэйл</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                    placeholder="delguur@example.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="storeDescription">Дэлгүүрийн тайлбар</Label>
                <Textarea
                  id="storeDescription"
                  value={storeSettings.storeDescription}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeDescription: e.target.value })}
                  placeholder="Дэлгүүрийнхээ тухай бичнэ үү"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="storePhone">Утасны дугаар</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.storePhone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                    placeholder="+976 9999 9999"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Валют</Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) => setStoreSettings({ ...storeSettings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - Америкийн доллар</SelectItem>
                      <SelectItem value="EUR">EUR - Евро</SelectItem>
                      <SelectItem value="GBP">GBP - Английн фунт</SelectItem>
                      <SelectItem value="CAD">CAD - Канадын доллар</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="storeAddress">Дэлгүүрийн хаяг</Label>
                <Textarea
                  id="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                  placeholder="Дэлгүүрийн хаягийг оруулна уу"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="taxRate">Татварын хувь (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={storeSettings.taxRate}
                    onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: parseFloat(e.target.value) })}
                    placeholder="8.5"
                  />
                </div>
                <div>
                  <Label htmlFor="shippingRate">Үндсэн хүргэлтийн үнэ ($)</Label>
                  <Input
                    id="shippingRate"
                    type="number"
                    step="0.01"
                    value={storeSettings.shippingRate}
                    onChange={(e) => setStoreSettings({ ...storeSettings, shippingRate: parseFloat(e.target.value) })}
                    placeholder="9.99"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveStoreSettings} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Хадгалж байна...' : 'Дэлгүүрийн тохиргоо хадгалах'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Имэйлийн тохиргоо</CardTitle>
              <CardDescription>
                Имэйл илгээхийн тулд SMTP тохиргоог хийх
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableEmailNotifications"
                  checked={emailSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableEmailNotifications: checked })}
                />
                <Label htmlFor="enableEmailNotifications">Имэйл мэдэгдэл идэвхжүүлэх</Label>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpHost">SMTP хост</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP порт</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })}
                    placeholder="587"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpUser">SMTP хэрэглэгчийн нэр</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                    placeholder="tanii-email@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP нууц үг</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fromEmail">Илгээгчийн имэйл</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                    placeholder="noreply@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">Илгээгчийн нэр</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                    placeholder="Миний дэлгүүр"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveEmailSettings} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Хадгалж байна...' : 'Имэйлийн тохиргоо хадгалах'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Аюулгүй байдлын тохиргоо</CardTitle>
              <CardDescription>
                Аюулгүй байдлын тохиргоо болон хандалтын хяналтыг удирдах
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTwoFactor">Хоёр түвшний баталгаажуулалт</Label>
                    <p className="text-sm text-gray-500">Админ бүртгэлд нэмэлт аюулгүй байдлын давхарга нэмэх</p>
                  </div>
                  <Switch
                    id="enableTwoFactor"
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, enableTwoFactor: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAuditLog">Аудитын бүртгэл</Label>
                    <p className="text-sm text-gray-500">Админ үйлдэл болон өөрчлөлтийг хянах</p>
                  </div>
                  <Switch
                    id="enableAuditLog"
                    checked={securitySettings.enableAuditLog}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, enableAuditLog: checked })}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sessionTimeout">Сешний хугацаа (минут)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Нэвтрэх оролдлогын дээд хязгаар</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                    placeholder="5"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveSecuritySettings} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Хадгалж байна...' : 'Аюулгүй байдлын тохиргоог хадгалах'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="space-y-6">
            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle>Системийн мэдээлэл</CardTitle>
                <CardDescription>
                  Одоогийн системийн төлөв байдал болон мэдээлэл
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Аппликейшний хувилбар</Label>
                    <p className="text-sm text-gray-600">v1.0.0</p>
                  </div>
                  <div>
                    <Label>Өгөгдлийн сангийн төлөв</Label>
                    <Badge className="bg-green-100 text-green-800">Холбогдсон</Badge>
                  </div>
                  <div>
                    <Label>Сүүлийн нөөцлөлт</Label>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                  <div>
                    <Label>Ашигласан хадгалах сан</Label>
                    <p className="text-sm text-gray-600">2.4 GB / 10 GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Өгөгдлийн удирдлага</CardTitle>
                <CardDescription>
                  Дэлгүүрийн өгөгдлийг экспорт, импорт болон удирдах
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Дэлгүүрийн өгөгдөл экспортлох</Label>
                    <p className="text-sm text-gray-500">Дэлгүүрийн бүх өгөгдлийг JSON хэлбэрээр татаж авах</p>
                  </div>
                  <Button onClick={handleExportData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Экспорт
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Аппликейшний кэш цэвэрлэх</Label>
                    <p className="text-sm text-gray-500">Гүйцэтгэлийг сайжруулахын тулд кэшлэгдсэн өгөгдлийг цэвэрлэх</p>
                  </div>
                  <Button onClick={handleClearCache} variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Кэш цэвэрлэх
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Аюултай бүс</CardTitle>
                <CardDescription>
                  Буцаах боломжгүй болон сүйрүүлэх үйлдлүүд
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Бүх өгөгдлийг шинэчлэх
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Та үнэхээр итгэлтэй байна уу?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Энэ үйлдлийг буцаах боломжгүй. Энэ нь бүтээгдэхүүн, захиалга, хэрэглэгч, тохиргоо зэрэг
                        дэлгүүрийн бүх өгөгдлийг бүрмөсөн устгана.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Тийм, бүгдийг шинэчлэх
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}