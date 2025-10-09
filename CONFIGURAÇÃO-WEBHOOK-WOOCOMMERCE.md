# 🔄 Configuração de Webhook WooCommerce

## Objetivo

Configurar webhooks do WooCommerce para invalidar o cache automaticamente quando produtos, categorias ou marcas forem atualizados, garantindo que o site sempre mostre informações atualizadas sem precisar esperar a revalidação automática.

---

## 📊 Como Funciona o Sistema de Cache

### **Tempos de Cache Atuais:**

| Recurso                | Cache      | Revalidação | Como Atualiza                           |
| ---------------------- | ---------- | ----------- | --------------------------------------- |
| **Produto Individual** | 1 hora     | Automática  | Webhook instantâneo quando produto muda |
| **Lista de Produtos**  | 10 minutos | Automática  | Webhook quando qualquer produto muda    |
| **Categorias**         | 1 hora     | Automática  | Webhook quando categoria muda           |
| **Marcas**             | 6 horas    | Automática  | Webhook quando marca muda               |
| **Variações**          | 1 hora     | Automática  | Webhook quando variação muda            |

### **Vantagens do Sistema:**

✅ **Resposta Rápida**: Cache serve conteúdo instantaneamente  
✅ **Sempre Atualizado**: Webhook invalida cache ao atualizar no WooCommerce  
✅ **Economia de Recursos**: Menos requisições à API do WooCommerce  
✅ **Escalável**: Suporta milhares de usuários simultâneos

---

## 🛠️ Passo a Passo - Configurar Webhook no WooCommerce

### **1. Acessar Configurações de Webhooks**

1. Entre no painel do WordPress/WooCommerce
2. Vá em: **WooCommerce** → **Configurações** → **Avançado** → **Webhooks**
3. Clique em **"Criar um novo webhook"** ou **"Adicionar webhook"**

### **2. Configurações Básicas**

**Nome**: `Nihon Auto - Revalidação de Cache de Produtos`  
**Status**: ✅ **Ativo**  
**Tópico**: `Produto atualizado`  
**URL de Entrega**:

```
https://seu-dominio.vercel.app/api/webhooks/woocommerce
```

**Segredo**: Gere uma chave secreta forte (guarde para o próximo passo)  
Exemplo: `wc_nihon_2025_S3cR3t_K3y_xYz123!@#`

**Versão da API**: `WP REST API Integration v3`

### **3. Criar Webhooks para Cada Evento**

Você precisa criar **5 webhooks** diferentes:

#### **Webhook 1: Produto Criado**

-   **Nome**: `Cache - Produto Criado`
-   **Tópico**: `Produto criado`
-   **URL**: `https://seu-dominio.vercel.app/api/webhooks/woocommerce`

#### **Webhook 2: Produto Atualizado**

-   **Nome**: `Cache - Produto Atualizado`
-   **Tópico**: `Produto atualizado`
-   **URL**: `https://seu-dominio.vercel.app/api/webhooks/woocommerce`

#### **Webhook 3: Produto Deletado**

-   **Nome**: `Cache - Produto Deletado`
-   **Tópico**: `Produto deletado`
-   **URL**: `https://seu-dominio.vercel.app/api/webhooks/woocommerce`

#### **Webhook 4: Variação Atualizada**

-   **Nome**: `Cache - Variação Atualizada`
-   **Tópico**: `Variação do produto atualizada`
-   **URL**: `https://seu-dominio.vercel.app/api/webhooks/woocommerce`

#### **Webhook 5: Categoria/Marca Atualizada** (Se disponível)

-   **Nome**: `Cache - Categoria Atualizada`
-   **Tópico**: Verifique se há opções para categorias/taxonomias
-   **URL**: `https://seu-dominio.vercel.app/api/webhooks/woocommerce`

**⚠️ IMPORTANTE:** Use o **mesmo segredo** em todos os webhooks!

---

## 🔐 Configurar Variável de Ambiente

### **No Vercel (Produção):**

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:

```env
WC_WEBHOOK_SECRET=wc_nihon_2025_S3cR3t_K3y_xYz123!@#
```

4. Marque para aplicar em **Production**, **Preview** e **Development**
5. Clique em **Save**
6. **Redeploy** o projeto para aplicar a variável

### **No Local (.env.local):**

Adicione ao arquivo `.env.local`:

```env
WC_WEBHOOK_SECRET=wc_nihon_2025_S3cR3t_K3y_xYz123!@#
```

---

## ✅ Testar o Webhook

### **Método 1: Via WooCommerce**

1. No WooCommerce, vá até o webhook criado
2. Role até **"Entregas do Webhook"** (Webhook Deliveries)
3. Clique em **"Entregar novamente"** em alguma entrega anterior
4. Ou edite um produto qualquer e salve

### **Método 2: Modo Debug**

Use a URL com `?debug=1` para ver detalhes:

```
https://seu-dominio.vercel.app/api/webhooks/woocommerce?debug=1
```

Configure isso temporariamente no webhook para ver a resposta detalhada.

**Resposta de Sucesso:**

```json
{
    "ok": true,
    "revalidated": ["wc:products", "wc:product:123"],
    "resource": "product",
    "topic": "product.updated",
    "event": "updated",
    "id": "123",
    "timestamp": "2025-10-09T16:30:00.000Z"
}
```

### **Método 3: Verificar Logs da Vercel**

1. Vá em **Vercel** → **Seu Projeto** → **Logs**
2. Edite um produto no WooCommerce
3. Procure por: `[WEBHOOK]` ou `Webhook processado`

Você deve ver algo como:

```
[2025-10-09T16:30:00.000Z] Webhook processado: product.updated | Revalidados: wc:products, wc:product:123
```

---

## 🚨 Solução de Problemas

### **Webhook não está funcionando:**

1. **Verifique o segredo**: Deve ser exatamente o mesmo no WooCommerce e na variável de ambiente
2. **Verifique a URL**: Deve ser HTTPS (http não funciona)
3. **Redeploy**: Após adicionar variável de ambiente, faça redeploy
4. **Logs**: Verifique os logs da Vercel para ver se o webhook está chegando

### **Cache não invalida:**

1. Verifique se o webhook está **Ativo**
2. Veja se há erros em **"Entregas do Webhook"** no WooCommerce
3. Use `?debug=1` na URL para ver detalhes da resposta
4. Verifique os logs do servidor

### **Erro de assinatura inválida:**

```json
{
    "ok": false,
    "error": "bad signature"
}
```

**Solução**: O segredo no WooCommerce é diferente da variável de ambiente. Certifique-se que são idênticos.

---

## 📈 Monitoramento

### **Logs Automáticos:**

O sistema já loga automaticamente todas as revalidações:

```
[2025-10-09T16:30:00.000Z] Webhook processado: product.updated | Revalidados: wc:products, wc:product:789
[2025-10-09T16:35:00.000Z] Webhook processado: product_variation.updated | Revalidados: wc:product:789, wc:products
```

### **Verificar no Vercel:**

-   Vá em **Logs** → Filtre por "webhook"
-   Você verá todas as revalidações de cache

---

## 🎯 Resultado Final

Com tudo configurado, quando você:

1. ✅ **Criar um produto** → Cache atualiza **instantaneamente**
2. ✅ **Editar um produto** → Cache atualiza **instantaneamente**
3. ✅ **Mudar estoque/preço** → Cache atualiza **instantaneamente**
4. ✅ **Adicionar variação** → Cache do produto pai atualiza **instantaneamente**
5. ✅ **Deletar produto** → Cache atualiza **instantaneamente**

**Sem webhooks**: Teria que esperar até 10 minutos (produtos) ou 1 hora (produto individual) para ver mudanças.

**Com webhooks**: **Mudanças aparecem em segundos!** ⚡

---

## 📝 Checklist Final

-   [ ] Webhooks criados no WooCommerce (5 webhooks)
-   [ ] Todos os webhooks com status **Ativo**
-   [ ] Mesma URL em todos: `https://seu-dominio.vercel.app/api/webhooks/woocommerce`
-   [ ] Mesmo segredo em todos os webhooks
-   [ ] Variável `WC_WEBHOOK_SECRET` configurada na Vercel
-   [ ] Projeto redesployado após adicionar variável
-   [ ] Webhook testado (editar produto e verificar cache)
-   [ ] Logs verificados na Vercel

---

## 🎉 Pronto!

Agora seu site tem um sistema de cache inteligente que é:

-   **Rápido** ⚡ (responde instantaneamente com cache)
-   **Sempre atualizado** 🔄 (webhook invalida quando muda)
-   **Eficiente** 💰 (menos requisições = menos custos)
-   **Escalável** 📈 (suporta muito tráfego)

Qualquer dúvida, verifique os logs ou ative o modo debug! 🚀
