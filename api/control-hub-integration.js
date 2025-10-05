// api/control-hub-integration.js
// Tag Team Printing -> Control Hub Integration

import fetch from 'node-fetch';

const CONTROL_HUB_API = process.env.CONTROL_HUB_API || 'http://localhost:4000';
const CONTROL_HUB_API_KEY = process.env.CONTROL_HUB_API_KEY || 'control-hub-secure-key-2025';

/**
 * Send Tag Team order to Control Hub backend
 * Called after successful Square payment
 */
export async function sendOrderToControlHub(orderData, paymentData = null) {
    try {
        // Transform Tag Team order to Control Hub TagTeamOrder format
        const controlHubOrder = {
            orderId: `TTP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            customerId: orderData.customer?.id || `GUEST-${Date.now()}`,
            customerInfo: {
                name: orderData.customer?.name || orderData.billingDetails?.name || 'Guest Customer',
                email: orderData.customer?.email || orderData.billingDetails?.email,
                phone: orderData.customer?.phone || orderData.billingDetails?.phone,
                company: orderData.customer?.company || null
            },
            orderType: determineOrderType(orderData),
            items: orderData.items?.map(item => ({
                productId: item.id || item.sku,
                name: item.name,
                description: item.description || '',
                quantity: parseInt(item.quantity) || 1,
                unitPrice: parseFloat(item.price) || 0,
                totalPrice: parseFloat(item.price) * parseInt(item.quantity) || 0,
                customizations: item.customizations || {},
                printingDetails: {
                    printMethod: item.printMethod || 'screen-print',
                    colors: item.colors || [],
                    placement: item.placement || 'front',
                    size: item.size || 'standard'
                }
            })) || [],
            pricing: {
                subtotal: parseFloat(orderData.subtotal) || 0,
                shipping: parseFloat(orderData.shipping) || 0,
                tax: parseFloat(orderData.tax) || 0,
                total: parseFloat(orderData.total) || 0,
                discount: parseFloat(orderData.discount) || 0
            },
            shippingAddress: orderData.shippingAddress || orderData.billingDetails?.address || {},
            billingAddress: orderData.billingDetails?.address || orderData.shippingAddress || {},
            orderNotes: orderData.notes || '',
            rushOrder: orderData.rushOrder || false,
            approvalRequired: orderData.approvalRequired || false,
            status: 'pending-production',
            orderSource: 'tag-team-website',
            mockupRequested: orderData.mockupRequested || false,
            mockupApproved: orderData.mockupApproved || false,
            // Add payment info if provided
            ...(paymentData && {
                paymentInfo: {
                    paymentId: paymentData.payment?.id,
                    amount: paymentData.payment?.amount_money?.amount,
                    currency: paymentData.payment?.amount_money?.currency || 'USD',
                    status: paymentData.payment?.status,
                    method: 'square',
                    processedAt: new Date().toISOString()
                }
            })
        };

        // Send to Control Hub
        const response = await fetch(`${CONTROL_HUB_API}/api/tagteam/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CONTROL_HUB_API_KEY
            },
            body: JSON.stringify(controlHubOrder)
        });

        if (!response.ok) {
            throw new Error(`Control Hub API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Order synced to Control Hub:', result.order?.orderId);
        
        return {
            success: true,
            controlHubOrderId: result.order?.orderId,
            data: result
        };

    } catch (error) {
        console.error('❌ Failed to sync order to Control Hub:', error);
        
        // Log to file for retry later (optional)
        await logFailedSync(orderData, error);
        
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Determine order type based on items and requirements
 */
function determineOrderType(orderData) {
    const items = orderData.items || [];
    const hasCustomDesign = items.some(item => item.customDesign || item.uploadedArt);
    const isWholesale = orderData.wholesale || (items.reduce((sum, item) => sum + item.quantity, 0) >= 50);
    const hasRushRequirement = orderData.rushOrder;

    if (isWholesale) return 'wholesale';
    if (hasCustomDesign) return 'custom-design';
    if (hasRushRequirement) return 'rush-order';
    return 'standard';
}

/**
 * Log failed syncs for retry mechanism
 */
async function logFailedSync(orderData, error) {
    try {
        const logEntry = {
            timestamp: new Date().toISOString(),
            orderData,
            error: error.message,
            retryCount: 0
        };
        
        // In production, you might want to write to a database or file
        console.log('📝 Logged failed sync for retry:', logEntry);
        
    } catch (logError) {
        console.error('Failed to log sync error:', logError);
    }
}

/**
 * Send customer service ticket to Control Hub
 */
export async function sendTicketToControlHub(ticketData) {
    try {
        const controlHubTicket = {
            ticketId: `TTP-TICKET-${Date.now()}`,
            customerId: ticketData.customerId || 'GUEST',
            customerInfo: {
                name: ticketData.customerName,
                email: ticketData.customerEmail,
                phone: ticketData.customerPhone
            },
            category: ticketData.category || 'general',
            priority: ticketData.priority || 'medium',
            subject: ticketData.subject,
            description: ticketData.description,
            source: 'tag-team-website',
            status: 'open',
            attachments: ticketData.attachments || []
        };

        const response = await fetch(`${CONTROL_HUB_API}/api/support/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CONTROL_HUB_API_KEY
            },
            body: JSON.stringify(controlHubTicket)
        });

        const result = await response.json();
        return { success: response.ok, data: result };

    } catch (error) {
        console.error('Failed to send ticket to Control Hub:', error);
        return { success: false, error: error.message };
    }
}

export default { sendOrderToControlHub, sendTicketToControlHub };