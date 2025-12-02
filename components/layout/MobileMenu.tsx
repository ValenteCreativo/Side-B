"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, Music, Disc, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/catalog", label: "Catalog", icon: Disc },
    { href: "/studio", label: "My Studio", icon: Music },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
]

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* Burger Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="lg:hidden"
            >
                <Menu className="h-6 w-6" />
            </Button>

            {/* Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />

                        {/* Drawer Content */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-background border-r border-white/10 z-50 lg:hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Music className="h-6 w-6 text-primary" />
                                    <span className="font-semibold text-lg">Side B</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Navigation */}
                            <nav className="p-4 space-y-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href

                                    return (
                                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                            <div
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                                    "hover:bg-primary/10 hover:text-primary",
                                                    isActive && "bg-primary/20 text-primary",
                                                    !isActive && "text-muted-foreground"
                                                )}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span className="font-medium">{item.label}</span>
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
