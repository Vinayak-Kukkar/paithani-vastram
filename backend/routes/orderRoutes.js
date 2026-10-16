import express from 'express';
import { DataStore } from '../data/store.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await DataStore.getOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const { items, customer, totalAmount, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }
    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ success: false, message: 'Customer name and phone number are required' });
    }

    const order = await DataStore.createOrder({
      items,
      customer,
      totalAmount: totalAmount || items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0),
      paymentMethod: paymentMethod || 'WHATSAPP_INQUIRY'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Paithani Vastram team will contact you shortly.',
      order
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Order placement failed' });
  }
});

// PATCH / PUT update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const updated = await DataStore.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order status updated successfully', order: updated });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

export default router;
