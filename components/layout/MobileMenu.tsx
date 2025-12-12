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
  LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, truncateAddress } from "@/lib/utils"
import { useUser } from "@/components/auth/UserContext"
import { AuthModal } from "@/components/auth/AuthModal"

// Public pages - visible to all users
const publicMenuItems = [
  { icon: Home, label: "Home", href: "/" },
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

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

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
              className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-80 pb-8"
            >
              <div className="relative w-full max-w-sm max-h-[85vh] rounded-2xl bg-white dark:bg-zinc-950 border border-bronze/40 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
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
                  {/* Public pages - always visible */}
                  {publicMenuItems.map((item) => {
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

                  {/* Role-specific pages for musicians */}
                  {user?.role === 'MUSICIAN' && musicianMenuItems.map((item) => {
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

                  {/* Role-specific pages for creators */}
                  {user?.role === 'CREATOR' && creatorMenuItems.map((item) => {
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

                  {/* Show grayed-out locked items for non-logged-in users */}
                  {!user && (
                    <>
                      {musicianMenuItems.concat(creatorMenuItems.filter(item => !musicianMenuItems.some(m => m.href === item.href))).map((item) => (
                        <div
                          key={item.href}
                          className="flex items-center gap-3 py-3 px-3 text-base font-medium rounded-md opacity-40 cursor-not-allowed border border-transparent"
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          <span className="tracking-wide text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Shared pages - only show when logged in */}
                  {user && sharedMenuItems.map((item) => {
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

                {/* Auth Section */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                  {!user ? (
                    <Button
                      variant="default"
                      className="w-full justify-center"
                      onClick={() => {
                        setIsOpen(false)
                        setShowAuthModal(true)
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      SIGN UP / LOGIN
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-md border border-zinc-200 dark:border-zinc-800">
                      <div className="w-8 h-8 rounded-full bg-bronze/10 flex items-center justify-center flex-shrink-0 border border-bronze/20">
                        <User className="h-4 w-4 text-bronze" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs text-muted-foreground">Signed in as</span>
                        <span className="font-mono text-sm truncate font-medium">
                          {truncateAddress(user.walletAddress)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </>
  )
}
