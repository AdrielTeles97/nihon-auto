<?php
if (!defined('ABSPATH')) {
    exit;
}

global $wpdb;

// Obter configurações atuais
$settings_table = $wpdb->prefix . 'nihon_settings';
$settings = array();

$results = $wpdb->get_results("SELECT setting_key, setting_value FROM $settings_table");
foreach ($results as $setting) {
    $settings[$setting->setting_key] = $setting->setting_value;
}

// Valores padrão
$whatsapp_number = isset($settings['whatsapp_number']) ? $settings['whatsapp_number'] : '';
$contact_email = isset($settings['contact_email']) ? $settings['contact_email'] : '';
$notification_email = isset($settings['notification_email']) ? $settings['notification_email'] : '';
?>

<div class="wrap">
    <h1>Configurações - Nihon Auto</h1>
    
    <form method="post" action="">
        <?php wp_nonce_field('nihon_settings_nonce'); ?>
        
        <div class="nihon-settings-container">
            <!-- Configurações de WhatsApp -->
            <div class="settings-section">
                <h2>📱 Configurações do WhatsApp</h2>
                <p>Configure o número do WhatsApp que receberá os pedidos de orçamento do site.</p>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="whatsapp_number">Número do WhatsApp</label>
                        </th>
                        <td>
                            <input 
                                name="whatsapp_number" 
                                type="text" 
                                id="whatsapp_number" 
                                value="<?php echo esc_attr($whatsapp_number); ?>" 
                                class="regular-text" 
                                placeholder="5511999999999"
                            />
                            <p class="description">
                                Formato: Código do país + DDD + número (ex: 5511999999999)
                                <br>Este número receberá os pedidos de orçamento automaticamente.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Configurações de Email -->
            <div class="settings-section">
                <h2>📧 Configurações de Email</h2>
                <p>Configure os emails de contato e notificação.</p>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="contact_email">Email de Contato</label>
                        </th>
                        <td>
                            <input 
                                name="contact_email" 
                                type="email" 
                                id="contact_email" 
                                value="<?php echo esc_attr($contact_email); ?>" 
                                class="regular-text" 
                                placeholder="contato@nihon-auto.com"
                            />
                            <p class="description">
                                Email principal para contato. Aparecerá no site e será usado para responder clientes.
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="notification_email">Email de Notificação</label>
                        </th>
                        <td>
                            <input 
                                name="notification_email" 
                                type="email" 
                                id="notification_email" 
                                value="<?php echo esc_attr($notification_email); ?>" 
                                class="regular-text" 
                                placeholder="admin@nihon-auto.com"
                            />
                            <p class="description">
                                Email que receberá notificações sobre novos pedidos e contatos.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Teste de Configurações -->
            <div class="settings-section">
                <h2>🧪 Testar Configurações</h2>
                <p>Teste se suas configurações estão funcionando corretamente.</p>
                
                <div class="test-buttons">
                    <button type="button" class="button button-secondary" onclick="testWhatsApp()">
                        📱 Testar WhatsApp
                    </button>
                    <button type="button" class="button button-secondary" onclick="testEmail()">
                        📧 Testar Email
                    </button>
                </div>
                
                <div id="test-results" class="test-results" style="display: none;">
                    <!-- Resultados dos testes aparecerão aqui -->
                </div>
            </div>
            
            <!-- Informações da API -->
            <div class="settings-section">
                <h2>🔗 Informações da API</h2>
                <p>URLs das APIs para integração com o site Next.js.</p>
                
                <div class="api-info">
                    <div class="api-endpoint">
                        <strong>Endpoint para Orçamentos:</strong>
                        <code><?php echo home_url('/wp-json/nihon-auto/v1/quote'); ?></code>
                        <button type="button" class="button button-small" onclick="copyToClipboard('<?php echo home_url('/wp-json/nihon-auto/v1/quote'); ?>')">Copiar</button>
                    </div>
                    
                    <div class="api-endpoint">
                        <strong>Endpoint para Contatos:</strong>
                        <code><?php echo home_url('/wp-json/nihon-auto/v1/contact'); ?></code>
                        <button type="button" class="button button-small" onclick="copyToClipboard('<?php echo home_url('/wp-json/nihon-auto/v1/contact'); ?>')">Copiar</button>
                    </div>
                    
                    <div class="api-endpoint">
                        <strong>Endpoint para Configurações:</strong>
                        <code><?php echo home_url('/wp-json/nihon-auto/v1/settings'); ?></code>
                        <button type="button" class="button button-small" onclick="copyToClipboard('<?php echo home_url('/wp-json/nihon-auto/v1/settings'); ?>')">Copiar</button>
                    </div>
                </div>
            </div>
            
            <!-- Estatísticas -->
            <div class="settings-section">
                <h2>📊 Estatísticas do Sistema</h2>
                
                <?php
                $quotes_table = $wpdb->prefix . 'nihon_quotes';
                $contacts_table = $wpdb->prefix . 'nihon_contacts';
                
                $total_quotes = $wpdb->get_var("SELECT COUNT(*) FROM $quotes_table");
                $total_contacts = $wpdb->get_var("SELECT COUNT(*) FROM $contacts_table");
                $quotes_today = $wpdb->get_var("SELECT COUNT(*) FROM $quotes_table WHERE DATE(created_at) = CURDATE()");
                $contacts_today = $wpdb->get_var("SELECT COUNT(*) FROM $contacts_table WHERE DATE(created_at) = CURDATE()");
                ?>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number"><?php echo $total_quotes; ?></div>
                        <div class="stat-label">Total de Orçamentos</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number"><?php echo $total_contacts; ?></div>
                        <div class="stat-label">Total de Contatos</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number"><?php echo $quotes_today; ?></div>
                        <div class="stat-label">Orçamentos Hoje</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number"><?php echo $contacts_today; ?></div>
                        <div class="stat-label">Contatos Hoje</div>
                    </div>
                </div>
            </div>
        </div>
        
        <p class="submit">
            <input type="submit" name="submit" id="submit" class="button-primary" value="Salvar Configurações">
        </p>
    </form>
</div>

<script>
function testWhatsApp() {
    const whatsappNumber = document.getElementById('whatsapp_number').value;
    
    if (!whatsappNumber) {
        showTestResult('Por favor, digite um número do WhatsApp primeiro.', 'error');
        return;
    }
    
    const testMessage = 'Teste de configuração do WhatsApp - Nihon Auto';
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(testMessage)}`;
    
    window.open(url, '_blank');
    showTestResult('WhatsApp aberto para teste. Verifique se o número está correto.', 'success');
}

function testEmail() {
    const email = document.getElementById('notification_email').value;
    
    if (!email) {
        showTestResult('Por favor, digite um email primeiro.', 'error');
        return;
    }
    
    // Simular teste de email
    jQuery.post(ajaxurl, {
        action: 'test_notification_email',
        email: email,
        nonce: nihonAjax.nonce
    }, function(response) {
        if (response.success) {
            showTestResult('Email de teste enviado com sucesso!', 'success');
        } else {
            showTestResult('Erro ao enviar email de teste: ' + response.data, 'error');
        }
    });
}

function showTestResult(message, type) {
    const resultsDiv = document.getElementById('test-results');
    resultsDiv.innerHTML = `<div class="notice notice-${type}"><p>${message}</p></div>`;
    resultsDiv.style.display = 'block';
    
    setTimeout(() => {
        resultsDiv.style.display = 'none';
    }, 5000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('URL copiada para a área de transferência!');
    }, function(err) {
        console.error('Erro ao copiar: ', err);
    });
}

// Validação de formulário
jQuery(document).ready(function($) {
    $('form').on('submit', function(e) {
        const whatsapp = $('#whatsapp_number').val();
        const contactEmail = $('#contact_email').val();
        const notificationEmail = $('#notification_email').val();
        
        if (!whatsapp) {
            alert('Por favor, digite o número do WhatsApp.');
            e.preventDefault();
            return false;
        }
        
        if (!contactEmail || !notificationEmail) {
            alert('Por favor, preencha todos os campos de email.');
            e.preventDefault();
            return false;
        }
        
        // Validar formato do WhatsApp (apenas números)
        if (!/^\d+$/.test(whatsapp)) {
            alert('O número do WhatsApp deve conter apenas números.');
            e.preventDefault();
            return false;
        }
        
        return true;
    });
});
</script>
