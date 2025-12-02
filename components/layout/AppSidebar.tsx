"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Music, Disc, User, Settings, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/catalog", label: "Catalog", icon: Disc },
    { href: "/studio", label: "My Studio", icon: Music },
    { href: "/profile", label: "Profile", icon: User },
]

export function AppSidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 240 }}
            className="hidden lg:flex flex-col h-screen bg-card/30 backdrop-blur-xl border-r border-white/5 sticky top-0 z-40"
        >
            {/* Logo */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Music className="h-6 w-6 text-primary" />
                            <span className="font-semibold text-lg">Side B</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="h-8 w-8"
                >
                    <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                    "hover:bg-primary/10 hover:text-primary",
                                    isActive && "bg-primary/20 text-primary shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]",
                                    !isActive && "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <AnimatePresence mode="wait">
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="font-medium overflow-hidden whitespace-nowrap"
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

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <Link href="/settings">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="font-medium overflow-hidden whitespace-nowrap"
                                >
                                    Settings
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </Link>
            </div>
        </motion.aside>
    )
}
