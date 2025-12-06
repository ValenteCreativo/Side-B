"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Home,
  Disc,
  Mic2,
  User,
  Users,
  FileCheck,
  Settings,
  TrendingUp,
  MessageSquare,
  Wallet,
} from "lucide-react"
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
      {/* Trigger igual que antes */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            {/* Menú centrado tipo videojuego */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="relative w-full max-w-sm h-[120vh] max-h-[150vh] rounded-2xl translate-y-3 bg-white dark:bg-zinc-950 border border-bronze/40 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
                {/* Header compacto con tache arriba derecha */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-bronze/30 bg-zinc-50/80 dark:bg-zinc-900/80">
                  <span className="font-semibold text-base tracking-tight text-foreground">
                    SIDE <span className="text-bronze">B</span> MENU
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-bronze transition-colors h-8 w-8"
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navegación: ocupa casi todo, scrollable */}
                <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block"
                      >
                        <div
                          className={cn(
                            "flex items-center gap-3 py-3 px-3 text-base font-medium rounded-md transition-all duration-200",
                            isActive
                              ? "text-foreground bg-bronze/15 border border-bronze/60 shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900/80 border border-transparent",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              isActive ? "text-bronze" : "text-muted-foreground",
                            )}
                          />
                          <span
                            className={cn(
                              "tracking-wide",
                              isActive && "font-semibold",
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
