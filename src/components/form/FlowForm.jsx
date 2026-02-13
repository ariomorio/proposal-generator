import React from 'react';

export default function FlowForm({ data, onChange }) {
    const update = (key, val) => onChange({ ...data, [key]: val });

    const updateStep = (index, field, val) => {
        const steps = [...data.steps];
        steps[index] = { ...steps[index], [field]: val };
        update('steps', steps);
    };

    const updatePayment = (index, field, val) => {
        const methods = [...data.paymentMethods];
        methods[index] = { ...methods[index], [field]: val };
        update('paymentMethods', methods);
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <div className="section-number">6</div>
                <h2 className="section-title">掲載までの流れ・支払い</h2>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">掲載ステップ</label>
                    {data.steps.map((step, i) => (
                        <div key={i} className="flow-step-row">
                            <span className="flow-step-number">{i + 1}</span>
                            <input className="form-input" placeholder="ステップ名"
                                value={step.title} onChange={(e) => updateStep(i, 'title', e.target.value)} />
                            <input className="form-input" placeholder="説明（任意）"
                                value={step.description} onChange={(e) => updateStep(i, 'description', e.target.value)} />
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label className="form-label">支払い方法</label>
                    {data.paymentMethods.map((pm, i) => (
                        <div key={i} className="payment-row">
                            <input className="form-input" placeholder={`方法名 (例: ${i === 0 ? '現金' : '銀行振込'})`}
                                value={pm.method} onChange={(e) => updatePayment(i, 'method', e.target.value)} />
                            <textarea className="form-textarea" placeholder={`詳細 (例: ${i === 0 ? 'ご来店時にお支払い' : '請求書をお送りします'})`}
                                value={pm.note} onChange={(e) => updatePayment(i, 'note', e.target.value)}
                                rows={2} />
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label className="form-label">注記</label>
                    <input className="form-input" value={data.note}
                        onChange={(e) => update('note', e.target.value)} />
                </div>
            </div>
        </div>
    );
}
