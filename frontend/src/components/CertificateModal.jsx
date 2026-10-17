import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconClose, IconPrinter, IconCheck, IconShield, IconAward, IconWhatsApp } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function CertificateModal({ isOpen, onClose, order }) {
  const { isMarathi: globalIsMarathi } = useLanguage();
  // Allow toggling language directly inside certificate for the printed copy
  const [certLang, setCertLang] = useState(globalIsMarathi ? 'mr' : 'en');
  const isMr = certLang === 'mr';

  useEffect(() => {
    setCertLang(globalIsMarathi ? 'mr' : 'en');
  }, [globalIsMarathi]);

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

  if (!isOpen || !order) return null;

  const orderId = order.orderNumber || order._id || `PV-${Date.now().toString().slice(-6)}`;
  const certNumber = `SM-PV-${orderId.replace(/[^a-zA-Z0-9]/g, '')}-MH`;
  const customer = order.customer || {};
  const items = order.items || [];
  const totalAmount = order.totalAmount || items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="modal-backdrop certificate-modal-backdrop" onClick={onClose}>
      <div className="certificate-modal-shell glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Controls Toolbar (Hidden in Print) */}
        <div className="cert-toolbar no-print">
          <div className="cert-toolbar-info">
            <IconAward size={22} className="gold-icon" />
            <span className="cert-toolbar-title font-display">
              {isMr ? 'सिल्क मार्क अस्सलता प्रमाणपत्र व बिल' : 'Silk Mark Authenticity Certificate & Invoice'}
            </span>
            <span className="cert-order-tag">#{orderId}</span>
          </div>

          <div className="cert-toolbar-actions">
            {/* Certificate Language Switcher */}
            <div className="cert-lang-pill">
              <button
                type="button"
                className={`cert-lang-opt ${isMr ? 'active' : ''}`}
                onClick={() => setCertLang('mr')}
                title="मराठीत प्रमाणपत्र"
              >
                मराठी
              </button>
              <button
                type="button"
                className={`cert-lang-opt ${!isMr ? 'active' : ''}`}
                onClick={() => setCertLang('en')}
                title="English Certificate"
              >
                EN
              </button>
            </div>

            {/* Print / Save PDF Button */}
            <button className="btn-gold cert-print-btn" onClick={handlePrint} title="Print or save as PDF">
              <IconPrinter size={18} />
              <span>{isMr ? 'प्रिंट / PDF जतन करा' : 'Print / Save PDF'}</span>
            </button>

            {/* Close */}
            <button className="cert-close-btn" onClick={onClose} aria-label="Close">
              <IconClose size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="cert-scroll-area">
          {/* THE ROYAL PRINTABLE PARCHMENT */}
          <div className="royal-parchment-sheet printable-content">
            {/* Ornate Gold Border Envelope */}
            <div className="parchment-border-frame">
              {/* Corner Ornaments */}
              <div className="corner-ornament top-left">🦚</div>
              <div className="corner-ornament top-right">🦚</div>
              <div className="corner-ornament bottom-left">🌿</div>
              <div className="corner-ornament bottom-right">🌿</div>

              {/* Header: Logo, Silk Mark & Royal Titles */}
              <header className="parchment-header">
                <div className="header-seal-block">
                  <div className="silk-mark-badge-graphic">
                    <span className="silk-mark-butterfly">🦋</span>
                    <span className="silk-mark-text">SILK MARK</span>
                    <span className="silk-mark-sub">GOVT. APPROVED</span>
                  </div>

                  <div className="brand-crest">
                    <span className="royal-crown">👑</span>
                    <h1 className="brand-title font-display">PAITHANI VASTRAM</h1>
                    <p className="brand-subtitle font-serif">
                      {isMr ? 'येवला हातमाग अस्सल पैठणी महादालन' : 'Royal Yeola Handloom Silk Heirlooms'}
                    </p>
                    <span className="brand-meta">
                      Pratishthana & Yeola Weaving Cluster • Est. 18th Century
                    </span>
                  </div>

                  <div className="gold-wax-seal">
                    <span className="seal-star">✦ 24K ✦</span>
                    <span className="seal-main">GOLD ZARI</span>
                    <span className="seal-sub">TESTED</span>
                  </div>
                </div>

                <div className="cert-divider-gold">
                  <span className="divider-flourish">❖ ❖ ❖</span>
                </div>

                <div className="cert-heading-strip">
                  <h2 className="official-cert-title font-display">
                    {isMr
                      ? 'सिल्क मार्क अस्सलता हमीपत्र व अधिकृत खरेदी पावती'
                      : 'OFFICIAL SILK MARK AUTHENTICITY CERTIFICATE & TAX INVOICE'}
                  </h2>
                  <div className="cert-identifiers-row">
                    <span>
                      <strong>{isMr ? 'प्रमाणपत्र क्रमांक:' : 'Certificate No:'}</strong> {certNumber}
                    </span>
                    <span>
                      <strong>{isMr ? 'ऑर्डर क्रमांक:' : 'Order ID:'}</strong> #{orderId}
                    </span>
                    <span>
                      <strong>{isMr ? 'दिनांक:' : 'Date:'}</strong> {formattedDate}
                    </span>
                  </div>
                </div>
              </header>

              {/* PART 1: SILK MARK AUTHENTICITY DECLARATION */}
              <section className="parchment-section cert-guarantee-section">
                <div className="section-header-pill">
                  <span>{isMr ? 'अस्सलता हमी व वस्त्र प्रामाणिकता' : 'AUTHENTICITY DECLARATION & WEAVE SPECIFICATIONS'}</span>
                </div>

                <p className="guarantee-statement font-serif">
                  {isMr
                    ? 'याद्वारे प्रमाणित करण्यात येते की या पावतीमध्ये नमूद केलेली प्रत्येक पैठणी साडी ही नाशिक जिल्ह्यातील येवला येथील कसबी हातमाग विणकरांनी पारंपारिक लाकडी खड्ड्यांच्या मागावर (Wooden Pit Looms) विणलेली अस्सल महावस्त्र आहे. यात १००% नैसर्गिक मलबेरी रेशीम (Pure Mulberry Silk) व अस्सल तपासलेली सुवर्ण जरी वापरण्यात आली असून, पदराची नक्षी ही प्राचीन टॅपेस्ट्री इंटरलॉकिंग पद्धतीद्वारे (कडीयाल व फेका काम) विणलेली आहे.'
                    : 'This document certifies that the Paithani saree(s) detailed herein are woven on authentic traditional wooden pit-looms by master handloom weavers in the historic textile epicenter of Yeola (Nashik), Maharashtra. Woven with 100% pure certified Mulberry Silk warp and weft, embellished with tested 24K gold and silver zari using the ancient tapestry interlocking weave technique.'}
                </p>

                {/* Technical Specifications Table */}
                <div className="parchment-table-wrap">
                  <table className="parchment-spec-table">
                    <thead>
                      <tr>
                        <th>{isMr ? 'साडीचे नाव व विणकाम' : 'Saree Description & Weave'}</th>
                        <th>{isMr ? 'रेशीम प्रकार' : 'Silk Grade'}</th>
                        <th>{isMr ? 'जरी दर्जा' : 'Zari Purity'}</th>
                        <th>{isMr ? 'पदर नक्षी व काठ' : 'Pallu & Border Motif'}</th>
                        <th>{isMr ? 'उत्पत्ती ठिकाण' : 'Provenance'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{item.name}</strong>
                            <div className="item-qty-tag">Qty: {item.quantity || 1} • Handloom Pit-Loom Weave</div>
                          </td>
                          <td>100% Pure Mulberry Silk (Silk Mark Certified)</td>
                          <td>Pure Tested Gold Zari (24K Gold Plated Silver Thread)</td>
                          <td>Mor Bangadi / Temple Zari Interlocked Border</td>
                          <td>Yeola Handloom Weavers Cluster, Maharashtra</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Dual Seals of Authenticity */}
                <div className="seals-sign-row">
                  <div className="seal-badge-box">
                    <div className="stamp-circle">
                      <span className="stamp-top">SILK MARK BOARD</span>
                      <span className="stamp-center">CERTIFIED</span>
                      <span className="stamp-bottom">100% PURE SILK</span>
                    </div>
                    <span className="stamp-caption">National Silk Mark Standard</span>
                  </div>

                  <div className="seal-badge-box">
                    <div className="stamp-circle gold-border">
                      <span className="stamp-top">YEOLA WEAVERS</span>
                      <span className="stamp-center">AUTHENTIC</span>
                      <span className="stamp-bottom">HANDLOOM</span>
                    </div>
                    <span className="stamp-caption">Traditional Pit-Loom Guarantee</span>
                  </div>

                  <div className="artisan-signature-box">
                    <div className="sig-line">
                      <span className="sig-cursive">Paithani Vastram Weavers</span>
                    </div>
                    <span className="sig-title">
                      {isMr ? 'मुख्य विणकर व अधिकृत प्रमाणीकरणकर्ता' : 'Master Weaver & Chief Authenticator'}
                    </span>
                    <span className="sig-org">Paithani Vastram Yeola Cluster, Maharashtra</span>
                  </div>
                </div>
              </section>

              {/* PART 2: ROYAL TAX INVOICE & ORDER SUMMARY */}
              <section className="parchment-section invoice-section">
                <div className="section-header-pill">
                  <span>{isMr ? 'शाही खरेदी पावती व बिल (Bill of Supply)' : 'ROYAL TAX INVOICE & BILL OF SUPPLY'}</span>
                </div>

                <div className="invoice-meta-grid">
                  <div className="invoice-col">
                    <h4 className="meta-subhead">{isMr ? 'ग्राहकाचे नाव व पत्ता:' : 'Billed & Shipped To:'}</h4>
                    <p className="cust-bill-name">
                      <strong>{customer.name || 'Valued Paithani Connoisseur'}</strong>
                    </p>
                    <p className="cust-bill-line">📞 {customer.phone || 'N/A'}</p>
                    {customer.email && <p className="cust-bill-line">✉️ {customer.email}</p>}
                    <p className="cust-bill-line">
                      📍 {customer.address}, {customer.city} - {customer.pincode}, {customer.state || 'Maharashtra'}
                    </p>
                    {customer.notes && (
                      <p className="cust-bill-notes">
                        <em>{isMr ? 'विशेष सूचना:' : 'Special Instruction:'} "{customer.notes}"</em>
                      </p>
                    )}
                  </div>

                  <div className="invoice-col right-align">
                    <h4 className="meta-subhead">{isMr ? 'वितरण व देयक तपशील:' : 'Invoice Details:'}</h4>
                    <p className="cust-bill-line">
                      <strong>{isMr ? 'पावती क्रमांक:' : 'Invoice No:'}</strong> INV-{orderId}
                    </p>
                    <p className="cust-bill-line">
                      <strong>{isMr ? 'ऑर्डर तारीख:' : 'Order Date:'}</strong> {formattedDate}
                    </p>
                    <p className="cust-bill-line">
                      <strong>{isMr ? 'पेमेंट पद्धत:' : 'Payment Method:'}</strong> {order.paymentMethod || 'WHATSAPP_INQUIRY'}
                    </p>
                    <p className="cust-bill-line">
                      <strong>{isMr ? 'ऑर्डर स्थिती:' : 'Status:'}</strong>{' '}
                      <span className="status-confirmed-pill">{order.status || 'Confirmed'}</span>
                    </p>
                    <p className="cust-bill-line">
                      <strong>{isMr ? 'जीएसटी/एचएसएन:' : 'HSN Code:'}</strong> 5007 (Handloom Silk Fabrics)
                    </p>
                  </div>
                </div>

                {/* Items Invoice Table */}
                <table className="parchment-invoice-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>{isMr ? 'हातमाग पैठणी साडी तपशील' : 'Handloom Paithani Description'}</th>
                      <th className="center-cell">{isMr ? 'नग (Qty)' : 'Qty'}</th>
                      <th className="right-cell">{isMr ? 'दर (Rate)' : 'Unit Rate'}</th>
                      <th className="right-cell">{isMr ? 'एकूण (Total)' : 'Net Amount'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => {
                      const itemSubtotal = (it.price || 0) * (it.quantity || 1);
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <strong>{it.name}</strong>
                            <div className="item-sub-desc">
                              HSN: 5007 • 100% Pure Silk & Tested Gold Zari • With Blouse Piece
                            </div>
                          </td>
                          <td className="center-cell">{it.quantity || 1}</td>
                          <td className="right-cell">₹{(it.price || 0).toLocaleString('en-IN')}</td>
                          <td className="right-cell">₹{itemSubtotal.toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="right-cell">
                        {isMr ? 'उपएकूण (Subtotal):' : 'Subtotal:'}
                      </td>
                      <td className="right-cell font-serif">₹{totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="right-cell">
                        {isMr ? 'जीएसटी (५% हातमाग रेशीम - समाविष्ट):' : 'GST (5% Handloom Silk - Inclusive):'}
                      </td>
                      <td className="right-cell" style={{ color: '#047857' }}>
                        {isMr ? 'समाविष्ट' : 'INCLUDED'}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="right-cell">
                        {isMr ? 'सुरक्षित शाही डिलिव्हरी (Insured Courier):' : 'Insured Royal Courier:'}
                      </td>
                      <td className="right-cell" style={{ color: '#047857', fontWeight: 700 }}>
                        {isMr ? 'मोफत (₹0)' : 'FREE (₹0)'}
                      </td>
                    </tr>
                    <tr className="grand-total-row">
                      <td colSpan="4" className="right-cell">
                        <strong>{isMr ? 'एकूण देय रक्कम (Grand Total):' : 'Net Total Payable:'}</strong>
                      </td>
                      <td className="right-cell grand-total-amount">
                        <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </section>

              {/* PART 3: ROYAL HEIRLOOM PRESERVATION GUIDE */}
              <section className="parchment-section care-section">
                <div className="section-header-pill">
                  <span>{isMr ? 'शाही पैठणी जतन व काळजी मार्गदर्शक' : 'ROYAL SILK & ZARI PRESERVATION GUIDE'}</span>
                </div>

                <div className="care-instructions-grid">
                  <div className="care-item">
                    <span className="care-num">१</span>
                    <p>
                      <strong>{isMr ? 'फक्त ड्राय क्लीन:' : 'Dry Clean Only:'}</strong>{' '}
                      {isMr
                        ? 'अस्सल रेशीम व जरीचे तेज टिकवण्यासाठी साडी नेहमी चांगल्या ड्राय क्लीनरकडे द्या.'
                        : 'Never machine wash or soak. Always entrust to expert dry cleaners specializing in heirloom silks.'}
                    </p>
                  </div>

                  <div className="care-item">
                    <span className="care-num">२</span>
                    <p>
                      <strong>{isMr ? 'सुती वस्त्रात गुंडाळा:' : 'Wrap in Muslin Cloth:'}</strong>{' '}
                      {isMr
                        ? 'प्लास्टिक पिशवीत न ठेवता शुद्ध सुती किंवा मलमलच्या वस्त्रात गुंडाळून ठेवा.'
                        : 'Store wrapped in pure unbleached muslin or breathable cotton cloth. Avoid plastic covers.'}
                    </p>
                  </div>

                  <div className="care-item">
                    <span className="care-num">३</span>
                    <p>
                      <strong>{isMr ? 'घड्या बदलणे:' : 'Alternate Folds:'}</strong>{' '}
                      {isMr
                        ? 'दर ६ महिन्यांनी साडीची घडी बदलावी, जेणेकरून सोन्याच्या जरीवर कायमस्वरूपी ताण पडत नाही.'
                        : 'Refold along alternate crease lines once every 6 months to prevent tension on gold zari.'}
                    </p>
                  </div>

                  <div className="care-item">
                    <span className="care-num">४</span>
                    <p>
                      <strong>{isMr ? 'सुगंध व कीटकांचे रक्षण:' : 'Natural Protection:'}</strong>{' '}
                      {isMr
                        ? 'कडुनिंबाची वाळलेली पाने ठेवावीत. अत्तर किंवा डिओडोरंट थेट जरीवर फवारू नये.'
                        : 'Place dried neem leaves nearby. Avoid spraying alcohol-based perfumes directly onto the gold zari.'}
                    </p>
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <footer className="parchment-footer">
                <div className="footer-line">
                  <span>👑 <strong>Paithani Vastram Master Weavers Guild</strong></span>
                  <span>Yeola Handloom Silk Center, Nashik, Maharashtra 423401</span>
                  <span>WhatsApp VIP Concierge: +91 7219120935</span>
                </div>
                <p className="footer-disclaimer">
                  {isMr
                    ? 'ही पावती संगणक प्रणालीद्वारे अधिकृत स्वाक्षरीसह तयार केली असून भारत सरकारच्या वस्त्रोद्योग मंत्रालयाच्या सिल्क मार्क मानकांशी सुसंगत आहे.'
                    : 'This document is generated by Paithani Vastram and is accompanied by Silk Mark certification conforming to the Ministry of Textiles, Government of India.'}
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .certificate-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100000;
          background: rgba(8, 1, 12, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          box-sizing: border-box;
          animation: fadeInBackdrop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .certificate-modal-shell {
          width: 100%;
          max-width: 960px;
          max-height: 94vh;
          display: flex;
          flex-direction: column;
          background: #15031b;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);
          overflow: hidden;
        }

        /* Toolbar */
        .cert-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: #200529;
          border-bottom: 1px solid var(--color-border);
          gap: 16px;
          flex-wrap: wrap;
        }

        .cert-toolbar-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gold-icon {
          color: var(--color-gold);
        }

        .cert-toolbar-title {
          font-size: 1.15rem;
          color: #fff;
          font-weight: 700;
        }

        .cert-order-tag {
          font-size: 0.8rem;
          background: rgba(212, 175, 55, 0.15);
          color: var(--color-gold-light);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(212, 175, 55, 0.3);
          font-weight: 600;
        }

        .cert-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cert-lang-pill {
          display: flex;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 3px;
        }

        .cert-lang-opt {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cert-lang-opt.active {
          background: var(--color-gold-gradient);
          color: #1a0520;
        }

        .cert-print-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          font-size: 0.88rem;
        }

        .cert-close-btn {
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
          transition: var(--transition);
        }

        .cert-close-btn:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: var(--color-gold);
        }

        /* Scroll Area */
        .cert-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding: 32px 24px;
          background: radial-gradient(circle at center, #1c0624 0%, #0d0112 100%);
        }

        /* ROYAL PARCHMENT SHEET */
        .royal-parchment-sheet {
          background: #fdfaf2;
          color: #1a0d03;
          max-width: 860px;
          margin: 0 auto;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.6);
          position: relative;
          border-radius: 4px;
        }

        .parchment-border-frame {
          position: relative;
          border: 3px double #9b7218;
          margin: 14px;
          padding: 32px 36px;
          background: radial-gradient(circle at 50% 50%, #fffdf8 0%, #f7f0df 100%);
        }

        .corner-ornament {
          position: absolute;
          font-size: 1.5rem;
          color: #9b7218;
          line-height: 1;
        }

        .corner-ornament.top-left { top: 8px; left: 8px; }
        .corner-ornament.top-right { top: 8px; right: 8px; }
        .corner-ornament.bottom-left { bottom: 8px; left: 8px; }
        .corner-ornament.bottom-right { bottom: 8px; right: 8px; }

        /* Header */
        .parchment-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-seal-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 12px;
        }

        .silk-mark-badge-graphic {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 86px;
          height: 86px;
          border: 2px dashed #9b7218;
          border-radius: 50%;
          background: #fff;
          padding: 4px;
          box-shadow: 0 2px 8px rgba(155, 114, 24, 0.15);
        }

        .silk-mark-butterfly {
          font-size: 1.4rem;
          line-height: 1;
        }

        .silk-mark-text {
          font-size: 0.62rem;
          font-weight: 800;
          color: #7c0a2b;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .silk-mark-sub {
          font-size: 0.5rem;
          font-weight: 700;
          color: #9b7218;
        }

        .brand-crest {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .royal-crown {
          font-size: 1.8rem;
          line-height: 1;
          margin-bottom: 2px;
        }

        .brand-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: #520921;
          letter-spacing: 1.5px;
          margin: 0;
        }

        .brand-subtitle {
          font-size: 1.05rem;
          color: #8b6014;
          font-weight: 600;
          margin-top: 2px;
        }

        .brand-meta {
          font-size: 0.72rem;
          color: #69533a;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .gold-wax-seal {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 86px;
          height: 86px;
          background: linear-gradient(135deg, #d4af37, #9b7218);
          border-radius: 50%;
          color: #fff;
          box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.4), 0 4px 10px rgba(0, 0, 0, 0.2);
          border: 2px solid #694b05;
        }

        .seal-star { font-size: 0.56rem; font-weight: 800; }
        .seal-main { font-size: 0.65rem; font-weight: 900; letter-spacing: 0.5px; }
        .seal-sub { font-size: 0.56rem; font-weight: 700; }

        .cert-divider-gold {
          position: relative;
          text-align: center;
          margin: 14px 0 16px;
        }

        .cert-divider-gold::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #9b7218, transparent);
        }

        .divider-flourish {
          position: relative;
          background: #fdfaf2;
          padding: 0 16px;
          color: #9b7218;
          font-size: 0.85rem;
        }

        .official-cert-title {
          font-size: 1.25rem;
          color: #45041a;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .cert-identifiers-row {
          display: flex;
          justify-content: center;
          gap: 24px;
          font-size: 0.82rem;
          color: #5c4323;
          border-top: 1px dotted #c9b179;
          border-bottom: 1px dotted #c9b179;
          padding: 6px 0;
        }

        /* Sections */
        .parchment-section {
          margin-bottom: 24px;
        }

        .section-header-pill {
          display: inline-block;
          background: #7c0a2b;
          color: #fce899;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 4px 14px;
          border-radius: 2px;
          margin-bottom: 12px;
        }

        .guarantee-statement {
          font-size: 0.88rem;
          line-height: 1.7;
          color: #2b1808;
          margin-bottom: 16px;
          text-align: justify;
        }

        /* Tables */
        .parchment-table-wrap {
          overflow-x: auto;
          margin-bottom: 18px;
        }

        .parchment-spec-table, .parchment-invoice-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }

        .parchment-spec-table th, .parchment-invoice-table th {
          background: #ecdcb9;
          color: #4a2d04;
          border: 1px solid #c4ab75;
          padding: 8px 10px;
          text-align: left;
          font-weight: 700;
        }

        .parchment-spec-table td, .parchment-invoice-table td {
          border: 1px solid #d8c394;
          padding: 8px 10px;
          vertical-align: top;
          color: #1e1102;
        }

        .item-qty-tag {
          font-size: 0.72rem;
          color: #7c0a2b;
          font-weight: 600;
          margin-top: 2px;
        }

        .item-sub-desc {
          font-size: 0.72rem;
          color: #6b5536;
          margin-top: 2px;
        }

        .center-cell { text-align: center; }
        .right-cell { text-align: right; }

        .parchment-invoice-table tfoot td {
          border-top: 1px solid #9b7218;
          padding: 6px 10px;
        }

        .grand-total-row {
          background: #ecdcb9;
        }

        .grand-total-amount {
          font-size: 1.15rem;
          color: #7c0a2b;
        }

        /* Seals & Signature */
        .seals-sign-row {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 16px;
          background: rgba(236, 220, 185, 0.4);
          border: 1px dashed #c4ab75;
          border-radius: 4px;
          margin-top: 16px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .seal-badge-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stamp-circle {
          width: 84px;
          height: 84px;
          border: 2px solid #7c0a2b;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #7c0a2b;
          text-align: center;
          padding: 4px;
        }

        .stamp-circle.gold-border {
          border-color: #8b6014;
          color: #8b6014;
        }

        .stamp-top { font-size: 0.52rem; font-weight: 700; letter-spacing: 0.5px; }
        .stamp-center { font-size: 0.68rem; font-weight: 900; letter-spacing: 1px; border-top: 1px solid currentColor; border-bottom: 1px solid currentColor; padding: 2px 0; margin: 2px 0; width: 90%; }
        .stamp-bottom { font-size: 0.52rem; font-weight: 700; }
        .stamp-caption { font-size: 0.65rem; color: #6b5536; font-weight: 600; margin-top: 4px; }

        .artisan-signature-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .sig-line {
          width: 180px;
          border-bottom: 1.5px solid #2b1808;
          padding-bottom: 4px;
          margin-bottom: 6px;
        }

        .sig-cursive {
          font-family: 'Playfair Display', cursive, serif;
          font-size: 1.15rem;
          font-style: italic;
          color: #7c0a2b;
          font-weight: 700;
        }

        .sig-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: #2b1808;
        }

        .sig-org {
          font-size: 0.64rem;
          color: #6b5536;
        }

        /* Invoice Meta */
        .invoice-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          background: #fbf5e7;
          border: 1px solid #d8c394;
          padding: 14px 18px;
          margin-bottom: 16px;
          font-size: 0.8rem;
        }

        .meta-subhead {
          font-size: 0.84rem;
          color: #7c0a2b;
          font-weight: 700;
          margin-bottom: 6px;
          border-bottom: 1px solid #ecdcb9;
          padding-bottom: 4px;
        }

        .cust-bill-name { font-size: 0.95rem; color: #1e1102; margin-bottom: 4px; }
        .cust-bill-line { color: #3a2510; line-height: 1.5; margin-bottom: 2px; }
        .cust-bill-notes { font-size: 0.74rem; color: #7c0a2b; margin-top: 4px; }

        .status-confirmed-pill {
          background: #047857;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        /* Care Guide */
        .care-instructions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 0.78rem;
        }

        .care-item {
          display: flex;
          gap: 8px;
          background: #fcf7eb;
          padding: 10px 12px;
          border: 1px solid #e2cf9f;
          border-radius: 4px;
        }

        .care-num {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          background: #7c0a2b;
          color: #fff;
          border-radius: 50%;
          font-size: 0.72rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .care-item p {
          color: #2b1808;
          line-height: 1.45;
        }

        /* Footer */
        .parchment-footer {
          text-align: center;
          border-top: 1px solid #c4ab75;
          padding-top: 14px;
          margin-top: 20px;
        }

        .footer-line {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 0.72rem;
          color: #4a341b;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }

        .footer-disclaimer {
          font-size: 0.64rem;
          color: #8b7454;
          font-style: italic;
        }

        /* ==========================================================================
           PRINT STYLES: PERFECT A4 SHEET READY FOR HARDCOPY OR PDF SAVE
           ========================================================================== */
        @media print {
          /* Hide all surrounding app chrome */
          body * {
            visibility: hidden;
          }

          .no-print {
            display: none !important;
          }

          .certificate-modal-backdrop {
            position: absolute !important;
            inset: 0 !important;
            background: none !important;
            padding: 0 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          .certificate-modal-shell {
            max-width: 100% !important;
            max-height: none !important;
            box-shadow: none !important;
            border: none !important;
            background: #fff !important;
          }

          .cert-scroll-area {
            padding: 0 !important;
            background: none !important;
            overflow: visible !important;
          }

          .royal-parchment-sheet,
          .royal-parchment-sheet * {
            visibility: visible !important;
          }

          .royal-parchment-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            background: #fff !important;
          }

          .parchment-border-frame {
            margin: 0 !important;
            padding: 20px 24px !important;
            border: 2px solid #9b7218 !important;
            background: #fff !important;
          }

          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }

        @media (max-width: 768px) {
          .certificate-modal-backdrop {
            padding: 8px 6px;
          }
          .certificate-modal-shell {
            max-width: 100%;
            max-height: 94vh;
          }
          .parchment-border-frame {
            padding: 16px 12px;
          }
          .header-seal-block {
            flex-direction: column;
            gap: 14px;
          }
          .invoice-meta-grid, .care-instructions-grid {
            grid-template-columns: 1fr;
          }
          .cert-identifiers-row {
            flex-direction: column;
            gap: 4px;
          }
          .parchment-table-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .cert-toolbar-actions {
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
