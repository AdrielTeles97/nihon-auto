// Teste para verificar a API de marcas do Next.js
import fetch from 'node-fetch'

async function testBrandsAPI() {
    console.log('Testando API de marcas...\n')

    const baseUrl = 'http://localhost:3001'

    try {
        // Testar endpoint de marcas para LogoCloud
        console.log('--- Testando /api/brands/wordpress?logocloud=true ---')
        const logoCloudResponse = await fetch(
            `${baseUrl}/api/brands/wordpress?logocloud=true&limit=8`
        )

        if (logoCloudResponse.ok) {
            const logoCloudData = await logoCloudResponse.json()
            console.log('Status:', logoCloudResponse.status)
            console.log('Response:', JSON.stringify(logoCloudData, null, 2))
        } else {
            console.log(
                'Erro:',
                logoCloudResponse.status,
                await logoCloudResponse.text()
            )
        }

        // Testar endpoint geral de marcas
        console.log('\n--- Testando /api/brands/wordpress ---')
        const generalResponse = await fetch(`${baseUrl}/api/brands/wordpress`)

        if (generalResponse.ok) {
            const generalData = await generalResponse.json()
            console.log('Status:', generalResponse.status)
            console.log('Response:', JSON.stringify(generalData, null, 2))
        } else {
            console.log(
                'Erro:',
                generalResponse.status,
                await generalResponse.text()
            )
        }
    } catch (error) {
        console.error('Erro ao testar API:', error.message)
    }
}

// Aguardar um pouco para o servidor iniciar
setTimeout(testBrandsAPI, 3000)
