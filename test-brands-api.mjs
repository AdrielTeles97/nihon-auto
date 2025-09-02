// Teste para verificar se o endpoint de marcas está funcionando
import axios from 'axios';

const WC_API_BASE_URL = 'https://darksalmon-cobra-736244.hostingersite.com/wp-json/wc/v3';
const WC_CONSUMER_KEY = 'ck_cde4987447c3bd8dc0f1c1ec064a135f9e9dafef';
const WC_CONSUMER_SECRET = 'cs_f9b40b5ecce45dbeb3fd0810a80cb8b90c115966';

const wcApi = axios.create({
  baseURL: WC_API_BASE_URL,
  timeout: 10000,
  params: {
    consumer_key: WC_CONSUMER_KEY,
    consumer_secret: WC_CONSUMER_SECRET
  }
});

async function testBrandsEndpoint() {
  console.log('Testando endpoint de marcas...\n');
  
  // Testar diferentes endpoints possíveis para marcas
  const endpoints = [
    '/products/brands',
    '/products/attributes',
    '/products/tags',
    '/products/categories'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n--- Testando ${endpoint} ---`);
      const response = await wcApi.get(endpoint, {
        params: {
          per_page: 10
        }
      });
      
      console.log(`Status: ${response.status}`);
      console.log(`Total de itens: ${response.data.length}`);
      
      if (response.data.length > 0) {
        console.log('Primeira entrada:', JSON.stringify(response.data[0], null, 2));
      }
      
    } catch (error) {
      console.log(`Erro em ${endpoint}:`, error.response?.status, error.response?.data?.message || error.message);
    }
  }
}

// Verificar se existe algum atributo relacionado a marcas
async function testProductAttributes() {
  try {
    console.log('\n--- Testando atributos de produtos ---');
    const response = await wcApi.get('/products/attributes');
    
    console.log(`Total de atributos: ${response.data.length}`);
    
    response.data.forEach(attr => {
      console.log(`- ${attr.name} (slug: ${attr.slug}, ID: ${attr.id})`);
    });
    
    // Buscar termos de cada atributo para ver se algum contém marcas
    for (const attr of response.data) {
      if (attr.name.toLowerCase().includes('marca') || attr.name.toLowerCase().includes('brand')) {
        console.log(`\n--- Termos do atributo "${attr.name}" ---`);
        try {
          const termsResponse = await wcApi.get(`/products/attributes/${attr.id}/terms`);
          console.log('Termos encontrados:', termsResponse.data.map(term => term.name));
        } catch (err) {
          console.log('Erro ao buscar termos:', err.response?.data?.message || err.message);
        }
      }
    }
    
  } catch (error) {
    console.log('Erro ao buscar atributos:', error.response?.data?.message || error.message);
  }
}

// Executar testes
testBrandsEndpoint().then(() => {
  return testProductAttributes();
}).then(() => {
  console.log('\n--- Teste concluído ---');
}).catch(console.error);
