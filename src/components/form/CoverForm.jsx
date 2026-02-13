import React, { useRef, useState } from 'react';
import ImageCropper from './ImageCropper';

export default function CoverForm({ data, onChange, errors = {} }) {
    const fileRef = useRef();
    const [cropImage, setCropImage] = useState(null);

    const update = (key, val) => onChange({ ...data, [key]: val });

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setCropImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (previewUrl, blob) => {
        onChange({ ...data, coverImage: blob, coverImagePreview: previewUrl });
        setCropImage(null);
    };

    const toggleSns = (platform) => {
        onChange({ ...data, sns: { ...data.sns, [platform]: !data.sns[platform] } });
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <div className="section-number">1</div>
                <h2 className="section-title">表紙</h2>
                <span className="badge badge-required">必須</span>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">アカウント名<span className="required">*</span></label>
                    <input className="form-input" placeholder="例: chiko's | 福岡グルメ🥢"
                        value={data.accountName} onChange={(e) => update('accountName', e.target.value)} />
                    {errors.accountName && <span className="form-error">⚠ {errors.accountName}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">カテゴリ<span className="required">*</span></label>
                    <input className="form-input" placeholder="例: グルメ / 美容 / ファッション"
                        value={data.category} onChange={(e) => update('category', e.target.value)} />
                    {errors.category && <span className="form-error">⚠ {errors.category}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">資料タイトル<span className="required">*</span></label>
                    <input className="form-input" placeholder="例: PRご提案資料"
                        value={data.title} onChange={(e) => update('title', e.target.value)} />
                    {errors.title && <span className="form-error">⚠ {errors.title}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">表紙画像 (1:1)<span className="required">*</span></label>
                    <div className="image-upload-area" onClick={() => fileRef.current?.click()}>
                        {data.coverImagePreview ? (
                            <img src={data.coverImagePreview} alt="Cover" className="image-preview" />
                        ) : (
                            <div className="image-placeholder">
                                <span className="image-placeholder-icon">📷</span>
                                <span>タップして画像を選択</span>
                            </div>
                        )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }} onChange={handleFileSelect} />
                    {errors.coverImage && <span className="form-error">⚠ {errors.coverImage}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">SNS表示</label>
                    <div className="sns-toggle-group">
                        {[
                            { key: 'instagram', label: 'Instagram', icon: '📸' },
                            { key: 'tiktok', label: 'TikTok', icon: '🎵' },
                            { key: 'youtube', label: 'YouTube', icon: '▶️' },
                        ].map((s) => (
                            <button key={s.key} type="button"
                                className={`sns-toggle-btn ${data.sns[s.key] ? 'active' : ''}`}
                                onClick={() => toggleSns(s.key)}>
                                <span>{s.icon}</span>
                                <span>{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {cropImage && (
                <ImageCropper
                    image={cropImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setCropImage(null)}
                    aspect={1}
                />
            )}
        </div>
    );
}
