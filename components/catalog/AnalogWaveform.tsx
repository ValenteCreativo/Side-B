"use client"

import { useEffect, useRef } from "react"

export function AnalogWaveform({ isPlaying, color = "rgba(198, 168, 124, 0.8)" }: { isPlaying: boolean; color?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Resolve color if it is "currentColor"
        let strokeColor = color
        if (color === "currentColor") {
            const style = getComputedStyle(canvas)
            strokeColor = style.color
        }

        let animationId: number
        let time = 0

        const draw = () => {
            const width = canvas.width
            const height = canvas.height

            ctx.clearRect(0, 0, width, height)
            ctx.lineWidth = 2
            ctx.strokeStyle = strokeColor
            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            ctx.beginPath()

            for (let x = 0; x < width; x++) {
                // Create a complex waveform combining multiple sine waves
                const y = height / 2 +
                    Math.sin(x * 0.05 + time) * (isPlaying ? 10 : 2) +
                    Math.sin(x * 0.1 - time * 0.5) * (isPlaying ? 5 : 1) +
                    Math.sin(x * 0.2 + time * 1.5) * (isPlaying ? 2 : 0.5)

                if (x === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            }

            ctx.stroke()

            // Add a "glow" effect by drawing a wider, more transparent line
            ctx.lineWidth = 6
            ctx.globalAlpha = 0.2
            ctx.stroke()
            ctx.globalAlpha = 1.0

            time += 0.1
            animationId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [isPlaying, color])

    return (
        <canvas
            ref={canvasRef}
            width={300}
            height={60}
            className="w-full h-[60px] opacity-80"
        />
    )
}
