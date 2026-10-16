import React from 'react';
import { IconSparkles, IconShield } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function HeritageStory() {
  const { isMarathi, t } = useLanguage();

  return (
    <section id="heritage-section" className="heritage-section">
      <div className="container">
        <div className="heritage-header">
          <span className="badge-silk">{t('heritageBadge')}</span>
          <h2 className={`heritage-title ${isMarathi ? 'font-devanagari' : 'font-display'}`} style={{ lineHeight: isMarathi ? '1.38' : '1.25' }}>
            {t('heritageTitlePrefix')} <span className="gold-text">{t('heritageTitleGold')}</span>
          </h2>
          <p className="heritage-subtitle">
            {t('heritageSubtitle')}
          </p>
        </div>

        <div className="motifs-grid">
          <div className="motif-card glass-panel">
            <div className="motif-badge-num">01</div>
            <h3 className="motif-name font-serif">{t('morBangadiTitle')}</h3>
            <span className="motif-tag">{t('morBangadiSub')}</span>
            <p className="motif-desc">
              {t('morBangadiDesc')}
            </p>
          </div>

          <div className="motif-card glass-panel">
            <div className="motif-badge-num">02</div>
            <h3 className="motif-name font-serif">{t('popatMainaTitle')}</h3>
            <span className="motif-tag">{t('popatMainaSub')}</span>
            <p className="motif-desc">
              {t('popatMainaDesc')}
            </p>
          </div>

          <div className="motif-card glass-panel">
            <div className="motif-badge-num">03</div>
            <h3 className="motif-name font-serif">{t('asavaliTitle')}</h3>
            <span className="motif-tag">{t('asavaliSub')}</span>
            <p className="motif-desc">
              {t('asavaliDesc')}
            </p>
          </div>
        </div>

        {/* Process Highlight */}
        <div className="craft-process-banner glass-panel">
          <div className="craft-process-content">
            <div className="craft-badge">
              <IconSparkles size={18} />
              <span>{isMarathi ? 'अस्सल पारंपारिक हातमाग कला' : 'THE SLOW HANDLOOM CRAFT'}</span>
            </div>
            <h3 className="craft-title font-serif">
              {isMarathi ? 'प्रत्येक पैठणी म्हणजे एक अजरामर कलाकृती' : 'Each Paithani is an Heirloom Masterpiece'}
            </h3>
            <p className="craft-desc">
              {isMarathi
                ? 'आधुनिक पॉवरलूमच्या विपरीत, अस्सल पैठणी साडी ही लाकडी खड्ड्याच्या हातमागावर ३० ते ९० दिवस सलग विणली जाते. कडीयाल व फेका पद्धतीने १००% शुद्ध मलबेरी रेशीम आणि टेस्टेड सोन्याची जरी वापरून तयार केलेल्या पैठणीचा पदर दोन्ही बाजूंनी हुबेहूब दिसतो.'
                : 'Unlike industrial powerloom sarees, an authentic Paithani saree is hand-woven on wooden pit looms over 30 to 90 days. Using the tapestry interlocking technique with 100% pure mulberry silk and genuine gold zari, both sides of an authentic Paithani show the exact same vibrant weave without loose threads.'}
            </p>
            <div className="craft-points">
              <div className="point-item">
                <IconShield size={16} />
                <span>{isMarathi ? 'कडीयाल विणकाम तंत्र (Kadiyal Interlock)' : 'Interlocking Weft Technique (Kadiyal)'}</span>
              </div>
              <div className="point-item">
                <IconShield size={16} />
                <span>{isMarathi ? 'नैसर्गिक खनिज व पर्यावरणपूरक रंग' : 'Natural Mineral & Eco-Dyes'}</span>
              </div>
              <div className="point-item">
                <IconShield size={16} />
                <span>{isMarathi ? 'भारत सरकार सिल्क मार्क प्रमाणित' : 'Government Silk Mark Certified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .heritage-section {
          scroll-margin-top: 90px;
          padding: 80px 0;
          background: linear-gradient(to bottom, rgba(15, 2, 18, 0.4), rgba(28, 7, 36, 0.6), rgba(15, 2, 18, 0.4));
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .heritage-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 50px;
        }
        .heritage-title {
          font-size: 2.6rem;
          color: #fff;
          margin-top: 14px;
          margin-bottom: 16px;
        }
        .heritage-subtitle {
          font-size: 1.05rem;
          color: var(--color-text-muted);
          line-height: 1.7;
        }
        .motifs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 50px;
        }
        .motif-card {
          padding: 28px;
          border-radius: var(--radius-md);
          position: relative;
          background: rgba(36, 12, 45, 0.6);
        }
        .motif-badge-num {
          font-size: 1.8rem;
          font-weight: 800;
          font-family: var(--font-display);
          color: var(--color-gold);
          opacity: 0.5;
          margin-bottom: 8px;
        }
        .motif-name {
          font-size: 1.35rem;
          color: #fff;
          margin-bottom: 4px;
        }
        .motif-tag {
          display: inline-block;
          font-size: 0.78rem;
          color: var(--color-gold-light);
          font-weight: 600;
          margin-bottom: 14px;
        }
        .motif-desc {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }
        .craft-process-banner {
          padding: 40px;
          border-radius: var(--radius-lg);
          background: radial-gradient(circle at top right, rgba(124, 10, 43, 0.3), rgba(28, 7, 36, 0.85));
          border: 1px solid var(--color-gold);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.15);
        }
        .craft-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-gold-light);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        .craft-title {
          font-size: 1.8rem;
          color: #fff;
          margin-bottom: 12px;
        }
        .craft-desc {
          font-size: 1rem;
          color: #e5d9eb;
          line-height: 1.7;
          margin-bottom: 24px;
          max-width: 900px;
        }
        .craft-points {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .point-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-gold-light);
        }

        @media (max-width: 900px) {
          .motifs-grid {
            grid-template-columns: 1fr;
          }
          .heritage-title {
            font-size: 2rem;
          }
          .craft-process-banner {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}
