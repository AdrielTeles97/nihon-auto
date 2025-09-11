<?php
/**
 * Plugin Name: Nihon acessórios Manager
 * Description: Sistema completo de cotações e contatos - Versão Final
 * Version: 2.1.0
 * Author: Nihon acessórios
 */

if (!defined('ABSPATH')) {
    exit;
}

class NihonAutoManager {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('admin_menu', array($this, 'add_admin_menus'));
        add_action('wp_ajax_update_quote_status', array($this, 'ajax_update_quote_status'));
        add_action('wp_ajax_delete_quote', array($this, 'ajax_delete_quote'));
        add_action('wp_ajax_delete_contact', array($this, 'ajax_delete_contact'));
        add_action('wp_ajax_cleanup_old_records', array($this, 'ajax_cleanup_old_records'));
        add_action('wp_ajax_update_contact_status', array($this, 'ajax_update_contact_status'));
        register_activation_hook(__FILE__, array($this, 'activate_plugin'));
    }
    
    public function init() {
        $this->create_tables();
    }
    
    public function register_rest_routes() {
        register_rest_route('nihon-auto/v1', '/test', array(
            'methods' => 'GET',
            'callback' => array($this, 'test_endpoint'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('nihon-auto/v1', '/quote', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_quote_request'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('nihon-auto/v1', '/contact', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_contact_request'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('nihon-auto/v1', '/settings', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_public_settings'),
            'permission_callback' => '__return_true'
        ));
    }
    
    public function test_endpoint() {
        global $wpdb;
        
        // Forçar criação das tabelas
        $this->create_tables();
        
        // Verificar se as tabelas existem
        $quotes_table = $wpdb->prefix . 'nihon_quotes';
        $contacts_table = $wpdb->prefix . 'nihon_contacts';
        
        $quotes_exists = $wpdb->get_var("SHOW TABLES LIKE '$quotes_table'") == $quotes_table;
        $contacts_exists = $wpdb->get_var("SHOW TABLES LIKE '$contacts_table'") == $contacts_table;
        
        return new WP_REST_Response(array(
            'status' => 'success',
            'message' => 'Plugin Nihon acessórios v2.1 funcionando!',
            'version' => '2.1.0',
            'timestamp' => current_time('mysql', false), // Horário local
            'database' => array(
                'quotes_table_exists' => $quotes_exists,
                'contacts_table_exists' => $contacts_exists,
                'quotes_table_name' => $quotes_table,
                'contacts_table_name' => $contacts_table
            )
        ), 200);
    }
    
    public function handle_quote_request($request) {
        global $wpdb;
        
        // Log da requisição para debug
        error_log('Nihon acessórios - Quote request received: ' . json_encode($request->get_json_params()));
        
        $data = $request->get_json_params();
        
        // Validar se pelo menos nome e um contato (email ou telefone) foi fornecido
        if (empty($data['name'])) {
            error_log('Nihon acessórios - Nome é obrigatório');
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Nome é obrigatório'
            ), 400);
        }
        
        if (empty($data['email']) && empty($data['phone'])) {
            error_log('Nihon acessórios - Email ou telefone é obrigatório');
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'E-mail ou telefone é obrigatório'
            ), 400);
        }
        
        // Verificar se a tabela existe
        $table_name = $wpdb->prefix . 'nihon_quotes';
        
        // Forçar criação da tabela se não existir
        $this->create_tables();
        
        // Verificar se a tabela foi criada
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;
        if (!$table_exists) {
            error_log('Nihon acessórios - Table does not exist: ' . $table_name);
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Erro de configuração do banco de dados'
            ), 500);
        }
        
        $cart_items_serialized = maybe_serialize($data['cart_items'] ?? array());
        error_log('Nihon acessórios - Cart items serialized: ' . $cart_items_serialized);
        
        // Limpar campos vazios
        $email = !empty($data['email']) ? sanitize_email($data['email']) : '';
        $phone = !empty($data['phone']) ? sanitize_text_field($data['phone']) : '';
        $document = !empty($data['document']) ? sanitize_text_field($data['document']) : '';
        
        $result = $wpdb->insert(
            $table_name,
            array(
                'name' => sanitize_text_field($data['name']),
                'document' => $document,
                'email' => $email,
                'phone' => $phone,
                'cart_items' => $cart_items_serialized,
                'message' => sanitize_textarea_field($data['message'] ?? ''),
                'status' => 'pending',
                'created_at' => current_time('mysql', false) // false = usar horário local do WordPress
            ),
            array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
        );
        
        if ($result === false) {
            $error = $wpdb->last_error;
            error_log('Nihon acessórios - Database insert error: ' . $error);
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Erro ao salvar cotação: ' . $error
            ), 500);
        }
        
        error_log('Nihon acessórios - Quote saved successfully with ID: ' . $wpdb->insert_id);
        
        // Enviar notificação
        try {
            $this->send_quote_notification($data);
        } catch (Exception $e) {
            error_log('Nihon acessórios - Error sending notification: ' . $e->getMessage());
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Cotação recebida com sucesso!',
            'id' => $wpdb->insert_id
        ), 200);
    }
    
    public function handle_contact_request($request) {
        global $wpdb;
        
        $data = $request->get_json_params();
        
        if (empty($data['name']) || empty($data['message'])) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Nome e mensagem são obrigatórios'
            ), 400);
        }
        
        if (empty($data['email']) && empty($data['phone'])) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'E-mail ou telefone é obrigatório'
            ), 400);
        }
        
        $table_name = $wpdb->prefix . 'nihon_contacts';
        
        // Forçar criação da tabela
        $this->create_tables();
        
        $email = !empty($data['email']) ? sanitize_email($data['email']) : '';
        $phone = !empty($data['phone']) ? sanitize_text_field($data['phone']) : '';
        
        $result = $wpdb->insert(
            $table_name,
            array(
                'name' => sanitize_text_field($data['name']),
                'email' => $email,
                'phone' => $phone,
                'subject' => sanitize_text_field($data['subject'] ?? ''),
                'message' => sanitize_textarea_field($data['message']),
                'status' => 'unread',
                'created_at' => current_time('mysql', false) // false = usar horário local do WordPress
            ),
            array('%s', '%s', '%s', '%s', '%s', '%s', '%s')
        );
        
        if ($result === false) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Erro ao salvar contato'
            ), 500);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Mensagem enviada com sucesso!',
            'id' => $wpdb->insert_id
        ), 200);
    }
    
    public function get_public_settings() {
        return new WP_REST_Response(array(
            'whatsapp' => get_option('nihon_whatsapp_number', ''),
            'email' => get_option('nihon_contact_email', ''),
            'business_hours' => get_option('nihon_business_hours', ''),
            'address' => get_option('nihon_address', '')
        ), 200);
    }
    
    private function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $quotes_table = $wpdb->prefix . 'nihon_quotes';
        $quotes_sql = "CREATE TABLE $quotes_table (
            id int(11) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            document varchar(20),
            email varchar(100),
            phone varchar(20),
            cart_items longtext,
            message longtext,
            status varchar(20) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        $contacts_table = $wpdb->prefix . 'nihon_contacts';
        $contacts_sql = "CREATE TABLE $contacts_table (
            id int(11) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            email varchar(100),
            phone varchar(20),
            subject varchar(200),
            message longtext NOT NULL,
            status varchar(20) DEFAULT 'unread',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        
        $result1 = dbDelta($quotes_sql);
        $result2 = dbDelta($contacts_sql);
        
        error_log('Nihon acessórios - Table creation results: ' . json_encode([
            'quotes' => $result1,
            'contacts' => $result2
        ]));
        
        // Verificar se as tabelas foram criadas
        $quotes_exists = $wpdb->get_var("SHOW TABLES LIKE '$quotes_table'") == $quotes_table;
        $contacts_exists = $wpdb->get_var("SHOW TABLES LIKE '$contacts_table'") == $contacts_table;
        
        error_log('Nihon acessórios - Tables exist check: quotes=' . ($quotes_exists ? 'yes' : 'no') . ', contacts=' . ($contacts_exists ? 'yes' : 'no'));
    }
    
    public function add_admin_menus() {
        add_menu_page(
            'Nihon acessórios',
            'Nihon acessórios',
            'manage_options',
            'nihon-auto',
            array($this, 'admin_dashboard'),
            'dashicons-car',
            30
        );
        
        add_submenu_page(
            'nihon-auto',
            'Cotações',
            'Cotações',
            'manage_options',
            'nihon-auto-quotes',
            array($this, 'admin_quotes')
        );
        
        add_submenu_page(
            'nihon-auto',
            'Contatos',
            'Contatos',
            'manage_options',
            'nihon-auto-contacts',
            array($this, 'admin_contacts')
        );
        
        add_submenu_page(
            'nihon-auto',
            'Configurações',
            'Configurações',
            'manage_options',
            'nihon-auto-settings',
            array($this, 'admin_settings')
        );
    }
    
    public function admin_dashboard() {
        global $wpdb;
        
        $quotes_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}nihon_quotes");
        $contacts_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}nihon_contacts");
        $pending_quotes = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}nihon_quotes WHERE status = 'pending'");
        $unread_contacts = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}nihon_contacts WHERE status = 'unread'");
        
        echo '<div class="wrap">';
        echo '<h1 class="wp-heading-inline">🚗 Nihon acessórios - Dashboard</h1>';
        echo '<div class="notice notice-success" style="margin: 20px 0;"><p><strong>✅ Plugin v2.1 Ativo</strong> - Sistema funcionando perfeitamente!</p></div>';
        
        // Cards de estatísticas
        echo '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0;">';
        
        // Card Cotações
        echo '<div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">';
        echo '<div style="display: flex; justify-content: space-between; align-items: center;">';
        echo '<div>';
        echo '<h3 style="margin: 0; font-size: 18px; opacity: 0.9;">Total de Cotações</h3>';
        echo '<p style="margin: 10px 0 0; font-size: 32px; font-weight: bold;">' . $quotes_count . '</p>';
        echo '</div>';
        echo '<div style="font-size: 48px; opacity: 0.3;">📊</div>';
        echo '</div>';
        echo '<a href="?page=nihon-auto-quotes" style="color: white; text-decoration: none; display: inline-block; margin-top: 15px; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 5px; font-size: 14px;">Ver Todas →</a>';
        echo '</div>';
        
        // Card Cotações Pendentes
        echo '<div class="card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">';
        echo '<div style="display: flex; justify-content: space-between; align-items: center;">';
        echo '<div>';
        echo '<h3 style="margin: 0; font-size: 18px; opacity: 0.9;">Cotações Pendentes</h3>';
        echo '<p style="margin: 10px 0 0; font-size: 32px; font-weight: bold;">' . $pending_quotes . '</p>';
        echo '</div>';
        echo '<div style="font-size: 48px; opacity: 0.3;">⏳</div>';
        echo '</div>';
        echo '<a href="?page=nihon-auto-quotes" style="color: white; text-decoration: none; display: inline-block; margin-top: 15px; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 5px; font-size: 14px;">Revisar →</a>';
        echo '</div>';
        
        // Card Contatos
        echo '<div class="card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">';
        echo '<div style="display: flex; justify-content: space-between; align-items: center;">';
        echo '<div>';
        echo '<h3 style="margin: 0; font-size: 18px; opacity: 0.9;">Total de Contatos</h3>';
        echo '<p style="margin: 10px 0 0; font-size: 32px; font-weight: bold;">' . $contacts_count . '</p>';
        echo '</div>';
        echo '<div style="font-size: 48px; opacity: 0.3;">💬</div>';
        echo '</div>';
        echo '<a href="?page=nihon-auto-contacts" style="color: white; text-decoration: none; display: inline-block; margin-top: 15px; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 5px; font-size: 14px;">Ver Todos →</a>';
        echo '</div>';
        
        // Card Contatos Não Lidos
        echo '<div class="card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">';
        echo '<div style="display: flex; justify-content: space-between; align-items: center;">';
        echo '<div>';
        echo '<h3 style="margin: 0; font-size: 18px; opacity: 0.9;">Contatos Não Lidos</h3>';
        echo '<p style="margin: 10px 0 0; font-size: 32px; font-weight: bold;">' . $unread_contacts . '</p>';
        echo '</div>';
        echo '<div style="font-size: 48px; opacity: 0.3;">📧</div>';
        echo '</div>';
        echo '<a href="?page=nihon-auto-contacts" style="color: white; text-decoration: none; display: inline-block; margin-top: 15px; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 5px; font-size: 14px;">Responder →</a>';
        echo '</div>';
        
        echo '</div>';
        
        // Ações rápidas
        echo '<div class="postbox" style="margin-top: 30px;">';
        echo '<div class="postbox-header"><h2>⚡ Ações Rápidas</h2></div>';
        echo '<div class="inside" style="padding: 20px;">';
        echo '<div style="display: flex; gap: 15px; flex-wrap: wrap;">';
        echo '<a href="?page=nihon-auto-quotes" class="button button-primary button-large">📋 Ver Cotações</a>';
        echo '<a href="?page=nihon-auto-contacts" class="button button-secondary button-large">💬 Ver Contatos</a>';
        echo '<a href="?page=nihon-auto-settings" class="button button-secondary button-large">⚙️ Configurações</a>';
        echo '<button onclick="location.reload()" class="button button-large">🔄 Atualizar</button>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
        
        echo '</div>';
    }
    
    public function admin_quotes() {
        global $wpdb;
        
        if (isset($_GET['action']) && $_GET['action'] === 'view' && isset($_GET['id'])) {
            $this->show_quote_details(intval($_GET['id']));
            return;
        }
        
        $quotes = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}nihon_quotes ORDER BY created_at DESC LIMIT 100");
        
        echo '<div class="wrap">';
        echo '<h1>📋 Cotações Recebidas <span class="count">(' . count($quotes) . ')</span></h1>';
        
        echo '<div style="margin-bottom: 15px;">';
        echo '<button onclick="cleanupOldRecords(\'quotes\')" class="button">🗑️ Limpar Concluídas (30+ dias)</button>';
        echo '<button onclick="location.reload()" class="button button-primary" style="margin-left: 10px;">🔄 Atualizar</button>';
        echo '</div>';
        
        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr><th style="width: 60px;">ID</th><th>Cliente</th><th>Contato</th><th>Produtos</th><th>Status</th><th>Data</th><th style="width: 200px;">Ações</th></tr></thead>';
        echo '<tbody>';
        
        if (empty($quotes)) {
            echo '<tr><td colspan="7" style="text-align: center; padding: 40px;">📭 Nenhuma cotação encontrada</td></tr>';
        }
        
        foreach ($quotes as $quote) {
            $products = maybe_unserialize($quote->cart_items);
            $item_count = is_array($products) ? count($products) : 0;
            
            echo '<tr>';
            echo '<td><strong>#' . $quote->id . '</strong></td>';
            echo '<td>';
            echo '<strong>' . esc_html($quote->name) . '</strong>';
            if ($quote->document) echo '<br><small>📄 ' . esc_html($quote->document) . '</small>';
            echo '</td>';
            echo '<td>';
            if ($quote->email) echo '📧 <a href="mailto:' . esc_attr($quote->email) . '">' . esc_html($quote->email) . '</a>';
            if ($quote->phone) {
                if ($quote->email) echo '<br>';
                echo '📱 ' . esc_html($quote->phone);
            }
            echo '</td>';
            echo '<td><span class="dashicons dashicons-products"></span> <strong>' . $item_count . '</strong> item(s)</td>';
            echo '<td>';
            $status_colors = ['pending' => '#e67e22', 'processing' => '#3498db', 'completed' => '#27ae60'];
            $color = $status_colors[$quote->status] ?? '#666';
            echo '<select onchange="updateQuoteStatus(' . $quote->id . ', this.value)" style="color: ' . $color . '; font-weight: bold;">';
            echo '<option value="pending"' . ($quote->status === 'pending' ? ' selected' : '') . '>⏳ Pendente</option>';
            echo '<option value="processing"' . ($quote->status === 'processing' ? ' selected' : '') . '>⚙️ Processando</option>';
            echo '<option value="completed"' . ($quote->status === 'completed' ? ' selected' : '') . '>✅ Concluído</option>';
            echo '</select>';
            echo '</td>';
            echo '<td><small>' . date('d/m/Y<\b\r>H:i', strtotime($quote->created_at)) . '</small></td>';
            echo '<td>';
            echo '<div style="display: flex; flex-wrap: wrap; gap: 3px;">';
            echo '<a href="?page=nihon-auto-quotes&action=view&id=' . $quote->id . '" class="button button-small">👁️ Ver</a>';
            if ($quote->phone) {
                $whatsapp_number = preg_replace('/\D/', '', $quote->phone);
                echo '<a href="https://wa.me/55' . $whatsapp_number . '" target="_blank" class="button button-small" style="background: #25D366; color: white; border-color: #25D366;">💬</a>';
            }
            echo '<button onclick="deleteQuote(' . $quote->id . ')" class="button button-small" style="color: #e74c3c;">🗑️</button>';
            echo '</div>';
            echo '</td>';
            echo '</tr>';
        }
        
        echo '</tbody></table>';
        
        $this->add_admin_scripts();
        
        echo '</div>';
    }
    
    public function admin_contacts() {
        global $wpdb;
        
        if (isset($_GET['action']) && $_GET['action'] === 'view' && isset($_GET['id'])) {
            $this->show_contact_details(intval($_GET['id']));
            return;
        }
        
        $contacts = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}nihon_contacts ORDER BY created_at DESC LIMIT 100");
        
        echo '<div class="wrap">';
        echo '<h1>💬 Contatos Recebidos <span class="count">(' . count($contacts) . ')</span></h1>';
        
        echo '<div style="margin-bottom: 15px;">';
        echo '<button onclick="cleanupOldRecords(\'contacts\')" class="button">🗑️ Limpar Lidos (30+ dias)</button>';
        echo '<button onclick="location.reload()" class="button button-primary" style="margin-left: 10px;">🔄 Atualizar</button>';
        echo '</div>';
        
        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr><th style="width: 60px;">ID</th><th>Nome</th><th>Contato</th><th>Assunto</th><th>Status</th><th>Data</th><th style="width: 160px;">Ações</th></tr></thead>';
        echo '<tbody>';
        
        if (empty($contacts)) {
            echo '<tr><td colspan="7" style="text-align: center; padding: 40px;">📭 Nenhum contato encontrado</td></tr>';
        }
        
        foreach ($contacts as $contact) {
            echo '<tr>';
            echo '<td><strong>#' . $contact->id . '</strong></td>';
            echo '<td><strong>' . esc_html($contact->name) . '</strong></td>';
            echo '<td>';
            if ($contact->email) echo '<a href="mailto:' . esc_attr($contact->email) . '">' . esc_html($contact->email) . '</a>';
            if ($contact->phone) {
                if ($contact->email) echo '<br>';
                echo esc_html($contact->phone);
            }
            echo '</td>';
            echo '<td>' . esc_html($contact->subject ?: '-') . '</td>';
            echo '<td>';
            $color = $contact->status === 'read' ? '#27ae60' : '#e67e22';
            echo '<select onchange="updateContactStatus(' . $contact->id . ', this.value)" style="color: ' . $color . '; font-weight: bold;">';
            echo '<option value="unread"' . ($contact->status === 'unread' ? ' selected' : '') . '>📧 Não Lido</option>';
            echo '<option value="read"' . ($contact->status === 'read' ? ' selected' : '') . '>✅ Lido</option>';
            echo '</select>';
            echo '</td>';
            echo '<td><small>' . date('d/m/Y<\b\r>H:i', strtotime($contact->created_at)) . '</small></td>';
            echo '<td>';
            echo '<div style="display: flex; gap: 3px;">';
            echo '<a href="?page=nihon-auto-contacts&action=view&id=' . $contact->id . '" class="button button-small">👁️ Ver</a>';
            echo '<button onclick="deleteContact(' . $contact->id . ')" class="button button-small" style="color: #e74c3c;">🗑️</button>';
            echo '</div>';
            echo '</td>';
            echo '</tr>';
        }
        
        echo '</tbody></table>';
        
        $this->add_admin_scripts();
        
        echo '</div>';
    }
    
    public function admin_settings() {
        if (isset($_POST['save_settings'])) {
            update_option('nihon_whatsapp_number', sanitize_text_field($_POST['whatsapp_number']));
            update_option('nihon_contact_email', sanitize_email($_POST['contact_email']));
            update_option('nihon_business_hours', sanitize_text_field($_POST['business_hours']));
            update_option('nihon_address', sanitize_textarea_field($_POST['address']));
            echo '<div class="notice notice-success"><p>✅ Configurações salvas com sucesso!</p></div>';
        }
        
        $whatsapp = get_option('nihon_whatsapp_number', '');
        $email = get_option('nihon_contact_email', get_option('admin_email'));
        $hours = get_option('nihon_business_hours', '');
        $address = get_option('nihon_address', '');
        
        echo '<div class="wrap">';
        echo '<h1>⚙️ Configurações Nihon acessórios</h1>';
        
        echo '<form method="post">';
        echo '<table class="form-table">';
        echo '<tr><th>📱 WhatsApp</th><td><input type="text" name="whatsapp_number" value="' . esc_attr($whatsapp) . '" class="regular-text" placeholder="5591999999999" /></td></tr>';
        echo '<tr><th>📧 E-mail de Contato</th><td><input type="email" name="contact_email" value="' . esc_attr($email) . '" class="regular-text" /></td></tr>';
        echo '<tr><th>🕒 Horário de Funcionamento</th><td><input type="text" name="business_hours" value="' . esc_attr($hours) . '" class="regular-text" placeholder="Seg-Sex: 8h às 18h" /></td></tr>';
        echo '<tr><th>📍 Endereço</th><td><textarea name="address" class="large-text" rows="3">' . esc_textarea($address) . '</textarea></td></tr>';
        echo '</table>';
        echo '<p class="submit"><input type="submit" name="save_settings" class="button-primary" value="💾 Salvar Configurações" /></p>';
        echo '</form>';
        
        echo '</div>';
    }
    
    private function show_quote_details($quote_id) {
        global $wpdb;
        
        $quote = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}nihon_quotes WHERE id = %d",
            $quote_id
        ));
        
        if (!$quote) {
            echo '<div class="wrap"><h1>❌ Cotação não encontrada</h1><p>A cotação #' . $quote_id . ' não foi encontrada.</p>';
            echo '<p><a href="?page=nihon-auto-quotes" class="button">← Voltar para lista</a></p></div>';
            return;
        }
        
        $products = maybe_unserialize($quote->cart_items);
        
        echo '<div class="wrap">';
        echo '<h1>📋 Detalhes da Cotação #' . $quote->id . '</h1>';
        echo '<p><a href="?page=nihon-auto-quotes" class="button">← Voltar para lista</a></p>';
        echo '<hr>';
        
        echo '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">';
        
        // Dados do cliente
        echo '<div class="postbox">';
        echo '<div class="postbox-header"><h2>👤 Dados do Cliente</h2></div>';
        echo '<div class="inside">';
        echo '<table class="form-table">';
        echo '<tr><th>Nome:</th><td><strong>' . esc_html($quote->name) . '</strong></td></tr>';
        if ($quote->document) echo '<tr><th>Documento:</th><td>' . esc_html($quote->document) . '</td></tr>';
        if ($quote->email) echo '<tr><th>E-mail:</th><td><a href="mailto:' . esc_attr($quote->email) . '" target="_blank">📧 ' . esc_html($quote->email) . '</a></td></tr>';
        if ($quote->phone) {
            echo '<tr><th>Telefone:</th><td>';
            $whatsapp_number = preg_replace('/\D/', '', $quote->phone);
            echo esc_html($quote->phone);
            echo '<br><a href="https://wa.me/55' . $whatsapp_number . '" target="_blank" class="button button-small" style="background: #25D366; color: white; border-color: #25D366; margin-top: 5px;">📱 Abrir WhatsApp</a>';
            echo '</td></tr>';
        }
        echo '<tr><th>Status:</th><td>';
        echo '<select onchange="updateQuoteStatus(' . $quote->id . ', this.value)" style="margin-left: 10px;">';
        echo '<option value="pending"' . ($quote->status === 'pending' ? ' selected' : '') . '>⏳ Pendente</option>';
        echo '<option value="processing"' . ($quote->status === 'processing' ? ' selected' : '') . '>⚙️ Processando</option>';
        echo '<option value="completed"' . ($quote->status === 'completed' ? ' selected' : '') . '>✅ Concluído</option>';
        echo '</select>';
        echo '</td></tr>';
        echo '<tr><th>Data:</th><td><strong>' . date('d/m/Y H:i:s', strtotime($quote->created_at)) . '</strong></td></tr>';
        echo '</table>';
        echo '</div>';
        echo '</div>';
        
        // Produtos solicitados
        echo '<div class="postbox">';
        echo '<div class="postbox-header"><h2>🛒 Produtos Solicitados</h2></div>';
        echo '<div class="inside">';
        
        if (is_array($products) && !empty($products)) {
            echo '<table class="wp-list-table widefat fixed striped">';
            echo '<thead><tr><th>Produto</th><th>Código</th><th>Variação</th><th>Qtd</th></tr></thead>';
            echo '<tbody>';
            
            foreach ($products as $item) {
                echo '<tr>';
                echo '<td><strong>' . esc_html($item['product']['name'] ?? 'Produto sem nome') . '</strong></td>';
                echo '<td><code>' . esc_html($item['product']['slug'] ?? $item['product']['id'] ?? '-') . '</code></td>';
                
                // Mostrar variação se existir
                echo '<td>';
                if (!empty($item['variation_id']) || !empty($item['selected_attributes'])) {
                    if (!empty($item['variation_id'])) {
                        echo '<small>🔗 ID: ' . intval($item['variation_id']) . '</small><br>';
                    }
                    if (!empty($item['selected_attributes']) && is_array($item['selected_attributes'])) {
                        $attrs = [];
                        foreach ($item['selected_attributes'] as $attr_name => $attr_value) {
                            $attrs[] = '<strong>' . esc_html($attr_name) . ':</strong> ' . esc_html($attr_value);
                        }
                        echo '<div style="font-size: 12px; color: #666;">🎯 ' . implode('<br>🎯 ', $attrs) . '</div>';
                    }
                } else {
                    echo '<span style="color: #999;">-</span>';
                }
                echo '</td>';
                
                echo '<td><span class="dashicons dashicons-products"></span> <strong>' . intval($item['quantity'] ?? 1) . '</strong></td>';
                echo '</tr>';
            }
            
            echo '</tbody></table>';
            echo '<p><strong>📦 Total de itens diferentes:</strong> ' . count($products) . '</p>';
        } else {
            echo '<div style="text-align: center; padding: 20px;">';
            echo '<p style="font-size: 18px; color: #666;">📭 Nenhum produto foi especificado nesta cotação</p>';
            echo '<p><small>Isso pode acontecer se a cotação foi feita por contato direto</small></p>';
            echo '</div>';
        }
        
        echo '</div>';
        echo '</div>';
        
        echo '</div>';
        
        // Mensagem adicional
        if ($quote->message) {
            echo '<div class="postbox">';
            echo '<div class="postbox-header"><h2>💬 Mensagem do Cliente</h2></div>';
            echo '<div class="inside">';
            echo '<div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #0073aa; border-radius: 4px;">';
            echo '<p style="margin: 0; line-height: 1.6;">' . nl2br(esc_html($quote->message)) . '</p>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
        }
        
        // Ações
        echo '<div class="postbox">';
        echo '<div class="postbox-header"><h2>⚡ Ações Rápidas</h2></div>';
        echo '<div class="inside">';
        echo '<p>';
        if ($quote->phone) {
            $whatsapp_number = preg_replace('/\D/', '', $quote->phone);
            echo '<a href="https://wa.me/55' . $whatsapp_number . '" target="_blank" class="button button-primary" style="background: #25D366; border-color: #25D366;">📱 Responder via WhatsApp</a> ';
        }
        if ($quote->email) {
            echo '<a href="mailto:' . esc_attr($quote->email) . '" class="button">📧 Responder via E-mail</a> ';
        }
        echo '<button onclick="deleteQuote(' . $quote->id . ')" class="button" style="color: #dc3545;">🗑️ Excluir Cotação</button>';
        echo '</p>';
        echo '</div>';
        echo '</div>';
        
        $this->add_admin_scripts();
        
        echo '</div>';
    }
    
    private function show_contact_details($contact_id) {
        global $wpdb;
        
        $contact = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}nihon_contacts WHERE id = %d",
            $contact_id
        ));
        
        if (!$contact) {
            echo '<div class="wrap"><h1>❌ Contato não encontrado</h1><p>O contato #' . $contact_id . ' não foi encontrado.</p>';
            echo '<p><a href="?page=nihon-auto-contacts" class="button">← Voltar para lista</a></p></div>';
            return;
        }
        
        // Marcar como lido automaticamente
        if ($contact->status === 'unread') {
            $wpdb->update(
                $wpdb->prefix . 'nihon_contacts',
                array('status' => 'read'),
                array('id' => $contact_id)
            );
            $contact->status = 'read';
        }
        
        echo '<div class="wrap">';
        echo '<h1>💬 Detalhes do Contato #' . $contact->id . '</h1>';
        echo '<p><a href="?page=nihon-auto-contacts" class="button">← Voltar para lista</a></p>';
        echo '<hr>';
        
        echo '<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; margin: 20px 0;">';
        
        // Dados do remetente
        echo '<div class="postbox">';
        echo '<div class="postbox-header"><h2>👤 Dados do Remetente</h2></div>';
        echo '<div class="inside">';
        echo '<table class="form-table">';
        echo '<tr><th>Nome:</th><td><strong>' . esc_html($contact->name) . '</strong></td></tr>';
        if ($contact->email) echo '<tr><th>E-mail:</th><td><a href="mailto:' . esc_attr($contact->email) . '" target="_blank">📧 ' . esc_html($contact->email) . '</a></td></tr>';
        if ($contact->phone) echo '<tr><th>Telefone:</th><td>' . esc_html($contact->phone) . '</td></tr>';
        echo '<tr><th>Assunto:</th><td>' . esc_html($contact->subject ?: 'Sem assunto') . '</td></tr>';
        echo '<tr><th>Status:</th><td>';
        echo '<select onchange="updateContactStatus(' . $contact->id . ', this.value)">';
        echo '<option value="unread"' . ($contact->status === 'unread' ? ' selected' : '') . '>📧 Não Lido</option>';
        echo '<option value="read"' . ($contact->status === 'read' ? ' selected' : '') . '>✅ Lido</option>';
        echo '</select>';
        echo '</td></tr>';
        echo '<tr><th>Data:</th><td><strong>' . date('d/m/Y H:i:s', strtotime($contact->created_at)) . '</strong></td></tr>';
        echo '</table>';
        echo '</div>';
        echo '</div>';
        
        // Mensagem
        echo '<div class="postbox">';
        echo '<div class="postbox-header"><h2>💬 Mensagem Completa</h2></div>';
        echo '<div class="inside">';
        echo '<div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #0073aa; border-radius: 4px; min-height: 150px;">';
        echo '<p style="margin: 0; line-height: 1.6; font-size: 16px;">' . nl2br(esc_html($contact->message)) . '</p>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
        
        echo '</div>';
        
        // Ações
        echo '<div class="postbox">';
        echo '<div class="postbox-header"><h2>⚡ Ações de Resposta</h2></div>';
        echo '<div class="inside">';
        echo '<p>';
        if ($contact->email) {
            echo '<a href="mailto:' . esc_attr($contact->email) . '?subject=Re: ' . esc_attr($contact->subject ?: 'Seu contato') . '" class="button button-primary">📧 Responder por E-mail</a> ';
        }
        echo '<button onclick="deleteContact(' . $contact->id . ')" class="button" style="color: #dc3545;">🗑️ Excluir Contato</button>';
        echo '</p>';
        echo '</div>';
        echo '</div>';
        
        $this->add_admin_scripts();
        
        echo '</div>';
    }
    
    private function add_admin_scripts() {
        echo '<script>
        function updateQuoteStatus(id, status) {
            const statusNames = {pending: "Pendente", processing: "Processando", completed: "Concluído"};
            if (confirm("Alterar status da cotação #" + id + " para " + statusNames[status] + "?")) {
                fetch(ajaxurl, {
                    method: "POST",
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    body: "action=update_quote_status&id=" + id + "&status=" + status + "&nonce=' . wp_create_nonce('update_quote_status') . '"
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        alert("Erro ao atualizar status: " + data.data);
                    }
                });
            }
        }
        
        function updateContactStatus(id, status) {
            fetch(ajaxurl, {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: "action=update_contact_status&id=" + id + "&status=" + status + "&nonce=' . wp_create_nonce('update_contact_status') . '"
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert("Erro ao atualizar status");
                }
            });
        }
        
        function deleteQuote(id) {
            if (confirm("⚠️ ATENÇÃO: Excluir permanentemente a cotação #" + id + "?\\n\\nEsta ação não pode ser desfeita!")) {
                fetch(ajaxurl, {
                    method: "POST",
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    body: "action=delete_quote&id=" + id + "&nonce=' . wp_create_nonce('delete_quote') . '"
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("✅ Cotação excluída com sucesso!");
                        if (window.location.href.includes("action=view")) {
                            window.location.href = "?page=nihon-auto-quotes";
                        } else {
                            location.reload();
                        }
                    } else {
                        alert("❌ Erro ao excluir: " + data.data);
                    }
                });
            }
        }
        
        function deleteContact(id) {
            if (confirm("⚠️ ATENÇÃO: Excluir permanentemente o contato #" + id + "?\\n\\nEsta ação não pode ser desfeita!")) {
                fetch(ajaxurl, {
                    method: "POST",
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    body: "action=delete_contact&id=" + id + "&nonce=' . wp_create_nonce('delete_contact') . '"
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("✅ Contato excluído com sucesso!");
                        if (window.location.href.includes("action=view")) {
                            window.location.href = "?page=nihon-auto-contacts";
                        } else {
                            location.reload();
                        }
                    } else {
                        alert("❌ Erro ao excluir: " + data.data);
                    }
                });
            }
        }
        
        function cleanupOldRecords(type) {
            const typeNames = {quotes: "cotações concluídas", contacts: "contatos lidos"};
            if (confirm("🗑️ Excluir todas as " + typeNames[type] + " com mais de 30 dias?\\n\\nEsta ação não pode ser desfeita!")) {
                fetch(ajaxurl, {
                    method: "POST",
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    body: "action=cleanup_old_records&type=" + type + "&nonce=' . wp_create_nonce('cleanup_old_records') . '"
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("✅ Limpeza concluída! " + data.data.deleted + " registros removidos.");
                        location.reload();
                    } else {
                        alert("❌ Erro na limpeza: " + data.data);
                    }
                });
            }
        }
        </script>';
    }
    
    // AJAX Functions
    public function ajax_update_quote_status() {
        check_ajax_referer('update_quote_status', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Acesso negado');
        }
        
        $id = intval($_POST['id']);
        $status = sanitize_text_field($_POST['status']);
        
        global $wpdb;
        $result = $wpdb->update(
            $wpdb->prefix . 'nihon_quotes',
            array('status' => $status),
            array('id' => $id),
            array('%s'),
            array('%d')
        );
        
        if ($result !== false) {
            wp_send_json_success('Status atualizado');
        } else {
            wp_send_json_error('Erro ao atualizar status');
        }
    }
    
    public function ajax_update_contact_status() {
        check_ajax_referer('update_contact_status', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Acesso negado');
        }
        
        $id = intval($_POST['id']);
        $status = sanitize_text_field($_POST['status']);
        
        global $wpdb;
        $result = $wpdb->update(
            $wpdb->prefix . 'nihon_contacts',
            array('status' => $status),
            array('id' => $id),
            array('%s'),
            array('%d')
        );
        
        if ($result !== false) {
            wp_send_json_success('Status atualizado');
        } else {
            wp_send_json_error('Erro ao atualizar status');
        }
    }
    
    public function ajax_delete_quote() {
        check_ajax_referer('delete_quote', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Acesso negado');
        }
        
        $id = intval($_POST['id']);
        
        global $wpdb;
        $result = $wpdb->delete(
            $wpdb->prefix . 'nihon_quotes',
            array('id' => $id),
            array('%d')
        );
        
        if ($result !== false) {
            wp_send_json_success('Cotação excluída');
        } else {
            wp_send_json_error('Erro ao excluir cotação');
        }
    }
    
    public function ajax_delete_contact() {
        check_ajax_referer('delete_contact', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Acesso negado');
        }
        
        $id = intval($_POST['id']);
        
        global $wpdb;
        $result = $wpdb->delete(
            $wpdb->prefix . 'nihon_contacts',
            array('id' => $id),
            array('%d')
        );
        
        if ($result !== false) {
            wp_send_json_success('Contato excluído');
        } else {
            wp_send_json_error('Erro ao excluir contato');
        }
    }
    
    public function ajax_cleanup_old_records() {
        check_ajax_referer('cleanup_old_records', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Acesso negado');
        }
        
        $type = sanitize_text_field($_POST['type']);
        
        global $wpdb;
        
        if ($type === 'quotes') {
            $deleted = $wpdb->query($wpdb->prepare(
                "DELETE FROM {$wpdb->prefix}nihon_quotes 
                 WHERE status = 'completed' 
                 AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)"
            ));
        } elseif ($type === 'contacts') {
            $deleted = $wpdb->query($wpdb->prepare(
                "DELETE FROM {$wpdb->prefix}nihon_contacts 
                 WHERE status = 'read' 
                 AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)"
            ));
        } else {
            wp_send_json_error('Tipo inválido');
        }
        
        wp_send_json_success(array('deleted' => $deleted));
    }
    
    private function send_quote_notification($data) {
        $to = get_option('nihon_contact_email', get_option('admin_email'));
        $subject = '🚗 Nova Cotação - Nihon acessórios';
        $message = "Nova cotação recebida:\n\n";
        $message .= "Nome: " . $data['name'] . "\n";
        $message .= "Email: " . ($data['email'] ?? '-') . "\n";
        $message .= "Telefone: " . ($data['phone'] ?? '-') . "\n\n";
        
        if (isset($data['cart_items']) && is_array($data['cart_items'])) {
            $message .= "Produtos solicitados:\n";
            foreach ($data['cart_items'] as $item) {
                $message .= "• " . $item['product']['name'] . " (Qtd: " . $item['quantity'] . ")\n";
            }
        }
        
        if ($data['message'] ?? '') {
            $message .= "\nMensagem: " . $data['message'] . "\n";
        }
        
        wp_mail($to, $subject, $message);
    }
    
    public function activate_plugin() {
        $this->create_tables();
        flush_rewrite_rules();
    }
}

new NihonAutoManager();
