import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  saree: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Saree',
    required: false
  },
  sareeId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    items: [orderItemSchema],
    customer: {
      name: { type: String, required: true },
      email: { type: String, default: '' },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: 'Maharashtra' },
      pincode: { type: String, required: true },
      notes: { type: String, default: '' }
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'CARD', 'WHATSAPP_INQUIRY'],
      default: 'WHATSAPP_INQUIRY'
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'],
      default: 'Confirmed'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
