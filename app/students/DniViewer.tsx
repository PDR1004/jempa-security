'use client'

import { useState } from 'react'

interface DniViewerProps {
    studentId: number
}

/**
 * Componente que muestra el DNI encriptado con un "ojito" para revelarlo temporalmente
 * Solo disponible para usuarios con permiso STUDENT_DNI_VIEW (Admin)
 * El DNI se muestra por 5 segundos y luego se oculta automáticamente
 */
export function DniViewer({ studentId }: DniViewerProps) {
    const [dni, setDni] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const showDni = async () => {
        if (isVisible) {
            setIsVisible(false)
            setDni(null)
            setError(null)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/student/${studentId}/dni`)
            
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('No tienes permiso para ver el DNI')
                }
                throw new Error('Error al obtener DNI')
            }

            const data = await response.json()
            setDni(data.dni)
            setIsVisible(true)

            setTimeout(() => {
                setIsVisible(false)
                setDni(null)
            }, 5000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
            setTimeout(() => setError(null), 3000)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="mc-font-sm text-[0.4rem] text-[#aaaaaa]">DNI:</span>
            
            {isVisible && dni ? (
                <span className="mc-badge-gold font-mono text-lg">
                    {dni}
                </span>
            ) : (
                <span className="text-lg text-[#777777]">••••••••</span>
            )}

            <button
                onClick={showDni}
                disabled={isLoading}
                className={`mc-btn mc-btn-gold text-[0.4rem] px-3 py-1 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } ${error ? 'border-[#c0392b]' : ''}`}
                title={isVisible ? 'Ocultar DNI' : 'Mostrar DNI (5 segundos)'}
            >
                {isLoading ? '...' : isVisible ? 'Ocultar' : 'Mostrar'}
            </button>

            {error && (
                <span className="text-base text-[#ff6b6b]">{error}</span>
            )}

            {isVisible && (
                <span className="text-base text-[#aaaaaa] animate-pulse">
                    (oculta en 5s)
                </span>
            )}
        </div>
    )
}
