"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, User, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  senderId: string
  receiverId: string
  message: string
  isRead: boolean
  createdAt: string
  senderName: string
  senderImage?: string
}

interface Conversation {
  userId: string
  userName: string
  userImage?: string
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
}

export default function MessagesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // الرسالة التلقائية
  const defaultMessage = "سلام عليكم, انا مهتم بالشراء واحتاج بعض المعلومات. (رسالة تلقائية)"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  // التحقق من وجود معرف المستخدم في URL لبدء محادثة جديدة
  useEffect(() => {
    const userId = searchParams.get("user")
    if (userId && user) {
      setSelectedConversation(userId)
      setNewMessage(defaultMessage)
    }
  }, [searchParams, user])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoadingConversations(false)
    }
  }

  const fetchMessages = async (userId: string) => {
    try {
      setLoadingMessages(true)
      const response = await fetch(`/api/messages/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        // تحديد الرسائل كمقروءة
        await markAsRead(userId)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const markAsRead = async (userId: string) => {
    try {
      await fetch(`/api/messages/${userId}/read`, { method: "POST" })
      // تحديث المحادثات لإزالة العدد غير المقروء
      setConversations((prev) => prev.map((conv) => (conv.userId === userId ? { ...conv, unreadCount: 0 } : conv)))
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return

    try {
      setSending(true)
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: selectedConversation,
          message: newMessage.trim(),
        }),
      })

      if (response.ok) {
        const sentMessage = await response.json()
        setMessages((prev) => [...prev, sentMessage])
        setNewMessage("")
        // تحديث المحادثات
        fetchConversations()
      } else {
        throw new Error("فشل في إرسال الرسالة")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "خطأ",
        description: "فشل في إرسال الرسالة",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const useDefaultMessage = () => {
    setNewMessage(defaultMessage)
  }

  if (isLoading || loadingConversations) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-[500px] md:h-[600px]">
          {/* قائمة المحادثات */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5" />
                المحادثات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] md:h-[500px]">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageCircle className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm md:text-base">لا توجد محادثات بعد</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      className={`flex items-center gap-3 p-3 md:p-4 cursor-pointer hover:bg-accent transition-colors ${
                        selectedConversation === conversation.userId ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation.userId)}
                    >
                      <Avatar className="h-8 w-8 md:h-10 md:w-10">
                        <AvatarImage src={conversation.userImage || ""} alt={conversation.userName} />
                        <AvatarFallback>
                          <User className="h-3 w-3 md:h-4 md:w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate text-sm md:text-base">{conversation.userName}</p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* منطقة الرسائل */}
          <Card className="md:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {conversations.find((c) => c.userId === selectedConversation)?.userName || "محادثة"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px] md:h-[400px] p-3 md:p-4">
                    {loadingMessages ? (
                      <div className="flex justify-center items-center h-full">
                        <LoadingSpinner />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        <MessageCircle className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm md:text-base">لا توجد رسائل بعد</p>
                        <p className="text-xs md:text-sm">ابدأ المحادثة بإرسال رسالة</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={useDefaultMessage}>
                          استخدام الرسالة التلقائية
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] md:max-w-[70%] rounded-lg p-2 md:p-3 ${
                                message.senderId === user.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <p className="text-xs md:text-sm">{message.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.createdAt).toLocaleTimeString("ar-SA", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                  <Separator />
                  <div className="p-3 md:p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="اكتب رسالتك..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sending}
                        className="text-sm"
                      />
                      <Button onClick={sendMessage} disabled={sending || !newMessage.trim()} size="sm">
                        {sending ? (
                          <LoadingSpinner className="h-3 w-3 md:h-4 md:w-4" />
                        ) : (
                          <Send className="h-3 w-3 md:h-4 md:w-4" />
                        )}
                      </Button>
                    </div>
                    {messages.length === 0 && (
                      <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={useDefaultMessage}>
                        استخدام الرسالة التلقائية
                      </Button>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-base md:text-lg font-medium">اختر محادثة للبدء</p>
                  <p className="text-xs md:text-sm">اختر محادثة من القائمة لعرض الرسائل</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
