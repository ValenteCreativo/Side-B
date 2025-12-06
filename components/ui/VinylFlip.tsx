"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { VinylParticles } from "./VinylParticles"

interface VinylFlipProps {
    front: React.ReactNode
    back: React.ReactNode
    className?: string
    direction?: "horizontal" | "vertical"
    flippable?: boolean // New prop: true for landing, false for app pages
    variant?: "default" | "transparent" // New prop for transparent frame
}

export function VinylFlip({
    front,
    back,
    className,
    direction = "horizontal",
    flippable = true,
    variant = "default"
}: VinylFlipProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [showParticles, setShowParticles] = useState(false)

    const flipVariants = {
        front: {
            rotateY: 0,
            rotateX: 0,
            transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
        },
        back: {
            rotateY: direction === "horizontal" ? 180 : 0,
            rotateX: direction === "vertical" ? 180 : 0,
            transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
        }
    }

    // If not flippable, show static back side with particles on hover
    if (!flippable) {
        return (
            <div
                className={cn("relative group overflow-hidden rounded-md shadow-refined hover:shadow-refined-lg transition-refined", className)}
                onMouseEnter={() => setShowParticles(true)}
                onMouseLeave={() => setShowParticles(false)}
            >
                <div className="w-full h-full relative bg-foreground text-background border border-zinc-200 dark:border-zinc-800 overflow-hidden rounded-md">
                    {back}

                    {/* Particles appear on hover - contained within this div */}
                    {showParticles && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <VinylParticles isDark={true} />
                        </div>
                    )}

                    {/* Decorative Corner - Refined */}
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-r border-t border-background bg-foreground z-10" />
                </div>
            </div>
        )
    }

    // Original flippable behavior for landing page
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className={cn("relative perspective-1000 group cursor-pointer", className)}
            onMouseEnter={() => { setIsFlipped(true); setIsHovered(true) }}
            onMouseLeave={() => { setIsFlipped(false); setIsHovered(false) }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Static Player Frame - Only for transparent variant */}
            {variant === "transparent" && (
                <div className="absolute inset-0 border border-zinc-200 dark:border-zinc-700 rounded-md pointer-events-none z-20">
                    {/* Tonearm - Simulating needle (más elegante) */}
                    <div className={cn(
                        "absolute top-6 right-4 w-1.5 h-24 bg-zinc-400 dark:bg-zinc-600 rounded-full origin-top transition-transform duration-700 shadow-md z-30",
                        isFlipped ? "rotate-[12deg]" : "rotate-[-8deg]"
                    )}>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-5 bg-zinc-800 dark:bg-zinc-900 rounded-sm" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-300 dark:bg-zinc-500 rounded-full shadow-sm" />
                    </div>

                    {/* Player Controls - Bottom Corners */}
                    <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 shadow-inner z-30" />
                    <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 shadow-inner z-30" />
                </div>
            )}

            <motion.div
                className="w-full h-full relative preserve-3d"
                initial="front"
                animate={isFlipped ? "back" : "front"}
                variants={flipVariants}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Side */}
                <div className={cn(
                    "absolute inset-0 overflow-hidden rounded-full transition-refined flex items-center justify-center",
                    variant === "default" && "backface-hidden bg-background border border-zinc-200 dark:border-zinc-800 shadow-refined group-hover:shadow-refined-lg rounded-md",
                    // ⬇️ AQUÍ SOLO SE AJUSTA EL CÍRCULO TRANSPARENTE:
                    // más pequeño, sin relleno, borde bronce
                    variant === "transparent" && "bg-transparent shadow-none scale-[1] border-2 border-bronze"
                )}>
                    <div className={cn(
                        "relative z-10 flex items-center justify-center w-full h-full",
                        variant === "transparent" && "p-8"
                    )}>
                        {/* Only render front content if NOT transparent variant */}
                        {variant !== "transparent" && front}

                        {/* Particles on Front Side (Hover) */}
                        {isHovered && !isFlipped && (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none z-30 rounded-full">
                                <VinylParticles isDark={variant === "default"} />
                            </div>
                        )}
                    </div>

                    {/* Decorative Corner - Only for default variant */}
                    {variant === "default" && (
                        <div className="absolute top-0 right-0 w-6 h-6 border-l border-b border-foreground bg-background z-10" />
                    )}
                </div>

                {/* Back Side */}
                <div
                    className={cn(
                        "absolute inset-0 overflow-hidden rounded-full flex items-center justify-center",
                        variant === "default" && "backface-hidden bg-foreground text-background shadow-refined rounded-md",
                        // mismo círculo que en front: borde bronce, sin relleno, más pequeño
                        variant === "transparent" && "bg-transparent border-2 border-bronze shadow-none scale-[1]"
                    )}
                    style={{
                        transform: direction === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)"
                    }}
                >
                    {/* 🔹 SOLO UNA VEZ EL BACK (Music is art) */}
                    <div className={cn(
                        "relative z-10 w-full h-full flex items-center justify-center",
                        variant === "transparent" && "p-8 text-white"
                    )}>
                        {back}
                    </div>

                    {/* Particles on flipped side */}
                    {isFlipped && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                            <VinylParticles isDark={variant === "default"} />
                        </div>
                    )}

                    {/* Decorative Corner - Only for default variant */}
                    {variant === "default" && (
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-r border-t border-background bg-foreground z-10" />
                    )}
                </div>
            </motion.div>
        </div>
    )
}
