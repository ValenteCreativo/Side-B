"use client"

import { useState } from "react"
import { useUser } from "@/components/auth/UserContext"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Save, Settings as SettingsIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PageHero } from "@/components/ui/PageHero"
import { VinylFlip } from "@/components/ui/VinylFlip"

export default function ProfilePage() {
    const { user } = useUser()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        displayName: user?.displayName || "",
        bio: "",
        twitter: "",
        instagram: "",
        website: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.id,
                    ...formData,
                }),
            })

            if (!response.ok) throw new Error("Failed to update profile")

            toast({
                title: "Profile updated",
                description: "Your profile has been saved successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    if (!user) {
        return (
            <AppShell>
                <div className="min-h-screen bg-background">
                    <PageHero
                        title="SETTINGS"
                        subtitle="CONFIGURATION"
                        description="Manage your account settings and profile information."
                    />
                    <div className="container mx-auto px-4 py-12">
                        <p className="text-center text-muted-foreground font-mono">PLEASE_SIGN_IN_TO_VIEW_PROFILE</p>
                    </div>
                </div>
            </AppShell>
        )
    }

    const initials = formData.displayName
        ? formData.displayName.substring(0, 2).toUpperCase()
        : "U"

    return (
        <AppShell>
            <div className="min-h-screen bg-background relative overflow-hidden">
                <PageHero
                    title="SETTINGS"
                    subtitle="CONFIGURATION"
                    description="Manage your account settings and profile information."
                    sideText="SIDE B"
                >
                    <VinylFlip
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <SettingsIcon className="w-32 h-32 animate-spin-slow" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                                <span className="font-mono text-sm font-bold tracking-widest">
                                    CONTROL
                                    <br />
                                    YOUR
                                    <br />
                                    IDENTITY
                                </span>
                            </div>
                        }
                    />
                </PageHero>

                <div className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Avatar Section */}
                        <div className="bg-background border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold uppercase tracking-tight">Avatar</h3>
                                <p className="text-sm text-muted-foreground font-mono">YOUR_DIGITAL_FACE</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-2 border-foreground rounded-none">
                                    <AvatarFallback className="bg-foreground text-background text-2xl font-bold rounded-none">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <Button type="button" variant="outline" disabled className="rounded-none border-2 border-foreground">
                                    <Camera className="h-4 w-4 mr-2" />
                                    UPLOAD_IMAGE (SOON)
                                </Button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-background border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold uppercase tracking-tight">Basic Information</h3>
                                <p className="text-sm text-muted-foreground font-mono">PUBLIC_ARTIST_DATA</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName" className="font-mono uppercase text-xs">Artist Name</Label>
                                    <Input
                                        id="displayName"
                                        value={formData.displayName}
                                        onChange={(e) => handleChange("displayName", e.target.value)}
                                        placeholder="YOUR_ARTIST_NAME"
                                        className="rounded-none border-2 border-foreground focus-visible:ring-0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="font-mono uppercase text-xs">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => handleChange("bio", e.target.value)}
                                        placeholder="TELL_US_ABOUT_YOUR_MUSIC..."
                                        rows={5}
                                        className="rounded-none border-2 border-foreground focus-visible:ring-0 resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground font-mono">
                                        DISPLAYED_ON_PUBLIC_PROFILE
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-background border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold uppercase tracking-tight">Social Links</h3>
                                <p className="text-sm text-muted-foreground font-mono">CONNECT_YOUR_PRESENCE</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="twitter" className="font-mono uppercase text-xs">Twitter / X</Label>
                                    <Input
                                        id="twitter"
                                        value={formData.twitter}
                                        onChange={(e) => handleChange("twitter", e.target.value)}
                                        placeholder="@USERNAME"
                                        className="rounded-none border-2 border-foreground focus-visible:ring-0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instagram" className="font-mono uppercase text-xs">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        value={formData.instagram}
                                        onChange={(e) => handleChange("instagram", e.target.value)}
                                        placeholder="@USERNAME"
                                        className="rounded-none border-2 border-foreground focus-visible:ring-0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website" className="font-mono uppercase text-xs">Website</Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => handleChange("website", e.target.value)}
                                        placeholder="HTTPS://YOURWEBSITE.COM"
                                        type="url"
                                        className="rounded-none border-2 border-foreground focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Wallet Info (Read-only) */}
                        <div className="bg-background border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold uppercase tracking-tight">Wallet Address</h3>
                                <p className="text-sm text-muted-foreground font-mono">CONNECTED_WALLET (READ_ONLY)</p>
                            </div>
                            <Input
                                value={user.walletAddress || ""}
                                readOnly
                                className="font-mono text-sm bg-muted/50 rounded-none border-2 border-foreground"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" disabled={isLoading} className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background">
                                CANCEL
                            </Button>
                            <Button type="submit" disabled={isLoading} className="rounded-none bg-foreground text-background hover:bg-foreground/90">
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? "SAVING..." : "SAVE CHANGES"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    )
}
