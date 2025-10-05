// api/order-webhook.js
// Tag Team Printing Order Webhook Handler
// Handles post-checkout order synchronization to Control Hub

import { sendOrderToControlHub, sendTicketToControlHub } from './control-hub-integration.js';

/**
 * Main webhook handler for Tag Team Printing orders
 * Called after successful checkout completion
 */
export default async function handler(req, res) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method Not Allowed - Use POST' 
        });
    }

    try {
        const { type, data } = req.body;

        switch (type) {
            case 'order.completed':
                return await handleOrderCompleted(req, res, data);
            
            case 'payment.succeeded':
                return await handlePaymentSucceeded(req, res, data);
            
            case 'support.ticket':
                return await handleSupportTicket(req, res, data);
            
            case 'order.updated':
                return await handleOrderUpdated(req, res, data);
                
            default:
                console.log(`⚠️ Unhandled webhook type: ${type}`);
                return res.status(200).json({ 
                    success: true, 
                    message: 'Webhook received but not processed',
                    type 
                });
        }

    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal webhook processing error',
            details: error.message 
        });
    }
}

/**
 * Handle completed order - sync to Control Hub
 */
async function handleOrderCompleted(req, res, orderData) {
    try {
        console.log('🛒 Processing completed Tag Team order:', orderData.id);

        // Validate required order data
        if (!orderData.id || !orderData.items || orderData.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid order data - missing id or items'
            });
        }

        // Sync to Control Hub
        const syncResult = await sendOrderToControlHub(orderData);

        if (syncResult.success) {
            console.log('✅ Tag Team order synced to Control Hub:', syncResult.controlHubOrderId);
            
            // Optionally trigger additional processes
            await triggerPostOrderProcesses(orderData, syncResult.controlHubOrderId);
            
            return res.status(200).json({
                success: true,
                message: 'Order successfully synced to Control Hub',
                controlHubOrderId: syncResult.controlHubOrderId
            });
        } else {
            // Log error but don't fail the webhook - order was still processed
            console.error('⚠️ Failed to sync to Control Hub, but order completed:', syncResult.error);
            
            return res.status(200).json({
                success: false,
                message: 'Order completed but Control Hub sync failed',
                error: syncResult.error,
                orderProcessed: true
            });
        }

    } catch (error) {
        console.error('❌ Error handling completed order:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process completed order',
            details: error.message
        });
    }
}

/**
 * Handle successful payment - may trigger immediate order sync
 */
async function handlePaymentSucceeded(req, res, paymentData) {
    try {
        console.log('💳 Payment succeeded for Tag Team order:', paymentData.orderId);

        // If order data is included with payment, sync immediately
        if (paymentData.orderData) {
            const syncResult = await sendOrderToControlHub(paymentData.orderData, paymentData);
            
            return res.status(200).json({
                success: true,
                message: 'Payment processed and order synced',
                controlHubOrderId: syncResult.controlHubOrderId
            });
        }

        // Otherwise, just acknowledge the payment
        return res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            paymentId: paymentData.payment?.id
        });

    } catch (error) {
        console.error('❌ Error handling payment success:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process payment success',
            details: error.message
        });
    }
}

/**
 * Handle support ticket creation
 */
async function handleSupportTicket(req, res, ticketData) {
    try {
        console.log('🎧 Creating support ticket for Tag Team:', ticketData.subject);

        const syncResult = await sendTicketToControlHub(ticketData);

        if (syncResult.success) {
            return res.status(200).json({
                success: true,
                message: 'Support ticket created in Control Hub',
                ticketId: syncResult.data.ticketId
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Failed to create support ticket',
                details: syncResult.error
            });
        }

    } catch (error) {
        console.error('❌ Error handling support ticket:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process support ticket',
            details: error.message
        });
    }
}

/**
 * Handle order updates (status changes, modifications)
 */
async function handleOrderUpdated(req, res, updateData) {
    try {
        console.log('📝 Order update received for Tag Team:', updateData.orderId);

        // For now, just log the update
        // In the future, you might want to sync status changes back to Control Hub
        console.log('Order update details:', updateData);

        return res.status(200).json({
            success: true,
            message: 'Order update received',
            orderId: updateData.orderId
        });

    } catch (error) {
        console.error('❌ Error handling order update:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process order update',
            details: error.message
        });
    }
}

/**
 * Trigger additional processes after successful order sync
 */
async function triggerPostOrderProcesses(orderData, controlHubOrderId) {
    try {
        // Potential post-order processes:
        
        // 1. Send confirmation email (if not already handled)
        // await sendOrderConfirmationEmail(orderData);
        
        // 2. Update inventory
        // await updateInventoryLevels(orderData.items);
        
        // 3. Notify production team for custom orders
        if (orderData.orderType === 'custom-design' || orderData.rushOrder) {
            console.log('🚨 Custom/Rush order - manual notification may be needed');
        }
        
        // 4. Schedule follow-up tasks
        // await scheduleOrderFollowUps(controlHubOrderId);
        
        console.log('✅ Post-order processes completed');

    } catch (error) {
        console.error('⚠️ Error in post-order processes (non-critical):', error);
        // Don't throw - these are supplementary processes
    }
}

/**
 * Validate webhook signature (for production security)
 */
function validateWebhookSignature(req) {
    // In production, implement webhook signature validation
    // const signature = req.headers['x-webhook-signature'];
    // const payload = JSON.stringify(req.body);
    // return verifySignature(payload, signature, process.env.WEBHOOK_SECRET);
    
    return true; // For development
}