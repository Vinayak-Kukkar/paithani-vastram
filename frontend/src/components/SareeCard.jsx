import React from 'react';
import { IconHeart, IconBag, IconEye, IconWhatsApp, IconStar } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function SareeCard({
  saree,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) {
  const { isMarathi, t, getMotifName } = useLanguage();

  const discount = saree.originalPrice && saree.originalPrice > saree.price
    ? Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)
    : 0;

  const imgSrc = saree.images && saree.images.length > 0 ? saree.images[0] : '/sarees/1000078648.jpg';

  const handleWhatsAppInquiry = (e) => {
    e.stopPropagation();
    const titleText = isMarathi && saree.marathiName ? saree.marathiName : saree.name;
    const text = encodeURIComponent(
      `Namaste Paithani Vastram! I am interested in ordering this handwoven saree: *${titleText}* (Price: ₹${saree.price.toLocaleString('en-IN')}). Could you please share more details or confirm availability?`
    );
    window.open(`https://wa.me/917219120935?text=${text}`, '_blank');
  };

  return (
    <div className="saree-card glass-panel animate-fade-in" onClick={() => onQuickView(saree)}>
      {/* Top Media Section */}
      <div className="card-media">
        <img
          src={imgSrc}
          alt={saree.name}
          className="saree-img"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="media-badges">
          {saree.isPersonalCollection && (
            <span className="badge-personal">{t('personalBadge')}</span>
          )}
          {discount > 0 && (
            <span className="badge-discount">{discount}% {isMarathi ? 'सूट' : 'OFF'}</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(saree);
          }}
          aria-label="Wishlist"
        >
          <IconHeart size={18} filled={isWishlisted} />
        </button>

        {/* Quick View Hover Strip */}
        <div className="quick-view-strip">
          <button
            className="quick-view-action"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(saree);
            }}
          >
            <IconEye size={16} />
            <span>{t('quickView')}</span>
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="card-info">
        {isMarathi ? (
          <>
            <h3 className="card-title font-devanagari" style={{ fontSize: '1.06rem', fontWeight: 700 }}>
              {saree.marathiName || saree.name}
            </h3>
            <span className="card-marathi" style={{ fontSize: '0.76rem', color: 'rgba(212, 175, 55, 0.7)' }}>
              {saree.name}
            </span>
          </>
        ) : (
          <>
            {saree.marathiName && (
              <span className="card-marathi font-devanagari">{saree.marathiName}</span>
            )}
            <h3 className="card-title font-serif">{saree.name}</h3>
          </>
        )}

        {/* Motif & Fabric Pills */}
        <div className="card-pills">
          <span className="motif-pill">{getMotifName(saree.palluMotif) || saree.palluMotif || 'Traditional Pallu'}</span>
          <span className="fabric-pill">{t('pureSilk')}</span>
        </div>

        {/* Rating */}
        <div className="card-rating">
          <div className="stars">
            <IconStar size={14} />
            <span className="rating-val">{saree.rating || 4.9}</span>
          </div>
          <span className="rating-count">({saree.reviewsCount || 28} {t('verifiedReviews')})</span>
        </div>

        {/* Price Row */}
        <div className="card-price-row">
          <div className="price-stack">
            <span className="current-price">₹{saree.price.toLocaleString('en-IN')}</span>
            {saree.originalPrice && (
              <span className="original-price">₹{saree.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          <div className="card-btn-group">
            <button
              className="card-wa-btn"
              onClick={handleWhatsAppInquiry}
              title={t('whatsappInquire')}
            >
              <IconWhatsApp size={16} />
            </button>
            <button
              className="btn-gold card-add-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(saree);
              }}
            >
              <IconBag size={16} />
              <span>{t('addToBag')}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .saree-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          border-radius: var(--radius-md);
          background: rgba(28, 9, 36, 0.75);
        }
        .saree-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-gold);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.2);
        }
        .card-media {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #140417;
        }
        .saree-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .saree-card:hover .saree-img {
          transform: scale(1.08);
        }
        .media-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 2;
        }
        .badge-discount {
          background: var(--color-gold-gradient);
          color: #1a0520;
          font-weight: 800;
          font-size: 0.72rem;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .card-wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .card-wishlist-btn:hover {
          background: rgba(233, 30, 99, 0.3);
          border-color: #e91e63;
          transform: scale(1.1);
        }
        .card-wishlist-btn.active {
          background: rgba(233, 30, 99, 0.25);
          border-color: #e91e63;
          color: #e91e63;
        }
        .quick-view-strip {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px;
          background: linear-gradient(to top, rgba(15, 2, 18, 0.95), transparent);
          display: flex;
          justify-content: center;
          opacity: 0;
          transform: translateY(10px);
          transition: var(--transition);
        }
        .saree-card:hover .quick-view-strip {
          opacity: 1;
          transform: translateY(0);
        }
        .quick-view-action {
          background: rgba(212, 175, 55, 0.9);
          color: #1a0520;
          border: none;
          border-radius: var(--radius-full);
          padding: 7px 18px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }
        .card-info {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-marathi {
          font-size: 0.74rem;
          color: var(--color-gold-light);
          letter-spacing: 0.5px;
          margin-bottom: 3px;
        }
        .card-title {
          font-size: 1.05rem;
          color: #ffffff;
          line-height: 1.35;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
        .motif-pill {
          font-size: 0.72rem;
          padding: 2px 8px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 4px;
          color: var(--color-gold-light);
        }
        .fabric-pill {
          font-size: 0.72rem;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          color: var(--color-text-muted);
        }
        .card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }
        .stars {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .rating-val {
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
        }
        .rating-count {
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }
        .card-price-row {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(212, 175, 55, 0.12);
        }
        .price-stack {
          display: flex;
          flex-direction: column;
        }
        .current-price {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
        }
        .original-price {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.45);
          text-decoration: line-through;
        }
        .card-btn-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .card-wa-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.15);
          border: 1px solid rgba(37, 211, 102, 0.4);
          color: #25d366;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .card-wa-btn:hover {
          background: #25d366;
          color: #fff;
          transform: scale(1.08);
        }
        .card-add-btn {
          padding: 8px 14px;
          font-size: 0.82rem;
          gap: 5px;
        }

        @media (max-width: 480px) {
          .card-info {
            padding: 14px;
          }
          .card-title {
            font-size: 0.98rem;
            margin-bottom: 6px;
          }
          .current-price {
            font-size: 1.15rem;
          }
          .card-add-btn {
            padding: 7px 12px;
            font-size: 0.78rem;
          }
          .card-wa-btn {
            width: 32px;
            height: 32px;
          }
          .card-btn-group {
            gap: 4px;
          }
          .quick-view-strip {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
