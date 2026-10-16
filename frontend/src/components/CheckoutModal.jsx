import React, { useState, useEffect } from 'react';
import { IconClose, IconCheck, IconWhatsApp, IconShield, IconTruck, IconAward } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import CertificateModal from './CertificateModal';
import { apiUrl } from '../config';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  discountAmount,
  onOrderSuccess
}) {
  const { isMarathi, t } = useLanguage();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('WHATSAPP_INQUIRY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address || !customer.pincode) {
      setErrorMsg(isMarathi ? 'कृपया सर्व आवश्यक पत्ता व संपर्क माहिती भरा' : 'Please fill in all required shipping fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const orderPayload = {
        items: cartItems.map((item) => ({
          sareeId: item.id || item._id,
          name: isMarathi && item.marathiName ? item.marathiName : item.name,
          price: item.price,
          image: item.images && item.images[0] ? item.images[0] : '',
          quantity: item.quantity
        })),
        customer,
        totalAmount,
        paymentMethod
      };

      const res = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      setCreatedOrder(data.order);
      if (onOrderSuccess) onOrderSuccess();

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppConfirmation = () => {
    if (!createdOrder) return;
    const itemsText = createdOrder.items.map(i => `• ${i.name} (Qty: ${i.quantity})`).join('\n');
    const msg = encodeURIComponent(
      `👑 *PAITHANI VASTRAM ORDER CONFIRMATION*\n\nOrder ID: *${createdOrder.orderNumber}*\nCustomer: ${createdOrder.customer.name}\nPhone: ${createdOrder.customer.phone}\nAddress: ${createdOrder.customer.address}, ${createdOrder.customer.city} - ${createdOrder.customer.pincode}\n\n*Items Ordered:*\n${itemsText}\n\nTotal: *₹${createdOrder.totalAmount.toLocaleString('en-IN')}*\nPayment Method: ${createdOrder.paymentMethod}\n\nPlease dispatch my pure silk saree with Silk Mark certificate.`
    );
    window.open(`https://wa.me/917219120935?text=${msg}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkout-modal glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <h3 className="font-display gold-text checkout-heading">
            {createdOrder ? t('orderConfirmedTitle') : t('checkoutTitle')}
          </h3>
          <button className="checkout-close" onClick={onClose}>
            <IconClose size={20} />
          </button>
        </div>

        {createdOrder ? (
          <div className="order-success-screen">
            <div className="success-badge-icon">
              <IconCheck size={44} />
            </div>
            <h2 className="font-serif success-title">
              {isMarathi ? `धन्यवाद, ${createdOrder.customer.name}!` : `Dhanyavad! Thank you, ${createdOrder.customer.name}`}
            </h2>
            <p className="order-id-display">
              {isMarathi ? 'ऑर्डर क्रमांक:' : 'Order Number:'} <strong>{createdOrder.orderNumber}</strong>
            </p>
            <p className="success-desc">
              {t('orderSuccessMsg')}
            </p>

            <div className="order-summary-box">
              <div className="summary-row">
                <span>{isMarathi ? 'साड्या:' : 'Items:'}</span>
                <span>{createdOrder.items.length} {t('weavesCount')}</span>
              </div>
              <div className="summary-row">
                <span>{t('finalTotal')}</span>
                <strong>₹{createdOrder.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="summary-row">
                <span>{isMarathi ? 'डिलिव्हरी हमी:' : 'Delivery:'}</span>
                <span>{t('stat1Title')} • {t('stat3Title')}</span>
              </div>
            </div>

            <div className="success-actions">
              <button
                type="button"
                className="btn-gold full-width"
                onClick={() => setIsCertOpen(true)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <IconAward size={18} />
                <span>{isMarathi ? 'सिल्क मार्क प्रमाणपत्र व बिल पहा / प्रिंट करा' : 'View & Print Silk Mark Certificate / Bill'}</span>
              </button>
              <button className="btn-whatsapp full-width" onClick={handleWhatsAppConfirmation}>
                <IconWhatsApp size={20} />
                <span>{t('sendWhatsAppBtn')}</span>
              </button>
              <button className="btn-secondary full-width" onClick={onClose}>
                {isMarathi ? 'दालनाकडे परत जा' : 'Back to Paithani Vastram Gallery'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-grid">
              {/* Shipping info */}
              <div className="checkout-col">
                <h4 className="section-title">1. {t('customerInfo')}</h4>

                <div className="form-group">
                  <label className="field-label">{t('fullName')} *</label>
                  <input
                    type="text"
                    className="input-royal"
                    placeholder={t('fullNamePlaceholder')}
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label">{t('phone')} *</label>
                    <input
                      type="tel"
                      className="input-royal"
                      placeholder={t('phonePlaceholder')}
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">{t('email')}</label>
                    <input
                      type="email"
                      className="input-royal"
                      placeholder={t('emailPlaceholder')}
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">{t('address')} *</label>
                  <textarea
                    className="input-royal"
                    rows="2"
                    placeholder={t('addressPlaceholder')}
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label">{t('city')} *</label>
                    <input
                      type="text"
                      className="input-royal"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">{t('pincode')} *</label>
                    <input
                      type="text"
                      className="input-royal"
                      placeholder={t('pincodePlaceholder')}
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">{t('specialNotes')}</label>
                  <input
                    type="text"
                    className="input-royal"
                    placeholder={isMarathi ? 'उदा. लग्नाची तारीख / स्पेशल गिफ्ट बॉक्स पॅकिंग' : 'e.g. Please do custom Fall & Pico / Bridal gift box packaging'}
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Payment selection & Summary */}
              <div className="checkout-col">
                <h4 className="section-title">2. {t('paymentMethodTitle')}</h4>

                <div className="payment-options">
                  <label
                    className={`payment-card ${paymentMethod === 'WHATSAPP_INQUIRY' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('WHATSAPP_INQUIRY')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'WHATSAPP_INQUIRY'}
                      onChange={() => setPaymentMethod('WHATSAPP_INQUIRY')}
                    />
                    <div>
                      <div className="payment-label">{isMarathi ? 'व्हॉट्सॲप विणकर प्राधान्य ऑर्डर (शिफारस केलेले)' : 'WhatsApp Weaver Priority Order (Recommended)'}</div>
                      <div className="payment-sub">
                        {isMarathi ? 'साडीच्या पदराचे थेट व्हिडिओ कॉलवर दर्शन आणि सुरक्षित विणकर खात्यात पेमेंट.' : 'Direct video inspection of the saree pallu & secure UPI/Bank payment before dispatch.'}
                      </div>
                    </div>
                  </label>

                  <label
                    className={`payment-card ${paymentMethod === 'COD' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <div>
                      <div className="payment-label">{t('paymentCod')}</div>
                      <div className="payment-sub">{t('paymentCodDesc')}</div>
                    </div>
                  </label>

                  <label
                    className={`payment-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('UPI')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                    />
                    <div>
                      <div className="payment-label">{t('paymentUpi')}</div>
                      <div className="payment-sub">{t('paymentUpiDesc')}</div>
                    </div>
                  </label>
                </div>

                {/* Mini Summary */}
                <div className="checkout-summary-box">
                  <div className="summary-row">
                    <span>{isMarathi ? 'निवडलेल्या साड्या:' : 'Selected Sarees:'}</span>
                    <span>{cartItems.length} {t('weavesCount')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="summary-row discount-row">
                      <span>{t('discount')}</span>
                      <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>{t('stat3Title')}</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>{isMarathi ? 'मोफत' : 'FREE'}</span>
                  </div>
                  <div className="summary-row total-order-row">
                    <span>{t('finalTotal')}</span>
                    <span className="gold-text" style={{ fontSize: '1.3rem' }}>
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {errorMsg && <div className="error-banner">{errorMsg}</div>}

                <button type="submit" className="btn-gold full-width" disabled={isSubmitting}>
                  {isSubmitting ? (isMarathi ? 'ऑर्डर नोंदवत आहे...' : 'Securing Your Saree...') : `${t('placeOrderBtn')} • ₹${totalAmount.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          z-index: 99999;
          background: rgba(10, 2, 14, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow-y: auto;
          box-sizing: border-box;
          animation: fadeInBackdrop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .checkout-modal {
          width: 100%;
          max-width: 920px;
          max-height: 90vh;
          overflow-y: auto;
          background: #17041f;
          border-radius: var(--radius-lg);
          padding: 30px;
          border: 1px solid var(--color-border);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
        }
        .checkout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 24px;
        }
        .checkout-heading {
          font-size: 1.5rem;
        }
        .checkout-close {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--color-border);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        .checkout-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .section-title {
          font-size: 1rem;
          color: var(--color-gold-light);
          margin-bottom: 6px;
        }
        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .payment-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--color-border);
          cursor: pointer;
          transition: var(--transition);
        }
        .payment-card:hover {
          border-color: var(--color-gold);
          background: rgba(212, 175, 55, 0.08);
        }
        .payment-card.selected {
          border-color: var(--color-gold);
          background: rgba(212, 175, 55, 0.14);
        }
        .payment-card input {
          margin-top: 4px;
          accent-color: var(--color-gold);
        }
        .payment-label {
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
        }
        .payment-sub {
          font-size: 0.74rem;
          color: var(--color-text-muted);
          margin-top: 2px;
        }
        .checkout-summary-box {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.84rem;
          color: var(--color-text-muted);
        }
        .discount-row {
          color: #4ade80;
        }
        .total-order-row {
          border-top: 1px solid var(--color-border);
          padding-top: 10px;
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          align-items: center;
        }
        .full-width {
          width: 100%;
          padding: 14px;
        }
        .order-success-screen {
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .success-badge-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.2);
          border: 2px solid #22c55e;
          color: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .success-title {
          font-size: 1.8rem;
          color: #fff;
          margin-bottom: 8px;
        }
        .order-id-display {
          font-size: 1.1rem;
          color: var(--color-gold-light);
          margin-bottom: 12px;
        }
        .success-desc {
          max-width: 500px;
          color: var(--color-text-muted);
          font-size: 0.92rem;
          margin-bottom: 24px;
        }
        .order-summary-box {
          width: 100%;
          max-width: 480px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }
        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 400px;
        }

        @media (max-width: 800px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 550px) {
          .checkout-modal {
            padding: 16px 14px;
            border-radius: 14px;
            max-height: 94vh;
          }
          .checkout-heading {
            font-size: 1.15rem;
          }
          .checkout-header {
            margin-bottom: 16px;
            padding-bottom: 12px;
          }
          .checkout-close {
            width: 32px;
            height: 32px;
          }
          .payment-card {
            padding: 10px 12px;
          }
          .success-title {
            font-size: 1.4rem;
          }
          .order-id-display {
            font-size: 0.95rem;
          }
        }
      `}</style>

      {/* Silk Mark Certificate & Royal Bill Modal */}
      {isCertOpen && createdOrder && (
        <CertificateModal
          isOpen={isCertOpen}
          onClose={() => setIsCertOpen(false)}
          order={createdOrder}
        />
      )}
    </div>
  );
}
