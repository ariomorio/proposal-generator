import React from 'react';

const allChapters = [
    { key: 'cover', label: '表紙', required: true },
    { key: 'contents', label: 'Contents（目次）', required: false },
    { key: 'performance', label: '01 アカウント実績', required: false },
    { key: 'follower', label: '02 フォロワー層', required: false },
    { key: 'caseStudies', label: '03 PR実績', required: false },
    { key: 'pricing', label: '04 料金表', required: false },
    { key: 'flow', label: '05 流れ・支払い', required: false },
    { key: 'contact', label: '連絡先', required: true },
];

export default function ChapterToggle({ chapters, onToggle }) {
    return (
        <div className="chapter-toggle-section">
            <div className="section-header">
                <div className="section-number">📋</div>
                <h2 className="section-title">資料構成</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
                含めるセクションを選択してください
            </p>
            <div className="chapter-list">
                {allChapters.map((ch) => (
                    <div key={ch.key} className={`chapter-item ${chapters[ch.key] ? 'active' : ''}`}>
                        <label className="chapter-label">
                            <input
                                type="checkbox"
                                checked={chapters[ch.key]}
                                disabled={ch.required}
                                onChange={() => onToggle(ch.key)}
                                className="chapter-checkbox"
                            />
                            <span className="chapter-check-icon">
                                {chapters[ch.key] ? '✓' : ''}
                            </span>
                            <span className="chapter-name">{ch.label}</span>
                            {ch.required && <span className="badge badge-required">必須</span>}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
