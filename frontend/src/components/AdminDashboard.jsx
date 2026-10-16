import React, { useState, useEffect } from 'react';
import { 
  IconClose, 
  IconTrash, 
  IconBag, 
  IconWhatsApp, 
  IconSearch, 
  IconShield, 
  IconUpload, 
  IconSparkles,
  IconCheck,
  IconAward,
  IconPrinter
} from './Icons';
import { useLanguage } from '../context/LanguageContext';
import CertificateModal from './CertificateModal';
import { apiUrl, resolveImageUrl } from '../config';

export default function AdminDashboard({
  isOpen,
  onClose,
  sarees = [],
  onRefreshSarees,
  onOpenUpload
}) {
  const { isMarathi, t, setLanguage } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('pv_admin_custom_pwd') || 'vastram2026';
  });
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password Change Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [pwdModalError, setPwdModalError] = useState('');

  // Admin tabs: 'inventory' | 'orders'
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [selectedCertOrder, setSelectedCertOrder] = useState(null);

  // Inventory Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Edit Saree State
  const [editingSaree, setEditingSaree] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editStockCount, setEditStockCount] = useState(1);
  const [editInStock, setEditInStock] = useState(true);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Status feedback toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch(apiUrl('/api/orders'));
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError('Failed to load customer orders.');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsAuthenticated(false);
      setPasscode('');
      setLoginError('');
      sessionStorage.removeItem('pv_admin_auth');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleClosePortal = () => {
    setIsAuthenticated(false);
    setPasscode('');
    setLoginError('');
    sessionStorage.removeItem('pv_admin_auth');
    onClose();
  };

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('pv_admin_auth', 'true');
      setLoginError('');
      fetchOrders();
    } else {
      setLoginError('Incorrect admin password. Please enter your custom personal password.');
    }
  };

  // Handle Change Password
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (currentPwdInput !== adminPassword) {
      setPwdModalError('Current password is incorrect.');
      return;
    }
    if (!newPwdInput || newPwdInput.trim().length < 4) {
      setPwdModalError('New password must be at least 4 characters long.');
      return;
    }
    if (newPwdInput !== confirmPwdInput) {
      setPwdModalError('New passwords do not match.');
      return;
    }

    localStorage.setItem('pv_admin_custom_pwd', newPwdInput.trim());
    setAdminPassword(newPwdInput.trim());
    setIsPasswordModalOpen(false);
    setCurrentPwdInput('');
    setNewPwdInput('');
    setConfirmPwdInput('');
    setPwdModalError('');
    showToast('🔑 Personal admin password updated successfully!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('pv_admin_auth');
    setPasscode('');
  };

  // Saree Actions
  const handleDeleteSaree = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from MongoDB Atlas?`)) {
      return;
    }

    try {
      const res = await fetch(apiUrl(`/api/sarees/${id}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`🗑️ Saree "${name}" deleted from MongoDB.`);
        if (onRefreshSarees) onRefreshSarees();
      } else {
        alert(data.message || 'Could not delete saree.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error communicating with server.');
    }
  };

  const handleToggleStock = async (saree) => {
    const id = saree.id || saree._id;
    const newStatus = !saree.inStock;
    try {
      const res = await fetch(apiUrl(`/api/sarees/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`📦 Stock status updated: ${newStatus ? 'In Stock' : 'Sold Out'}`);
        if (onRefreshSarees) onRefreshSarees();
      }
    } catch (err) {
      console.error('Stock toggle error:', err);
    }
  };

  const handleOpenEdit = (saree) => {
    setEditingSaree(saree);
    setEditPrice(saree.price || '');
    setEditOriginalPrice(saree.originalPrice || '');
    setEditStockCount(saree.stockCount || 1);
    setEditInStock(saree.inStock !== false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingSaree) return;
    setIsSavingEdit(true);
    const id = editingSaree.id || editingSaree._id;

    try {
      const res = await fetch(apiUrl(`/api/sarees/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: Number(editPrice),
          originalPrice: Number(editOriginalPrice),
          stockCount: Number(editStockCount),
          inStock: editInStock
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✨ Updated pricing & stock for "${editingSaree.name}"!`);
        setEditingSaree(null);
        if (onRefreshSarees) onRefreshSarees();
      } else {
        alert(data.message || 'Failed to update saree.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Error updating saree on server.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(apiUrl(`/api/orders/${orderId}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to "${newStatus}"!`);
        setOrders((prev) =>
          prev.map((o) => ((o._id === orderId || o.orderNumber === orderId) ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Order status update error:', err);
    }
  };

  // Filtered Sarees
  const filteredSarees = sarees.filter((saree) => {
    if (selectedCategory !== 'All' && saree.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = saree.name && saree.name.toLowerCase().includes(q);
      const matchMarathi = saree.marathiName && saree.marathiName.toLowerCase().includes(q);
      const matchColor = saree.color && saree.color.toLowerCase().includes(q);
      const matchMotif = saree.palluMotif && saree.palluMotif.toLowerCase().includes(q);
      return matchName || matchMarathi || matchColor || matchMotif;
    }
    return true;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const inStockCount = sarees.filter((s) => s.inStock).length;

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-container glass-panel animate-fade-in">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="admin-toast animate-fade-in">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="admin-login-card">
            <div className="admin-login-emblem">
              <img src="/logo.jpg" alt="Paithani Vastram" className="admin-emblem-img" />
            </div>
            <h2 className="font-display gold-text">Paithani Vastram Portal</h2>
            <p className="admin-login-sub font-serif">
              Master Weaver & Administrator Access Control
            </p>
            <span className="admin-restriction-pill">
              🔒 Admin Only • Customer Upload Restricted
            </span>

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group">
                <label className="admin-input-label">Enter Admin Passcode</label>
                <input
                  type="password"
                  className="input-royal"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                />
              </div>

              {loginError && <p className="admin-error-text">{loginError}</p>}

              <button type="submit" className="btn-gold admin-submit-btn">
                <span>Unlock Admin Dashboard &rarr;</span>
              </button>
            </form>

            <div className="admin-login-footer">
              <button className="text-link-btn" onClick={handleClosePortal}>
                &larr; Return to Customer Storefront
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="admin-dashboard-layout">
            {/* Top Admin Header */}
            <header className="admin-top-bar">
              <div className="admin-brand-info">
                <img src="/logo.jpg" alt="Logo" className="admin-header-logo" />
                <div>
                  <div className="admin-badge-row">
                    <span className="badge-silk">WEAVER CONSOLE</span>
                    <span className="badge-mongo">● MongoDB Atlas Online</span>
                  </div>
                  <h2 className="admin-header-title font-display">
                    Paithani Vastram <span className="gold-text">Admin Dashboard</span>
                  </h2>
                </div>
              </div>

              <div className="admin-header-actions">
                <div className="lang-toggle-pill" role="group" aria-label="Language Selector" style={{ marginRight: '6px' }}>
                  <button
                    type="button"
                    className={`lang-choice ${isMarathi ? 'active' : ''}`}
                    onClick={() => setLanguage('mr')}
                    title="मराठी"
                  >
                    मराठी
                  </button>
                  <button
                    type="button"
                    className={`lang-choice ${!isMarathi ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                    title="English"
                  >
                    EN
                  </button>
                </div>

                <button
                  className="btn-gold admin-upload-btn"
                  onClick={onOpenUpload}
                  title="Upload Saree directly to MongoDB Atlas"
                >
                  <IconUpload size={18} />
                  <span>{isMarathi ? '+ नवीन साडी जोडा' : '+ Upload New Saree'}</span>
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsPasswordModalOpen(true);
                    setPwdModalError('');
                  }}
                  title="Change your personal admin password"
                >
                  {isMarathi ? '🔑 पासवर्ड बदला' : '🔑 Change Password'}
                </button>

                <button
                  className="btn-secondary"
                  onClick={handleClosePortal}
                  title="Return to customer store"
                >
                  {isMarathi ? '👁️ दुकान दालन पहा' : '👁️ Storefront View'}
                </button>

                <button
                  className="admin-logout-btn"
                  onClick={handleLogout}
                  title="Lock dashboard"
                >
                  {isMarathi ? 'बाहेर पडा' : 'Log Out'}
                </button>
              </div>
            </header>

            {/* Quick Metrics Bar */}
            <div className="admin-metrics-row">
              <div className="metric-box glass-panel">
                <span className="metric-label">{isMarathi ? 'एकूण हातमाग साड्या' : 'Total Handloom Sarees'}</span>
                <span className="metric-value font-display gold-text">{sarees.length}</span>
                <span className="metric-sub">{inStockCount} {isMarathi ? 'शिल्लक उपलब्ध' : 'In Stock'}</span>
              </div>

              <div className="metric-box glass-panel">
                <span className="metric-label">{isMarathi ? 'नोंदवलेल्या ग्राहक ऑर्डर्स' : 'Customer Orders'}</span>
                <span className="metric-value font-display">{orders.length}</span>
                <span className="metric-sub">{isMarathi ? 'MongoDB Atlas मध्ये सुरक्षित' : 'Stored in MongoDB Atlas'}</span>
              </div>

              <div className="metric-box glass-panel">
                <span className="metric-label">{isMarathi ? 'एकूण विक्री मूल्य' : 'Gross Order Value'}</span>
                <span className="metric-value font-display gold-text">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className="metric-sub">{isMarathi ? 'थेट व COD विचारणा' : 'Direct & COD Inquiries'}</span>
              </div>

              <div className="metric-box glass-panel">
                <span className="metric-label">{isMarathi ? 'प्रवेश मर्यादा' : 'Access Policy'}</span>
                <span className="metric-value font-display" style={{ color: '#4ade80', fontSize: '1.25rem' }}>
                  ADMIN-ONLY
                </span>
                <span className="metric-sub">{isMarathi ? 'ग्राहक अपलोड पूर्णपणे बंद' : 'Customer Uploads Blocked'}</span>
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="admin-tabs-nav">
              <button
                className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setActiveTab('inventory')}
              >
                🥻 {isMarathi ? 'साड्यांचे व्यवस्थापन व साठा' : 'Saree Inventory & Catalog'} ({sarees.length})
              </button>
              <button
                className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('orders');
                  fetchOrders();
                }}
              >
                📦 {isMarathi ? 'थेट ग्राहक ऑर्डर्स' : 'Customer Orders'} ({orders.length})
              </button>
            </div>

            {/* TAB 1: INVENTORY MANAGEMENT */}
            {activeTab === 'inventory' && (
              <div className="admin-tab-content">
                {/* Search & Category Filter */}
                <div className="admin-controls-bar glass-panel">
                  <div className="admin-search-wrap">
                    <IconSearch size={18} className="search-icon" />
                    <input
                      type="text"
                      className="input-royal"
                      placeholder="Search saree by name, Marathi title, color, or motif..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                        <IconClose size={15} />
                      </button>
                    )}
                  </div>

                  <div className="admin-filter-wrap">
                    <select
                      className="select-filter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      <option value="Bridal">Bridal</option>
                      <option value="Pure Silk">Pure Silk</option>
                      <option value="Kadiyal">Kadiyal</option>
                      <option value="Brocade">Brocade</option>
                      <option value="Yeola Special">Yeola Special</option>
                    </select>

                    <button className="btn-gold" onClick={onOpenUpload}>
                      <IconUpload size={16} />
                      <span>Upload Saree</span>
                    </button>
                  </div>
                </div>

                {/* Sarees Table */}
                <div className="admin-table-container glass-panel">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Saree</th>
                        <th>Category</th>
                        <th>Color & Motif</th>
                        <th>Price (₹)</th>
                        <th>Stock Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSarees.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="admin-empty-table">
                            No sarees match your search or filter.
                          </td>
                        </tr>
                      ) : (
                        filteredSarees.map((saree) => {
                          const id = saree.id || saree._id;
                          return (
                            <tr key={id} className="admin-row">
                              <td className="td-saree-info">
                                <img
                                  src={resolveImageUrl(saree.images && saree.images[0] ? saree.images[0] : '/sarees/1000078648.jpg')}
                                  alt={saree.name}
                                  className="admin-saree-thumb"
                                />
                                <div className="admin-saree-names">
                                  <span className="admin-saree-name">{saree.name}</span>
                                  {saree.marathiName && (
                                    <span className="admin-saree-marathi font-devanagari">
                                      {saree.marathiName}
                                    </span>
                                  )}
                                  <span className="admin-saree-id">ID: {id}</span>
                                </div>
                              </td>

                              <td>
                                <span className="cat-badge">{saree.category}</span>
                              </td>

                              <td>
                                <div className="color-motif-cell">
                                  <div className="color-dot-name">
                                    <span
                                      className="color-dot"
                                      style={{ backgroundColor: saree.colorHex || '#d4af37' }}
                                    ></span>
                                    <span>{saree.color}</span>
                                  </div>
                                  <span className="motif-sub">{saree.palluMotif}</span>
                                </div>
                              </td>

                              <td className="td-price">
                                <div className="admin-price-cell">
                                  <span className="admin-current-price">
                                    ₹{saree.price ? saree.price.toLocaleString('en-IN') : 'N/A'}
                                  </span>
                                  {saree.originalPrice && saree.originalPrice > saree.price && (
                                    <span className="admin-mrp-price">
                                      MRP: ₹{saree.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td>
                                <button
                                  className={`stock-pill ${saree.inStock ? 'in-stock' : 'sold-out'}`}
                                  onClick={() => handleToggleStock(saree)}
                                  title="Click to toggle availability"
                                >
                                  {saree.inStock ? '● In Stock' : '✕ Sold Out'}
                                </button>
                              </td>

                              <td className="td-actions">
                                <button
                                  className="admin-action-btn edit-btn"
                                  onClick={() => handleOpenEdit(saree)}
                                  title="Edit price & stock"
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  className="admin-action-btn delete-btn"
                                  onClick={() => handleDeleteSaree(id, saree.name)}
                                  title="Delete from MongoDB"
                                >
                                  <IconTrash size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="admin-tab-content">
                <div className="admin-orders-header">
                  <h3 className="font-display">Recent Customer Orders ({orders.length})</h3>
                  <button className="btn-secondary" onClick={fetchOrders}>
                    🔄 Refresh Orders
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="admin-loading-state">Loading orders from MongoDB Atlas...</div>
                ) : orders.length === 0 ? (
                  <div className="admin-empty-state glass-panel">
                    <IconBag size={48} className="empty-icon" />
                    <h4 className="font-display">No Orders Placed Yet</h4>
                    <p>
                      Orders submitted by customers via WhatsApp Priority, Cash on Delivery (COD), or UPI
                      will appear here in real-time.
                    </p>
                    <button className="btn-gold" onClick={onClose} style={{ marginTop: '16px' }}>
                      Go to Store & Place Test Order
                    </button>
                  </div>
                ) : (
                  <div className="admin-orders-list">
                    {orders.map((order) => {
                      const orderId = order.orderNumber || order._id;
                      const customer = order.customer || {};
                      const items = order.items || [];
                      const createdDate = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Recent';

                      // WhatsApp direct chat URL
                      const cleanPhone = (customer.phone || '').replace(/\D/g, '');
                      const waLink = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                        `Namaste ${customer.name || 'Customer'}, regarding your Paithani Vastram order #${orderId}...`
                      )}`;

                      return (
                        <div key={orderId} className="admin-order-card glass-panel">
                          <div className="order-card-header">
                            <div>
                              <span className="order-num-badge">#{orderId}</span>
                              <span className="order-date">{createdDate}</span>
                            </div>

                            <div className="order-status-control">
                              <button
                                className="order-cert-pill-btn"
                                onClick={() => setSelectedCertOrder(order)}
                                title="View & print official Silk Mark Certificate & Royal Bill"
                              >
                                <IconAward size={14} />
                                <span>{isMarathi ? 'सिल्क मार्क प्रमाणपत्र' : 'Certificate & Bill'}</span>
                              </button>
                              <label className="status-label">Status:</label>
                              <select
                                className={`order-status-select status-${(order.status || 'Confirmed').toLowerCase()}`}
                                value={order.status || 'Confirmed'}
                                onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          <div className="order-card-body">
                            {/* Customer Details */}
                            <div className="order-customer-section">
                              <h5 className="section-title">Customer & Shipping</h5>
                              <p className="cust-name">
                                <strong>{customer.name || 'Unnamed Customer'}</strong>
                              </p>
                              <p className="cust-phone">
                                📞 {customer.phone || 'No phone'}
                                {cleanPhone && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="order-wa-btn"
                                    title="Open WhatsApp chat with buyer"
                                  >
                                    <IconWhatsApp size={14} />
                                    <span>WhatsApp Buyer</span>
                                  </a>
                                )}
                              </p>
                              <p className="cust-address">
                                📍 {customer.address}, {customer.city} - {customer.pincode}
                              </p>
                              {customer.notes && (
                                <p className="cust-notes">
                                  <em>Note: "{customer.notes}"</em>
                                </p>
                              )}
                              <div className="payment-pill">
                                Method: <strong>{order.paymentMethod || 'WHATSAPP_INQUIRY'}</strong>
                              </div>
                            </div>

                            {/* Ordered Items */}
                            <div className="order-items-section">
                              <h5 className="section-title">Ordered Weaves ({items.length})</h5>
                              <div className="ordered-items-scroll">
                                {items.map((it, idx) => (
                                  <div key={idx} className="ordered-item-row">
                                    <img
                                      src={resolveImageUrl(it.image || '/sarees/1000078648.jpg')}
                                      alt={it.name}
                                      className="ordered-item-img"
                                    />
                                    <div className="ordered-item-info">
                                      <span className="item-name">{it.name}</span>
                                      <span className="item-pricing">
                                        Qty: {it.quantity || 1} × ₹{(it.price || 0).toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                    <span className="item-subtotal">
                                      ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="order-total-bar">
                                <div>
                                  <span>Grand Total:</span>
                                  <span className="order-grand-total font-display gold-text" style={{ marginLeft: '8px' }}>
                                    ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <button
                                  className="btn-gold cert-action-btn"
                                  onClick={() => setSelectedCertOrder(order)}
                                  title="Print official Silk Mark Authenticity Certificate & Royal Invoice"
                                >
                                  <IconPrinter size={15} />
                                  <span>{isMarathi ? 'प्रमाणपत्र व बिल प्रिंट करा' : 'Print Certificate & Bill'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODAL: EDIT SAREE PRICING & STOCK */}
        {editingSaree && (
          <div className="edit-modal-backdrop" onClick={() => setEditingSaree(null)}>
            <div className="edit-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
              <div className="edit-modal-header">
                <h3 className="font-display">Edit Saree Details</h3>
                <button className="cart-close-btn" onClick={() => setEditingSaree(null)}>
                  <IconClose size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="edit-form">
                <div className="edit-saree-preview">
                  <img
                    src={resolveImageUrl(editingSaree.images && editingSaree.images[0] ? editingSaree.images[0] : '/sarees/1000078648.jpg')}
                    alt={editingSaree.name}
                    className="edit-thumb"
                  />
                  <div>
                    <h4>{editingSaree.name}</h4>
                    <span className="cat-badge">{editingSaree.category}</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="admin-input-label">Offer Price (₹)</label>
                    <input
                      type="number"
                      className="input-royal"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="admin-input-label">Original MRP (₹)</label>
                    <input
                      type="number"
                      className="input-royal"
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="admin-input-label">Stock Quantity</label>
                    <input
                      type="number"
                      className="input-royal"
                      value={editStockCount}
                      onChange={(e) => setEditStockCount(e.target.value)}
                      min="0"
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
                    <input
                      type="checkbox"
                      id="editStockCheck"
                      checked={editInStock}
                      onChange={(e) => setEditInStock(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold)' }}
                    />
                    <label htmlFor="editStockCheck" style={{ color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
                      Mark as In Stock
                    </label>
                  </div>
                </div>

                <div className="edit-modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setEditingSaree(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold" disabled={isSavingEdit}>
                    {isSavingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CHANGE ADMIN PASSWORD */}
        {isPasswordModalOpen && (
          <div className="edit-modal-backdrop" onClick={() => setIsPasswordModalOpen(false)}>
            <div className="edit-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
              <div className="edit-modal-header">
                <h3 className="font-display">🔐 Change Personal Admin Password</h3>
                <button className="cart-close-btn" onClick={() => setIsPasswordModalOpen(false)}>
                  <IconClose size={18} />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="edit-form">
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: '0 0 14px' }}>
                  Create your own personal password to lock and secure the Paithani Vastram Admin Portal.
                </p>

                <div className="form-group">
                  <label className="admin-input-label">Current Password</label>
                  <input
                    type="password"
                    className="input-royal"
                    placeholder="Enter current password"
                    value={currentPwdInput}
                    onChange={(e) => setCurrentPwdInput(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="admin-input-label">New Personal Password</label>
                  <input
                    type="password"
                    className="input-royal"
                    placeholder="Enter new strong password"
                    value={newPwdInput}
                    onChange={(e) => setNewPwdInput(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="admin-input-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="input-royal"
                    placeholder="Repeat new password"
                    value={confirmPwdInput}
                    onChange={(e) => setConfirmPwdInput(e.target.value)}
                    required
                  />
                </div>

                {pwdModalError && (
                  <p className="admin-error-text" style={{ textAlign: 'left', margin: '4px 0' }}>
                    {pwdModalError}
                  </p>
                )}

                <div className="edit-modal-actions" style={{ marginTop: '16px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsPasswordModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold">
                    Save New Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: SILK MARK CERTIFICATE & ROYAL INVOICE */}
        {selectedCertOrder && (
          <CertificateModal
            isOpen={Boolean(selectedCertOrder)}
            onClose={() => setSelectedCertOrder(null)}
            order={selectedCertOrder}
          />
        )}
      </div>

      {/* ADMIN DASHBOARD STYLES */}
      <style>{`
        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(10, 2, 14, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          overflow-y: auto;
          display: flex;
          justify-content: center;
          padding: 24px;
        }

        .admin-container {
          width: 100%;
          max-width: 1240px;
          background: #17041f;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 32px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
          margin: auto;
          min-height: 85vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .admin-toast {
          position: absolute;
          top: 20px;
          right: 24px;
          background: #10b981;
          color: #fff;
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.88rem;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
          z-index: 1000;
        }

        /* Login Card */
        .admin-login-card {
          max-width: 460px;
          margin: 60px auto;
          text-align: center;
          padding: 40px 30px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }

        .admin-login-emblem {
          margin-bottom: 16px;
        }

        .admin-emblem-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid var(--color-gold);
          object-fit: cover;
        }

        .admin-login-sub {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          margin-bottom: 16px;
        }

        .admin-restriction-pill {
          display: inline-block;
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .admin-input-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-gold-light);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-submit-btn {
          width: 100%;
          padding: 13px;
          font-size: 1rem;
          margin-top: 6px;
        }

        .admin-error-text {
          color: #f87171;
          font-size: 0.82rem;
          text-align: center;
        }

        .admin-login-footer {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }

        .text-link-btn {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.85rem;
          cursor: pointer;
        }

        .text-link-btn:hover {
          color: #fff;
        }

        .passcode-hint {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .passcode-hint code {
          color: var(--color-gold-light);
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Dashboard Header */
        .admin-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--color-border);
          flex-wrap: wrap;
          gap: 16px;
        }

        .admin-brand-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-header-logo {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 2px solid var(--color-gold);
          object-fit: cover;
        }

        .admin-badge-row {
          display: flex;
          gap: 8px;
          margin-bottom: 4px;
          align-items: center;
        }

        .badge-mongo {
          font-size: 0.72rem;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 2px 10px;
          border-radius: 20px;
          font-weight: 700;
        }

        .admin-header-title {
          font-size: 1.6rem;
          color: #fff;
          margin: 0;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .admin-upload-btn {
          padding: 10px 20px;
          font-size: 0.9rem;
        }

        .admin-logout-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--color-border);
          color: #f87171;
          padding: 9px 18px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .admin-logout-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: #f87171;
        }

        /* Metrics Bar */
        .admin-metrics-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }

        .metric-box {
          padding: 20px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
        }

        .metric-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
        }

        .metric-sub {
          font-size: 0.78rem;
          color: rgba(212, 175, 55, 0.8);
        }

        /* Tabs Nav */
        .admin-tabs-nav {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 24px;
        }

        .admin-tab-btn {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--color-text-muted);
          padding: 12px 20px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }

        .admin-tab-btn.active {
          color: var(--color-gold-light);
          border-bottom-color: var(--color-gold);
        }

        /* Controls Bar */
        .admin-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .admin-search-wrap {
          flex: 1;
          min-width: 280px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .admin-search-wrap .search-icon {
          position: absolute;
          left: 14px;
          color: var(--color-gold);
        }

        .admin-search-wrap input {
          padding-left: 42px;
        }

        .admin-filter-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Table Styles */
        .admin-table-container {
          overflow-x: auto;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .admin-table th {
          background: rgba(255, 255, 255, 0.04);
          padding: 14px 18px;
          color: var(--color-gold-light);
          font-weight: 700;
          border-bottom: 1px solid var(--color-border);
          text-transform: uppercase;
          font-size: 0.78rem;
          letter-spacing: 0.6px;
        }

        .admin-table td {
          padding: 16px 18px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.08);
          vertical-align: middle;
        }

        .admin-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .td-saree-info {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 260px;
        }

        .admin-saree-thumb {
          width: 60px;
          height: 75px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }

        .admin-saree-names {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .admin-saree-name {
          font-weight: 700;
          color: #fff;
          font-size: 0.92rem;
        }

        .admin-saree-marathi {
          color: var(--color-gold-light);
          font-size: 0.8rem;
        }

        .admin-saree-id {
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }

        .cat-badge {
          background: rgba(212, 175, 55, 0.12);
          color: var(--color-gold-light);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.76rem;
          font-weight: 600;
        }

        .color-motif-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .color-dot-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }

        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .motif-sub {
          font-size: 0.76rem;
          color: var(--color-text-muted);
        }

        .admin-price-cell {
          display: flex;
          flex-direction: column;
        }

        .admin-current-price {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-gold-light);
        }

        .admin-mrp-price {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-decoration: line-through;
        }

        .stock-pill {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: var(--transition);
        }

        .stock-pill.in-stock {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .stock-pill.sold-out {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .td-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-action-btn {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--color-border);
          transition: var(--transition);
        }

        .edit-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .edit-btn:hover {
          background: var(--color-gold);
          color: #1a0524;
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.25);
        }

        .delete-btn:hover {
          background: #ef4444;
          color: #fff;
        }

        .admin-empty-table {
          text-align: center;
          padding: 40px;
          color: var(--color-text-muted);
        }

        /* Orders View */
        .admin-orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .admin-orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-order-card {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
        }

        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.12);
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .order-num-badge {
          background: var(--color-gold-gradient);
          color: #1a0524;
          font-weight: 800;
          font-size: 0.85rem;
          padding: 4px 12px;
          border-radius: 12px;
          margin-right: 12px;
        }

        .order-date {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }

        .order-status-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-gold-light);
        }

        .order-status-select {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: #23082b;
          color: #fff;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .order-card-body {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 24px;
        }

        @media (max-width: 860px) {
          .order-card-body {
            grid-template-columns: 1fr;
          }
        }

        .section-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-gold-light);
          text-transform: uppercase;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .cust-name {
          font-size: 1.05rem;
          color: #fff;
          margin-bottom: 4px;
        }

        .cust-phone {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .order-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #25d366;
          color: #fff;
          padding: 3px 10px;
          border-radius: 14px;
          text-decoration: none;
          font-size: 0.76rem;
          font-weight: 700;
        }

        .cust-address {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .payment-pill {
          display: inline-block;
          font-size: 0.78rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          padding: 4px 10px;
          border-radius: 8px;
          color: #fff;
        }

        .ordered-items-scroll {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 220px;
          overflow-y: auto;
          margin-bottom: 14px;
        }

        .ordered-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .ordered-item-img {
          width: 50px;
          height: 60px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .ordered-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-name {
          font-size: 0.88rem;
          color: #fff;
          font-weight: 600;
        }

        .item-pricing {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }

        .item-subtotal {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-gold-light);
        }

        .order-total-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--color-border);
          font-size: 1rem;
          flex-wrap: wrap;
          gap: 12px;
        }

        .order-cert-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: var(--color-gold-light);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .order-cert-pill-btn:hover {
          background: var(--color-gold-gradient);
          color: #1a0520;
          transform: translateY(-1px);
        }

        .cert-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 0.82rem;
          border-radius: var(--radius-sm);
        }

        .order-grand-total {
          font-size: 1.3rem;
          font-weight: 800;
        }

        /* Edit Saree Modal */
        .edit-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100000;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .edit-modal-card {
          width: 100%;
          max-width: 500px;
          background: #190522;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 26px;
        }

        .edit-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .edit-saree-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--color-border);
        }

        .edit-thumb {
          width: 60px;
          height: 75px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .edit-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
