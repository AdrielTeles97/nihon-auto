'use client'

import React, { ReactElement } from 'react'
import { motion } from 'motion/react'

type AnimateBy = 'words' | 'letters'

interface BlurTextProps {
    text: string
    className?: string
    variant?: {
        hidden: { filter: string; opacity: number }
        visible: { filter: string; opacity: number }
    }
    animateBy?: AnimateBy
    delay?: number
    stepDuration?: number
}

const defaultVariant = {
    hidden: { filter: 'blur(10px)', opacity: 0 },
    visible: { filter: 'blur(0px)', opacity: 1 }
}

const getAnimationDelay = (
    index: number,
    delay: number,
    stepDuration: number = 50
) => {
    return delay + index * stepDuration
}

export default function BlurText({
    text,
    className,
    variant = defaultVariant,
    animateBy = 'words',
    delay = 0,
    stepDuration = 50
}: BlurTextProps): ReactElement {
    const MotionComponent = motion.span

    const splitText = (text: string, animateBy: AnimateBy) => {
        if (animateBy === 'words') {
            return text.split(' ')
        } else {
            return text.split('')
        }
    }

    const textArray = splitText(text, animateBy)

    return (
        <MotionComponent
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: stepDuration / 1000 }}
            className={className}
        >
            {textArray.map((item, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={variant}
                    transition={{
                        duration: 0.6,
                        delay:
                            getAnimationDelay(index, delay, stepDuration) /
                            1000,
                        ease: 'easeOut'
                    }}
                >
                    {item}
                    {animateBy === 'words' &&
                        index < textArray.length - 1 &&
                        ' '}
                </motion.span>
            ))}
        </MotionComponent>
    )
}
