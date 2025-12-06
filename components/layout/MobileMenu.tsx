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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-zinc-950 border-r-2 border-bronze/30 z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              {/* Header más compacto */}
              <div className="h-16 flex items-center justify-between px-4 border-b-2 border-bronze/20 bg-zinc-50 dark:bg-zinc-900">
                <span className="font-bold text-xl tracking-tight text-foreground">
                  SIDE <span className="text-bronze">B</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-bronze transition-colors h-9 w-9"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Nav más denso: más items por pantalla */}
              <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto bg-white dark:bg-zinc-950">
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
                          "flex items-center gap-3 py-2.5 px-3 text-sm font-medium transition-all duration-200 rounded-md",
                          isActive
                            ? "text-foreground bg-bronze/10 border-l-4 border-bronze shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-l-4 hover:border-bronze/50 border-l-4 border-transparent",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors flex-shrink-0",
                            isActive
                              ? "text-bronze"
                              : "text-muted-foreground group-hover:text-bronze",
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
