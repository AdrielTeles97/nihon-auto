# 🕒 Correção de Fuso Horário - Plugin Nihon acessórios

## Problema Identificado

As cotações estavam sendo salvas com horário UTC (horário mundial) ao invés do horário local do Brasil.

**Exemplo:**

-   Você fez a cotação às **08:41** (horário do Brasil)
-   Sistema mostrava **11:39** (UTC +3 horas)

## Correção Aplicada

Alterado no plugin as linhas que usavam:

```php
'created_at' => current_time('mysql')        // ❌ UTC
```

Para:

```php
'created_at' => current_time('mysql', false) // ✅ Horário Local
```

## Como Atualizar o Plugin

### Opção 1: Via WordPress Admin

1. Acesse: https://darksalmon-cobra-736244.hostingersite.com/wp-admin
2. Vá em **Plugins > Editor de Plugins**
3. Selecione **Nihon acessórios Manager**
4. Substitua o conteúdo pelo arquivo corrigido
5. Clique em **Atualizar arquivo**

### Opção 2: Via cPanel/FTP

1. Acesse o **cPanel da Hostinger**
2. Vá em **Arquivos > Gerenciador de Arquivos**
3. Navegue até `/public_html/wp-content/plugins/nihon-auto-manager/`
4. Substitua o arquivo `nihon-auto-manager.php`
5. O arquivo corrigido está em: `wordpress-plugin/nihon-auto-manager/nihon-auto-manager.php`

## Resultado Esperado

Após a atualização, as novas cotações serão salvas com o horário correto do Brasil (UTC-3).

**Nota:** As cotações antigas continuarão com o horário UTC, apenas as novas terão o horário correto.

## Para Testar

1. Faça uma nova cotação no site
2. Verifique no WordPress admin se o horário está correto
3. Deve mostrar o mesmo horário que você fez a solicitação

## Configuração Adicional (Opcional)

No WordPress admin, vá em:
**Configurações > Geral > Fuso Horário**
Certifique-se que está configurado como **São Paulo** ou **UTC-3**
