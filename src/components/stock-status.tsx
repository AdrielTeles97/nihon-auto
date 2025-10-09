'use client'

import { cn } from '@/lib/utils'
import { Package, CheckCircle, XCircle, Clock } from 'lucide-react'

interface StockStatusProps {
    inStock?: boolean
    stockStatus?: 'instock' | 'outofstock' | 'onbackorder'
    stockQuantity?: number | null
    className?: string
}

export function StockStatus({
    inStock = true,
    stockStatus = 'instock',
    stockQuantity,
    className
}: StockStatusProps) {
    const getStatusInfo = () => {
        // Determinar status baseado nos dados disponíveis
        let status = stockStatus
        if (inStock === false) {
            status = 'outofstock'
        }

        switch (status) {
            case 'instock':
                return {
                    text: 'Em estoque',
                    icon: CheckCircle,
                    className: 'text-green-600 bg-green-50 border-green-200',
                    iconClassName: 'text-green-500'
                }
            case 'outofstock':
                return {
                    text: 'Fora de estoque',
                    icon: XCircle,
                    className: 'text-red-600 bg-red-50 border-red-200',
                    iconClassName: 'text-red-500'
                }
            case 'onbackorder':
                return {
                    text: 'Sob encomenda',
                    icon: Clock,
                    className: 'text-orange-600 bg-orange-50 border-orange-200',
                    iconClassName: 'text-orange-500'
                }
            default:
                return {
                    text: 'Consulte disponibilidade',
                    icon: Package,
                    className: 'text-gray-600 bg-gray-50 border-gray-200',
                    iconClassName: 'text-gray-500'
                }
        }
    }

    const statusInfo = getStatusInfo()
    const Icon = statusInfo.icon

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium',
                statusInfo.className,
                className
            )}
        >
            <Icon className={cn('w-4 h-4', statusInfo.iconClassName)} />
            <span>{statusInfo.text}</span>
            {stockQuantity !== null &&
                stockQuantity !== undefined &&
                stockQuantity > 0 && (
                    <span className="text-xs opacity-75">
                        ({stockQuantity}{' '}
                        {stockQuantity === 1 ? 'unidade' : 'unidades'})
                    </span>
                )}
        </div>
    )
}
