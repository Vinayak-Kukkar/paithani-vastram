import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SareeCard from './components/SareeCard';
import SareeModal from './components/SareeModal';
import UploadModal from './components/UploadModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import HeritageStory from './components/HeritageStory';
import HeritageModal from './components/HeritageModal';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { IconFilter, IconSparkles } from './components/Icons';
import { useLanguage } from './context/LanguageContext';
import { apiUrl } from './config';

export default function App() {
  const { isMarathi, t, getColorName, getMotifName } = useLanguage();
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverWakingUp, setServerWakingUp] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedMotif, setSelectedMotif] = useState('All');
  const [sortOption, setSortOption] = useState('featured');
  const [onlyPersonal, setOnlyPersonal] = useState(false);

  // Modals & Drawers
  const [selectedSaree, setSelectedSaree] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isHeritageOpen, setIsHeritageOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return window.location.hash === '#admin';
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [isSharedBastaView, setIsSharedBastaView] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Cart & Wishlist with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('pv_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('pv_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pv_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('pv_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Fetch sarees from Backend API
  const fetchSarees = async () => {
    let wakeTimer;
    try {
      setLoading(true);
      setError(null);
      setServerWakingUp(false);

      // Render free tier cold-start detector
      wakeTimer = setTimeout(() => {
        setServerWakingUp(true);
      }, 3500);

      const res = await fetch(apiUrl('/api/sarees'));
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSarees(data.data);
      } else {
        throw new Error('Invalid sarees response');
      }
    } catch (err) {
      console.error('Error loading sarees from backend:', err);
      setError('Could not connect to backend server. If using Render free tier, please wait ~45s for the server to wake up and click Retry.');
    } finally {
      clearTimeout(wakeTimer);
      setServerWakingUp(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSarees();
  }, []);

  // Deep-link handler: read ?basta= or ?trousseau= or ?saree= from URL
  useEffect(() => {
    if (!sarees || sarees.length === 0) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const bastaParam = params.get('basta') || params.get('trousseau');
      const sareeParam = params.get('saree');

      if (bastaParam) {
        const targetIds = bastaParam
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
        const matched = sarees.filter((s) => {
          const sId = (s.id || s._id)?.toString();
          return targetIds.includes(sId);
        });

        if (matched.length > 0) {
          setWishlist((prev) => {
            const existingIds = new Set(
              prev.map((i) => (i.id || i._id)?.toString())
            );
            const toAdd = matched.filter(
              (m) => !existingIds.has((m.id || m._id)?.toString())
            );
            return [...prev, ...toAdd];
          });
          setIsSharedBastaView(true);
          setIsWishlistOpen(true);
        }
      } else if (sareeParam) {
        const found = sarees.find(
          (s) => (s.id || s._id)?.toString() === sareeParam.trim()
        );
        if (found) {
          setSelectedSaree(found);
        }
      }
    } catch (e) {
      console.error('Error handling basta/saree query params:', e);
    }
  }, [sarees]);

  // Cart Operations
  const handleAddToCart = (saree, qty = 1) => {
    setCart((prev) => {
      const sareeId = saree.id || saree._id;
      const existing = prev.find((item) => (item.id || item._id) === sareeId);
      if (existing) {
        return prev.map((item) =>
          (item.id || item._id) === sareeId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...saree, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => ((item.id || item._id) === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => (item.id || item._id) !== id));
  };

  // Wishlist Operations
  const handleToggleWishlist = (saree) => {
    const sareeId = saree.id || saree._id;
    setWishlist((prev) => {
      const exists = prev.some((item) => (item.id || item._id) === sareeId);
      if (exists) {
        return prev.filter((item) => (item.id || item._id) !== sareeId);
      }
      return [...prev, saree];
    });
  };

  const handleMoveToCart = (saree) => {
    handleAddToCart(saree, 1);
    setWishlist((prev) => prev.filter((item) => (item.id || item._id) !== (saree.id || saree._id)));
    setIsWishlistOpen(false);
  };

  const handleMoveAllToCart = (items = []) => {
    if (!items || items.length === 0) return;
    setCart((prev) => {
      let updatedCart = [...prev];
      items.forEach((saree) => {
        const sareeId = saree.id || saree._id;
        const existing = updatedCart.find((item) => (item.id || item._id) === sareeId);
        if (existing) {
          updatedCart = updatedCart.map((item) =>
            (item.id || item._id) === sareeId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart.push({ ...saree, quantity: 1 });
        }
      });
      return updatedCart;
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  const handleBuyNow = (saree, qty = 1) => {
    handleAddToCart(saree, qty);
    setCheckoutTotal(saree.price * qty);
    setCheckoutDiscount(0);
    setIsCheckoutOpen(true);
  };

  const handleProceedCheckout = (total, discount) => {
    setCheckoutTotal(total);
    setCheckoutDiscount(discount);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCart([]);
  };

  const handleSareeAdded = (newSaree) => {
    setSarees((prev) => [newSaree, ...prev]);
    setSelectedSaree(newSaree);
  };

  // Filter & Sort Logic
  const filteredSarees = sarees.filter((saree) => {
    if (onlyPersonal && !saree.isPersonalCollection) return false;

    if (selectedCategory !== 'All' && saree.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    if (selectedColor !== 'All') {
      const col = selectedColor.toLowerCase();
      if (!saree.color || !saree.color.toLowerCase().includes(col)) return false;
    }

    if (selectedMotif !== 'All') {
      const motif = selectedMotif.toLowerCase();
      if (!saree.palluMotif || !saree.palluMotif.toLowerCase().includes(motif)) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = saree.name && saree.name.toLowerCase().includes(q);
      const matchMarathi = saree.marathiName && saree.marathiName.toLowerCase().includes(q);
      const matchColor = saree.color && saree.color.toLowerCase().includes(q);
      const matchMotif = saree.palluMotif && saree.palluMotif.toLowerCase().includes(q);
      const matchDesc = saree.description && saree.description.toLowerCase().includes(q);
      if (!matchName && !matchMarathi && !matchColor && !matchMotif && !matchDesc) return false;
    }

    return true;
  });

  // Sort
  const sortedSarees = [...filteredSarees].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // featured default
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const colorsList = ['All', 'Pink', 'Green', 'Red', 'Purple', 'Blue', 'Gold', 'Orange'];
  const motifsList = ['All', 'Mor Bangadi', 'Popat Maina', 'Asavali'];

  return (
    <div className="paithani-app">
      {/* Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        setIsCartOpen={setIsCartOpen}
        wishlistCount={wishlist.length}
        setIsWishlistOpen={setIsWishlistOpen}
        onOpenAdmin={() => setIsAdminOpen(true)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Hero Section */}
      <Hero
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onHeritageClick={() => setIsHeritageOpen(true)}
      />

      {/* Saree Catalog Main Section */}
      <main id="catalog-section" className="container catalog-section">
        {/* Section Header */}
        <div className="catalog-header-wrap">
          <div className="catalog-headings">
            <span className="badge-silk">{t('catalogBadge')}</span>
            <h2 className={`catalog-title ${isMarathi ? 'font-devanagari' : 'font-display'}`} style={{ lineHeight: isMarathi ? '1.35' : '1.2' }}>
              {t('catalogTitlePrefix')} <span className="gold-text">{t('catalogTitleGold')}</span>
            </h2>
            <p className="catalog-desc">
              {t('catalogDesc')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge-silk">{t('trustBadge1')}</span>
            <span className="badge-silk">{t('trustBadge2')}</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="filter-toolbar glass-panel">
          {/* Colors Filter */}
          <div className="filter-group">
            <span className="filter-label">{t('filterColor')}</span>
            <div className="color-pills-row">
              {colorsList.map((col) => (
                <button
                  key={col}
                  className={`color-filter-btn ${selectedColor === col ? 'active' : ''}`}
                  onClick={() => setSelectedColor(col)}
                >
                  {getColorName(col)}
                </button>
              ))}
            </div>
          </div>

          {/* Motif Filter */}
          <div className="filter-group">
            <span className="filter-label">{t('filterMotif')}</span>
            <select
              className="select-filter"
              value={selectedMotif}
              onChange={(e) => setSelectedMotif(e.target.value)}
            >
              {motifsList.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? t('allMotifs') : getMotifName(m)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="filter-group">
            <span className="filter-label">{t('filterSort')}</span>
            <select
              className="select-filter"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="price-low">{t('sortPriceLow')}</option>
              <option value="price-high">{t('sortPriceHigh')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
          </div>

          {/* Personal Filter Toggle */}
          <label className="personal-toggle-label">
            <input
              type="checkbox"
              checked={onlyPersonal}
              onChange={(e) => setOnlyPersonal(e.target.checked)}
            />
            <span>{t('filterPersonalOnly')}</span>
          </label>
        </div>

        {/* Sarees Count & Active Badges */}
        <div className="catalog-meta-row">
          <span className="results-count">
            {t('showingCount')} <strong>{sortedSarees.length}</strong> {t('authenticSareesCount')}
          </span>

          {(selectedCategory !== 'All' || selectedColor !== 'All' || selectedMotif !== 'All' || searchQuery) && (
            <button
              className="btn-secondary clear-filters-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedColor('All');
                setSelectedMotif('All');
                setSearchQuery('');
                setOnlyPersonal(false);
              }}
            >
              {t('clearFilters')}
            </button>
          )}
        </div>

        {/* Loading / Error / Sarees Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{isMarathi ? 'पैठणी वस्त्रम साड्या लोड होत आहेत...' : 'Loading Paithani Vastram Weaves...'}</p>
            {serverWakingUp && (
              <p style={{ fontSize: '0.88rem', color: '#f3a847', marginTop: '8px', maxWidth: '420px', lineHeight: 1.4 }}>
                {isMarathi
                  ? '⏳ क्लाउड सर्व्हर सुरू होत आहे (Render फ्री सर्व्हर सुरुवातीस ~४५ सेकंद घेऊ शकतो)...'
                  : '⏳ Connecting to cloud backend (Render free tier may take ~45s on first wake)...'}
              </p>
            )}
          </div>
        ) : error ? (
          <div className="error-state glass-panel">
            <p>{error}</p>
            <button className="btn-gold" onClick={fetchSarees} style={{ marginTop: '14px' }}>
              {isMarathi ? 'पुन्हा प्रयत्न करा' : 'Retry Loading Sarees'}
            </button>
          </div>
        ) : sortedSarees.length === 0 ? (
          <div className="empty-catalog-state glass-panel">
            <IconSparkles size={48} className="empty-sparkle" />
            <h3 className="font-display">{t('emptyTitle')}</h3>
            <p>{t('emptyDesc')}</p>
            <button
              className="btn-gold"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedColor('All');
                setSelectedMotif('All');
                setSearchQuery('');
                setOnlyPersonal(false);
              }}
              style={{ marginTop: '16px' }}
            >
              {t('emptyResetBtn')}
            </button>
          </div>
        ) : (
          <div className="sarees-grid">
            {sortedSarees.map((saree) => (
              <SareeCard
                key={saree.id || saree._id}
                saree={saree}
                onQuickView={(s) => setSelectedSaree(s)}
                onAddToCart={(s) => handleAddToCart(s, 1)}
                isWishlisted={wishlist.some(
                  (item) => (item.id || item._id) === (saree.id || saree._id)
                )}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </main>

      {/* Heritage Story Section */}
      <HeritageStory />

      {/* Footer */}
      <Footer
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Quick View / Detail Modal */}
      {selectedSaree && (
        <SareeModal
          saree={selectedSaree}
          onClose={() => setSelectedSaree(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isWishlisted={wishlist.some(
            (item) => (item.id || item._id) === (selectedSaree.id || selectedSaree._id)
          )}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.pushState(null, '', window.location.pathname);
          }
        }}
        sarees={sarees}
        onRefreshSarees={fetchSarees}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Saree Studio Upload Modal (Admin-Triggered Only) */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSareeAdded={handleSareeAdded}
        existingSarees={sarees}
      />

      {/* 2,000-Year Heritage Story Modal */}
      <HeritageModal
        isOpen={isHeritageOpen}
        onClose={() => setIsHeritageOpen(false)}
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={handleProceedCheckout}
      />

      {/* Wishlist / Bridal Trousseau Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveFromWishlist={(id) =>
          setWishlist((prev) => prev.filter((item) => (item.id || item._id) !== id))
        }
        onMoveToCart={handleMoveToCart}
        onMoveAllToCart={handleMoveAllToCart}
        onSelectSaree={(saree) => {
          setSelectedSaree(saree);
          setIsWishlistOpen(false);
        }}
        isSharedView={isSharedBastaView}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        totalAmount={checkoutTotal}
        discountAmount={checkoutDiscount}
        onOrderSuccess={handleOrderSuccess}
      />

      <style>{`
        .catalog-section {
          padding: 60px 24px 80px;
        }
        .catalog-header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .catalog-title {
          font-size: 2.5rem;
          color: #fff;
          margin-top: 8px;
          margin-bottom: 8px;
        }
        .catalog-desc {
          color: var(--color-text-muted);
          font-size: 0.98rem;
          max-width: 620px;
        }
        .studio-cta-btn {
          padding: 12px 24px;
        }
        .filter-toolbar {
          padding: 16px 20px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .filter-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-gold-light);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .color-pills-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .color-filter-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .color-filter-btn:hover {
          color: #fff;
          border-color: var(--color-gold);
        }
        .color-filter-btn.active {
          background: var(--color-gold-gradient);
          color: #1a0520;
          border-color: transparent;
          font-weight: 700;
        }
        .select-filter {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--color-border);
          color: #fff;
          padding: 7px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          outline: none;
          cursor: pointer;
        }
        .select-filter option {
          background: #1e0524;
          color: #fff;
        }
        .personal-toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.84rem;
          color: var(--color-gold-light);
          cursor: pointer;
          margin-left: auto;
        }
        .personal-toggle-label input {
          accent-color: var(--color-gold);
          width: 16px;
          height: 16px;
        }
        .catalog-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .results-count {
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }
        .results-count strong {
          color: var(--color-gold-light);
        }
        .clear-filters-btn {
          padding: 6px 14px;
          font-size: 0.78rem;
        }
        .sarees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }
        .loading-state,
        .empty-catalog-state,
        .error-state {
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: var(--radius-md);
        }
        .empty-sparkle {
          color: var(--color-gold);
          margin-bottom: 16px;
        }
        .spinner {
          width: 44px;
          height: 44px;
          border: 3px solid rgba(212, 175, 55, 0.2);
          border-top-color: var(--color-gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .catalog-header-wrap {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          .catalog-title {
            font-size: 1.8rem;
          }
          .filter-toolbar {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            padding: 16px;
          }
          .filter-group {
            width: 100%;
          }
          .color-pills-row {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 6px;
            -webkit-overflow-scrolling: touch;
          }
          .color-pills-row::-webkit-scrollbar {
            display: none;
          }
          .select-filter {
            width: 100%;
          }
          .personal-toggle-label {
            margin-left: 0;
            padding-top: 4px;
          }
          .sarees-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        @media (max-width: 480px) {
          .catalog-title {
            font-size: 1.55rem;
          }
          .catalog-desc {
            font-size: 0.88rem;
          }
          .catalog-meta-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
