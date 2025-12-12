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

// Public pages - visible to all users
const publicMenuItems = [
    { icon: Disc, label: "Catalog", href: "/catalog" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: User, label: "My Profile", href: "/my-profile" },
]

// Musician-only pages
const musicianMenuItems = [
    { icon: Mic2, label: "My Studio", href: "/studio" },
    { icon: TrendingUp, label: "Analytics", href: "/analytics" },
    { icon: Wallet, label: "Balance", href: "/wallet" },
]

// Creator-only pages
const creatorMenuItems = [
    { icon: FileCheck, label: "My Licenses", href: "/licenses" },
    { icon: Wallet, label: "Balance", href: "/wallet" },
]

// Shared pages (shown to all logged-in users)
const sharedMenuItems = [
    { icon: MessageSquare, label: "Messages", href: "/messages" },
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
            className="hidden lg:flex flex-col h-screen border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 z-50 relative transition-all duration-300"
        >
            {/* Header */}
            <div className="h-20 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 bg-background">
                <Link href="/" className="flex items-center gap-3 overflow-hidden group">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
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
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {/* Public pages - always visible */}
                {publicMenuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-4 px-4 py-3 transition-all duration-300 group relative rounded-sm",
                                isActive
                                    ? "text-foreground font-medium bg-white dark:bg-zinc-900 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-bronze rounded-r-full"
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-bronze" : "group-hover:text-foreground")} />
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

                {/* Role-specific pages */}
                {user?.role === 'MUSICIAN' && musicianMenuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-4 px-4 py-3 transition-all duration-300 group relative rounded-sm",
                                isActive
                                    ? "text-foreground font-medium bg-white dark:bg-zinc-900 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-bronze rounded-r-full"
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-bronze" : "group-hover:text-foreground")} />
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

                {user?.role === 'CREATOR' && creatorMenuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-4 px-4 py-3 transition-all duration-300 group relative rounded-sm",
                                isActive
                                    ? "text-foreground font-medium bg-white dark:bg-zinc-900 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-bronze rounded-r-full"
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-bronze" : "group-hover:text-foreground")} />
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

                {/* Show grayed-out locked items for non-logged-in users */}
                {!user && (
                    <>
                        {musicianMenuItems.concat(creatorMenuItems.filter(item => !musicianMenuItems.some(m => m.href === item.href))).map((item) => (
                            <div key={item.href} className="flex items-center gap-4 px-4 py-3 opacity-40 cursor-not-allowed rounded-sm">
                                <item.icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="whitespace-nowrap text-muted-foreground"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </>
                )}

                {/* Shared pages - only show when logged in */}
                {user && sharedMenuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-4 px-4 py-3 transition-all duration-300 group relative rounded-sm",
                                isActive
                                    ? "text-foreground font-medium bg-white dark:bg-zinc-900 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-bronze rounded-r-full"
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-bronze" : "group-hover:text-foreground")} />
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
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-background">
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
                            "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800",
                            isCollapsed && "justify-center px-0"
                        )}>
                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                                <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex flex-col overflow-hidden"
                                    >
                                        <span className="text-xs text-muted-foreground">Signed in as</span>
                                        <span className="font-mono text-sm truncate font-medium">
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
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-background">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm"
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
