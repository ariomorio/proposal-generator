import React from 'react';
import { formatCurrency } from '../../utils/calculations';

export default function PricingForm({ data, onChange, errors = {} }) {
    const addPlan = () => {
        if (data.length >= 5) return;
        onChange([...data, { name: '', price: '', features: [''], platforms: ['instagram'], limitedOffer: '' }]);
    };

    const removePlan = (index) => {
        onChange(data.filter((_, i) => i !== index));
    };

    const updatePlan = (index, field, val) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: val };
        onChange(updated);
    };

    const updateFeature = (planIndex, featureIndex, val) => {
        const updated = [...data];
        const features = [...updated[planIndex].features];
        features[featureIndex] = val;
        updated[planIndex] = { ...updated[planIndex], features };
        onChange(updated);
    };

    const addFeature = (planIndex) => {
        const updated = [...data];
        updated[planIndex] = { ...updated[planIndex], features: [...updated[planIndex].features, ''] };
        onChange(updated);
    };

    const removeFeature = (planIndex, featureIndex) => {
        const updated = [...data];
        updated[planIndex] = {
            ...updated[planIndex],
            features: updated[planIndex].features.filter((_, i) => i !== featureIndex),
        };
        onChange(updated);
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <div className="section-number">5</div>
                <h2 className="section-title">料金表</h2>
                <span className="badge badge-optional">最大5プラン</span>
            </div>

            {data.map((plan, i) => {
                const planErrors = (errors && errors[i]) || {};
                return (
                    <div key={i} className="card pricing-card">
                        <div className="case-study-header">
                            <h3>プラン {i + 1}</h3>
                            {data.length > 1 && (
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removePlan(i)}>削除</button>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">プラン名<span className="required">*</span></label>
                                    <input className="form-input" placeholder="例: ライトプラン"
                                        value={plan.name} onChange={(e) => updatePlan(i, 'name', e.target.value)} />
                                    {planErrors.name && <span className="form-error">⚠ {planErrors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">価格 (円)<span className="required">*</span></label>
                                    <input className="form-input" type="number" placeholder="50000"
                                        value={plan.price} onChange={(e) => updatePlan(i, 'price', e.target.value)} />
                                    {planErrors.price && <span className="form-error">⚠ {planErrors.price}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">内容（箇条書き）<span className="required">*</span></label>
                                {plan.features.map((f, fi) => (
                                    <div key={fi} className="feature-row">
                                        <input className="form-input" placeholder="例: 基本の認知拡大"
                                            value={f} onChange={(e) => updateFeature(i, fi, e.target.value)} />
                                        {plan.features.length > 1 && (
                                            <button type="button" className="btn btn-danger btn-sm"
                                                onClick={() => removeFeature(i, fi)}>✕</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => addFeature(i)}>
                                    ＋ 項目追加
                                </button>
                            </div>

                            <div className="form-group">
                                <label className="form-label">期間限定文言（任意）</label>
                                <input className="form-input" placeholder="例: 2026年2月末までの期間限定価格"
                                    value={plan.limitedOffer} onChange={(e) => updatePlan(i, 'limitedOffer', e.target.value)} />
                            </div>
                        </div>
                    </div>
                );
            })}

            {data.length < 5 && (
                <button type="button" className="btn btn-secondary" onClick={addPlan}>
                    ＋ プラン追加
                </button>
            )}
        </div>
    );
}
