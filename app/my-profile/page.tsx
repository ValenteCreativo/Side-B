"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/auth/UserContext"
import { AppShell } from "@/components/layout/AppShell"
import { Loader2 } from "lucide-react"

/**
 * My Profile Page
 * Redirects to the user's own profile page so they can see how others see them
 */
export default function MyProfilePage() {
    const { user } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (user?.id) {
            // Redirect to the user's profile page
            router.push(`/profile/${user.id}`)
        }
    }, [user, router])

    if (!user) {
        return (
            <AppShell>
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <p className="font-mono text-muted-foreground">PLEASE_SIGN_IN_TO_VIEW_PROFILE</p>
                    </div>
                </div>
            </AppShell>
        )
    }

    return (
        <AppShell>
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
                    <p className="font-mono text-muted-foreground">LOADING_PROFILE...</p>
                </div>
            </div>
        </AppShell>
    )
}
