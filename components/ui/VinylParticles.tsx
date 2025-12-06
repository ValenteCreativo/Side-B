"use client"

import { useEffect, useMemo, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { type Container, type ISourceOptions } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"

interface VinylParticlesProps {
    isDark?: boolean
}

export function VinylParticles({ isDark = false }: VinylParticlesProps) {
    const [init, setInit] = useState(false)

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine)
        }).then(() => {
            setInit(true)
        })
    }, [])

    const options: ISourceOptions = useMemo(
        () => ({
            background: {
                color: {
                    value: "transparent",
                },
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "grab",
                    },
                    resize: {
                        enable: true,
                    } as any,
                },
                modes: {
                    grab: {
                        distance: 140,
                        links: {
                            opacity: 1.5,
                        },
                    },
                },
            },
            particles: {
                color: {
                    value: ["#CD7F32", "#B87333", "#A0522D"], // Bronze/copper gradient
                },
                links: {
                    color: "#CD7F32", // Bronze
                    distance: 150,
                    enable: true,
                    opacity: 1.3,
                    width: 2,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 0.5,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 100,
                },
                opacity: {
                    value: 1.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 3 },
                },
            },
            detectRetina: true,
        }),
        [isDark]
    )

    if (!init) {
        return null
    }

    return (
        <Particles
            id="vinyl-particles"
            options={options}
            className="absolute inset-0 pointer-events-none"
        />
    )
}
