import React, { useState, useEffect } from 'react';
import { IconClose, IconUpload, IconSparkles, IconCheck } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { apiUrl } from '../config';

export default function UploadModal({ isOpen, onClose, onSareeAdded, existingSarees = [] }) {
  const { isMarathi } = useLanguage();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const initialForm = {
    name: '',
    marathiName: '',
    price: '',
    originalPrice: '',
    category: 'Bridal',
    color: 'Rani Pink',
    colorHex: '#D81B60',
    palluMotif: 'Mor Bangadi (Peacock)',
    borderType: 'Broad Gold Zari Border',
    fabric: '100% Pure Mulberry Silk',
    zariType: 'Pure Tested Gold Zari',
    description: '',
    origin: 'Yeola, Maharashtra',
    stockCount: 1
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setPreviewUrl('');
      setImageUrlInput('');
      setIsUploading(false);
      setUploadSuccess(false);
      setErrorMsg('');
      setFormData(initialForm);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setImageUrlInput('');
      setErrorMsg('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setPreviewUrl(URL.createObjectURL(dropped));
      setImageUrlInput('');
      setErrorMsg('');
    }
  };

  const handleQuickSelectImage = (imgSrc) => {
    setPreviewUrl(imgSrc);
    setImageUrlInput(imgSrc);
    setFile(null);
    setErrorMsg('');
  };

  const handleUrlInputChange = (e) => {
    const val = e.target.value;
    setImageUrlInput(val);
    if (val.trim()) {
      setPreviewUrl(val.trim());
      setFile(null);
      setErrorMsg('');
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg(isMarathi ? 'कृपया साडीचे नाव प्रविष्ट करा' : 'Please enter a name for the saree');
      return;
    }
    if (!formData.price) {
      setErrorMsg(isMarathi ? 'कृपया साडीची किंमत प्रविष्ट करा' : 'Please enter a price');
      return;
    }
    if (!previewUrl) {
      setErrorMsg(isMarathi ? 'कृपया साडीचा फोटो निवडा किंवा अपलोड करा' : 'Please upload a saree photo or select one');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg('');

      let finalImageUrl = previewUrl;

      // If user uploaded a new file from disk, post to /api/upload
      if (file) {
        const uploadBody = new FormData();
        uploadBody.append('image', file);

        const uploadRes = await fetch(apiUrl('/api/upload'), {
          method: 'POST',
          body: uploadBody
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          throw new Error(uploadData.message || (isMarathi ? 'फोटो अपलोड अयशस्वी झाले' : 'Image upload failed'));
        }
        finalImageUrl = uploadData.imageUrl || uploadData.backendUrl;
      }

      // Create Saree object in backend
      const sareePayload = {
        name: formData.name.trim(),
        marathiName: (formData.marathiName || formData.name).trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Math.round(Number(formData.price) * 1.25),
        category: formData.category,
        color: formData.color.trim(),
        colorHex: formData.colorHex || '#D4AF37',
        palluMotif: formData.palluMotif,
        borderType: formData.borderType,
        fabric: formData.fabric,
        zariType: formData.zariType,
        images: [finalImageUrl],
        description: formData.description || `Handcrafted Paithani saree in ${formData.color} featuring ${formData.palluMotif} pallu motifs and ${formData.borderType}.`,
        origin: formData.origin || 'Yeola, Maharashtra',
        inStock: true,
        stockCount: formData.stockCount ? Number(formData.stockCount) : 1,
        isPersonalCollection: true
      };

      const sareeRes = await fetch(apiUrl('/api/sarees'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sareePayload)
      });

      const sareeData = await sareeRes.json();
      if (!sareeData.success) {
        throw new Error(sareeData.message || (isMarathi ? 'साडी साठवण्यात त्रुटी आली' : 'Failed to save saree'));
      }

      setUploadSuccess(true);
      if (onSareeAdded) onSareeAdded(sareeData.data);

      setTimeout(() => {
        setUploadSuccess(false);
        onClose();
      }, 1400);

    } catch (err) {
      console.error('Saree upload error:', err);
      setErrorMsg(err.message || (isMarathi ? 'साडी जोडताना सर्व्हर त्रुटी आली' : 'Error uploading saree to database'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-modal-backdrop" onClick={onClose}>
      <div className="upload-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="badge-personal">
              {isMarathi ? 'विणकर दालन • साडी संकलन' : 'WEAVER CONSOLE • CATALOG STUDIO'}
            </span>
            <h2 className="modal-title font-display">
              {isMarathi ? 'नवीन पैठणी साडी जोडा' : 'Upload New Paithani Saree'}
            </h2>
            <p className="modal-subtitle">
              {isMarathi 
                ? 'अस्सल हातमाग पैठणी साडीचा फोटो व विणकाम तपशील थेट MongoDB Atlas मध्ये साठवा.' 
                : 'Upload authentic handloom Paithani saree photograph and specifications directly to MongoDB Atlas.'}
            </p>
          </div>
          <button className="close-btn" onClick={onClose} title={isMarathi ? 'बंद करा' : 'Close'}>
            <IconClose size={20} />
          </button>
        </div>

        {uploadSuccess ? (
          <div className="success-view animate-fade-in">
            <div className="success-icon-wrap">
              <IconCheck size={40} />
            </div>
            <h3 className="font-display gold-text">
              {isMarathi ? 'साडी यशस्वीरित्या जोडली गेली!' : 'New Saree Added Successfully!'}
            </h3>
            <p>
              {isMarathi 
                ? 'ही साडी पैठणी वस्त्रमच्या कॅटलॉग व MongoDB Atlas मध्ये साठवली आहे.' 
                : 'Your Paithani saree has been saved to the Paithani Vastram catalog and MongoDB Atlas.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-grid">
              {/* Image Upload Area */}
              <div className="upload-column">
                <label className="field-label">
                  {isMarathi ? 'साडीचे छायाचित्र *' : 'Saree Image *'}
                </label>
                
                <div
                  className={`dropzone ${previewUrl ? 'has-preview' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('saree-file-input').click()}
                >
                  <input
                    id="saree-file-input"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  {previewUrl ? (
                    <div className="preview-container">
                      <img src={previewUrl} alt="Saree Preview" className="preview-img" />
                      <div className="change-img-overlay">
                        <IconUpload size={22} />
                        <span>{isMarathi ? 'फोटो बदलण्यासाठी येथे क्लिक करा' : 'Click or Drag to Change Image'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-placeholder">
                      <div className="upload-icon-circle">
                        <IconUpload size={28} />
                      </div>
                      <h4>{isMarathi ? 'साडीचा फोटो येथे ड्रॅग करा' : 'Drag & Drop your saree image here'}</h4>
                      <p>{isMarathi ? 'किंवा संगणकातून निवडा (JPG, PNG, WebP)' : 'or click to browse from device (JPG, PNG, WebP)'}</p>
                      <span className="btn-secondary dropzone-btn">
                        {isMarathi ? 'फाईल निवडा' : 'Select Saree File'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Image URL input */}
                <div className="image-url-input-wrap">
                  <label className="field-sublabel">
                    {isMarathi ? 'किंवा थेट इमेज लिंक टाका:' : 'Or enter direct image URL:'}
                  </label>
                  <input
                    type="url"
                    className="input-royal url-field"
                    placeholder="https://example.com/saree.jpg"
                    value={imageUrlInput}
                    onChange={handleUrlInputChange}
                  />
                </div>

                {/* Quick picker from pre-loaded photos */}
                <div className="preloaded-gallery-picker">
                  <span className="picker-title">
                    {isMarathi ? 'किंवा आमच्या दालनातील फोटो निवडा:' : 'Or pick an authentic sample photograph:'}
                  </span>
                  <div className="picker-thumbnails">
                    {['1000078648', '1000078649', '1000078650', '1000078651', '1000162504', '1000162505', '1000162506', '1000162507'].map((id) => (
                      <img
                        key={id}
                        src={`/sarees/${id}.jpg`}
                        alt={`Saree ${id}`}
                        className={`picker-thumb ${previewUrl === `/sarees/${id}.jpg` ? 'active' : ''}`}
                        onClick={() => handleQuickSelectImage(`/sarees/${id}.jpg`)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="fields-column">
                <div className="form-group">
                  <label className="field-label">
                    {isMarathi ? 'साडीचे शीर्षक / नाव *' : 'Saree Title *'}
                  </label>
                  <input
                    type="text"
                    className="input-royal"
                    placeholder={isMarathi ? 'उदा. राणी गुलाबी मोर-बांगडी पैठणी' : 'e.g. Maharani Rani Pink Peacock Paithani'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label">
                      {isMarathi ? 'मराठी नाव (देवनागरी)' : 'Marathi Name (मराठी नाव)'}
                    </label>
                    <input
                      type="text"
                      className="input-royal font-devanagari"
                      placeholder="उदा. राणी गुलाबी मोर-बांगडी पैठणी"
                      value={formData.marathiName}
                      onChange={(e) => setFormData({ ...formData, marathiName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">
                      {isMarathi ? 'प्रकार *' : 'Category *'}
                    </label>
                    <select
                      className="input-royal"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Bridal">Bridal Paithani</option>
                      <option value="Pure Silk">Pure Silk Paithani</option>
                      <option value="Kadiyal">Kadiyal Paithani</option>
                      <option value="Brocade">Brocade Paithani</option>
                      <option value="Yeola Special">Yeola Special</option>
                      <option value="Personal Collection">Master Collection</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label">
                      {isMarathi ? 'विक्री किंमत (₹) *' : 'Selling Price (₹) *'}
                    </label>
                    <input
                      type="number"
                      className="input-royal"
                      placeholder="18500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">
                      {isMarathi ? 'मूळ किंमत / MRP (₹)' : 'Original MRP (₹)'}
                    </label>
                    <input
                      type="number"
                      className="input-royal"
                      placeholder="24000"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label">
                      {isMarathi ? 'रंग *' : 'Saree Color *'}
                    </label>
                    <input
                      type="text"
                      className="input-royal"
                      placeholder={isMarathi ? 'उदा. रॉयल ब्लू / राणी गुलाबी' : 'e.g. Royal Blue / Rani Pink'}
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">
                      {isMarathi ? 'पदरावरील नक्षी' : 'Pallu Motif'}
                    </label>
                    <select
                      className="input-royal"
                      value={formData.palluMotif}
                      onChange={(e) => setFormData({ ...formData, palluMotif: e.target.value })}
                    >
                      <option value="Mor Bangadi (Peacock)">Mor Bangadi (Peacock in Ring)</option>
                      <option value="Popat Maina (Parrot on Branch)">Popat Maina (Parrot)</option>
                      <option value="Asavali (Temple Urn & Vines)">Asavali (Sacred Vases)</option>
                      <option value="Kamal Butti (Lotus)">Kamal (Lotus)</option>
                      <option value="Peshwai Heavy Pallu">Peshwai Heavy Zari Pallu</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label">
                      {isMarathi ? 'काठाचा प्रकार' : 'Border Type'}
                    </label>
                    <input
                      type="text"
                      className="input-royal"
                      placeholder="e.g. Munia Border / Narali Border"
                      value={formData.borderType}
                      onChange={(e) => setFormData({ ...formData, borderType: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">
                      {isMarathi ? 'कापड व रेशीम' : 'Fabric & Silk'}
                    </label>
                    <input
                      type="text"
                      className="input-royal"
                      value={formData.fabric}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">
                    {isMarathi ? 'साडीचे विणकाम व तपशील' : 'Weaver / Saree Description'}
                  </label>
                  <textarea
                    className="input-royal"
                    rows="3"
                    placeholder={
                      isMarathi 
                        ? 'हातमाग विणकाम, जरीची प्रत आणि सण-समारंभांसाठी शिफारसी...' 
                        : 'Details about the handloom weave, zari quality, and occasion recommendations...'
                    }
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                {errorMsg && <div className="error-banner">{errorMsg}</div>}

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={onClose}>
                    {isMarathi ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button type="submit" className="btn-gold" disabled={isUploading}>
                    {isUploading ? (
                      <span>{isMarathi ? 'साडी साठवत आहे...' : 'Saving Weave...'}</span>
                    ) : (
                      <>
                        <IconSparkles size={18} />
                        <span>{isMarathi ? '+ साडी कॅटलॉगमध्ये समाविष्ट करा' : '+ Add Saree to Paithani Vastram'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .upload-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100005 !important;
          background: rgba(8, 1, 14, 0.90);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          box-sizing: border-box;
          animation: fadeInBackdrop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .upload-modal-content {
          width: 100%;
          max-width: 920px;
          max-height: 90vh;
          overflow-y: auto;
          background: #190520;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 30px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
          position: relative;
          z-index: 100006;
          animation: scaleInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleInModal {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 16px;
        }
        .badge-personal {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(212, 175, 55, 0.15);
          color: var(--color-gold);
          border: 1px solid rgba(212, 175, 55, 0.3);
          margin-bottom: 6px;
        }
        .modal-title {
          font-size: 1.8rem;
          color: #fff;
          margin-top: 4px;
        }
        .modal-subtitle {
          color: var(--color-text-muted);
          font-size: 0.88rem;
          margin-top: 4px;
        }
        .close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .close-btn:hover {
          color: #fff;
          border-color: var(--color-gold);
          background: rgba(212, 175, 55, 0.2);
        }
        .form-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 28px;
        }
        .upload-column {
          display: flex;
          flex-direction: column;
        }
        .field-label {
          display: block;
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--color-gold-light);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .field-sublabel {
          display: block;
          font-size: 0.76rem;
          color: var(--color-text-muted);
          margin-bottom: 4px;
        }
        .image-url-input-wrap {
          margin-top: 12px;
        }
        .url-field {
          font-size: 0.82rem;
          padding: 8px 12px;
        }
        .dropzone {
          border: 2px dashed rgba(212, 175, 55, 0.35);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: var(--transition);
          overflow: hidden;
          min-height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .dropzone:hover {
          border-color: var(--color-gold);
          background: rgba(212, 175, 55, 0.06);
        }
        .dropzone-placeholder {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .upload-icon-circle {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.15);
          color: var(--color-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .dropzone-placeholder h4 {
          font-size: 0.94rem;
          color: #fff;
          margin-bottom: 6px;
        }
        .dropzone-placeholder p {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-bottom: 14px;
        }
        .dropzone-btn {
          font-size: 0.82rem;
          padding: 7px 16px;
        }
        .preview-container {
          position: relative;
          width: 100%;
          height: 280px;
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .change-img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
          font-size: 0.84rem;
          font-weight: 600;
        }
        .preview-container:hover .change-img-overlay {
          opacity: 1;
        }
        .preloaded-gallery-picker {
          margin-top: 14px;
        }
        .picker-title {
          font-size: 0.76rem;
          color: var(--color-text-muted);
          margin-bottom: 8px;
          display: block;
        }
        .picker-thumbnails {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }
        .picker-thumb {
          width: 100%;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: var(--transition);
        }
        .picker-thumb:hover {
          transform: scale(1.05);
          border-color: var(--color-gold);
        }
        .picker-thumb.active {
          border-color: var(--color-gold);
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
        }
        .fields-column {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .error-banner {
          background: rgba(220, 38, 38, 0.2);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }
        .success-view {
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .success-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          border: 2px solid #22c55e;
        }

        @media (max-width: 850px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .dropzone {
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
