import React from 'react';

const AGE_BUCKETS = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

export default function FollowerForm({ data, onChange, errors = {} }) {
    const update = (key, val) => onChange({ ...data, [key]: val });

    const updateAge = (bucket, val) => {
        update('ageDistribution', { ...data.ageDistribution, [bucket]: Number(val) || 0 });
    };

    const updateRegion = (index, field, val) => {
        const regions = [...data.regions];
        regions[index] = { ...regions[index], [field]: field === 'percentage' ? (Number(val) || 0) : val };
        update('regions', regions);
    };

    const totalRegion = data.regions.reduce((s, r) => s + (Number(r.percentage) || 0), 0);
    const otherRegion = Math.max(0, 100 - totalRegion);

    return (
        <div className="form-section">
            <div className="section-header">
                <div className="section-number">3</div>
                <h2 className="section-title">フォロワー層</h2>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">年齢分布 (%)<span className="required">*</span></label>
                    <div className="age-grid">
                        {AGE_BUCKETS.map((bucket) => (
                            <div key={bucket} className="age-item">
                                <label className="age-label">{bucket}歳</label>
                                <input className="form-input" type="number" min="0" max="100"
                                    value={data.ageDistribution[bucket] || 0}
                                    onChange={(e) => updateAge(bucket, e.target.value)} />
                            </div>
                        ))}
                    </div>
                    {errors.ageDistribution && <span className="form-error">⚠ {errors.ageDistribution}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">性別比率 (%)<span className="required">*</span></label>
                    <div className="gender-row">
                        <div className="gender-item">
                            <label className="age-label">男性</label>
                            <input className="form-input" type="number" min="0" max="100" step="0.1"
                                value={data.genderMale}
                                onChange={(e) => {
                                    const v = Number(e.target.value) || 0;
                                    onChange({ ...data, genderMale: v, genderFemale: Math.round((100 - v) * 10) / 10 });
                                }} />
                        </div>
                        <div className="gender-item">
                            <label className="age-label">女性</label>
                            <input className="form-input" type="number" min="0" max="100" step="0.1"
                                value={data.genderFemale} readOnly style={{ opacity: 0.6 }} />
                        </div>
                    </div>
                    {errors.gender && <span className="form-error">⚠ {errors.gender}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <span>地域分布</span>
                        <div className="toggle-wrapper" style={{ marginLeft: 'auto' }}>
                            <div className={`toggle ${data.showRegion ? 'active' : ''}`}
                                onClick={() => update('showRegion', !data.showRegion)}>
                                <div className="toggle-knob" />
                            </div>
                            <span className="toggle-label">{data.showRegion ? 'ON' : 'OFF'}</span>
                        </div>
                    </label>
                </div>

                {data.showRegion && (
                    <div className="form-group">
                        <label className="form-label">上位5地域</label>
                        {data.regions.map((r, i) => (
                            <div key={i} className="region-row">
                                <input className="form-input" placeholder={`地域名 (例: 福岡市)`}
                                    value={r.name} onChange={(e) => updateRegion(i, 'name', e.target.value)} />
                                <input className="form-input" type="number" min="0" max="100"
                                    placeholder="%" value={r.percentage || ''}
                                    onChange={(e) => updateRegion(i, 'percentage', e.target.value)} />
                                <span className="region-percent">%</span>
                            </div>
                        ))}
                        <div className="region-other">
                            その他: <strong>{otherRegion}%</strong>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">備考（任意）</label>
                    <textarea className="form-textarea" placeholder="例: 台湾・香港(7％程度)など海外フォロワーも保有し、訪日客への訴求も可能"
                        value={data.followerNote || ''} onChange={(e) => update('followerNote', e.target.value)} />
                </div>
            </div>
        </div>
    );
}
