import React, { useState } from 'react';
import { IconClose, IconTrash, IconBag, IconCheck, IconShield, IconWhatsApp } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { resolveImageUrl } from '../config';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout
}) {
  const { isMarathi, t, getColorName } = useLanguage();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'VASTRAM10') {
      setDiscountPercent(10);
      setCouponMessage(isMarathi ? '✨ १०% शाही सूट यशस्वीपणे लागू झाली!' : '✨ Royal 10% Discount Applied Successfully!');
    } else if (couponCode.trim().toUpperCase() === 'SHAHI20') {
      setDiscountPercent(20);
      setCouponMessage(isMarathi ? '👑 २०% विशेष सूट लागू झाली!' : '👑 Shahi 20% Privilege Discount Applied!');
    } else {
      setCouponMessage(isMarathi ? '❌ अवैध कुपन कोड. "VASTRAM10" वापरून पहा.' : '❌ Invalid coupon. Try "VASTRAM10"');
    }
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <IconBag size={22} className="cart-title-icon" />
            <h3 className="cart-title font-display">{t('royalBagTitle')}</h3>
            <span className="cart-items-count">({cartItems.length} {t('weavesCount')})</span>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            <IconClose size={20} />
          </button>
        </div>

        {/* Free Shipping Alert */}
        <div className="cart-perk-banner">
          <IconShield size={16} />
          <span>{t('stat1Title')} • {t('stat3Title')}</span>
        </div>

        {/* Items List */}
        <div className="cart-items-scroll">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <IconBag size={48} className="empty-bag-icon" />
              <h4 className="font-display">{t('emptyCartTitle')}</h4>
              <p>{t('emptyCartDesc')}</p>
              <button className="btn-gold" onClick={onClose} style={{ marginTop: '16px' }}>
                {t('exploreCatalog')}
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id || item._id} className="cart-item-row">
                <img
                  src={resolveImageUrl(item.images && item.images[0] ? item.images[0] : '/sarees/1000078648.jpg')}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <h4 className="cart-item-title font-serif">
                    {isMarathi && item.marathiName ? item.marathiName : item.name}
                  </h4>
                  <span className="cart-item-color">{t('filterColor')} {getColorName(item.color)}</span>
                  <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>

                  <div className="cart-item-controls">
                    <div className="cart-qty-toggle">
                      <button
                        onClick={() => onUpdateQuantity(item.id || item._id, item.quantity - 1)}
                        className="qty-arrow"
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id || item._id, item.quantity + 1)}
                        className="qty-arrow"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="cart-remove-btn"
                      onClick={() => onRemoveItem(item.id || item._id)}
                      title="Remove from bag"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <input
                type="text"
                placeholder={t('couponPlaceholder')}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button type="submit" className="coupon-btn">
                {t('applyBtn')}
              </button>
            </form>
            {couponMessage && (
              <span className={`coupon-msg ${discountPercent > 0 ? 'success' : 'error'}`}>
                {couponMessage}
              </span>
            )}

            {/* Calculations */}
            <div className="price-summary-breakdown">
              <div className="summary-line">
                <span>{t('subtotal')}</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-line discount-line">
                  <span>{t('discount')} ({discountPercent}%)</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="summary-line">
                <span>{t('stat3Title')}</span>
                <span className="free-text">{isMarathi ? 'मोफत' : 'FREE'}</span>
              </div>
              <div className="summary-line total-line">
                <span>{t('finalTotal')}</span>
                <span className="final-price">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="cart-wa-order-hint">
              <IconWhatsApp size={16} />
              <span>
                {isMarathi
                  ? 'कोणतीही साडी ऑर्डर करण्यासाठी कृपया व्हॉट्सअ‍ॅपवर संपर्क साधा'
                  : 'If you have to order any saree, please order via WhatsApp'}
              </span>
            </div>

            <button
              className="btn-gold cart-checkout-btn"
              onClick={() => {
                onClose();
                onProceedCheckout(finalTotal, discountAmount);
              }}
            >
              <span>{t('proceedCheckout')}</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .cart-backdrop {
          position: fixed;
          inset: 0;
          z-index: 210;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: flex-end;
        }
        .cart-drawer {
          width: 100%;
          max-width: 440px;
          height: 100%;
          background: #17041f;
          border-left: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.8);
        }
        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--color-border);
        }
        .cart-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cart-title-icon {
          color: var(--color-gold);
        }
        .cart-title {
          font-size: 1.25rem;
          color: #fff;
        }
        .cart-items-count {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }
        .cart-close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--color-border);
          color: #fff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-perk-banner {
          background: rgba(212, 175, 55, 0.1);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          padding: 8px 16px;
          font-size: 0.76rem;
          color: var(--color-gold-light);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cart-items-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px;
        }
        .empty-bag-icon {
          color: rgba(212, 175, 55, 0.3);
          margin-bottom: 16px;
        }
        .cart-item-row {
          display: flex;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }
        .cart-item-img {
          width: 80px;
          height: 100px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }
        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .cart-item-title {
          font-size: 0.95rem;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .cart-item-color {
          font-size: 0.74rem;
          color: var(--color-text-muted);
        }
        .cart-item-price {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-gold-light);
          margin-top: 4px;
          margin-bottom: 8px;
        }
        .cart-item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .cart-qty-toggle {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
        }
        .qty-arrow {
          background: none;
          border: none;
          color: #fff;
          width: 26px;
          height: 26px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .qty-value {
          padding: 0 8px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .cart-remove-btn {
          background: none;
          border: none;
          color: #f87171;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.2s;
        }
        .cart-remove-btn:hover {
          transform: scale(1.15);
        }
        .cart-footer {
          padding: 20px 24px;
          background: rgba(14, 2, 17, 0.95);
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .coupon-form {
          display: flex;
          gap: 8px;
        }
        .coupon-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          color: #fff;
          font-size: 0.82rem;
          outline: none;
        }
        .coupon-btn {
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid var(--color-gold);
          color: var(--color-gold-light);
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .coupon-msg {
          font-size: 0.74rem;
        }
        .coupon-msg.success {
          color: #4ade80;
        }
        .coupon-msg.error {
          color: #f87171;
        }
        .price-summary-breakdown {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
          padding-top: 10px;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.84rem;
          color: var(--color-text-muted);
        }
        .discount-line {
          color: #4ade80;
        }
        .free-text {
          color: #34d399;
          font-weight: 700;
        }
        .total-line {
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          padding-top: 8px;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
        }
        .final-price {
          font-size: 1.25rem;
          color: var(--color-gold-light);
        }
        .cart-checkout-btn {
          width: 100%;
          padding: 14px;
        }

        @media (max-width: 480px) {
          .cart-drawer {
            width: 100vw;
            max-width: 100vw;
          }
          .cart-header {
            padding: 14px 16px;
          }
          .cart-items-scroll {
            padding: 14px;
          }
          .cart-footer {
            padding: 14px 16px;
          }
          .coupon-row {
            flex-direction: column;
            gap: 8px;
          }
          .coupon-input {
            width: 100%;
          }
          .apply-coupon-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
