<?php
if (!defined('ABSPATH')) {
    exit;
}

global $wpdb;

// Estatísticas para o dashboard
$quotes_table = $wpdb->prefix . 'nihon_quotes';
$contacts_table = $wpdb->prefix . 'nihon_contacts';

$total_quotes = $wpdb->get_var("SELECT COUNT(*) FROM $quotes_table");
$pending_quotes = $wpdb->get_var("SELECT COUNT(*) FROM $quotes_table WHERE status = 'pending'");
$completed_quotes = $wpdb->get_var("SELECT COUNT(*) FROM $quotes_table WHERE status = 'completed'");

$total_contacts = $wpdb->get_var("SELECT COUNT(*) FROM $contacts_table");
$pending_contacts = $wpdb->get_var("SELECT COUNT(*) FROM $contacts_table WHERE status = 'pending'");
$completed_contacts = $wpdb->get_var("SELECT COUNT(*) FROM $contacts_table WHERE status = 'completed'");

// Últimos pedidos
$latest_quotes = $wpdb->get_results("SELECT * FROM $quotes_table ORDER BY created_at DESC LIMIT 5");
$latest_contacts = $wpdb->get_results("SELECT * FROM $contacts_table ORDER BY created_at DESC LIMIT 5");
?>

<div class="wrap">
    <h1>Dashboard - Nihon acessórios</h1>
    
    <div class="nihon-dashboard">
        <!-- Cards de Estatísticas -->
        <div class="nihon-stats-grid">
            <div class="nihon-stat-card">
                <div class="stat-icon orçamentos">🛒</div>
                <div class="stat-content">
                    <h3><?php echo $total_quotes; ?></h3>
                    <p>Total Orçamentos</p>
                    <small><?php echo $pending_quotes; ?> pendentes</small>
                </div>
            </div>
            
            <div class="nihon-stat-card">
                <div class="stat-icon contatos">📧</div>
                <div class="stat-content">
                    <h3><?php echo $total_contacts; ?></h3>
                    <p>Total Contatos</p>
                    <small><?php echo $pending_contacts; ?> pendentes</small>
                </div>
            </div>
            
            <div class="nihon-stat-card">
                <div class="stat-icon concluidos">✅</div>
                <div class="stat-content">
                    <h3><?php echo $completed_quotes + $completed_contacts; ?></h3>
                    <p>Total Concluídos</p>
                    <small>Este mês</small>
                </div>
            </div>
            
            <div class="nihon-stat-card">
                <div class="stat-icon taxa">📊</div>
                <div class="stat-content">
                    <h3><?php echo $total_quotes > 0 ? round(($completed_quotes / $total_quotes) * 100) : 0; ?>%</h3>
                    <p>Taxa de Conclusão</p>
                    <small>Orçamentos</small>
                </div>
            </div>
        </div>
        
        <!-- Seção de Ações Rápidas -->
        <div class="nihon-quick-actions">
            <h2>Ações Rápidas</h2>
            <div class="quick-actions-grid">
                <a href="<?php echo admin_url('admin.php?page=nihon-quotes'); ?>" class="quick-action-btn orçamentos">
                    <span class="dashicons dashicons-cart"></span>
                    <span>Ver Orçamentos</span>
                    <?php if ($pending_quotes > 0): ?>
                        <span class="badge"><?php echo $pending_quotes; ?></span>
                    <?php endif; ?>
                </a>
                
                <a href="<?php echo admin_url('admin.php?page=nihon-contacts'); ?>" class="quick-action-btn contatos">
                    <span class="dashicons dashicons-email"></span>
                    <span>Ver Contatos</span>
                    <?php if ($pending_contacts > 0): ?>
                        <span class="badge"><?php echo $pending_contacts; ?></span>
                    <?php endif; ?>
                </a>
                
                <a href="<?php echo admin_url('admin.php?page=nihon-settings'); ?>" class="quick-action-btn configuracoes">
                    <span class="dashicons dashicons-admin-settings"></span>
                    <span>Configurações</span>
                </a>
            </div>
        </div>
        
        <!-- Últimos Pedidos -->
        <div class="nihon-recent-activity">
            <div class="activity-section">
                <h2>Últimos Orçamentos</h2>
                <div class="activity-list">
                    <?php if (!empty($latest_quotes)): ?>
                        <?php foreach ($latest_quotes as $quote): ?>
                            <div class="activity-item">
                                <div class="activity-icon">🛒</div>
                                <div class="activity-content">
                                    <h4><?php echo esc_html($quote->name); ?></h4>
                                    <p><?php echo esc_html($quote->document); ?> • <?php echo esc_html($quote->email); ?></p>
                                    <small><?php echo date('d/m/Y H:i', strtotime($quote->created_at)); ?></small>
                                </div>
                                <div class="activity-status">
                                    <span class="status-badge <?php echo $quote->status; ?>">
                                        <?php echo $quote->status === 'pending' ? 'Pendente' : 'Concluído'; ?>
                                    </span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="no-activity">Nenhum orçamento encontrado.</p>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="activity-section">
                <h2>Últimos Contatos</h2>
                <div class="activity-list">
                    <?php if (!empty($latest_contacts)): ?>
                        <?php foreach ($latest_contacts as $contact): ?>
                            <div class="activity-item">
                                <div class="activity-icon">📧</div>
                                <div class="activity-content">
                                    <h4><?php echo esc_html($contact->name); ?></h4>
                                    <p><?php echo esc_html($contact->subject); ?></p>
                                    <small><?php echo date('d/m/Y H:i', strtotime($contact->created_at)); ?></small>
                                </div>
                                <div class="activity-status">
                                    <span class="status-badge <?php echo $contact->status; ?>">
                                        <?php echo $contact->status === 'pending' ? 'Pendente' : 'Concluído'; ?>
                                    </span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="no-activity">Nenhum contato encontrado.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>
