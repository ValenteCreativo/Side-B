"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, Disc, Mic2, User, Users, FileCheck, Settings, TrendingUp, MessageSquare, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Disc, label: "Catalog", href: "/catalog" },
    { icon: User, label: "My Profile", href: "/my-profile" },
    { icon: Mic2, label: "My Studio", href: "/studio" },
    { icon: FileCheck, label: "My Licenses", href: "/licenses" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: Wallet, label: "Wallet", href: "/wallet" },
    { icon: TrendingUp, label: "Analytics", href: "/analytics" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Settings, label: "Settings", href: "/settings" },
]

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <Menu className="h-6 w-6" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-background border-r border-zinc-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
                                <span className="font-bold text-xl tracking-tight">SIDE B</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            <nav className="flex-1 py-8 px-6 space-y-2 overflow-y-auto">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className={cn(
                                                "flex items-center gap-4 py-4 px-4 text-lg transition-all duration-200 rounded-sm",
                                                isActive
                                                    ? "text-foreground font-medium bg-zinc-100 dark:bg-zinc-900"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                                            )}>
                                                <item.icon className={cn("h-6 w-6", isActive && "text-bronze")} />
                                                {item.label}
                                            </div>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
