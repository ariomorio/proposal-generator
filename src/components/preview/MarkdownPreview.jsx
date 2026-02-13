import React, { useMemo, useState } from 'react';
import { generateProposalMarkdown } from '../../utils/markdownGenerator';

/**
 * MarkdownPreview — Shows generated Markdown and provides download
 */
export default function MarkdownPreview({ formData, chapters, errors }) {
    const [copied, setCopied] = useState(false);

    const markdown = useMemo(() => {
        return generateProposalMarkdown(formData, chapters);
    }, [formData, chapters]);

    const hasErrors = errors && Object.keys(errors).length > 0;

    const downloadMarkdown = () => {
        const accountName = formData.cover?.accountName || 'proposal';
        const fileName = `${accountName}_proposal_data.md`;
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadDesignGuide = async () => {
        try {
            const res = await fetch('/design_guide.md');
            const text = await res.text();
            const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'design_guide.md';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Design guide download failed:', err);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(markdown);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    return (
        <div className="markdown-preview-container">
            <div className="markdown-preview-header">
                <h2 className="preview-title">📄 Markdown出力</h2>
                <p className="preview-subtitle">
                    NotebookLMにデータセットとしてアップロードするMarkdownファイルを生成します
                </p>
            </div>

            {hasErrors && (
                <div className="preview-warning">
                    ⚠ 未入力の必須項目があります。出力前に修正することを推奨します。
                </div>
            )}

            {/* Download Buttons */}
            <div className="download-section">
                <h3 className="download-section-title">📥 ファイルダウンロード</h3>
                <p className="download-description">
                    以下の2つのファイルをNotebookLMにアップロードしてください
                </p>

                <div className="download-cards">
                    <div className="download-card">
                        <div className="download-card-icon">📊</div>
                        <h4 className="download-card-title">提案データ</h4>
                        <p className="download-card-desc">
                            入力した情報を構造化したMarkdownファイル
                        </p>
                        <button className="btn btn-primary" onClick={downloadMarkdown}>
                            ダウンロード (.md)
                        </button>
                    </div>

                    <div className="download-card">
                        <div className="download-card-icon">🎨</div>
                        <h4 className="download-card-title">デザインガイド</h4>
                        <p className="download-card-desc">
                            参考元PDFのデザイン情報をまとめたガイド
                        </p>
                        <button className="btn btn-secondary" onClick={downloadDesignGuide}>
                            ダウンロード (.md)
                        </button>
                    </div>
                </div>
            </div>

            {/* Markdown Preview */}
            <div className="markdown-content-section">
                <div className="markdown-content-header">
                    <h3>プレビュー（提案データ）</h3>
                    <button
                        className={`btn btn-secondary copy-btn ${copied ? 'copied' : ''}`}
                        onClick={copyToClipboard}
                    >
                        {copied ? '✓ コピーしました' : '📋 コピー'}
                    </button>
                </div>
                <pre className="markdown-raw">{markdown}</pre>
            </div>
        </div>
    );
}
