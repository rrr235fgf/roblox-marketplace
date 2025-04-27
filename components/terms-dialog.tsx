"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
}

export function TermsDialog({ open, onOpenChange, onAccept }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>الشروط والأحكام</DialogTitle>
          <DialogDescription>يرجى قراءة الشروط والأحكام التالية قبل استخدام المنصة</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-bold">مقدمة</h3>
            <p>
              مرحبًا بك في منصة Roblox Market، وهي منصة تتيح للمستخدمين شراء وبيع أصول Roblox مثل الخرائط والأنظمة
              والألعاب الكاملة.
            </p>

            <h3 className="text-lg font-bold">قواعد المنصة</h3>
            <ul className="list-inside list-disc space-y-2">
              <li>يجب أن تكون جميع المعاملات عادلة وشفافة.</li>
              <li>يُمنع منعًا باتًا الاحتيال أو الخداع.</li>
              <li>يجب أن تكون جميع الأصول المعروضة للبيع مملوكة بالكامل للبائع.</li>
              <li>يُمنع بيع أو شراء أصول تنتهك حقوق الملكية الفكرية.</li>
              <li>يجب أن تكون جميع المحادثات والتفاعلات محترمة وخالية من الإساءة.</li>
            </ul>

            <h3 className="text-lg font-bold">المعاملات</h3>
            <p>
              تتم جميع المعاملات بين المشتري والبائع مباشرة عبر Discord. نحن لا نتحمل أي مسؤولية عن المعاملات التي تتم
              خارج المنصة.
            </p>

            <h3 className="text-lg font-bold">الخصوصية</h3>
            <p>
              نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. نحن نجمع فقط المعلومات الضرورية لتشغيل المنصة، مثل معرف
              Discord الخاص بك واسم المستخدم وصورة الملف الشخصي.
            </p>

            <h3 className="text-lg font-bold">حقوق الملكية الفكرية</h3>
            <p>
              جميع الأصول المعروضة على المنصة تظل مملوكة لأصحابها الأصليين. عند شراء أصل، فإنك تشتري ترخيصًا لاستخدامه
              وفقًا للشروط المتفق عليها مع البائع.
            </p>

            <h3 className="text-lg font-bold">التغييرات في الشروط</h3>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية.</p>

            <h3 className="text-lg font-bold">الاتصال بنا</h3>
            <p>
              إذا كان لديك أي أسئلة أو استفسارات حول هذه الشروط، يرجى التواصل معنا عبر البريد الإلكتروني:
              support@robloxmarket.com
            </p>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            رفض
          </Button>
          <Button onClick={onAccept}>أوافق على الشروط</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
