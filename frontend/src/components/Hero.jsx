import React from 'react';
import { IconSparkles, IconUpload, IconWhatsApp, IconShield, IconTruck } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onExploreClick, onHeritageClick }) {
  const { isMarathi, t } = useLanguage();

  return (
    <section className="hero-section">
      <div className="hero-backdrop">
        <img
          src="/hero.jpg"
          alt="Royal Bride in Handwoven Paithani Vastram Saree"
          className="hero-bg-img"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="container hero-content animate-fade-in">
        <div className="hero-badge animate-float">
          <IconSparkles size={16} />
          <span>{t('heroBadge')}</span>
        </div>

        <h1 className={`hero-title ${isMarathi ? 'font-devanagari is-marathi-hero' : 'font-display'}`}>
          {t('heroTitlePrefix')} <br />
          <span className="gold-text hero-gold-title">{t('heroTitleGold')}</span>
        </h1>

        <p className="hero-description">
          {t('heroDesc')}
        </p>

        <div className="hero-cta-group">
          <button className="btn-gold hero-btn" onClick={onExploreClick}>
            <span>{isMarathi ? 'शाही संग्रह पहा (१९+ साड्या)' : 'Explore Collection (19+ Weaves)'}</span>
          </button>

          <button
            className="btn-secondary hero-btn"
            onClick={() => {
              if (onHeritageClick) {
                onHeritageClick();
              } else {
                const el = document.getElementById('heritage-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span>{t('heroHeritageBtn')}</span>
          </button>

          <a
            href="https://wa.me/917219120935?text=Hello%20Paithani%20Vastram,%20I%20am%20interested%20in%20exploring%20your%20handwoven%20Paithani%20saree%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp hero-btn"
          >
            <IconWhatsApp size={18} />
            <span>{t('heroWeaverWhatsApp')}</span>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="hero-stats-grid">
          <div className="hero-stat-card glass-panel">
            <IconShield size={24} className="stat-icon" />
            <div>
              <h4 className="stat-title">{t('stat1Title')}</h4>
              <p className="stat-sub">{t('stat1Sub')}</p>
            </div>
          </div>

          <div className="hero-stat-card glass-panel">
            <IconSparkles size={24} className="stat-icon" />
            <div>
              <h4 className="stat-title">{t('stat2Title')}</h4>
              <p className="stat-sub">{t('stat2Sub')}</p>
            </div>
          </div>

          <div className="hero-stat-card glass-panel">
            <IconTruck size={24} className="stat-icon" />
            <div>
              <h4 className="stat-title">{t('stat3Title')}</h4>
              <p className="stat-sub">{t('stat3Sub')}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 82vh;
          display: flex;
          align-items: center;
          padding: 80px 0 60px;
          overflow: hidden;
        }
        .hero-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          filter: brightness(0.72) saturate(1.15);
          transform: scale(1.02);
          transition: transform 10s ease;
        }
        .hero-section:hover .hero-bg-img {
          transform: scale(1.06);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(15, 2, 18, 0.95) 0%,
            rgba(18, 4, 22, 0.85) 45%,
            rgba(18, 4, 22, 0.5) 100%
          ),
          linear-gradient(
            to top,
            rgba(15, 2, 18, 1) 0%,
            transparent 50%
          );
        }
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 820px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          background: rgba(212, 175, 55, 0.14);
          border: 1px solid var(--color-gold);
          color: var(--color-gold-light);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          margin-bottom: 22px;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.25);
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.35;
          color: #ffffff;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
          overflow: visible;
        }
        .hero-title.is-marathi-hero {
          font-family: 'Noto Serif Devanagari', 'Gotu', serif;
          font-size: 3.25rem;
          line-height: 1.48;
          font-weight: 700;
          letter-spacing: normal;
        }
        .hero-gold-title {
          display: inline-block;
          padding-top: 0.22em;
          padding-bottom: 0.22em;
          margin-top: -0.22em;
          margin-bottom: -0.22em;
          overflow: visible;
        }
        .hero-description {
          font-size: 1.12rem;
          color: #e5d9eb;
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 660px;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .hero-btn {
          padding: 14px 28px;
          font-size: 0.98rem;
        }
        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .hero-stat-card {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: var(--radius-sm);
          background: rgba(26, 7, 33, 0.75);
        }
        .stat-icon {
          color: var(--color-gold);
          flex-shrink: 0;
        }
        .stat-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #ffffff;
        }
        .stat-sub {
          font-size: 0.76rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 960px) {
          .hero-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.4rem;
          }
          .hero-section {
            min-height: auto;
            padding: 60px 0 40px;
          }
          .hero-description {
            font-size: 0.98rem;
          }
          .hero-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
