# 🚀 ATUALIZAÇÃO URGENTE DO PLUGIN WORDPRESS

## ⚠️ IMPORTANTE: Plugin Versão 2.1.0 com Melhorias de Variações

### 📋 O QUE FOI ALTERADO:

#### 1. **Exibição Melhorada de Variações no Admin**

-   ✅ Nova coluna "Variação" na tabela de produtos das cotações
-   ✅ Exibe ID da variação (🔗 ID: 456)
-   ✅ Mostra atributos selecionados formatados (🎯 **Cor:** Azul)
-   ✅ Interface mais intuitiva para identificar produtos variáveis

#### 2. **Correção do Filtro de Marcas**

-   ✅ API corrigida para mapear slugs → IDs das marcas
-   ✅ Cache otimizado para melhor performance
-   ✅ Filtro por fabricantes funcionando 100%

---

## 📦 COMO ATUALIZAR O PLUGIN:

### **Opção 1 - Substituir arquivo manualmente:**

1. Acesse o servidor WordPress via FTP/cPanel
2. Vá para `/wp-content/plugins/nihon-auto-manager/`
3. Faça backup do arquivo atual `nihon-auto-manager.php`
4. Substitua pelo arquivo da pasta `wordpress-plugin/nihon-auto-manager/nihon-auto-manager.php`

### **Opção 2 - Reativar plugin no WordPress:**

1. WordPress Admin → Plugins
2. Desativar "Nihon Auto Manager"
3. Ativar novamente
4. Verificar se versão mostra 2.1.0

---

## 🔍 COMO TESTAR AS MELHORIAS:

### **1. Teste de Variações no Admin:**

-   Vá para WordPress Admin → Nihon Auto → Cotações
-   Abra qualquer cotação com produtos variáveis
-   Verificar se aparece a coluna "Variação" com:
    -   🔗 ID: [número da variação]
    -   🎯 **Atributo:** Valor selecionado

### **2. Teste do Filtro de Marcas:**

-   Acesse `/produtos` no site
-   Clique em qualquer marca na sidebar "FABRICANTES"
-   Verificar se filtra os produtos corretamente
-   URL deve mostrar `?brand=slug-da-marca`

---

## 📊 VERSÃO ATUAL:

-   **Versão:** 2.1.0
-   **Data:** Setembro 2025
-   **Alterações:** Variações melhoradas + Filtro de marcas corrigido

## ⚡ URGÊNCIA: ALTA

Este plugin contém correções importantes para o funcionamento do sistema de cotações com produtos variáveis.

---

**🛠️ Desenvolvido por:** GitHub Copilot para Nihon Auto
