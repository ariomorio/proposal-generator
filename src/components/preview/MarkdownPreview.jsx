import React, { useMemo, useState } from 'react';
import { generateProposalMarkdown } from '../../utils/markdownGenerator';
import { collectImages } from '../../utils/imageCollector';
import { generateProposalPDF } from '../../utils/pdfGenerator';
import designGuideRaw from '../../data/design_guide.md?raw';

/**
 * MarkdownPreview — Shows generated output and provides download options
 */
export default function MarkdownPreview({ formData, chapters, errors }) {
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    const markdown = useMemo(() => {
        return generateProposalMarkdown(formData, chapters);
    }, [formData, chapters]);

    const images = useMemo(() => {
        return collectImages(formData, chapters);
    }, [formData, chapters]);

    const hasErrors = errors && Object.keys(errors).length > 0;

    // ===== PDF Download (Primary) =====
    const downloadPDF = async () => {
        setGenerating(true);
        try {
            const accountName = formData.cover?.accountName || 'proposal';
            await generateProposalPDF(markdown, designGuideRaw, images, accountName);
        } catch (err) {
            console.error('PDF generation failed:', err);
            alert('PDF生成に失敗しました。もう一度お試しください。');
        } finally {
            setGenerating(false);
        }
    };

    // ===== MD Downloads (Secondary) =====
    const downloadMarkdown = () => {
        const accountName = formData.cover?.accountName || 'proposal';
        const fileName = `${accountName}_proposal_data.md`;
        const blob = new Blob([markdown], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadDesignGuide = () => {
        const blob = new Blob([designGuideRaw], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'design_guide.md';
        a.click();
        URL.revokeObjectURL(url);
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
                <h2 className="preview-title">📄 NotebookLM用データ出力</h2>
                <p className="preview-subtitle">
                    提案データ・デザインガイド・画像を1つのPDFにまとめてダウンロードできます
                </p>
            </div>

            {hasErrors && (
                <div className="preview-warning">
                    ⚠ 未入力の必須項目があります。出力前に修正することを推奨します。
                </div>
            )}

            {/* NotebookLM Link */}
            <div className="notebooklm-link-section">
                <a href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer" className="notebooklm-link">
                    <span className="notebooklm-link-icon">📒</span>
                    <span>NotebookLM を開く →</span>
                </a>
            </div>

            {/* Primary: PDF Download */}
            <div className="download-section pdf-primary-section">
                <h3 className="download-section-title">📥 PDF一括ダウンロード</h3>
                <p className="download-description">
                    提案データ + デザインガイド + 画像をすべて含んだPDFを生成します。
                    このファイルをNotebookLMにアップロードしてください。
                </p>

                <div className="download-cards">
                    <div className="download-card pdf-card">
                        <div className="download-card-icon">📑</div>
                        <h4 className="download-card-title">一括PDF</h4>
                        <p className="download-card-desc">
                            全データ・画像を1つのPDFにまとめてダウンロード
                        </p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={downloadPDF}
                            disabled={generating}
                        >
                            {generating ? '⏳ 生成中...' : 'PDFをダウンロード'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Secondary: Individual MD Downloads */}
            <details className="secondary-downloads">
                <summary className="secondary-downloads-toggle">
                    📂 個別ファイルダウンロード（MD形式）
                </summary>
                <div className="download-section secondary-section">
                    <div className="download-cards">
                        <div className="download-card">
                            <div className="download-card-icon">📊</div>
                            <h4 className="download-card-title">提案データ</h4>
                            <p className="download-card-desc">
                                入力した情報を構造化したMarkdownファイル
                            </p>
                            <button className="btn btn-secondary" onClick={downloadMarkdown}>
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
            </details>

            {/* Image Preview */}
            {images.length > 0 && (
                <div className="download-section image-preview-section">
                    <h3 className="download-section-title">🖼️ 添付画像プレビュー ({images.length}枚)</h3>
                    <p className="download-description">これらの画像はPDFに含まれます</p>
                    <div className="image-export-grid">
                        {images.map((img, i) => (
                            <div key={i} className="image-export-item">
                                <div className="image-export-preview">
                                    <img src={img.dataUrl} alt={img.label} />
                                </div>
                                <div className="image-export-info">
                                    <span className="image-export-label">{img.label}</span>
                                    <span className="image-export-filename">{img.fileName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
