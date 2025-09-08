import { useState, useEffect } from 'react'

export interface CompanySettings {
  whatsapp: string
  email: string
  working_hours: string
  address: string
  company_name: string
  company_description: string
  social_media: {
    facebook: string
    instagram: string
    linkedin: string
  }
}

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true)
        const response = await fetch('/api/company-settings')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar configurações da empresa')
        }
        
        const data = await response.json()
        setSettings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        console.error('Erro ao buscar configurações:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}
