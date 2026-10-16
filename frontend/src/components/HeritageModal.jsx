import React from 'react';
import { IconClose, IconShield, IconSparkles } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function HeritageModal({ isOpen, onClose, onExploreClick }) {
  const { isMarathi, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="heritage-modal-backdrop" onClick={onClose}>
      <div className="heritage-modal-container glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="heritage-modal-header">
          <div className="heritage-modal-title-wrap">
            <span className="badge-silk">👑 {isMarathi ? '२,००० वर्षांचा ऐतिहासिक वारसा' : '2,000-Year Ancient Legacy'}</span>
            <h2 className="heritage-modal-heading font-display">
              {t('heritageModalTitle')}
            </h2>
            <span className="heritage-marathi-tag font-devanagari">{t('heritageModalSubtitle')}</span>
          </div>
          <button className="cart-close-btn" onClick={onClose} title="Close">
            <IconClose size={20} />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="heritage-modal-scroll">
          {/* Era 1 */}
          <div className="era-card glass-panel">
            <div className="era-time-badge">{isMarathi ? 'इ.स. पूर्व २०० • सातवाहन साम्राज्य' : '200 BC • Satavahana Dynasty'}</div>
            <h3 className="era-title font-serif">{isMarathi ? 'रोमन साम्राज्य आणि गोदावरी सिल्क रूट' : 'The Roman Empire & Godavari River Silk Route'}</h3>
            <p className="era-text">
              {isMarathi
                ? 'गोदावरीच्या पवित्र तीरावर प्रतिष्ठान (आधुनिक पैठण) ही प्राचीन राजधानी होती. पैठणचे तलम रेशमी वस्त्र इतके प्रसिद्ध होते की रोमन व्यापारी सोन्याची नाणी, सुगंधी मद्य आणि मौल्यवान काचेच्या वस्तू देऊन पैठणी खरेदी करत असत. रोमन इतिहासकार प्लिनीने या वस्त्रांची विशेष प्रशंसा केली आहे.'
                : 'Originating in the ancient capital city of Pratishthana (modern-day Paithan) along the sacred Godavari river, Paithani silk was so legendary that Roman traders exchanged pure gold coins, wine, and fine European glassware for this gossamer handwoven silk fabric. Roman historian Pliny noted the supreme demand for Indian silks in the court of Rome.'}
            </p>
          </div>

          {/* Era 2 */}
          <div className="era-card glass-panel">
            <div className="era-time-badge">{isMarathi ? 'इ.स. १७०० चे शतक • पेशवेकालीन सुवर्णकाळ' : '1700s • The Peshwa Golden Age'}</div>
            <h3 className="era-title font-serif">{isMarathi ? 'पुण्याचा शनिवार वाडा आणि येवला नगरीचे विणकर' : 'The Royal Court of Pune & Yeola Weavers'}</h3>
            <p className="era-text">
              {isMarathi
                ? '१८ व्या शतकात श्रीमंत माधवराव पेशवे यांनी या कलेला राजाश्रय दिला आणि पैठणहून कसबी विणकर कुटुंबांना येवला (नाशिक) येथे आणून स्थायिक केले. त्यामुळे येवला ही अस्सल हातमाग पैठणीची राजधानी बनली. मराठा साम्राज्यातील राजमाता आणि महाराण्यांसाठी पैठणी हा मानाचा महावस्त्र अलंकार ठरला.'
                : 'During the 18th century, Madhavrao Peshwa revitalized the weaving art and brought elite weaver families from Paithan to Yeola (Nashik), establishing Yeola as India\'s premier epicenter of authentic handloom silk weaving. Paithani became the mandatory royal attire for Maratha maharanis, royal weddings, and ceremonial durbars.'}
            </p>
          </div>

          {/* The Weaving Art */}
          <div className="era-card glass-panel">
            <div className="era-time-badge">{isMarathi ? 'पारंपारिक विणकाम तंत्र' : 'Traditional Technique'}</div>
            <h3 className="era-title font-serif">{isMarathi ? 'टॅपेस्ट्री इंटरलॉकिंग पद्धत (कडीयाल व फेका काम)' : 'Tapestry Interlocking Weave (कडीयाल व फेका काम)'}</h3>
            <p className="era-text">
              {isMarathi
                ? 'हातमागावर लाकडी खड्ड्यात विणलेली अस्सल पैठणी साडी म्हणजे विणकरांच्या १ ते ६ महिन्यांच्या अखंड तपश्चर्येचे फळ असते. पदरावर धागा मागे सुटत नाही, त्यामुळे साडी उलट-सुलट दोन्ही बाजूने सारखीच सुंदर दिसते.'
                : 'Unlike modern powerloom sarees with loose floats or printing, an authentic Paithani saree is handwoven using the interlocking tapestry method on hand-operated wooden pit looms. The pallu motif looks identical from both front and back with zero floating threads — a testament to master artisans who spend between 1 to 6 months on a single saree.'}
            </p>
          </div>

          {/* Master Motifs */}
          <div className="heritage-motifs-summary">
            <h4 className="motifs-summary-heading font-serif">{isMarathi ? 'शाही अलंकारिक नक्षी (Motifs)' : 'Royal Heirlooms & Motifs'}</h4>
            <div className="motifs-mini-grid">
              <div className="mini-motif-card">
                <span className="mini-motif-icon">🦚</span>
                <strong>{t('morBangadiTitle')}</strong>
                <p>{t('morBangadiDesc')}</p>
              </div>
              <div className="mini-motif-card">
                <span className="mini-motif-icon">🦜</span>
                <strong>{t('popatMainaTitle')}</strong>
                <p>{t('popatMainaDesc')}</p>
              </div>
              <div className="mini-motif-card">
                <span className="mini-motif-icon">🌿</span>
                <strong>{t('asavaliTitle')}</strong>
                <p>{t('asavaliDesc')}</p>
              </div>
              <div className="mini-motif-card">
                <span className="mini-motif-icon">🪙</span>
                <strong>{isMarathi ? 'मुनिया बॉर्डर' : 'Muniyā Border'}</strong>
                <p>{isMarathi ? 'काठावर पोपटांची नाजूक नक्षी, प्रामुख्याने लाल व हिरव्या रंगात.' : 'Fine parrot motifs nestled within gold borders, traditionally in red and green.'}</p>
              </div>
            </div>
          </div>

          {/* Authenticity Guarantee */}
          <div className="authenticity-banner glass-panel">
            <IconShield size={32} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
            <div>
              <h4 className="font-serif">{t('footerSilkMark')}</h4>
              <p>
                {isMarathi
                  ? 'आमच्या सर्व साड्या भारत सरकारच्या वस्त्रोद्योग मंत्रालयाच्या सिल्क मार्क प्रमाणीकरणासह येतात.'
                  : 'Every Paithani Vastram saree comes with tested 24K gold zari, 100% pure mulberry silk certification, and direct lineage from registered Yeola master handloom weavers.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="heritage-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {isMarathi ? 'बंद करा' : 'Close'}
          </button>
          <button
            className="btn-gold"
            onClick={() => {
              onClose();
              if (onExploreClick) onExploreClick();
            }}
          >
            <span>{isMarathi ? 'सर्व हातमाग साड्या पहा →' : 'Explore Handloom Sarees →'}</span>
          </button>
        </div>
      </div>

      <style>{`
        .heritage-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(10, 2, 14, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .heritage-modal-container {
          width: 100%;
          max-width: 820px;
          background: #17041f;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        .heritage-modal-header {
          padding: 24px 28px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .heritage-modal-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .heritage-modal-heading {
          font-size: 1.8rem;
          color: #fff;
          margin: 0;
        }

        .heritage-marathi-tag {
          font-size: 0.88rem;
          color: var(--color-gold-light);
        }

        .heritage-modal-scroll {
          padding: 28px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .era-card {
          padding: 20px 24px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .era-time-badge {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--color-gold-light);
          background: rgba(212, 175, 55, 0.14);
          padding: 3px 12px;
          border-radius: 12px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .era-title {
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 8px;
        }

        .era-text {
          font-size: 0.94rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        .heritage-motifs-summary {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: var(--radius-md);
          padding: 20px 24px;
        }

        .motifs-summary-heading {
          font-size: 1.15rem;
          color: var(--color-gold-light);
          margin-bottom: 14px;
        }

        .motifs-mini-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
        }

        .mini-motif-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(212, 175, 55, 0.1);
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }

        .mini-motif-card strong {
          display: block;
          color: #fff;
          font-size: 0.88rem;
          margin: 4px 0 2px;
        }

        .mini-motif-icon {
          font-size: 1.3rem;
        }

        .authenticity-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .authenticity-banner h4 {
          color: #fff;
          font-size: 0.98rem;
          margin-bottom: 4px;
        }

        .authenticity-banner p {
          color: var(--color-text-muted);
          font-size: 0.84rem;
          line-height: 1.4;
          margin: 0;
        }

        .heritage-modal-footer {
          padding: 18px 28px;
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
