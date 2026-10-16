import React from 'react';
import { IconWhatsApp, IconShield, IconSparkles } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onCategorySelect, onOpenAdmin }) {
  const { isMarathi, t, setLanguage } = useLanguage();

  return (
    <footer className="royal-footer">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col brand-col">
            <div className="footer-logo-row">
              <img src="/logo.jpg" alt="Paithani Vastram Emblem" className="footer-logo" />
              <div>
                <h3 className="footer-brand font-display gold-text">PAITHANI VASTRAM</h3>
                <span className="footer-marathi font-devanagari">पैठणी वस्त्रम • येवला पैठण</span>
              </div>
            </div>

            <p className="footer-about">
              {t('footerAbout')}
            </p>

            <div className="footer-cert-badge">
              <IconShield size={18} />
              <span>{t('footerSilkMark')}</span>
            </div>

            {/* Language Switcher in Footer */}
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-gold-light)' }}>🌐 Language / भाषा:</span>
              <button
                className={`lang-choice ${isMarathi ? 'active' : ''}`}
                onClick={() => setLanguage('mr')}
                style={{
                  background: isMarathi ? 'var(--color-gold-gradient)' : 'rgba(255,255,255,0.06)',
                  color: isMarathi ? '#1a0520' : '#c8b9cf',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                मराठी
              </button>
              <button
                className={`lang-choice ${!isMarathi ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                style={{
                  background: !isMarathi ? 'var(--color-gold-gradient)' : 'rgba(255,255,255,0.06)',
                  color: !isMarathi ? '#1a0520' : '#c8b9cf',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                English
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading font-serif">{t('footerRoyalWeaves')}</h4>
            <ul className="footer-links">
              <li><button onClick={() => onCategorySelect('Bridal')}>{t('catBridal')}</button></li>
              <li><button onClick={() => onCategorySelect('Pure Silk')}>{t('catPureSilk')}</button></li>
              <li><button onClick={() => onCategorySelect('Kadiyal')}>{t('catKadiyal')}</button></li>
              <li><button onClick={() => onCategorySelect('Brocade')}>{t('catBrocade')}</button></li>
              <li><button onClick={() => onCategorySelect('Yeola Special')}>{t('catYeolaSpecial')}</button></li>
              <li><button onClick={onOpenAdmin}>{t('footerAdminLink')}</button></li>
            </ul>
          </div>

          {/* Saree Care & Authenticity */}
          <div className="footer-col">
            <h4 className="footer-heading font-serif">{t('footerCareTitle')}</h4>
            <ul className="footer-care-tips">
              <li>{t('footerCare1')}</li>
              <li>{t('footerCare2')}</li>
              <li>{t('footerCare3')}</li>
              <li>{t('footerCare4')}</li>
            </ul>
          </div>

          {/* Workshop & Contact */}
          <div className="footer-col">
            <h4 className="footer-heading font-serif">{t('footerWorkshopTitle')}</h4>
            <div className="footer-contact-info">
              <p>📍 <strong>{t('footerWorkshopName')}</strong></p>
              <p>{t('footerAddress')}</p>
              <p style={{ marginTop: '8px' }}>📞 {t('footerHelpline')}</p>
              <p>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=vinuu1124@gmail.com&su=Inquiry%20-%20Paithani%20Vastram%20Saree"
                  onClick={(e) => {
                    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                      e.preventDefault();
                      window.location.href = 'mailto:vinuu1124@gmail.com?subject=Inquiry%20-%20Paithani%20Vastram%20Saree';
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-email-link"
                  title="Directly open Gmail to send an email to vinuu1124@gmail.com"
                >
                  ✉️ vinuu1124@gmail.com
                </a>
              </p>

              <a
                href="https://wa.me/917219120935?text=Namaste%20Paithani%20Vastram,%20I%20would%20like%20to%20connect%20with%20your%20weavers."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp footer-wa-btn"
              >
                <IconWhatsApp size={16} />
                <span>{isMarathi ? 'व्हॉट्सॲपवर संपर्क करा' : 'Chat on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>{t('footerCopyright')}</p>
          <p className="weavers-tribute">
            {isMarathi ? 'महाराष्ट्रातील पारंपरिक हातमाग विणकरांच्या सन्मानार्थ अभिमानाने निर्मित.' : 'Handcrafted with pride for Maharashtrian handloom weavers.'}
          </p>
        </div>
      </div>

      <style>{`
        .royal-footer {
          background: #0d0111;
          border-top: 1px solid var(--color-border);
          padding: 70px 0 30px;
          color: var(--color-text-muted);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
          gap: 36px;
          margin-bottom: 50px;
        }
        .footer-logo-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .footer-logo {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid var(--color-gold);
        }
        .footer-brand {
          font-size: 1.3rem;
          line-height: 1.1;
        }
        .footer-marathi {
          font-size: 0.76rem;
          color: var(--color-gold-light);
        }
        .footer-about {
          font-size: 0.88rem;
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .footer-cert-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid var(--color-gold);
          border-radius: var(--radius-full);
          padding: 6px 14px;
          font-size: 0.74rem;
          color: var(--color-gold-light);
          font-weight: 600;
        }
        .footer-heading {
          font-size: 1.15rem;
          color: #ffffff;
          margin-bottom: 18px;
          letter-spacing: 0.5px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links button {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.88rem;
          cursor: pointer;
          text-align: left;
          transition: var(--transition);
          padding: 0;
        }
        .footer-links button:hover {
          color: var(--color-gold-light);
          transform: translateX(4px);
        }
        .footer-care-tips {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.84rem;
          line-height: 1.5;
        }
        .footer-contact-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.86rem;
        }
        .footer-email-link {
          color: var(--color-gold-light);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition);
          font-weight: 500;
        }
        .footer-email-link:hover {
          color: #ffffff;
          text-decoration: underline;
          transform: translateX(3px);
        }
        .footer-wa-btn {
          margin-top: 14px;
          width: fit-content;
          padding: 8px 18px;
          font-size: 0.84rem;
        }
        .footer-bottom {
          border-top: 1px solid rgba(212, 175, 55, 0.15);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          flex-wrap: wrap;
          gap: 12px;
        }
        .weavers-tribute {
          color: var(--color-gold-light);
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 650px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
