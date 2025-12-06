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
}

export function VinylFlip({
    front,
    back,
    className,
    direction = "horizontal",
    flippable = true
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
                className={cn("relative group overflow-hidden", className)}
                onMouseEnter={() => setShowParticles(true)}
                onMouseLeave={() => setShowParticles(false)}
            >
                <div className="w-full h-full relative bg-foreground text-background border-2 border-foreground overflow-hidden">
                    {back}

                    {/* Particles appear on hover - contained within this div */}
                    {showParticles && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <VinylParticles isDark={true} />
                        </div>
                    )}

                    {/* Decorative Corner */}
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-r-2 border-t-2 border-background bg-foreground z-10" />
                </div>
            </div>
        )
    }

    // Original flippable behavior for landing page
    return (
        <div
            className={cn("relative perspective-1000 group cursor-pointer", className)}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial="front"
                animate={isFlipped ? "back" : "front"}
                variants={flipVariants}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-background border-2 border-foreground overflow-hidden">
                    {front}

                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-foreground bg-background z-10" />
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 backface-hidden bg-foreground text-background overflow-hidden"
                    style={{
                        transform: direction === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)"
                    }}
                >
                    {back}

                    {/* Decorative Corner */}
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-r-2 border-t-2 border-background bg-foreground z-10" />
                </div>
            </motion.div>
        </div>
    )
}
