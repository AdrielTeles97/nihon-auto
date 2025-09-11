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

$quotes_table = $wpdb->prefix . 'nihon_quotes';

// Construir query
$where_conditions = array();
$where_values = array();

if (!empty($status_filter)) {
    $where_conditions[] = "status = %s";
    $where_values[] = $status_filter;
}

if (!empty($search)) {
    $where_conditions[] = "(name LIKE %s OR email LIKE %s OR document LIKE %s)";
    $where_values[] = '%' . $search . '%';
    $where_values[] = '%' . $search . '%';
    $where_values[] = '%' . $search . '%';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Contar total
$count_query = "SELECT COUNT(*) FROM $quotes_table $where_clause";
if (!empty($where_values)) {
    $total_items = $wpdb->get_var($wpdb->prepare($count_query, $where_values));
} else {
    $total_items = $wpdb->get_var($count_query);
}

// Buscar orçamentos
$quotes_query = "SELECT * FROM $quotes_table $where_clause ORDER BY created_at DESC LIMIT %d OFFSET %d";
$query_values = array_merge($where_values, array($per_page, $offset));

if (!empty($where_values)) {
    $quotes = $wpdb->get_results($wpdb->prepare($quotes_query, $query_values));
} else {
    $quotes = $wpdb->get_results($wpdb->prepare("SELECT * FROM $quotes_table ORDER BY created_at DESC LIMIT %d OFFSET %d", $per_page, $offset));
}

$total_pages = ceil($total_items / $per_page);
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Pedidos de Orçamento</h1>
    <a href="#" class="page-title-action" onclick="refreshQuotes()">Atualizar</a>
    
    <!-- Filtros -->
    <div class="nihon-filters">
        <form method="get" action="">
            <input type="hidden" name="page" value="nihon-quotes">
            
            <select name="status">
                <option value="">Todos os Status</option>
                <option value="pending" <?php selected($status_filter, 'pending'); ?>>Pendente</option>
                <option value="completed" <?php selected($status_filter, 'completed'); ?>>Concluído</option>
            </select>
            
            <input type="search" name="s" value="<?php echo esc_attr($search); ?>" placeholder="Buscar por nome, email ou documento">
            
            <input type="submit" class="button" value="Filtrar">
            
            <?php if (!empty($status_filter) || !empty($search)): ?>
                <a href="<?php echo admin_url('admin.php?page=nihon-quotes'); ?>" class="button">Limpar Filtros</a>
            <?php endif; ?>
        </form>
    </div>
    
    <!-- Estatísticas Rápidas -->
    <div class="nihon-stats-mini">
        <?php
        $pending_count = $wpdb->get_var("SELECT COUNT(*) FROM $quotes_table WHERE status = 'pending'");
        $completed_count = $wpdb->get_var("SELECT COUNT(*) FROM $quotes_table WHERE status = 'completed'");
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
    
    <!-- Tabela de Orçamentos -->
    <div class="nihon-table-container">
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Documento</th>
                    <th scope="col">Contato</th>
                    <th scope="col">Itens</th>
                    <th scope="col">Status</th>
                    <th scope="col">Data</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($quotes)): ?>
                    <?php foreach ($quotes as $quote): ?>
                        <?php
                        $cart_items = json_decode($quote->cart_items, true);
                        $items_count = is_array($cart_items) ? count($cart_items) : 0;
                        ?>
                        <tr>
                            <td><strong>#<?php echo $quote->id; ?></strong></td>
                            <td>
                                <strong><?php echo esc_html($quote->name); ?></strong>
                                <div class="row-actions">
                                    <span><a href="#" onclick="viewQuoteDetails(<?php echo $quote->id; ?>)">Ver Detalhes</a></span>
                                </div>
                            </td>
                            <td><code><?php echo esc_html($quote->document); ?></code></td>
                            <td>
                                <?php if (!empty($quote->email)): ?>
                                    <div>📧 <a href="mailto:<?php echo esc_attr($quote->email); ?>"><?php echo esc_html($quote->email); ?></a></div>
                                <?php endif; ?>
                                <?php if (!empty($quote->phone)): ?>
                                    <div>📱 <a href="tel:<?php echo esc_attr($quote->phone); ?>"><?php echo esc_html($quote->phone); ?></a></div>
                                <?php endif; ?>
                            </td>
                            <td>
                                <span class="items-badge"><?php echo $items_count; ?> itens</span>
                            </td>
                            <td>
                                <select class="status-select" data-quote-id="<?php echo $quote->id; ?>" data-current-status="<?php echo $quote->status; ?>">
                                    <option value="pending" <?php selected($quote->status, 'pending'); ?>>Pendente</option>
                                    <option value="completed" <?php selected($quote->status, 'completed'); ?>>Concluído</option>
                                </select>
                            </td>
                            <td>
                                <?php echo date('d/m/Y', strtotime($quote->created_at)); ?>
                                <br><small><?php echo date('H:i', strtotime($quote->created_at)); ?></small>
                            </td>
                            <td>
                                <button class="button button-small" onclick="viewQuoteDetails(<?php echo $quote->id; ?>)">
                                    Ver Detalhes
                                </button>
                                <button class="button button-small" onclick="sendWhatsApp('<?php echo esc_js($quote->phone); ?>', '<?php echo esc_js($quote->name); ?>')">
                                    WhatsApp
                                </button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 50px;">
                            <p>Nenhum orçamento encontrado.</p>
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

<!-- Modal para Detalhes do Orçamento -->
<div id="quote-details-modal" class="nihon-modal" style="display: none;">
    <div class="nihon-modal-content">
        <div class="nihon-modal-header">
            <h2>Detalhes do Orçamento</h2>
            <span class="nihon-modal-close" onclick="closeModal()">&times;</span>
        </div>
        <div class="nihon-modal-body">
            <div id="quote-details-content">
                <!-- Conteúdo será carregado via JavaScript -->
            </div>
        </div>
    </div>
</div>

<script>
function viewQuoteDetails(quoteId) {
    // Buscar detalhes do orçamento via AJAX
    jQuery.post(ajaxurl, {
        action: 'get_quote_details',
        quote_id: quoteId,
        nonce: nihonAjax.nonce
    }, function(response) {
        if (response.success) {
            document.getElementById('quote-details-content').innerHTML = response.data;
            document.getElementById('quote-details-modal').style.display = 'block';
        }
    });
}

function closeModal() {
    document.getElementById('quote-details-modal').style.display = 'none';
}

function sendWhatsApp(phone, name) {
    if (!phone) {
        alert('Telefone não disponível');
        return;
    }
    
    const message = `Olá ${name}, tudo bem? Vi que você solicitou um orçamento no site da Nihon acessórios. Vou te ajudar com os detalhes!`;
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function refreshQuotes() {
    location.reload();
}

// Atualizar status via AJAX
jQuery(document).ready(function($) {
    $('.status-select').on('change', function() {
        const quoteId = $(this).data('quote-id');
        const newStatus = $(this).val();
        const currentStatus = $(this).data('current-status');
        
        if (newStatus === currentStatus) return;
        
        $.post(ajaxurl, {
            action: 'update_quote_status',
            id: quoteId,
            status: newStatus,
            nonce: nihonAjax.nonce
        }, function(response) {
            if (response.success) {
                location.reload();
            } else {
                alert('Erro ao atualizar status');
            }
        });
    });
});
</script>
