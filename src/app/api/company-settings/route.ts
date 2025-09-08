import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Buscar dados do plugin Nihon Auto no WordPress
    const wpResponse = await fetch(`${process.env.WORDPRESS_BASE_URL}/wp-json/nihon-auto/v1/company-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Se necessário, adicionar autenticação
        // 'Authorization': `Bearer ${process.env.WORDPRESS_TOKEN}`
      },
      next: { revalidate: 3600 } // Cache por 1 hora
    })

    if (!wpResponse.ok) {
      // Fallback para dados padrão se a API falhar
      const fallbackData = {
        whatsapp: '5591982475485',
        email: 'adrielt008@gmail.com',
        working_hours: 'Seg-Sex: 8h às 18h',
        address: 'Travessa José Pio, 541 - Umarizal - Belém/PA',
        company_name: 'Nihon Peças e Acessórios',
        company_description: 'Especialistas em peças e acessórios automotivos com mais de 15 anos de experiência no mercado brasileiro.',
        social_media: {
          facebook: '',
          instagram: '',
          linkedin: ''
        }
      }
      
      return NextResponse.json(fallbackData)
    }

    const companyData = await wpResponse.json()
    
    // Estruturar os dados de acordo com o que vemos na imagem do plugin
    const formattedData = {
      whatsapp: companyData.whatsapp || '5591982475485',
      email: companyData.email || 'adrielt008@gmail.com', 
      working_hours: companyData.working_hours || 'Seg-Sex: 8h às 18h',
      address: companyData.address || 'Travessa José Pio, 541 - Umarizal - Belém/PA',
      company_name: companyData.company_name || 'Nihon Peças e Acessórios',
      company_description: companyData.company_description || 'Especialistas em peças e acessórios automotivos com mais de 15 anos de experiência no mercado brasileiro.',
      social_media: {
        facebook: companyData.facebook_url || '',
        instagram: companyData.instagram_url || '',
        linkedin: companyData.linkedin_url || ''
      }
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Erro ao buscar dados da empresa:', error)
    
    // Retornar dados padrão em caso de erro
    const fallbackData = {
      whatsapp: '5591982475485',
      email: 'adrielt008@gmail.com',
      working_hours: 'Seg-Sex: 8h às 18h', 
      address: 'Travessa José Pio, 541 - Umarizal - Belém/PA',
      company_name: 'Nihon Peças e Acessórios',
      company_description: 'Especialistas em peças e acessórios automotivos com mais de 15 anos de experiência no mercado brasileiro.',
      social_media: {
        facebook: '',
        instagram: '',
        linkedin: ''
      }
    }
    
    return NextResponse.json(fallbackData)
  }
}
