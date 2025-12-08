"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/components/auth/UserContext"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Notification {
    id: string
    userId: string
    type: string
    title: string
    message: string
    read: boolean
    link: string | null
    createdAt: string
}

export function NotificationBell() {
    const { user } = useUser()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const fetchNotifications = async () => {
        if (!user) return

        try {
            const response = await fetch(`/api/notifications?userId=${user.id}`)
            if (!response.ok) return

            const data = await response.json()
            setNotifications(data)
            setUnreadCount(data.filter((n: Notification) => !n.read).length)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        }
    }

    useEffect(() => {
        fetchNotifications()

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [user])

    const markAsRead = async (notificationId: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId }),
            })

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    const markAllAsRead = async () => {
        if (!user) return

        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, markAllAsRead: true }),
            })

            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'PURCHASE':
                return '💰'
            case 'FOLLOW':
                return '👤'
            case 'MESSAGE':
                return '💬'
            default:
                return '🔔'
        }
    }

    if (!user) return null

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-bronze text-white text-xs font-bold flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-bronze hover:underline font-normal"
                        >
                            Mark all as read
                        </button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        No notifications yet
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.slice(0, 10).map((notification) => {
                            const NotificationContent = (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={`flex-col items-start gap-1 cursor-pointer ${
                                        !notification.read ? 'bg-bronze/5' : ''
                                    }`}
                                    onClick={() => {
                                        if (!notification.read) {
                                            markAsRead(notification.id)
                                        }
                                        setIsOpen(false)
                                    }}
                                >
                                    <div className="flex items-start gap-2 w-full">
                                        <span className="text-lg mt-0.5">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm line-clamp-1">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <span className="h-2 w-2 rounded-full bg-bronze mt-1.5 flex-shrink-0" />
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            )

                            if (notification.link) {
                                return (
                                    <Link key={notification.id} href={notification.link}>
                                        {NotificationContent}
                                    </Link>
                                )
                            }

                            return NotificationContent
                        })}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
