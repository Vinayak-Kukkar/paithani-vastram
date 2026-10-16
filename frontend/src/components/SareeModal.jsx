import React, { useState, useEffect } from 'react';
import { IconClose, IconBag, IconWhatsApp, IconHeart, IconShield, IconTruck, IconSparkles, IconCheck, IconStar } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { resolveImageUrl } from '../config';

export default function SareeModal({
  saree,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist
}) {
  const { isMarathi, t, getCategoryName, getMotifName } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
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
  }, [onClose]);

  if (!saree) return null;

  const imgSrc = resolveImageUrl(saree.images && saree.images.length > 0 ? saree.images[0] : '/sarees/1000078648.jpg');

  const discount = saree.originalPrice && saree.originalPrice > saree.price
    ? Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)
    : 0;

  const handleWhatsApp = () => {
    const titleText = isMarathi && saree.marathiName ? saree.marathiName : saree.name;
    const text = encodeURIComponent(
      `Namaste Paithani Vastram! I would like to order or inspect this authentic saree:\n\n*${titleText}*\nPrice: ₹${saree.price.toLocaleString('en-IN')}\nMotif: ${saree.palluMotif || 'Traditional'}\nCategory: ${saree.category}\n\nPlease share video consultation / order confirmation.`
    );
    window.open(`https://wa.me/917219120935?text=${text}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="saree-modal-box glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <IconClose size={20} />
        </button>

        <div className="modal-body-grid">
          {/* Left Column: Image with Zoom */}
          <div className="modal-media-col">
            <div
              className={`modal-img-wrap ${isZoomed ? 'zoomed' : ''}`}
              onClick={() => setIsZoomed(!isZoomed)}
              title="Click to Zoom In/Out"
            >
              <img src={imgSrc} alt={saree.name} className="modal-main-img" />
              <div className="zoom-hint">
                <span>{isZoomed ? t('zoomHintReset') : t('zoomHintZoom')}</span>
              </div>
            </div>

            {saree.isPersonalCollection && (
              <div className="personal-tag-banner">
                <IconCheck size={16} />
                <span>{t('personalVerified')}</span>
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="modal-info-col">
            <div className="modal-category-strip">
              <span className="badge-silk">{t('silkMarkLabel')}</span>
              <span className="badge-personal">{getCategoryName(saree.category)}</span>
            </div>

            {isMarathi ? (
              <>
                <h2 className="modal-saree-title font-devanagari" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {saree.marathiName || saree.name}
                </h2>
                <span className="modal-marathi" style={{ color: 'rgba(212, 175, 55, 0.8)', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
                  {saree.name}
                </span>
              </>
            ) : (
              <>
                {saree.marathiName && (
                  <span className="modal-marathi font-devanagari">{saree.marathiName}</span>
                )}
                <h2 className="modal-saree-title font-serif">{saree.name}</h2>
              </>
            )}

            <div className="modal-rating-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <IconStar key={i} size={15} />
                ))}
              </div>
              <span className="rating-score">{saree.rating || 4.9}</span>
              <span className="rating-reviews">({saree.reviewsCount || 34} {t('customerReviewsCount')})</span>
            </div>

            {/* Price Box */}
            <div className="modal-price-box">
              <div className="price-tag-wrap">
                <span className="modal-price">₹{saree.price.toLocaleString('en-IN')}</span>
                {saree.originalPrice && (
                  <span className="modal-original-price">₹{saree.originalPrice.toLocaleString('en-IN')}</span>
                )}
                {discount > 0 && (
                  <span className="modal-discount-pill">{discount}% {t('saveDiscount')}</span>
                )}
              </div>
              <span className="tax-inclusive-tag">{t('gstShippingFree')}</span>
            </div>

            {/* Description */}
            <p className="modal-description">
              {saree.description ||
                `Pure silk handwoven Paithani saree in mesmerizing ${saree.color}. Woven with timeless precision on traditional pit-looms, the rich zari pallu displays ${saree.palluMotif} alongside classic temple borders.`}
            </p>

            {/* Weave Specifications Table */}
            <div className="specs-table">
              <div className="spec-row">
                <span className="spec-label">{t('specFabric')}</span>
                <span className="spec-val">{saree.fabric || '100% Pure Mulberry Silk'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{t('specZari')}</span>
                <span className="spec-val">{saree.zariType || 'Pure Tested Gold Zari'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{t('specPallu')}</span>
                <span className="spec-val">{getMotifName(saree.palluMotif) || saree.palluMotif || 'Mor Bangadi'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{t('specBorder')}</span>
                <span className="spec-val">{saree.borderType || 'Zari Temple Border'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{t('specOrigin')}</span>
                <span className="spec-val">{saree.origin || 'Yeola, Maharashtra'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{t('specLength')}</span>
                <span className="spec-val">{t('specLengthVal')}</span>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="modal-actions-area">
              <div className="qty-picker">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="qty-num">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>

              <button
                className="btn-gold modal-add-bag-btn"
                onClick={() => {
                  onAddToCart(saree, quantity);
                  onClose();
                }}
              >
                <IconBag size={18} />
                <span>{t('addToBag')}</span>
              </button>

              <button
                className="btn-secondary modal-buy-now-btn"
                onClick={() => {
                  onBuyNow(saree, quantity);
                  onClose();
                }}
              >
                <span>{t('instantBuy')}</span>
              </button>

              <button
                className={`modal-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(saree)}
                aria-label="Wishlist"
              >
                <IconHeart size={20} filled={isWishlisted} />
              </button>
            </div>

            {/* Direct WhatsApp Ordering */}
            <button className="btn-whatsapp modal-whatsapp-btn" onClick={handleWhatsApp}>
              <IconWhatsApp size={18} />
              <span>{t('requestVideoCall')}</span>
            </button>

            {/* Trust Assurances */}
            <div className="modal-trust-strip">
              <div className="trust-item">
                <IconShield size={16} />
                <span>{t('stat1Title')}</span>
              </div>
              <div className="trust-item">
                <IconSparkles size={16} />
                <span>{t('stat2Title')}</span>
              </div>
              <div className="trust-item">
                <IconTruck size={16} />
                <span>{t('stat3Title')}</span>
              </div>
            </div>
          </div>
        </div>
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
        .saree-modal-box {
          position: relative;
          width: 100%;
          max-width: 1060px;
          max-height: 92vh;
          overflow-y: auto;
          background: #17041f;
          border-radius: var(--radius-lg);
          padding: 32px;
          border: 1px solid var(--color-border);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
        }
        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--color-border);
          color: #fff;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .modal-close-btn:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: var(--color-gold);
        }
        .modal-body-grid {
          display: grid;
          grid-template-columns: 460px 1fr;
          gap: 36px;
        }
        .modal-media-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .modal-img-wrap {
          position: relative;
          width: 100%;
          height: 520px;
          background: #100214;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: zoom-in;
          border: 1px solid var(--color-border);
        }
        .modal-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .modal-img-wrap.zoomed {
          cursor: zoom-out;
        }
        .modal-img-wrap.zoomed .modal-main-img {
          transform: scale(2.2);
          object-position: center;
        }
        .zoom-hint {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          color: var(--color-gold-light);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 600;
          pointer-events: none;
        }
        .personal-tag-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(124, 10, 43, 0.25);
          border: 1px solid rgba(124, 10, 43, 0.5);
          border-radius: var(--radius-sm);
          color: #fca5a5;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .modal-info-col {
          display: flex;
          flex-direction: column;
        }
        .modal-category-strip {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .modal-marathi {
          font-size: 0.86rem;
          color: var(--color-gold-light);
          margin-bottom: 4px;
        }
        .modal-saree-title {
          font-size: 1.85rem;
          color: #ffffff;
          line-height: 1.25;
          margin-bottom: 10px;
        }
        .modal-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .rating-score {
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
        }
        .rating-reviews {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }
        .modal-price-box {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 14px 18px;
          margin-bottom: 16px;
        }
        .price-tag-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }
        .modal-price {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
        }
        .modal-original-price {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.45);
          text-decoration: line-through;
        }
        .modal-discount-pill {
          background: var(--color-gold-gradient);
          color: #1a0520;
          font-weight: 800;
          font-size: 0.74rem;
          padding: 3px 9px;
          border-radius: var(--radius-full);
        }
        .tax-inclusive-tag {
          font-size: 0.76rem;
          color: #a7f3d0;
        }
        .modal-description {
          font-size: 0.92rem;
          color: #e2d7e8;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .specs-table {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--color-border);
          margin-bottom: 24px;
        }
        .spec-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          font-size: 0.84rem;
        }
        .spec-label {
          color: var(--color-gold-light);
          font-weight: 600;
        }
        .spec-val {
          color: #ffffff;
          font-weight: 500;
        }
        .modal-actions-area {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .qty-picker {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 4px 8px;
        }
        .qty-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          width: 32px;
          height: 32px;
          cursor: pointer;
        }
        .qty-num {
          padding: 0 10px;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .modal-add-bag-btn {
          flex: 1;
          padding: 12px 20px;
        }
        .modal-buy-now-btn {
          padding: 12px 20px;
        }
        .modal-wishlist-toggle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--color-border);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .modal-wishlist-toggle.active {
          color: #e91e63;
          border-color: #e91e63;
          background: rgba(233, 30, 99, 0.2);
        }
        .modal-whatsapp-btn {
          width: 100%;
          padding: 12px;
          margin-bottom: 20px;
        }
        .modal-trust-strip {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--radius-sm);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }
        .trust-item svg {
          color: var(--color-gold);
        }

        @media (max-width: 900px) {
          .modal-body-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .modal-img-wrap {
            height: 360px;
          }
          .saree-modal-box {
            padding: 20px 16px;
          }
        }

        @media (max-width: 550px) {
          .saree-modal-box {
            padding: 16px 12px;
            border-radius: 14px;
            max-height: 94vh;
          }
          .modal-close-btn {
            top: 10px;
            right: 10px;
            width: 32px;
            height: 32px;
          }
          .modal-img-wrap {
            height: 270px;
          }
          .modal-saree-title {
            font-size: 1.25rem;
            line-height: 1.3;
          }
          .modal-price {
            font-size: 1.5rem;
          }
          .modal-actions-area {
            flex-wrap: wrap;
            gap: 8px;
          }
          .qty-picker {
            order: 1;
            flex: 1;
            justify-content: space-between;
          }
          .modal-wishlist-toggle {
            order: 2;
            width: 40px;
            height: 40px;
          }
          .modal-add-bag-btn {
            order: 3;
            width: 100%;
            flex: none;
            justify-content: center;
          }
          .modal-buy-now-btn {
            order: 4;
            width: 100%;
            justify-content: center;
          }
          .spec-row {
            font-size: 0.78rem;
          }
        }
      `}</style>
    </div>
  );
}
