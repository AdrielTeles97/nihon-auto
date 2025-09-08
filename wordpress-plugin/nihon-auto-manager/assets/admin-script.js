jQuery(document).ready(function ($) {
    // Função para atualizar status de orçamentos
    window.updateQuoteStatus = function (quoteId, newStatus) {
        $.post(
            nihonAjax.ajax_url,
            {
                action: 'update_quote_status',
                id: quoteId,
                status: newStatus,
                nonce: nihonAjax.nonce
            },
            function (response) {
                if (response.success) {
                    location.reload()
                } else {
                    alert('Erro ao atualizar status: ' + response.data)
                }
            }
        )
    }

    // Função para atualizar status de contatos
    window.updateContactStatus = function (contactId, newStatus) {
        $.post(
            nihonAjax.ajax_url,
            {
                action: 'update_contact_status',
                id: contactId,
                status: newStatus,
                nonce: nihonAjax.nonce
            },
            function (response) {
                if (response.success) {
                    location.reload()
                } else {
                    alert('Erro ao atualizar status: ' + response.data)
                }
            }
        )
    }

    // Função para buscar detalhes de orçamento
    window.viewQuoteDetails = function (quoteId) {
        $.post(
            nihonAjax.ajax_url,
            {
                action: 'get_quote_details',
                quote_id: quoteId,
                nonce: nihonAjax.nonce
            },
            function (response) {
                if (response.success) {
                    showQuoteModal(response.data)
                } else {
                    alert('Erro ao carregar detalhes do orçamento')
                }
            }
        )
    }

    // Função para mostrar modal com detalhes do orçamento
    function showQuoteModal(data) {
        const modalHtml = `
            <div class="quote-details">
                <div class="quote-header">
                    <h3>Orçamento #${data.id}</h3>
                    <span class="status-badge ${data.status}">${
            data.status === 'pending' ? 'Pendente' : 'Concluído'
        }</span>
                </div>
                
                <div class="quote-customer-info">
                    <h4>Informações do Cliente</h4>
                    <div class="customer-grid">
                        <div>
                            <strong>Nome:</strong> ${data.name}
                        </div>
                        <div>
                            <strong>Documento:</strong> ${data.document}
                        </div>
                        <div>
                            <strong>Email:</strong> ${data.email}
                        </div>
                        <div>
                            <strong>Telefone:</strong> ${
                                data.phone || 'Não informado'
                            }
                        </div>
                    </div>
                </div>
                
                <div class="quote-items">
                    <h4>Itens do Orçamento</h4>
                    <div class="items-list">
                        ${data.cart_items
                            .map(
                                item => `
                            <div class="quote-item">
                                <div class="item-image">
                                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                                </div>
                                <div class="item-info">
                                    <h5>${item.name}</h5>
                                    <p>Categoria: ${item.category}</p>
                                    <p>Quantidade: ${item.quantity}</p>
                                </div>
                            </div>
                        `
                            )
                            .join('')}
                    </div>
                </div>
                
                <div class="quote-actions">
                    <button type="button" class="button button-primary" onclick="sendQuoteWhatsApp('${
                        data.phone
                    }', '${data.name}', ${data.id})">
                        📱 Enviar WhatsApp
                    </button>
                    <button type="button" class="button button-secondary" onclick="sendQuoteEmail('${
                        data.email
                    }', '${data.name}', ${data.id})">
                        📧 Enviar Email
                    </button>
                    <button type="button" class="button" onclick="printQuote(${
                        data.id
                    })">
                        🖨️ Imprimir
                    </button>
                </div>
            </div>
        `

        // Criar e mostrar modal
        const modal = $(`
            <div class="nihon-modal" id="quote-modal">
                <div class="nihon-modal-content">
                    <div class="nihon-modal-header">
                        <h2>Detalhes do Orçamento</h2>
                        <span class="nihon-modal-close">&times;</span>
                    </div>
                    <div class="nihon-modal-body">
                        ${modalHtml}
                    </div>
                </div>
            </div>
        `)

        $('body').append(modal)
        modal.fadeIn(300)

        // Fechar modal
        modal.find('.nihon-modal-close').click(function () {
            modal.fadeOut(300, function () {
                modal.remove()
            })
        })

        // Fechar ao clicar fora
        modal.click(function (e) {
            if (e.target === this) {
                modal.fadeOut(300, function () {
                    modal.remove()
                })
            }
        })
    }

    // Função para enviar WhatsApp do orçamento
    window.sendQuoteWhatsApp = function (phone, name, quoteId) {
        if (!phone || phone === 'Não informado') {
            alert('Cliente não forneceu número de telefone')
            return
        }

        const message = `Olá ${name}! 👋

Tudo bem? Vi que você solicitou um orçamento (ID: #${quoteId}) no site da Nihon Auto.

Estou entrando em contato para te ajudar com os detalhes dos produtos que você tem interesse.

Posso te ajudar com mais informações? 🚗

*Nihon Auto - Especialistas em peças japonesas*`

        const cleanPhone = phone.replace(/\D/g, '')
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            message
        )}`
        window.open(url, '_blank')
    }

    // Função para enviar email do orçamento
    window.sendQuoteEmail = function (email, name, quoteId) {
        const subject = `Nihon Auto - Orçamento #${quoteId}`
        const body = `Olá ${name},

Agradecemos seu interesse em nossos produtos!

Recebemos sua solicitação de orçamento (ID: #${quoteId}) e nossa equipe está analisando os itens selecionados.

Em breve entraremos em contato com você com todas as informações detalhadas sobre preços e disponibilidade.

Caso tenha alguma dúvida ou queira adicionar mais itens ao orçamento, não hesite em nos contatar.

Atenciosamente,
Equipe Nihon Auto
Especialistas em peças japonesas`

        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`
        window.open(mailtoUrl)
    }

    // Função para imprimir orçamento
    window.printQuote = function (quoteId) {
        // Implementar funcionalidade de impressão
        window.print()
    }

    // Auto-refresh para notificações
    function checkForNewNotifications() {
        $.post(
            nihonAjax.ajax_url,
            {
                action: 'get_notification_count',
                nonce: nihonAjax.nonce
            },
            function (response) {
                if (response.success && response.data.hasNew) {
                    // Mostrar notificação visual
                    showNotification('Novos pedidos recebidos!', 'info')
                }
            }
        )
    }

    // Função para mostrar notificações
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notice notice-${type} is-dismissible nihon-notification" style="position: fixed; top: 32px; right: 20px; z-index: 999999; min-width: 300px;">
                <p>${message}</p>
                <button type="button" class="notice-dismiss">
                    <span class="screen-reader-text">Dismiss this notice.</span>
                </button>
            </div>
        `)

        $('body').append(notification)

        // Auto-dismiss após 5 segundos
        setTimeout(() => {
            notification.fadeOut(300, function () {
                notification.remove()
            })
        }, 5000)

        // Dismiss manual
        notification.find('.notice-dismiss').click(function () {
            notification.fadeOut(300, function () {
                notification.remove()
            })
        })
    }

    // Verificar notificações a cada 30 segundos (apenas nas páginas do plugin)
    if (window.location.href.includes('nihon-')) {
        setInterval(checkForNewNotifications, 30000)
    }

    // Melhorar UX dos selects de status
    $('.status-select').each(function () {
        const $select = $(this)
        const originalStatus = $select.data('current-status')

        $select.on('change', function () {
            const newStatus = $(this).val()
            const itemId =
                $select.data('quote-id') || $select.data('contact-id')
            const itemType = $select.data('quote-id') ? 'quote' : 'contact'

            if (newStatus === originalStatus) return

            // Confirmação antes de alterar
            const confirmed = confirm(
                `Tem certeza que deseja marcar este ${
                    itemType === 'quote' ? 'orçamento' : 'contato'
                } como ${newStatus === 'pending' ? 'pendente' : 'concluído'}?`
            )

            if (!confirmed) {
                $select.val(originalStatus)
                return
            }

            // Desabilitar select durante a atualização
            $select.prop('disabled', true)

            const action =
                itemType === 'quote'
                    ? 'update_quote_status'
                    : 'update_contact_status'

            $.post(
                nihonAjax.ajax_url,
                {
                    action: action,
                    id: itemId,
                    status: newStatus,
                    nonce: nihonAjax.nonce
                },
                function (response) {
                    if (response.success) {
                        showNotification(
                            `Status atualizado com sucesso!`,
                            'success'
                        )
                        setTimeout(() => location.reload(), 1000)
                    } else {
                        showNotification(
                            `Erro ao atualizar status: ${response.data}`,
                            'error'
                        )
                        $select.val(originalStatus)
                    }
                }
            ).always(function () {
                $select.prop('disabled', false)
            })
        })
    })

    // Função para exportar dados
    window.exportData = function (type, format = 'csv') {
        const url =
            nihonAjax.ajax_url +
            '?' +
            $.param({
                action: 'export_nihon_data',
                type: type,
                format: format,
                nonce: nihonAjax.nonce
            })

        window.open(url, '_blank')
    }

    // Confirmar antes de deletar (se implementado)
    $('.delete-item').click(function (e) {
        e.preventDefault()
        const confirmed = confirm(
            'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.'
        )
        if (confirmed) {
            // Implementar lógica de delete
            window.location.href = $(this).attr('href')
        }
    })

    // Melhorar acessibilidade
    $('[data-tooltip]').each(function () {
        $(this).attr('title', $(this).data('tooltip'))
    })

    // Atalhos de teclado
    $(document).keydown(function (e) {
        // Ctrl/Cmd + R para refresh
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 82) {
            if (window.location.href.includes('nihon-')) {
                e.preventDefault()
                location.reload()
            }
        }

        // Esc para fechar modals
        if (e.keyCode === 27) {
            $('.nihon-modal').fadeOut(300, function () {
                $(this).remove()
            })
        }
    })

    console.log('Nihon Auto Manager JS carregado com sucesso!')
})
