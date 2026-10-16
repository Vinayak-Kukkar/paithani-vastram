import React, { useState } from 'react';
import { IconClose, IconUpload, IconSparkles, IconCheck } from './Icons';

export default function UploadModal({ isOpen, onClose, onSareeAdded, existingSarees = [] }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [formData, setFormData] = useState({
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
    origin: 'Yeola, Maharashtra'
  });

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setErrorMsg('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setPreviewUrl(URL.createObjectURL(dropped));
      setErrorMsg('');
    }
  };

  const handleQuickSelectImage = (imgSrc) => {
    setPreviewUrl(imgSrc);
    setFile(null); // using already existing image path
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setErrorMsg('Please enter a name for the saree');
      return;
    }
    if (!formData.price) {
      setErrorMsg('Please enter a price');
      return;
    }
    if (!previewUrl) {
      setErrorMsg('Please upload a saree photo or select one');
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

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadBody
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          throw new Error(uploadData.message || 'Image upload failed');
        }
        finalImageUrl = uploadData.imageUrl || uploadData.backendUrl;
      }

      // Create Saree object in backend
      const sareePayload = {
        name: formData.name,
        marathiName: formData.marathiName || formData.name,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Math.round(Number(formData.price) * 1.25),
        category: formData.category,
        color: formData.color,
        colorHex: formData.colorHex,
        palluMotif: formData.palluMotif,
        borderType: formData.borderType,
        fabric: formData.fabric,
        zariType: formData.zariType,
        images: [finalImageUrl],
        description: formData.description || `Handcrafted Paithani saree in ${formData.color} featuring ${formData.palluMotif} pallu motifs and ${formData.borderType}.`,
        origin: formData.origin,
        isPersonalCollection: true
      };

      const sareeRes = await fetch('/api/sarees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sareePayload)
      });

      const sareeData = await sareeRes.json();
      if (!sareeData.success) {
        throw new Error(sareeData.message || 'Failed to save saree');
      }

      setUploadSuccess(true);
      if (onSareeAdded) onSareeAdded(sareeData.data);

      setTimeout(() => {
        setUploadSuccess(false);
        onClose();
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error uploading personal saree');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="upload-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="badge-personal">PERSONAL COLLECTION STUDIO</span>
            <h2 className="modal-title font-display">Add Your Personal Saree</h2>
            <p className="modal-subtitle">Upload your personal Paithani saree photograph and list it with authentic weave details.</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <IconClose size={20} />
          </button>
        </div>

        {uploadSuccess ? (
          <div className="success-view animate-fade-in">
            <div className="success-icon-wrap">
              <IconCheck size={40} />
            </div>
            <h3 className="font-display gold-text">Personal Saree Added Successfully!</h3>
            <p>Your Paithani saree has been saved to the Paithani Vastram collection.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-grid">
              {/* Image Upload Area */}
              <div className="upload-column">
                <label className="field-label">Saree Image *</label>
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
                        <IconUpload size={20} />
                        <span>Click or Drag to Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-placeholder">
                      <div className="upload-icon-circle">
                        <IconUpload size={28} />
                      </div>
                      <h4>Drag & Drop your saree image here</h4>
                      <p>or click to browse from your computer (JPG, PNG, WebP)</p>
                      <span className="btn-secondary dropzone-btn">Select Saree File</span>
                    </div>
                  )}
                </div>

                {/* Quick picker from pre-loaded photos */}
                <div className="preloaded-gallery-picker">
                  <span className="picker-title">Or pick from personal collection:</span>
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
                  <label className="field-label">Saree Title *</label>
                  <input
                    type="text"
                    className="input-royal"
                    placeholder="e.g. Maharani Rani Pink Peacock Paithani"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label">Marathi Name (मराठी नाव)</label>
                    <input
                      type="text"
                      className="input-royal font-devanagari"
                      placeholder="उदा. राणी गुलाबी मोर-बांगडी पैठणी"
                      value={formData.marathiName}
                      onChange={(e) => setFormData({ ...formData, marathiName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Category *</label>
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
                      <option value="Personal Collection">Personal Collection</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label">Selling Price (₹) *</label>
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
                    <label className="field-label">Original MRP (₹)</label>
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
                    <label className="field-label">Saree Color *</label>
                    <input
                      type="text"
                      className="input-royal"
                      placeholder="e.g. Royal Blue / Rani Pink"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Pallu Motif</label>
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
                    <label className="field-label">Border Type</label>
                    <input
                      type="text"
                      className="input-royal"
                      placeholder="e.g. Munia Border / Narali Border"
                      value={formData.borderType}
                      onChange={(e) => setFormData({ ...formData, borderType: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Fabric & Silk</label>
                    <input
                      type="text"
                      className="input-royal"
                      value={formData.fabric}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Weaver / Saree Description</label>
                  <textarea
                    className="input-royal"
                    rows="3"
                    placeholder="Details about the handloom weave, zari quality, and occasion recommendations..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                {errorMsg && <div className="error-banner">{errorMsg}</div>}

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold" disabled={isUploading}>
                    {isUploading ? (
                      <span>Saving Weave...</span>
                    ) : (
                      <>
                        <IconSparkles size={18} />
                        <span>Add Saree to Paithani Vastram</span>
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
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }
        .upload-modal-content {
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          background: #190520;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 30px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 16px;
        }
        .modal-title {
          font-size: 1.8rem;
          color: #fff;
          margin-top: 6px;
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
        .dropzone {
          border: 2px dashed rgba(212, 175, 55, 0.35);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: var(--transition);
          overflow: hidden;
          min-height: 280px;
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
          font-size: 0.96rem;
          color: #fff;
          margin-bottom: 6px;
        }
        .dropzone-placeholder p {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }
        .dropzone-btn {
          font-size: 0.82rem;
          padding: 8px 16px;
        }
        .preview-container {
          position: relative;
          width: 100%;
          height: 320px;
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .change-img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
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
          margin-top: 16px;
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
          height: 52px;
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
          gap: 16px;
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
            min-height: 220px;
          }
        }
      `}</style>
    </div>
  );
}
