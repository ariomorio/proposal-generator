import React from 'react';

export default function ContactForm({ data, onChange, errors = {} }) {
    const update = (key, val) => onChange({ ...data, [key]: val });

    return (
        <div className="form-section">
            <div className="section-header">
                <div className="section-number">7</div>
                <h2 className="section-title">連絡先</h2>
                <span className="badge badge-required">必須</span>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">メールアドレス<span className="required">*</span></label>
                    <input className="form-input" type="email" placeholder="例: info@example.com"
                        value={data.email} onChange={(e) => update('email', e.target.value)} />
                    {errors.email && <span className="form-error">⚠ {errors.email}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">SNSアカウント / 屋号（任意）</label>
                    <input className="form-input" placeholder="例: @taro_tokyo"
                        value={data.snsHandle} onChange={(e) => update('snsHandle', e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">屋号 / 事業名（任意）</label>
                    <input className="form-input" placeholder="例: taro's kitchen | 東京グルメ"
                        value={data.businessName} onChange={(e) => update('businessName', e.target.value)} />
                </div>
            </div>
        </div>
    );
}
