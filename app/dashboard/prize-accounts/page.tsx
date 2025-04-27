"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Gift, Trash2, RefreshCw, User, Lock, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// تحويل نوع الحساب إلى اسم عربي
const getAccountTypeName = (type: string) => {
  switch (type) {
    case "empty":
      return "حساب فاضي"
    case "bloxfruit":
      return "حساب بلوكس فروت"
    case "medium":
      return "حساب متوسط"
    case "premium":
      return "حساب مشحون"
    default:
      return "غير معروف"
  }
}

// تحويل نوع الحساب إلى لون
const getAccountTypeColor = (type: string) => {
  switch (type) {
    case "empty":
      return "text-red-500"
    case "bloxfruit":
      return "text-green-500"
    case "medium":
      return "text-blue-500"
    case "premium":
      return "text-yellow-500"
    default:
      return "text-gray-500"
  }
}

export default function PrizeAccountsPage() {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)

  // نموذج إضافة حساب جديد
  const [newAccount, setNewAccount] = useState({
    type: "bloxfruit",
    username: "",
    password: "",
    details: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && !isAdmin) {
      router.push("/dashboard")
    } else if (!isLoading && user && isAdmin) {
      fetchAccounts()
    }
  }, [user, isLoading, isAdmin, router])

  // جلب حسابات الجوائز
  const fetchAccounts = async () => {
    try {
      setIsLoadingAccounts(true)
      const response = await fetch("/api/admin/prize-accounts")

      if (!response.ok) {
        throw new Error("فشل في جلب حسابات الجوائز")
      }

      const data = await response.json()
      setAccounts(data.accounts)
    } catch (error) {
      console.error("Error fetching prize accounts:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب حسابات الجوائز",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  // إضافة حساب جديد
  const addAccount = async () => {
    try {
      if (!newAccount.username || !newAccount.password) {
        toast({
          title: "خطأ",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/admin/prize-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      })

      if (!response.ok) {
        throw new Error("فشل في إضافة حساب الجائزة")
      }

      const data = await response.json()

      toast({
        title: "تم بنجاح",
        description: "تمت إضافة حساب الجائزة بنجاح",
      })

      setNewAccount({
        type: "bloxfruit",
        username: "",
        password: "",
        details: "",
      })

      setShowAddDialog(false)
      fetchAccounts()
    } catch (error) {
      console.error("Error adding prize account:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة حساب الجائزة",
        variant: "destructive",
      })
    }
  }

  // حذف حساب
  const deleteAccount = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/prize-accounts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("فشل في حذف حساب الجائزة")
      }

      toast({
        title: "تم بنجاح",
        description: "تم حذف حساب الجائزة بنجاح",
      })

      fetchAccounts()
    } catch (error) {
      console.error("Error deleting prize account:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف حساب الجائزة",
        variant: "destructive",
      })
    }
  }

  // عرض تفاصيل الحساب
  const viewAccount = (account: any) => {
    setSelectedAccount(account)
    setShowViewDialog(true)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-8">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">إدارة حسابات الجوائز</h1>
            <Button onClick={() => setShowAddDialog(true)}>
              <Gift className="mr-2 h-4 w-4" />
              إضافة حساب جديد
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>حسابات الجوائز</CardTitle>
              <CardDescription>إدارة حسابات الجوائز المتاحة في عجلة الحظ</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAccounts ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">لا توجد حسابات جوائز متاحة</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>النوع</TableHead>
                        <TableHead>اسم المستخدم</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ الإضافة</TableHead>
                        <TableHead className="text-left">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <span className={getAccountTypeColor(account.type)}>
                              {getAccountTypeName(account.type)}
                            </span>
                          </TableCell>
                          <TableCell dir="ltr">{account.username}</TableCell>
                          <TableCell>
                            {account.claimed ? (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                تم المطالبة به
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                متاح
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(account.createdAt).toLocaleDateString("ar-SA")}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => viewAccount(account)}>
                                <Info className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteAccount(account.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">إجمالي الحسابات: {accounts.length}</div>
              <Button variant="outline" size="sm" onClick={fetchAccounts}>
                <RefreshCw className="mr-2 h-4 w-4" />
                تحديث
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
      <Footer />

      {/* مربع حوار إضافة حساب جديد */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة حساب جائزة جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="account-type">نوع الحساب</Label>
              <Select value={newAccount.type} onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الحساب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bloxfruit">حساب بلوكس فروت</SelectItem>
                  <SelectItem value="medium">حساب متوسط</SelectItem>
                  <SelectItem value="premium">حساب مشحون</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                value={newAccount.username}
                onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">تفاصيل إضافية (اختياري)</Label>
              <Textarea
                id="details"
                value={newAccount.details}
                onChange={(e) => setNewAccount({ ...newAccount, details: e.target.value })}
                rows={3}
                dir="ltr"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={addAccount}>إضافة الحساب</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* مربع حوار عرض تفاصيل الحساب */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل الحساب</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-md bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`font-medium ${getAccountTypeColor(selectedAccount.type)}`}>
                    {getAccountTypeName(selectedAccount.type)}
                  </div>
                  {selectedAccount.claimed ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      تم المطالبة به
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      متاح
                    </span>
                  )}
                </div>
                {selectedAccount.claimed && (
                  <div className="text-sm text-muted-foreground mb-2">
                    تمت المطالبة به بواسطة: {selectedAccount.claimedBy || "غير معروف"}
                    <br />
                    تاريخ المطالبة:{" "}
                    {selectedAccount.claimedAt
                      ? new Date(selectedAccount.claimedAt).toLocaleString("ar-SA")
                      : "غير معروف"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Label>اسم المستخدم</Label>
                </div>
                <div className="p-2 rounded-md bg-muted" dir="ltr">
                  {selectedAccount.username}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Label>كلمة المرور</Label>
                </div>
                <div className="p-2 rounded-md bg-muted" dir="ltr">
                  {selectedAccount.password}
                </div>
              </div>
              {selectedAccount.details && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <Label>تفاصيل إضافية</Label>
                  </div>
                  <div className="p-2 rounded-md bg-muted" dir="ltr">
                    {selectedAccount.details}
                  </div>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                تاريخ الإضافة: {new Date(selectedAccount.createdAt).toLocaleString("ar-SA")}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
