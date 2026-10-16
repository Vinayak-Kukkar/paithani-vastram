import React, { useState } from 'react';
import { IconSearch, IconHeart, IconBag, IconUpload, IconClose } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  cartCount,
  cartTotal,
  setIsCartOpen,
  wishlistCount,
  setIsWishlistOpen,
  onOpenAdmin,
  selectedCategory,
  setSelectedCategory
}) {
  const { language, isMarathi, setLanguage, t, getCategoryName } = useLanguage();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const categories = ['All', 'Bridal', 'Pure Silk', 'Kadiyal', 'Brocade', 'Yeola Special'];

  return (
    <header className="sticky-nav">
      {/* Top Banner */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span>{t('announcement')}</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="main-navbar">
        <div className="container nav-container">
          {/* Brand Logo & Name */}
          <div className="brand-section" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
            <img src="/logo.jpg" alt="Paithani Vastram Emblem" className="brand-logo" />
            <div className="brand-titles">
              <span className="brand-marathi font-devanagari">पैठणी वस्त्रम</span>
              <h1 className="brand-english font-display gold-text">PAITHANI VASTRAM</h1>
              <span className="brand-tagline">{t('brandTagline')}</span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="search-bar-wrapper desktop-search">
            <IconSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                <IconClose size={15} />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="nav-actions">
            {/* Language Toggle Switch */}
            <div className="lang-toggle-pill" role="group" aria-label="Language Selector">
              <button
                type="button"
                className={`lang-choice ${isMarathi ? 'active' : ''}`}
                onClick={() => setLanguage('mr')}
                title="मराठी मध्ये पहा"
              >
                मराठी
              </button>
              <button
                type="button"
                className={`lang-choice ${!isMarathi ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                title="View in English"
              >
                EN
              </button>
            </div>

            {/* Admin Portal Button */}
            <button
              className="admin-portal-nav-btn"
              onClick={() => onOpenAdmin()}
              title="Paithani Vastram Weaver & Admin Portal"
            >
              <span className="admin-crown-icon">👑</span>
              <span className="admin-nav-text">{t('adminPortal')}</span>
            </button>

            {/* Wishlist Button */}
            <button
              className="icon-btn"
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
              title={t('savedSarees')}
            >
              <IconHeart size={21} filled={wishlistCount > 0} />
              {wishlistCount > 0 && <span className="counter-badge">{wishlistCount}</span>}
            </button>

            {/* Cart Button */}
            <button
              className="icon-btn cart-btn-pill"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              title={t('cartBag')}
            >
              <div className="cart-icon-wrap">
                <IconBag size={21} />
                {cartCount > 0 && <span className="counter-badge">{cartCount}</span>}
              </div>
              <span className="cart-total-pill">₹{cartTotal.toLocaleString('en-IN')}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (visible on screens <= 900px) */}
        <div className="mobile-search-container">
          <div className="container">
            <div className="search-bar-wrapper mobile-search-bar">
              <IconSearch size={16} className="search-icon" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <IconClose size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="category-strip">
          <div className="container category-container">
            <div className="category-scroll">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(18, 4, 22, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--color-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .announcement-bar {
          background: linear-gradient(90deg, #3d071a 0%, #1e0524 50%, #3d071a 100%);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          padding: 6px 0;
          font-size: 0.78rem;
          color: var(--color-gold-light);
          letter-spacing: 0.4px;
        }
        .announcement-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          text-align: center;
        }
        .separator {
          color: rgba(212, 175, 55, 0.4);
        }
        .main-navbar {
          padding-top: 10px;
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .brand-section {
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          user-select: none;
        }
        .brand-logo {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 2px solid var(--color-gold);
          box-shadow: 0 0 16px rgba(212, 175, 55, 0.4);
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .brand-section:hover .brand-logo {
          transform: scale(1.05) rotate(2deg);
        }
        .brand-titles {
          display: flex;
          flex-direction: column;
        }
        .brand-marathi {
          font-size: 0.76rem;
          color: var(--color-gold-light);
          letter-spacing: 1.5px;
        }
        .brand-english {
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: 2px;
          line-height: 1.1;
        }
        .brand-tagline {
          font-size: 0.62rem;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
        }
        .search-bar-wrapper {
          position: relative;
          flex: 1;
          max-width: 440px;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--color-gold);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 10px 38px 10px 42px;
          color: #fff;
          font-size: 0.88rem;
          outline: none;
          transition: var(--transition);
        }
        .search-input:focus {
          border-color: var(--color-gold);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.25);
        }
        .search-input::placeholder {
          color: rgba(200, 185, 207, 0.6);
          font-size: 0.84rem;
        }
        .clear-search-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lang-toggle-pill {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: var(--radius-full);
          padding: 3px;
          gap: 2px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
        }
        .lang-choice {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.76rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.5px;
        }
        .lang-choice:hover {
          color: var(--color-gold-light);
        }
        .lang-choice.active {
          background: var(--color-gold-gradient);
          color: #1a0520;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
        }
        .admin-portal-nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.35);
          color: var(--color-gold-light);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }
        .admin-portal-nav-btn:hover {
          background: var(--color-gold);
          color: #1a0524;
          border-color: var(--color-gold);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }
        .icon-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--color-border);
          color: var(--color-gold-light);
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }
        .icon-btn:hover {
          border-color: var(--color-gold);
          background: rgba(212, 175, 55, 0.15);
          transform: translateY(-2px);
        }
        .cart-btn-pill {
          width: auto;
          border-radius: var(--radius-full);
          padding: 0 16px 0 12px;
          gap: 8px;
        }
        .cart-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .cart-total-pill {
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
        }
        .counter-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: #e91e63;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 800;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(233, 30, 99, 0.5);
        }
        .category-strip {
          margin-top: 10px;
          border-top: 1px solid rgba(212, 175, 55, 0.12);
          padding: 8px 0;
        }
        .category-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .category-scroll::-webkit-scrollbar {
          display: none;
        }
        .cat-pill {
          white-space: nowrap;
          background: transparent;
          border: 1px solid transparent;
          color: var(--color-text-muted);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .cat-pill:hover {
          color: var(--color-gold-light);
          background: rgba(255, 255, 255, 0.05);
        }
        .cat-pill.active {
          background: rgba(212, 175, 55, 0.15);
          border-color: var(--color-gold);
          color: var(--color-gold-light);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.2);
        }
        .special-personal-pill {
          border-color: rgba(233, 30, 99, 0.4);
          color: #f48fb1;
          background: rgba(233, 30, 99, 0.08);
        }
        .special-personal-pill:hover {
          background: rgba(233, 30, 99, 0.2);
          color: #fff;
        }

        .mobile-search-container {
          display: none;
          padding: 4px 0 8px;
        }

        @media (max-width: 900px) {
          .desktop-search {
            display: none !important;
          }
          .mobile-search-container {
            display: block;
          }
          .mobile-search-bar {
            width: 100%;
            max-width: 100%;
            height: 38px;
          }
          .brand-english {
            font-size: 1.15rem;
          }
          .admin-nav-text {
            display: none;
          }
          .admin-portal-nav-btn {
            width: 36px;
            height: 36px;
            padding: 0;
            border-radius: 50%;
            justify-content: center;
          }
          .icon-btn {
            width: 36px;
            height: 36px;
          }
          .cart-total-pill {
            display: none;
          }
          .cart-btn-pill {
            padding: 0;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            justify-content: center;
          }
          .nav-actions {
            gap: 6px;
          }
          .lang-choice {
            padding: 3px 7px;
            font-size: 0.72rem;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding-left: 10px;
            padding-right: 10px;
          }
          .brand-logo {
            width: 36px;
            height: 36px;
          }
          .brand-marathi {
            font-size: 0.65rem;
          }
          .brand-english {
            font-size: 0.95rem;
            letter-spacing: 0.5px;
          }
          .brand-tagline {
            display: none;
          }
          .brand-section {
            gap: 8px;
          }
          .cat-pill {
            padding: 5px 12px;
            font-size: 0.78rem;
          }
          .announcement-bar {
            font-size: 0.7rem;
            padding: 4px 8px;
          }
        }
      `}</style>
    </header>
  );
}
