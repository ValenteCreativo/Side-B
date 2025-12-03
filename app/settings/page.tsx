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
import { Camera, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
                <div className="container mx-auto px-4 py-12">
                    <p className="text-center text-muted-foreground">Please sign in to view your profile.</p>
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
                {/* Background Ambient Particles */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-drift" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-3xl animate-breathe" />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2 tracking-tight">Settings</h1>
                        <p className="text-muted-foreground">Manage your account settings and profile information.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Section */}
                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardHeader>
                                <CardTitle>Avatar</CardTitle>
                                <CardDescription>Your profile picture</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-2 border-white/10">
                                    <AvatarFallback className="bg-primary/20 text-primary text-2xl font-medium">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <Button type="button" variant="outline" disabled>
                                    <Camera className="h-4 w-4 mr-2" />
                                    Upload Image (Coming Soon)
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Basic Info */}
                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Your public artist name and bio</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Artist Name</Label>
                                    <Input
                                        id="displayName"
                                        value={formData.displayName}
                                        onChange={(e) => handleChange("displayName", e.target.value)}
                                        placeholder="Your artist or band name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => handleChange("bio", e.target.value)}
                                        placeholder="Tell us about your music and journey..."
                                        rows={5}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        This will be displayed on your public artist profile.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardHeader>
                                <CardTitle>Social Links</CardTitle>
                                <CardDescription>Connect your social media profiles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="twitter">Twitter / X</Label>
                                    <Input
                                        id="twitter"
                                        value={formData.twitter}
                                        onChange={(e) => handleChange("twitter", e.target.value)}
                                        placeholder="@yourusername"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        value={formData.instagram}
                                        onChange={(e) => handleChange("instagram", e.target.value)}
                                        placeholder="@yourusername"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => handleChange("website", e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                        type="url"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Wallet Info (Read-only) */}
                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardHeader>
                                <CardTitle>Wallet Address</CardTitle>
                                <CardDescription>Your connected wallet (read-only)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    value={user.walletAddress || ""}
                                    readOnly
                                    className="font-mono text-sm bg-muted/50"
                                />
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    )
}
