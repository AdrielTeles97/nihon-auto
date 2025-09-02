import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const WORDPRESS_URL = 'https://darksalmon-cobra-736244.hostingersite.com';
const CONSUMER_KEY = 'ck_cde4987447c3bd8dc0f1c1ec064a135f9e9dafef';
const CONSUMER_SECRET = 'cs_f9b40b5ecce45dbeb3fd0810a80cb8b90c115966';
const WC_API_URL = `${WORDPRESS_URL}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

async function testWooCommerceAPI() {
  console.log('🔍 Verificando variáveis de ambiente:');
  console.log('WC_API_URL:', WC_API_URL);
  console.log('CONSUMER_KEY:', CONSUMER_KEY);
  console.log('CONSUMER_SECRET:', CONSUMER_SECRET);
  console.log('\n');

  try {
    console.log('🚀 Testando WooCommerce API com fetch usando parâmetros na URL...');
    console.log('URL:', WC_API_URL);
    
    const response = await fetch(WC_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Sucesso!');
      console.log('Produtos encontrados:', data.length);
      if (data.length > 0) {
        console.log('Primeiro produto:', data[0]?.name || 'Nome não disponível');
        console.log('ID:', data[0]?.id);
        console.log('Preço:', data[0]?.price);
      } else {
        console.log('ℹ️ Nenhum produto encontrado. Adicione produtos no WooCommerce.');
      }
    } else {
      const error = await response.json();
      console.log('❌ Erro:', response.status, response.statusText);
      console.log('Detalhes do erro:', error);
      
      console.log('\n🔧 Dicas de troubleshooting:');
      console.log('1. Verifique se o WordPress está rodando em', WORDPRESS_URL);
      console.log('2. Confirme as chaves de API no painel do WordPress');
      console.log('3. Verifique se a chave tem permissões de "Read" ou "Read/Write"');
      console.log('4. Teste se existem produtos cadastrados no WooCommerce');
      console.log('5. Verifique se o WooCommerce está ativo e configurado');
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    console.log('\n🔧 Verifique se o WordPress está rodando e acessível.');
  }
}

// Executar teste
testWooCommerceAPI();
