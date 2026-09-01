"use client"

import { motion, useScroll } from "motion/react"

export default function ScrollLinked() {
    const { scrollYProgress } = useScroll()

    return (
        <>
            <motion.div
                id="scroll-indicator"
                className='bg-rose-400 dark:bg-emerald-300 z-50'
                style={{
                    scaleX: scrollYProgress,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 10,
                    originX: 0,
                }}
            />
        </>
    )
}