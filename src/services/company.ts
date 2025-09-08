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

class CompanyService {
    private baseUrl = '/api'

    async getCompanySettings(): Promise<CompanySettings> {
        const response = await fetch(`${this.baseUrl}/company-settings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            next: { revalidate: 3600 } // Cache por 1 hora
        })

        if (!response.ok) {
            throw new Error(
                `Erro ao buscar configurações da empresa: ${response.status}`
            )
        }

        return response.json()
    }
}

export const companyService = new CompanyService()
