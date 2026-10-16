import React, { useState } from 'react';
import {
  IconClose,
  IconHeart,
  IconBag,
  IconTrash,
  IconWhatsApp,
  IconShare,
  IconCopy,
  IconCheck,
  IconSparkles,
  IconEye
} from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { getFullImageUrl } from '../config';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems = [],
  onRemoveFromWishlist,
  onMoveToCart,
  onMoveAllToCart,
  onSelectSaree,
  isSharedView = false
}) {
  const { isMarathi, t, getColorName, getMotifName } = useLanguage();
  const [copyToast, setCopyToast] = useState('');

  if (!isOpen) return null;

  const totalBastaValue = wishlistItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0),
    0
  );

  const getShareUrl = () => {
    const ids = wishlistItems
      .map((item) => item.id || item._id)
      .filter(Boolean)
      .join(',');
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('basta', ids);
    return url.toString();
  };

  const handleShareWhatsApp = () => {
    if (wishlistItems.length === 0) return;
    const shareUrl = getShareUrl();
    const totalFormatted = totalBastaValue.toLocaleString('en-IN');

    let msg = isMarathi
      ? `👑 *पैठणी वस्त्रम - लग्नाचा बस्ता (BRIDAL TROUSSEAU)*\n\n` +
        `सस्नेह नमस्कार! आम्ही विवाहासाठी येवला विणकरांच्या अस्सल हातमाग पैठणी साड्यांची निवड केली आहे:\n\n`
      : `👑 *PAITHANI VASTRAM - BRIDAL TROUSSEAU (लग्नाचा बस्ता)*\n\n` +
        `Namaste! We have shortlisted these authentic handloom Paithani sarees for our wedding trousseau:\n\n`;

    wishlistItems.forEach((item, index) => {
      const title = isMarathi && item.marathiName ? item.marathiName : item.name;
      const price = (Number(item.price) || 0).toLocaleString('en-IN');
      const color = getColorName(item.color);
      const motif = getMotifName(item.palluMotif);
      msg += `${index + 1}. *${title}* - ₹${price}\n   • ${t('filterColor')}: ${color} | ${t('filterMotif')}: ${motif}\n\n`;
    });

    msg += isMarathi
      ? `━━━━━━━━━━━━━━━━━━━━\n` +
        `✨ *एकूण निवडलेल्या साड्या:* ${wishlistItems.length}\n` +
        `💎 *बस्ता अंदाजे एकूण मूल्य:* ₹${totalFormatted}\n` +
        `🏛️ *खात्री:* सिल्क मार्क प्रमाणित १००% शुद्ध रेशीम व २४ कॅरेट टेस्टेड जरी (येवला विणकर)\n\n` +
        `👉 *आमचा संपूर्ण निवडलेला बस्ता पाहण्यासाठी खालील लिंकवर क्लिक करा:*\n${shareUrl}\n\n` +
        `कृपया साड्या पाहून तुमची पसंती नक्की कळवा! 🙏`
      : `━━━━━━━━━━━━━━━━━━━━\n` +
        `✨ *Total Sarees Shortlisted:* ${wishlistItems.length}\n` +
        `💎 *Total Trousseau Value:* ₹${totalFormatted}\n` +
        `🏛️ *Hallmark:* Silk Mark Certified 100% Pure Mulberry Silk & 24K Tested Zari (Yeola Weavers)\n\n` +
        `👉 *View & explore our complete shortlisted basta online:*\n${shareUrl}\n\n` +
        `Please review and let us know your favorite! 🙏`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (wishlistItems.length === 0) return;
    const shareUrl = getShareUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopyToast(t('linkCopiedToast'));
        setTimeout(() => setCopyToast(''), 3500);
      });
    } else {
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopyToast(t('linkCopiedToast'));
      setTimeout(() => setCopyToast(''), 3500);
    }
  };

  const handleMoveAll = () => {
    if (onMoveAllToCart && wishlistItems.length > 0) {
      onMoveAllToCart(wishlistItems);
      setCopyToast(t('moveAllSuccess'));
      setTimeout(() => setCopyToast(''), 3000);
    }
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div
        className="cart-drawer glass-panel animate-fade-in trousseau-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Notification */}
        {copyToast && (
          <div className="trousseau-toast animate-fade-in">
            <IconCheck size={18} className="toast-check-icon" />
            <span>{copyToast}</span>
          </div>
        )}

        {/* Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <div className="trousseau-icon-circle">
              <IconHeart size={20} filled={true} />
            </div>
            <div>
              <div className="trousseau-badge-top">{t('bridalTrousseauBadge')}</div>
              <h3 className="cart-title font-display">{t('wishlistTitle')}</h3>
            </div>
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close Wishlist">
            <IconClose size={20} />
          </button>
        </div>

        {/* Shared Trousseau Banner if opened from family link */}
        {isSharedView && (
          <div className="shared-trousseau-alert">
            <IconSparkles size={18} className="shared-alert-sparkle" />
            <div>
              <strong>{t('sharedBastaViewing')}</strong>
              <p>{t('sharedBastaViewingSub')}</p>
            </div>
          </div>
        )}

        {/* Subtitle / Cultural Context */}
        {wishlistItems.length > 0 && (
          <div className="trousseau-subbar">
            <p className="trousseau-subtitle">{t('trousseauSubtitle')}</p>
          </div>
        )}

        {/* Items List */}
        <div className="cart-items-scroll">
          {wishlistItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-heart-ring">
                <IconHeart size={48} className="empty-bag-icon" />
              </div>
              <h4 className="font-display">{t('emptyWishlistTitle')}</h4>
              <p>{t('emptyWishlistDesc')}</p>
              <button className="btn-gold" onClick={onClose} style={{ marginTop: '20px' }}>
                {t('exploreCatalog')}
              </button>
            </div>
          ) : (
            wishlistItems.map((item, index) => (
              <div key={item.id || item._id || index} className="cart-item-row trousseau-item-row">
                <div
                  className="cart-item-img-wrap"
                  onClick={() => onSelectSaree && onSelectSaree(item)}
                  title="View Saree Details"
                >
                  <img
                    src={getFullImageUrl(
                      item.images && item.images[0]
                        ? item.images[0]
                        : '/sarees/1000078648.jpg'
                    )}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="img-hover-hint">
                    <IconEye size={16} />
                  </div>
                </div>

                <div className="cart-item-details">
                  <h4
                    className="cart-item-title font-serif clickable-title"
                    onClick={() => onSelectSaree && onSelectSaree(item)}
                  >
                    {isMarathi && item.marathiName ? item.marathiName : item.name}
                  </h4>

                  <div className="trousseau-tags-row">
                    <span className="trousseau-tag">
                      {getColorName(item.color)}
                    </span>
                    {item.palluMotif && (
                      <span className="trousseau-tag-motif">
                        {getMotifName(item.palluMotif)}
                      </span>
                    )}
                  </div>

                  <div className="cart-item-price-row">
                    <div className="cart-item-price">
                      ₹{(Number(item.price) || 0).toLocaleString('en-IN')}
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="cart-item-orig-price">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="cart-item-controls">
                    <button
                      className="btn-gold"
                      style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                      onClick={() => onMoveToCart(item)}
                    >
                      <IconBag size={14} />
                      <span>{t('moveToBag')}</span>
                    </button>
                    <button
                      className="cart-remove-btn"
                      onClick={() => onRemoveFromWishlist(item.id || item._id)}
                      title="Remove from trousseau"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Trousseau Summary & WhatsApp Sharing Actions */}
        {wishlistItems.length > 0 && (
          <div className="trousseau-footer">
            {/* Investment Summary */}
            <div className="trousseau-summary-box">
              <div className="summary-left">
                <span className="summary-label">{t('trousseauEstValue')}</span>
                <span className="summary-sub">
                  ({wishlistItems.length} {t('weavesCount')}) • Silk Mark 100% Pure Silk
                </span>
              </div>
              <div className="summary-total font-display">
                ₹{totalBastaValue.toLocaleString('en-IN')}
              </div>
            </div>

            <p className="trousseau-share-hint font-serif">{t('trousseauShareHint')}</p>

            {/* Sharing Action Buttons */}
            <div className="trousseau-actions-grid">
              {/* WhatsApp Share Button */}
              <button
                className="btn-whatsapp trousseau-btn-wa"
                onClick={handleShareWhatsApp}
                title="Share bridal collection on WhatsApp"
              >
                <IconWhatsApp size={19} />
                <span>{t('shareBastaWhatsApp')}</span>
              </button>

              {/* Copy Link Button */}
              <button
                className="btn-outline-gold trousseau-btn-copy"
                onClick={handleCopyLink}
                title="Copy sharable link to clipboard"
              >
                <IconCopy size={16} />
                <span>{t('copyBastaLink')}</span>
              </button>

              {/* Move All to Bag Button */}
              <button
                className="btn-gold trousseau-btn-all"
                onClick={handleMoveAll}
                title="Add all shortlisted sarees to royal bag"
              >
                <IconBag size={16} />
                <span>{t('moveAllToBag')}</span>
              </button>
            </div>
          </div>
        )}

        <style>{`
          .trousseau-drawer {
            max-width: 480px;
            position: relative;
          }
          .trousseau-badge-top {
            font-size: 0.65rem;
            font-weight: 700;
            color: var(--color-gold-light);
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          .trousseau-icon-circle {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(233, 30, 99, 0.15);
            border: 1px solid rgba(233, 30, 99, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .trousseau-subbar {
            padding: 8px 24px 12px;
            background: rgba(0, 0, 0, 0.25);
            border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          }
          .trousseau-subtitle {
            font-size: 0.78rem;
            color: var(--color-text-muted);
            margin: 0;
            line-height: 1.4;
          }
          .shared-trousseau-alert {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(124, 10, 43, 0.25) 100%);
            border-bottom: 1px solid rgba(212, 175, 55, 0.4);
            color: #fff;
          }
          .shared-trousseau-alert strong {
            font-size: 0.85rem;
            color: var(--color-gold-light);
            display: block;
          }
          .shared-trousseau-alert p {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            margin: 2px 0 0;
          }
          .shared-alert-sparkle {
            color: var(--color-gold);
            flex-shrink: 0;
          }
          .trousseau-toast {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            background: #1f0827;
            border: 1px solid var(--color-gold);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 10px 20px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.82rem;
            white-space: nowrap;
          }
          .toast-check-icon {
            color: #4ade80;
          }
          .cart-item-img-wrap {
            position: relative;
            cursor: pointer;
            border-radius: var(--radius-sm);
            overflow: hidden;
            flex-shrink: 0;
          }
          .cart-item-img-wrap:hover .img-hover-hint {
            opacity: 1;
          }
          .img-hover-hint {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-gold);
            opacity: 0;
            transition: var(--transition);
          }
          .clickable-title {
            cursor: pointer;
            transition: var(--transition);
          }
          .clickable-title:hover {
            color: var(--color-gold-light);
          }
          .trousseau-tags-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin: 4px 0 6px;
          }
          .trousseau-tag {
            font-size: 0.7rem;
            padding: 2px 8px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.06);
            color: var(--color-text-muted);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .trousseau-tag-motif {
            font-size: 0.7rem;
            padding: 2px 8px;
            border-radius: 4px;
            background: rgba(212, 175, 55, 0.1);
            color: var(--color-gold-light);
            border: 1px solid rgba(212, 175, 55, 0.25);
          }
          .cart-item-price-row {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 8px;
          }
          .cart-item-orig-price {
            font-size: 0.8rem;
            color: var(--color-text-muted);
            text-decoration: line-through;
          }
          .trousseau-footer {
            padding: 20px 24px 24px;
            border-top: 1px solid var(--color-border);
            background: rgba(15, 3, 20, 0.95);
          }
          .trousseau-summary-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: rgba(212, 175, 55, 0.08);
            border: 1px solid rgba(212, 175, 55, 0.25);
            border-radius: var(--radius-sm);
            margin-bottom: 12px;
          }
          .summary-left {
            display: flex;
            flex-direction: column;
          }
          .summary-label {
            font-size: 0.82rem;
            color: var(--color-text-muted);
          }
          .summary-sub {
            font-size: 0.7rem;
            color: var(--color-gold);
          }
          .summary-total {
            font-size: 1.35rem;
            font-weight: 700;
            color: var(--color-gold-light);
          }
          .trousseau-share-hint {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            text-align: center;
            margin: 0 0 14px;
            font-style: italic;
          }
          .trousseau-actions-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .trousseau-btn-wa {
            width: 100%;
            padding: 12px 18px;
            font-size: 0.92rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .trousseau-btn-copy,
          .trousseau-btn-all {
            width: 100%;
            padding: 10px 16px;
            font-size: 0.84rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .empty-heart-ring {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(233, 30, 99, 0.08);
            border: 1px dashed rgba(233, 30, 99, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          @media (max-width: 480px) {
            .trousseau-drawer {
              max-width: 100vw;
              width: 100vw;
            }
            .cart-header {
              padding: 14px 16px;
            }
            .trousseau-subbar {
              padding: 8px 16px 10px;
            }
            .cart-items-scroll {
              padding: 14px;
            }
            .trousseau-footer {
              padding: 14px 16px;
            }
            .summary-total {
              font-size: 1.15rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
