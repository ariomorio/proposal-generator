import React from 'react';

export default function PerformanceForm({ data, onChange, errors = {} }) {
    const update = (key, val) => onChange({ ...data, [key]: val });

    const updateKpi = (index, field, val) => {
        const kpis = [...data.kpis];
        kpis[index] = { ...kpis[index], [field]: val };
        update('kpis', kpis);
    };

    const addKpi = () => {
        update('kpis', [...data.kpis, { label: '', value: '' }]);
    };

    const removeKpi = (index) => {
        update('kpis', data.kpis.filter((_, i) => i !== index));
    };

    const updateHistory = (index, val) => {
        const history = [...data.followerHistory];
        history[index] = { ...history[index], value: val };
        update('followerHistory', history);
    };

    const addHistoryPoint = () => {
        update('followerHistory', [...data.followerHistory, { month: '', value: '' }]);
    };

    const updateHistoryMonth = (index, val) => {
        const history = [...data.followerHistory];
        history[index] = { ...history[index], month: val };
        update('followerHistory', history);
    };

    const removeHistory = (index) => {
        update('followerHistory', data.followerHistory.filter((_, i) => i !== index));
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <div className="section-number">2</div>
                <h2 className="section-title">アカウント実績</h2>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">総フォロワー数<span className="required">*</span></label>
                    <input className="form-input" type="text" placeholder="例: 68000"
                        value={data.totalFollowers} onChange={(e) => update('totalFollowers', e.target.value)} />
                    {errors.totalFollowers && <span className="form-error">⚠ {errors.totalFollowers}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">KPI数値（複数）<span className="required">*</span></label>
                    {data.kpis.map((kpi, i) => (
                        <div key={i} className="kpi-row">
                            <input className="form-input" placeholder="ラベル (例: 100万再生)"
                                value={kpi.label} onChange={(e) => updateKpi(i, 'label', e.target.value)} />
                            <input className="form-input" placeholder="値 (例: 120本以上)"
                                value={kpi.value} onChange={(e) => updateKpi(i, 'value', e.target.value)} />
                            {data.kpis.length > 1 && (
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeKpi(i)}>✕</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addKpi}>＋ KPI追加</button>
                </div>

                <div className="form-group">
                    <label className="form-label">フォロワー推移<span className="required">*</span></label>
                    {data.followerHistory.map((h, i) => (
                        <div key={i} className="history-row">
                            <input className="form-input" placeholder="月 (例: 2025年1月)"
                                value={h.month} onChange={(e) => updateHistoryMonth(i, e.target.value)} />
                            <input className="form-input" type="number" placeholder="フォロワー数"
                                value={h.value} onChange={(e) => updateHistory(i, e.target.value)} />
                            {data.followerHistory.length > 2 && (
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeHistory(i)}>✕</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addHistoryPoint}>＋ データポイント追加</button>
                </div>

                <div className="form-group">
                    <label className="form-label">訴求文（任意）</label>
                    <textarea className="form-textarea" placeholder="例: 20代〜40代の購買意欲の高い層へのアプローチが可能"
                        value={data.appealText} onChange={(e) => update('appealText', e.target.value)} />
                </div>
            </div>
        </div>
    );
}
