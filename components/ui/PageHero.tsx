"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PageHeroProps {
    title: string
    subtitle?: string
    description?: string
    sideText?: string
    className?: string
    children?: React.ReactNode
}

export function PageHero({
    title,
    subtitle,
    description,
    sideText = "SIDE B",
    className,
    children
}: PageHeroProps) {
    return (
        <div className={cn("relative w-full min-h-[40vh] flex flex-col justify-end pb-16 px-8 overflow-hidden border-b border-zinc-200 dark:border-zinc-800", className)}>
            {/* Background Grain */}
            <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />

            {/* Side Label */}
            <div className="absolute top-8 right-8 lg:top-8 lg:right-[420px] flex items-center gap-4">
                <div className="h-[1px] w-24 bg-bronze" />
                <span className="font-mono text-xs tracking-[0.2em] font-bold text-muted-foreground">{sideText}</span>
            </div>

            <div className="container mx-auto relative z-10">
                <div className="grid lg:grid-cols-[2fr_1fr] gap-16 items-end">
                    <div>
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-mono text-sm md:text-base mb-6 tracking-[0.2em] uppercase text-bronze font-medium"
                            >
                                {subtitle}
                            </motion.p>
                        )}

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: [0.2, 1, 0.3, 1] }}
                            className="text-display leading-[0.9] mb-8 break-words tracking-tight"
                        >
                            {title}
                        </motion.h1>

                        {description && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl md:text-2xl font-light max-w-xl leading-relaxed text-muted-foreground"
                            >
                                {description}
                            </motion.p>
                        )}
                    </div>

                    {children && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="hidden lg:block"
                        >
                            {children}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
