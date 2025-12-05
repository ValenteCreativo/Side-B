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
    { icon: Mic2, label: "My Studio", href: "/studio" },
    { icon: FileCheck, label: "My Licenses", href: "/licenses" },
    { icon: MessageSquare, label: "Messages", href: "/waku-messages" },
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
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
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
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-background border-r border-border z-50 flex flex-col"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-border">
                                <span className="font-bold text-xl tracking-tight">SIDE B</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            <nav className="flex-1 py-8 px-6 space-y-4">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className={cn(
                                                "flex items-center gap-4 py-4 text-lg transition-colors border-b border-border",
                                                isActive
                                                    ? "text-foreground font-medium"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}>
                                                <item.icon className="h-6 w-6" />
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
