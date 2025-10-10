import React from 'react'
import { cn } from '@/lib/utils'

interface DividerLinesProps {
    className?: string
    showHorizontal?: boolean
    showVertical?: boolean
    variant?: 'default' | 'red' | 'subtle'
}

export function DividerLines({
    className,
    showHorizontal = true,
    showVertical = true,
    variant = 'default'
}: DividerLinesProps) {
    const getLineStyles = () => {
        switch (variant) {
            case 'red':
                return {
                    horizontal:
                        'bg-gradient-to-r from-transparent via-red-400/40 to-transparent',
                    vertical:
                        'bg-gradient-to-b from-transparent via-red-300/35 to-transparent'
                }
            case 'subtle':
                return {
                    horizontal:
                        'bg-gradient-to-r from-transparent via-border/20 to-transparent',
                    vertical:
                        'bg-gradient-to-b from-transparent via-border/10 to-transparent'
                }
            default:
                return {
                    horizontal:
                        'bg-gradient-to-r from-transparent via-border to-transparent',
                    vertical:
                        'bg-gradient-to-b from-transparent via-border/50 to-transparent'
                }
        }
    }

    const styles = getLineStyles()

    return (
        <div className={cn('absolute inset-0 pointer-events-none', className)}>
            {/* Linhas horizontais */}
            {showHorizontal && (
                <>
                    <div
                        className={cn(
                            'absolute top-0 left-0 w-full h-px',
                            styles.horizontal
                        )}
                    />
                    <div
                        className={cn(
                            'absolute bottom-0 left-0 w-full h-px',
                            styles.horizontal
                        )}
                    />
                </>
            )}

            {/* Linhas verticais */}
            {showVertical && (
                <>
                    <div
                        className={cn(
                            'absolute top-0 left-16 w-px h-full opacity-60',
                            styles.vertical
                        )}
                    />
                    <div
                        className={cn(
                            'absolute top-0 right-16 w-px h-full opacity-60',
                            styles.vertical
                        )}
                    />
                    <div
                        className={cn(
                            'absolute top-0 left-1/4 w-px h-full opacity-40',
                            styles.vertical
                        )}
                    />
                    <div
                        className={cn(
                            'absolute top-0 right-1/4 w-px h-full opacity-40',
                            styles.vertical
                        )}
                    />
                </>
            )}
        </div>
    )
}
