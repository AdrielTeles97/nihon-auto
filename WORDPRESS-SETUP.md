# 🐳 Configuração do WordPress com Docker

## ✅ Status dos Containers

Todos os containers estão rodando com sucesso:

- **WordPress**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081
- **MySQL**: localhost:3306
- **Frontend Next.js**: http://localhost:3000

## 🚀 Próximos Passos

### 1. Configuração Inicial do WordPress

1. Acesse: http://localhost:8080
2. Escolha o idioma: **Português do Brasil**
3. Configure o site:
   - **Título do site**: Loja de Produtos
   - **Nome de usuário**: admin
   - **Senha**: admin123!@#
   - **Email**: admin@loja.com

### 2. Instalar Plugins Necessários

Após a configuração inicial, instale os seguintes plugins:

```bash
# Plugins essenciais para e-commerce
- WooCommerce (para produtos)
- Custom Post Type UI (para tipos personalizados)
- Advanced Custom Fields (para campos customizados)
- WP REST API Controller (para melhor controle da API)
```

### 3. Criar Custom Post Type "Produtos"

**Via Custom Post Type UI:**

- **Post Type Slug**: `produtos`
- **Plural Label**: `Produtos`
- **Singular Label**: `Produto`
- **Public**: `True`
- **Show in REST**: `True`
- **REST Base**: `produtos`

### 4. Campos Personalizados (ACF)

Criar grupo de campos para "Produtos":

```php
- nome (Text)
- descricao (Textarea)
- preco (Number)
- categoria (Select: Eletrônicos, Roupas, Casa, Esportes)
- imagem (Image)
- disponivel (True/False)
```

### 5. Configurar Permalinks

1. Vá em **Configurações > Links Permanentes**
2. Escolha: **Nome do post**
3. Salvar alterações

### 6. Habilitar CORS para API

Adicionar no `wp-config.php` ou via plugin:

```php
// Habilitar CORS para desenvolvimento
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

## 🔗 URLs da API REST

Após configurar os produtos:

```bash
# Listar todos os produtos
GET http://localhost:8080/wp-json/wp/v2/produtos

# Produto específico
GET http://localhost:8080/wp-json/wp/v2/produtos/{id}

# Categorias
GET http://localhost:8080/wp-json/wp/v2/categories
```

## 📊 Dados de Teste

Criar alguns produtos de exemplo:

1. **Smartphone Samsung Galaxy**
   - Preço: R$ 1.299,00
   - Categoria: Eletrônicos
   - Descrição: Smartphone com tela de 6.1 polegadas...

2. **Camiseta Polo**
   - Preço: R$ 89,90
   - Categoria: Roupas
   - Descrição: Camiseta polo 100% algodão...

3. **Cafeteira Elétrica**
   - Preço: R$ 199,90
   - Categoria: Casa
   - Descrição: Cafeteira elétrica com capacidade para 12 xícaras...

## 🛠️ Comandos Docker Úteis

```bash
# Parar containers
docker-compose down

# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs wordpress

# Backup do banco
docker exec loja_mysql mysqldump -u wordpress -pwordpress_password wordpress > backup.sql
```

## 🔧 Troubleshooting

### Problema: WordPress não carrega
```bash
docker-compose restart wordpress
```

### Problema: Banco não conecta
```bash
docker-compose restart db
```

### Problema: Permissões
```bash
docker exec -it loja_wordpress chown -R www-data:www-data /var/www/html
```

---

**Próximo passo**: Após configurar o WordPress, atualize o arquivo `src/services/wordpress.ts` para buscar dados reais da API.