<?php
if (!defined('ABSPATH')) {
    exit;
}

global $wpdb;

// Paginação
$page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
$per_page = 20;
$offset = ($page - 1) * $per_page;

// Filtros
$status_filter = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';
$search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';

$contacts_table = $wpdb->prefix . 'nihon_contacts';

// Construir query
$where_conditions = array();
$where_values = array();

if (!empty($status_filter)) {
    $where_conditions[] = "status = %s";
    $where_values[] = $status_filter;
}

if (!empty($search)) {
    $where_conditions[] = "(name LIKE %s OR email LIKE %s OR subject LIKE %s OR message LIKE %s)";
    $where_values[] = '%' . $search . '%';
    $where_values[] = '%' . $search . '%';
    $where_values[] = '%' . $search . '%';
    $where_values[] = '%' . $search . '%';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Contar total
$count_query = "SELECT COUNT(*) FROM $contacts_table $where_clause";
if (!empty($where_values)) {
    $total_items = $wpdb->get_var($wpdb->prepare($count_query, $where_values));
} else {
    $total_items = $wpdb->get_var($count_query);
}

// Buscar contatos
$contacts_query = "SELECT * FROM $contacts_table $where_clause ORDER BY created_at DESC LIMIT %d OFFSET %d";
$query_values = array_merge($where_values, array($per_page, $offset));

if (!empty($where_values)) {
    $contacts = $wpdb->get_results($wpdb->prepare($contacts_query, $query_values));
} else {
    $contacts = $wpdb->get_results($wpdb->prepare("SELECT * FROM $contacts_table ORDER BY created_at DESC LIMIT %d OFFSET %d", $per_page, $offset));
}

$total_pages = ceil($total_items / $per_page);
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Contatos Recebidos</h1>
    <a href="#" class="page-title-action" onclick="refreshContacts()">Atualizar</a>
    
    <!-- Filtros -->
    <div class="nihon-filters">
        <form method="get" action="">
            <input type="hidden" name="page" value="nihon-contacts">
            
            <select name="status">
                <option value="">Todos os Status</option>
                <option value="pending" <?php selected($status_filter, 'pending'); ?>>Pendente</option>
                <option value="completed" <?php selected($status_filter, 'completed'); ?>>Concluído</option>
            </select>
            
            <input type="search" name="s" value="<?php echo esc_attr($search); ?>" placeholder="Buscar por nome, email, assunto ou mensagem">
            
            <input type="submit" class="button" value="Filtrar">
            
            <?php if (!empty($status_filter) || !empty($search)): ?>
                <a href="<?php echo admin_url('admin.php?page=nihon-contacts'); ?>" class="button">Limpar Filtros</a>
            <?php endif; ?>
        </form>
    </div>
    
    <!-- Estatísticas Rápidas -->
    <div class="nihon-stats-mini">
        <?php
        $pending_count = $wpdb->get_var("SELECT COUNT(*) FROM $contacts_table WHERE status = 'pending'");
        $completed_count = $wpdb->get_var("SELECT COUNT(*) FROM $contacts_table WHERE status = 'completed'");
        ?>
        <span class="stat-mini pending">
            <strong><?php echo $pending_count; ?></strong> Pendentes
        </span>
        <span class="stat-mini completed">
            <strong><?php echo $completed_count; ?></strong> Concluídos
        </span>
        <span class="stat-mini total">
            <strong><?php echo $total_items; ?></strong> Total
        </span>
    </div>
    
    <!-- Tabela de Contatos -->
    <div class="nihon-table-container">
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Contato</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Mensagem</th>
                    <th scope="col">Status</th>
                    <th scope="col">Data</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($contacts)): ?>
                    <?php foreach ($contacts as $contact): ?>
                        <tr>
                            <td><strong>#<?php echo $contact->id; ?></strong></td>
                            <td>
                                <strong><?php echo esc_html($contact->name); ?></strong>
                            </td>
                            <td>
                                <?php if (!empty($contact->email)): ?>
                                    <div>📧 <a href="mailto:<?php echo esc_attr($contact->email); ?>"><?php echo esc_html($contact->email); ?></a></div>
                                <?php endif; ?>
                                <?php if (!empty($contact->phone)): ?>
                                    <div>📱 <a href="tel:<?php echo esc_attr($contact->phone); ?>"><?php echo esc_html($contact->phone); ?></a></div>
                                <?php endif; ?>
                            </td>
                            <td>
                                <strong><?php echo esc_html($contact->subject ?: 'Sem assunto'); ?></strong>
                            </td>
                            <td>
                                <div class="message-preview" title="<?php echo esc_attr($contact->message); ?>">
                                    <?php echo esc_html(wp_trim_words($contact->message, 15, '...')); ?>
                                </div>
                            </td>
                            <td>
                                <select class="status-select" data-contact-id="<?php echo $contact->id; ?>" data-current-status="<?php echo $contact->status; ?>">
                                    <option value="pending" <?php selected($contact->status, 'pending'); ?>>Pendente</option>
                                    <option value="completed" <?php selected($contact->status, 'completed'); ?>>Concluído</option>
                                </select>
                            </td>
                            <td>
                                <?php echo date('d/m/Y', strtotime($contact->created_at)); ?>
                                <br><small><?php echo date('H:i', strtotime($contact->created_at)); ?></small>
                            </td>
                            <td>
                                <button class="button button-small" onclick="viewContactDetails(<?php echo $contact->id; ?>)">
                                    Ver Detalhes
                                </button>
                                <button class="button button-small" onclick="replyContact('<?php echo esc_js($contact->email); ?>', '<?php echo esc_js($contact->name); ?>', '<?php echo esc_js($contact->subject); ?>')">
                                    Responder
                                </button>
                                <?php if (!empty($contact->phone)): ?>
                                <button class="button button-small" onclick="sendWhatsApp('<?php echo esc_js($contact->phone); ?>', '<?php echo esc_js($contact->name); ?>')">
                                    WhatsApp
                                </button>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 50px;">
                            <p>Nenhum contato encontrado.</p>
                        </td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    
    <!-- Paginação -->
    <?php if ($total_pages > 1): ?>
        <div class="tablenav bottom">
            <div class="tablenav-pages">
                <?php
                $pagination_args = array(
                    'base' => add_query_arg('paged', '%#%'),
                    'format' => '',
                    'prev_text' => '&laquo; Anterior',
                    'next_text' => 'Próximo &raquo;',
                    'total' => $total_pages,
                    'current' => $page
                );
                echo paginate_links($pagination_args);
                ?>
            </div>
        </div>
    <?php endif; ?>
</div>

<!-- Modal para Detalhes do Contato -->
<div id="contact-details-modal" class="nihon-modal" style="display: none;">
    <div class="nihon-modal-content">
        <div class="nihon-modal-header">
            <h2>Detalhes do Contato</h2>
            <span class="nihon-modal-close" onclick="closeContactModal()">&times;</span>
        </div>
        <div class="nihon-modal-body">
            <div id="contact-details-content">
                <!-- Conteúdo será carregado via JavaScript -->
            </div>
        </div>
    </div>
</div>

<script>
function viewContactDetails(contactId) {
    // Buscar detalhes do contato via AJAX
    jQuery.post(ajaxurl, {
        action: 'get_contact_details',
        contact_id: contactId,
        nonce: nihonAjax.nonce
    }, function(response) {
        if (response.success) {
            document.getElementById('contact-details-content').innerHTML = response.data;
            document.getElementById('contact-details-modal').style.display = 'block';
        } else {
            // Fallback se não houver AJAX - mostrar dados da tabela
            showContactDetailsFromTable(contactId);
        }
    }).fail(function() {
        // Fallback se não houver AJAX
        showContactDetailsFromTable(contactId);
    });
}

function showContactDetailsFromTable(contactId) {
    // Buscar dados da linha da tabela atual
    const row = document.querySelector(`[data-contact-id="${contactId}"]`).closest('tr');
    const cells = row.querySelectorAll('td');
    
    const name = cells[1].querySelector('strong').textContent;
    const email = cells[2].querySelector('a[href^="mailto:"]')?.textContent || 'Não informado';
    const phone = cells[2].querySelector('a[href^="tel:"]')?.textContent || 'Não informado';
    const subject = cells[3].querySelector('strong').textContent;
    const message = cells[4].getAttribute('title');
    const status = cells[5].querySelector('select').value;
    const date = cells[6].textContent.trim();
    
    const detailsHtml = `
        <div class="contact-details">
            <div class="contact-header">
                <h3>Contato #${contactId}</h3>
                <span class="status-badge ${status}">${status === 'pending' ? 'Pendente' : 'Concluído'}</span>
            </div>
            
            <div class="contact-info">
                <h4>Informações do Cliente</h4>
                <div class="customer-grid">
                    <div><strong>Nome:</strong> ${name}</div>
                    <div><strong>Email:</strong> ${email}</div>
                    <div><strong>Telefone:</strong> ${phone}</div>
                    <div><strong>Data:</strong> ${date}</div>
                </div>
            </div>
            
            <div class="contact-message">
                <h4>Assunto</h4>
                <p><strong>${subject}</strong></p>
                
                <h4>Mensagem</h4>
                <div class="message-content">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
            
            <div class="contact-actions">
                <button type="button" class="button button-primary" onclick="replyContact('${email}', '${name}', '${subject}')">
                    📧 Responder por Email
                </button>
                ${phone !== 'Não informado' ? `
                    <button type="button" class="button button-secondary" onclick="sendWhatsApp('${phone}', '${name}')">
                        📱 Enviar WhatsApp
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('contact-details-content').innerHTML = detailsHtml;
    document.getElementById('contact-details-modal').style.display = 'block';
}

function closeContactModal() {
    document.getElementById('contact-details-modal').style.display = 'none';
}

function replyContact(email, name, originalSubject) {
    const subject = `Re: ${originalSubject}`;
    const body = `Olá ${name},

Obrigado por entrar em contato conosco através do site da Nihon Auto.

Recebemos sua mensagem sobre "${originalSubject}" e estamos prontos para te ajudar!

[Sua resposta aqui]

Caso tenha mais alguma dúvida, não hesite em nos contatar.

Atenciosamente,
Equipe Nihon Auto
Especialistas em peças japonesas

--
Nihon Auto
Email: contato@nihon-auto.com
WhatsApp: (11) 99999-9999`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
}

function sendWhatsApp(phone, name) {
    if (!phone || phone === 'Não informado') {
        alert('Cliente não forneceu número de telefone');
        return;
    }
    
    const message = `Olá ${name}! 👋

Tudo bem? Vi que você entrou em contato conosco através do site da Nihon Auto.

Estou aqui para te ajudar com qualquer dúvida ou informação que você precise sobre nossos produtos.

Como posso te ajudar? 🚗

*Nihon Auto - Especialistas em peças japonesas*`;

    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function refreshContacts() {
    location.reload();
}

// CSS adicional para a mensagem
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .message-preview {
            max-width: 200px;
            cursor: help;
        }
        
        .contact-details {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .contact-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .contact-info, .contact-message {
            margin-bottom: 25px;
        }
        
        .contact-info h4, .contact-message h4 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .customer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        
        .customer-grid > div {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        
        .message-content {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
            line-height: 1.6;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .contact-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
        }
    `;
    document.head.appendChild(style);
});
</script>
