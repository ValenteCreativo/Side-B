"use client"

import { AppSidebar } from "./AppSidebar"
import { MobileMenu } from "./MobileMenu"
import { UserNav } from "./UserNav"
import { Music } from "lucide-react"
import Link from "next/link"

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <AppSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Top Bar */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-background/95 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <MobileMenu />
                        <Link href="/" className="flex items-center gap-2">
                            <Music className="h-5 w-5 text-primary" />
                            <span className="font-semibold">Side B</span>
                        </Link>
                    </div>
                    <UserNav />
                </header>

                {/* Desktop Top Bar (User Nav only) */}
                <header className="hidden lg:flex items-center justify-end px-6 py-3 border-b border-white/5 bg-background/95 backdrop-blur-md sticky top-0 z-40">
                    <UserNav />
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto pb-24">
                    {children}
                </main>
            </div>
        </div>
    )
}
