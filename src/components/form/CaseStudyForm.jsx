import React, { useRef, useState } from 'react';
import ImageCropper from './ImageCropper';
import { calculateEstimatedSales, formatNumber, formatCurrency } from '../../utils/calculations';

export default function CaseStudyForm({ data, onChange, errors = {} }) {
    const [cropIndex, setCropIndex] = useState(null);
    const [cropImage, setCropImage] = useState(null);
    const fileRefs = useRef({});

    const addCase = () => {
        if (data.length >= 10) return;
        onChange([...data, {
            name: '',
            date: '',
            views: '',
            reach: '',
            comments: '',
            saves: '',
            thumbnail: null,
            thumbnailPreview: null,
            avgSpend: 5500,
            conversionRate: 0.01,
            avgGroupSize: 2,
        }]);
    };

    const removeCase = (index) => {
        onChange(data.filter((_, i) => i !== index));
    };

    const updateCase = (index, field, val) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: val };
        onChange(updated);
    };

    const handleFileSelect = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setCropIndex(index);
            setCropImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (previewUrl, blob) => {
        updateCase(cropIndex, 'thumbnail', blob);
        updateCase(cropIndex, 'thumbnailPreview', previewUrl);
        setCropImage(null);
        setCropIndex(null);
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <div className="section-number">4</div>
                <h2 className="section-title">PR実績</h2>
                <span className="badge badge-optional">最大10件</span>
            </div>

            {data.length === 0 && (
                <div className="empty-state">
                    <p>PR実績がまだありません。0件でも資料生成可能です。</p>
                </div>
            )}

            {data.map((cs, i) => {
                const sales = calculateEstimatedSales(
                    Number(cs.saves) || 0,
                    Number(cs.conversionRate) || 0.01,
                    Number(cs.avgGroupSize) || 2,
                    Number(cs.avgSpend) || 5500
                );
                const csErrors = (errors && errors[i]) || {};

                return (
                    <div key={i} className="card case-study-card">
                        <div className="case-study-header">
                            <h3>事例 {i + 1}</h3>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCase(i)}>削除</button>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">案件名<span className="required">*</span></label>
                                <input className="form-input" placeholder="例: 博多駅近く居酒屋"
                                    value={cs.name} onChange={(e) => updateCase(i, 'name', e.target.value)} />
                                {csErrors.name && <span className="form-error">⚠ {csErrors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">投稿日<span className="required">*</span></label>
                                <input className="form-input" type="date"
                                    value={cs.date} onChange={(e) => updateCase(i, 'date', e.target.value)} />
                                {csErrors.date && <span className="form-error">⚠ {csErrors.date}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">サムネ画像 (1:1)<span className="required">*</span></label>
                                <div className="image-upload-area small" onClick={() => {
                                    if (!fileRefs.current[i]) fileRefs.current[i] = document.createElement('input');
                                    const inp = fileRefs.current[i];
                                    inp.type = 'file';
                                    inp.accept = 'image/jpeg,image/png,image/webp';
                                    inp.onchange = (e) => handleFileSelect(i, e);
                                    inp.click();
                                }}>
                                    {cs.thumbnailPreview ? (
                                        <img src={cs.thumbnailPreview} alt="Thumbnail" className="image-preview" />
                                    ) : (
                                        <div className="image-placeholder small">
                                            <span>📷</span>
                                        </div>
                                    )}
                                </div>
                                {csErrors.thumbnail && <span className="form-error">⚠ {csErrors.thumbnail}</span>}
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">再生数<span className="required">*</span></label>
                                    <input className="form-input" type="number" placeholder="546570"
                                        value={cs.views} onChange={(e) => updateCase(i, 'views', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">リーチ数</label>
                                    <input className="form-input" type="number" placeholder="388320"
                                        value={cs.reach} onChange={(e) => updateCase(i, 'reach', e.target.value)} />
                                </div>
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">コメント数</label>
                                    <input className="form-input" type="number" placeholder="39"
                                        value={cs.comments} onChange={(e) => updateCase(i, 'comments', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">保存数</label>
                                    <input className="form-input" type="number" placeholder="9437"
                                        value={cs.saves} onChange={(e) => updateCase(i, 'saves', e.target.value)} />
                                </div>
                            </div>

                            <div className="calc-section">
                                <h4>売上計算</h4>
                                <div className="form-row-3">
                                    <div className="form-group">
                                        <label className="form-label">客単価<span className="required">*</span></label>
                                        <input className="form-input" type="number" value={cs.avgSpend}
                                            onChange={(e) => updateCase(i, 'avgSpend', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">換算率</label>
                                        <input className="form-input" type="number" step="0.001" value={cs.conversionRate}
                                            onChange={(e) => updateCase(i, 'conversionRate', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">平均人数</label>
                                        <input className="form-input" type="number" value={cs.avgGroupSize}
                                            onChange={(e) => updateCase(i, 'avgGroupSize', e.target.value)} />
                                    </div>
                                </div>
                                <div className="calc-result">
                                    <span>来客予定: <strong>{formatNumber(sales.estimatedGroups)}組</strong></span>
                                    <span>見込売上: <strong className="sales-highlight">{formatCurrency(sales.estimatedSales)}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {data.length < 10 && (
                <button type="button" className="btn btn-secondary add-case-btn" onClick={addCase}>
                    ＋ PR実績を追加
                </button>
            )}

            {cropImage && (
                <ImageCropper
                    image={cropImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => { setCropImage(null); setCropIndex(null); }}
                    aspect={1}
                />
            )}
        </div>
    );
}
