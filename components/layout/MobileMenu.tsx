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
                        {/* Backdrop - Stronger overlay with better contrast */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />

                        {/* Drawer - Enhanced with solid background and shadow */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-zinc-950 border-r-2 border-bronze/30 z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            {/* Header with bronze accent */}
                            <div className="h-20 flex items-center justify-between px-6 border-b-2 border-bronze/20 bg-zinc-50 dark:bg-zinc-900">
                                <span className="font-bold text-2xl tracking-tight text-foreground">
                                    SIDE <span className="text-bronze">B</span>
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-bronze transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            {/* Navigation with improved contrast and spacing */}
                            <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto bg-white dark:bg-zinc-950">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block"
                                        >
                                            <div className={cn(
                                                "flex items-center gap-4 py-4 px-5 text-base font-medium transition-all duration-200 rounded-md",
                                                isActive
                                                    ? "text-foreground bg-bronze/10 border-l-4 border-bronze shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-l-4 hover:border-bronze/50 border-l-4 border-transparent"
                                            )}>
                                                <item.icon className={cn(
                                                    "h-6 w-6 transition-colors",
                                                    isActive ? "text-bronze" : "text-muted-foreground group-hover:text-bronze"
                                                )} />
                                                <span className={cn(
                                                    "tracking-wide",
                                                    isActive && "font-semibold"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </nav>

                            {/* Footer with branding */}
                            <div className="px-6 py-4 border-t-2 border-bronze/20 bg-zinc-50 dark:bg-zinc-900">
                                <p className="text-xs text-muted-foreground text-center font-mono tracking-wider">
                                    RAW • REAL • RIGHTS
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
