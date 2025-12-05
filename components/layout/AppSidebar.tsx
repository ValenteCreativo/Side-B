"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Disc,
    Mic2,
    User,
    Users,
    FileCheck,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogIn,
    TrendingUp,
    MessageSquare,
    Wallet
} from "lucide-react"
import { cn, truncateAddress } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUser } from "@/components/auth/UserContext"
import { AuthModal } from "@/components/auth/AuthModal"

const menuItems = [
    { icon: Disc, label: "Catalog", href: "/catalog" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Mic2, label: "My Studio", href: "/studio" },
    { icon: FileCheck, label: "My Licenses", href: "/licenses" },
    { icon: MessageSquare, label: "Messages", href: "/waku-messages" },
    { icon: Wallet, label: "Wallet", href: "/wallet" },
    { icon: TrendingUp, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
]

export function AppSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const pathname = usePathname()
    const { user } = useUser()

    return (
        <motion.div
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="hidden lg:flex flex-col h-screen border-r border-border bg-background z-50 relative"
        >
            {/* Header */}
            <div className="h-20 flex items-center px-6 border-b border-border">
                <Link href="/" className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <img src="/assets/catalog-art.png" alt="Side B" className="w-full h-full object-contain" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="font-bold text-xl tracking-tight whitespace-nowrap"
                            >
                                SIDE B
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-4 px-4 py-3 transition-colors group relative",
                                isActive
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-bronze"
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "fill-current")} />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Auth Section */}
            <div className="p-4 border-t border-border">
                {!user ? (
                    <Button
                        variant="default"
                        size={isCollapsed ? "icon" : "default"}
                        onClick={() => setShowAuthModal(true)}
                        className="w-full justify-center"
                    >
                        <LogIn className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="whitespace-nowrap"
                                >
                                    SIGN UP / LOGIN
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>
                ) : (
                    <Link href="/settings">
                        <div className={cn(
                            "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary rounded-sm",
                            isCollapsed && "justify-center px-0"
                        )}>
                            <User className="h-5 w-5 flex-shrink-0" />
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex flex-col overflow-hidden"
                                    >
                                        <span className="text-xs text-muted-foreground">Signed in as</span>
                                        <span className="font-mono text-sm truncate">
                                            {truncateAddress(user.walletAddress)}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Link>
                )}
            </div>

            {/* Collapse Toggle */}
            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full justify-center hover:bg-secondary rounded-none"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Auth Modal */}
            <AuthModal
                open={showAuthModal}
                onOpenChange={setShowAuthModal}
            />
        </motion.div>
    )
}
