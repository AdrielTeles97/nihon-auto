# Guia de Configuração do WordPress para E-commerce

## 1. Configuração Inicial do WordPress

### Acesso ao WordPress
1. Abra seu navegador e acesse: `http://localhost:8080`
2. Você verá a tela de instalação do WordPress

### Configuração do Banco de Dados
Use as seguintes configurações (já definidas no docker-compose.yml):
- **Nome do banco de dados**: `wordpress_db`
- **Nome de usuário**: `wordpress_user`
- **Senha**: `wordpress_password`
- **Host do banco de dados**: `loja_mysql`
- **Prefixo da tabela**: `wp_` (padrão)

### Configuração do Site
- **Título do site**: "Loja de Eletrônicos" (ou o nome que preferir)
- **Nome de usuário do admin**: `admin`
- **Senha**: `admin123!` (use uma senha forte em produção)
- **Email**: seu email

## 2. Plugins Essenciais para Instalar

### Plugins Obrigatórios:
1. **WooCommerce** - Para funcionalidades de e-commerce
2. **WP REST API** - Para integração com o frontend (geralmente já vem ativo)
3. **Custom Post Type UI** - Para criar tipos de post personalizados
4. **Advanced Custom Fields (ACF)** - Para campos personalizados

### Plugins Recomendados:
1. **Yoast SEO** - Para otimização SEO
2. **WP Super Cache** - Para cache e performance
3. **Wordfence Security** - Para segurança
4. **UpdraftPlus** - Para backups

## 3. Configuração do WooCommerce

### Após instalar o WooCommerce:
1. Execute o assistente de configuração
2. Configure:
   - **Localização**: Brasil
   - **Moeda**: Real (BRL)
   - **Tipo de loja**: Eletrônicos
   - **Produtos**: Produtos físicos

### Configurações importantes:
- Vá em **WooCommerce > Configurações**
- **Aba Geral**: Configure endereço da loja
- **Aba Produtos**: Configure unidades, dimensões
- **Aba Envio**: Configure métodos de envio
- **Aba Pagamentos**: Configure métodos de pagamento

## 4. Criando Produtos de Teste

### Categorias de Produtos:
1. Vá em **Produtos > Categorias**
2. Crie as seguintes categorias:
   - Smartphones
   - Notebooks
   - Tablets
   - Acessórios
   - Audio & Video

### Produtos de Exemplo:

#### Produto 1: iPhone 15 Pro
- **Nome**: iPhone 15 Pro 128GB
- **Categoria**: Smartphones
- **Preço**: R$ 8.999,00
- **Descrição**: Smartphone Apple iPhone 15 Pro com 128GB de armazenamento
- **SKU**: IPHONE15PRO128
- **Status**: Publicado
- **Imagem**: Use uma imagem placeholder ou baixe uma imagem do produto

#### Produto 2: MacBook Air M2
- **Nome**: MacBook Air M2 13" 256GB
- **Categoria**: Notebooks
- **Preço**: R$ 12.999,00
- **Descrição**: Notebook Apple MacBook Air com chip M2
- **SKU**: MACBOOKAIRM2256
- **Status**: Publicado

#### Produto 3: iPad Air
- **Nome**: iPad Air 10.9" 64GB Wi-Fi
- **Categoria**: Tablets
- **Preço**: R$ 4.999,00
- **Descrição**: Tablet Apple iPad Air com tela de 10.9 polegadas
- **SKU**: IPADAIR64WIFI
- **Status**: Publicado

## 5. Configuração da API REST

### Habilitando a API:
1. Vá em **Configurações > Links Permanentes**
2. Escolha "Nome do post" ou "Estrutura personalizada"
3. Salve as alterações

### Testando a API:
Acesse no navegador:
- `http://localhost:8080/wp-json/wp/v2/posts` - Para posts
- `http://localhost:8080/wp-json/wc/v3/products` - Para produtos (WooCommerce)

### Configuração de CORS (se necessário):
Adicione no arquivo `wp-config.php` (dentro do container):
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

## 6. Configurações de Segurança

### Configurações básicas:
1. **Usuários > Perfil**: Altere a senha padrão
2. **Configurações > Geral**: Desmarque "Qualquer pessoa pode se registrar"
3. **Configurações > Discussão**: Configure moderação de comentários

## 7. Configurações para Desenvolvimento

### Debug Mode (apenas para desenvolvimento):
No `wp-config.php`, certifique-se de ter:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

## 8. Testando a Integração

### Após configurar tudo:
1. Acesse `http://localhost:3000` (seu frontend Next.js)
2. Verifique se os produtos aparecem na página inicial
3. Teste a navegação para páginas de produtos
4. Verifique se as imagens estão carregando

### Troubleshooting:
- Se não aparecerem produtos, verifique se a API está funcionando
- Verifique se os produtos estão publicados no WordPress
- Confirme se as URLs da API estão corretas no código

## 9. Próximos Passos

1. Adicione mais produtos de teste
2. Configure métodos de pagamento reais
3. Configure envio e logística
4. Personalize o tema do WordPress (se necessário)
5. Configure SSL para produção
6. Configure backups automáticos

---

**Importante**: Este é um ambiente de desenvolvimento. Para produção, use senhas seguras, configure SSL, e implemente medidas de segurança adequadas.

**URLs Importantes**:
- WordPress Admin: `http://localhost:8080/wp-admin`
- Frontend Next.js: `http://localhost:3000`
- phpMyAdmin: `http://localhost:8081`
- API REST: `http://localhost:8080/wp-json/wp/v2/`
- WooCommerce API: `http://localhost:8080/wp-json/wc/v3/`