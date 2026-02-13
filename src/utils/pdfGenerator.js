import { jsPDF } from 'jspdf';

/**
 * PDF Generator — Combines proposal data, design guide, and images into a single PDF.
 * Uses jsPDF with built-in font (Helvetica) for structure and embeds images.
 * Japanese text is rendered via UTF-16 encoding support.
 */

const PAGE_WIDTH = 210; // A4 mm
const PAGE_HEIGHT = 297;
const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 6;
const FONT_SIZE_TITLE = 18;
const FONT_SIZE_H2 = 14;
const FONT_SIZE_H3 = 12;
const FONT_SIZE_BODY = 10;

/**
 * Load a font file and register it with jsPDF for Japanese text support.
 */
async function loadJapaneseFont(doc) {
    try {
        // Try loading Noto Sans JP from Google Fonts CDN
        const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.1/files/noto-sans-jp-japanese-400-normal.woff';
        const response = await fetch(fontUrl);
        if (!response.ok) throw new Error('Font fetch failed');
        const buffer = await response.arrayBuffer();
        const base64 = arrayBufferToBase64(buffer);
        doc.addFileToVFS('NotoSansJP-Regular.woff', base64);
        doc.addFont('NotoSansJP-Regular.woff', 'NotoSansJP', 'normal');
        doc.setFont('NotoSansJP');
        return true;
    } catch (e) {
        console.warn('Japanese font loading failed, falling back to default:', e);
        return false;
    }
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Check if we need a new page, and add one if so.
 * Returns the updated Y position.
 */
function checkPageBreak(doc, y, neededSpace = LINE_HEIGHT * 2) {
    if (y + neededSpace > PAGE_HEIGHT - MARGIN) {
        doc.addPage();
        return MARGIN;
    }
    return y;
}

/**
 * Write wrapped text and return the new Y position.
 */
function writeText(doc, text, x, y, fontSize, options = {}) {
    const { bold = false, color = [40, 40, 40], maxWidth = CONTENT_WIDTH } = options;
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    if (bold) {
        doc.setFont(undefined, 'bold');
    } else {
        doc.setFont(undefined, 'normal');
    }

    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
        y = checkPageBreak(doc, y);
        doc.text(line, x, y);
        y += fontSize * 0.4 + 1;
    }
    return y;
}

/**
 * Parse markdown text and render it into the PDF.
 */
function renderMarkdown(doc, markdown, startY) {
    let y = startY;
    const lines = markdown.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (!line.trim()) {
            y += LINE_HEIGHT * 0.5;
            continue;
        }

        // H1 — Title
        if (line.startsWith('# ')) {
            y = checkPageBreak(doc, y, 15);
            y += 3;
            y = writeText(doc, line.slice(2), MARGIN, y, FONT_SIZE_TITLE, { bold: true });
            // Underline
            doc.setDrawColor(212, 175, 55);
            doc.setLineWidth(0.5);
            doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
            y += 5;
            continue;
        }

        // H2
        if (line.startsWith('## ')) {
            y = checkPageBreak(doc, y, 12);
            y += 4;
            y = writeText(doc, line.slice(3), MARGIN, y, FONT_SIZE_H2, { bold: true, color: [170, 140, 44] });
            y += 2;
            continue;
        }

        // H3
        if (line.startsWith('### ')) {
            y = checkPageBreak(doc, y, 10);
            y += 2;
            y = writeText(doc, line.slice(4), MARGIN, y, FONT_SIZE_H3, { bold: true });
            y += 1;
            continue;
        }

        // Table row
        if (line.startsWith('|')) {
            if (line.includes('---')) continue; // skip separator

            const cells = line.split('|').filter(c => c.trim());
            if (cells.length >= 2) {
                y = checkPageBreak(doc, y, 8);
                const label = cells[0].trim();
                const value = cells.slice(1).join(' | ').trim();

                // Draw label in bold
                doc.setFontSize(FONT_SIZE_BODY);
                doc.setTextColor(100, 100, 100);
                doc.setFont(undefined, 'bold');
                doc.text(label, MARGIN + 2, y);

                // Draw value
                doc.setFont(undefined, 'normal');
                doc.setTextColor(40, 40, 40);
                const valueLines = doc.splitTextToSize(value, CONTENT_WIDTH - 60);
                for (const vl of valueLines) {
                    doc.text(vl, MARGIN + 55, y);
                    y += LINE_HEIGHT;
                }
                if (valueLines.length === 0) y += LINE_HEIGHT;
                continue;
            }
        }

        // Bullet point
        if (line.match(/^\s*[-*]\s/)) {
            y = checkPageBreak(doc, y);
            const indent = line.match(/^(\s*)/)[1].length;
            const bulletX = MARGIN + 3 + indent * 2;
            const textContent = line.replace(/^\s*[-*]\s/, '');
            doc.setFontSize(FONT_SIZE_BODY);
            doc.setTextColor(40, 40, 40);
            doc.setFont(undefined, 'normal');
            doc.text('•', bulletX, y);
            const wrapped = doc.splitTextToSize(textContent, CONTENT_WIDTH - indent * 2 - 8);
            for (const wl of wrapped) {
                doc.text(wl, bulletX + 5, y);
                y += LINE_HEIGHT;
            }
            continue;
        }

        // Numbered list
        if (line.match(/^\s*\d+\.\s/)) {
            y = checkPageBreak(doc, y);
            const numMatch = line.match(/^(\s*)(\d+)\.\s(.*)/);
            if (numMatch) {
                const indent = numMatch[1].length;
                const num = numMatch[2];
                const textContent = numMatch[3];
                const numX = MARGIN + 3 + indent * 2;
                doc.setFontSize(FONT_SIZE_BODY);
                doc.setTextColor(40, 40, 40);
                doc.text(`${num}.`, numX, y);
                const wrapped = doc.splitTextToSize(textContent, CONTENT_WIDTH - indent * 2 - 10);
                for (const wl of wrapped) {
                    doc.text(wl, numX + 7, y);
                    y += LINE_HEIGHT;
                }
            }
            continue;
        }

        // Regular text
        y = checkPageBreak(doc, y);
        y = writeText(doc, line, MARGIN, y, FONT_SIZE_BODY);
    }

    return y;
}

/**
 * Add images to the PDF.
 */
function addImages(doc, images, startY) {
    if (!images || images.length === 0) return startY;

    let y = startY;
    y = checkPageBreak(doc, y, 20);
    y += 5;
    y = writeText(doc, '添付画像', MARGIN, y, FONT_SIZE_H2, { bold: true, color: [170, 140, 44] });
    y += 3;

    for (const img of images) {
        y = checkPageBreak(doc, y, 80);

        // Label
        y = writeText(doc, img.label, MARGIN, y, FONT_SIZE_BODY, { bold: true });
        y += 2;

        try {
            // Determine image format from data URL
            const format = img.dataUrl.includes('image/png') ? 'PNG' : 'JPEG';
            const maxImgWidth = CONTENT_WIDTH * 0.7;
            const maxImgHeight = 70;

            doc.addImage(img.dataUrl, format, MARGIN, y, maxImgWidth, maxImgHeight, undefined, 'FAST');
            y += maxImgHeight + 5;
        } catch (e) {
            console.warn('Failed to add image:', img.label, e);
            y = writeText(doc, `[画像を読み込めませんでした: ${img.label}]`, MARGIN, y, FONT_SIZE_BODY, { color: [200, 50, 50] });
        }

        y += 3;
    }

    return y;
}

/**
 * Generate a complete PDF with proposal data, design guide, and images.
 */
export async function generateProposalPDF(markdown, designGuideMarkdown, images, accountName) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    // Try to load Japanese font
    const hasJapaneseFont = await loadJapaneseFont(doc);
    if (!hasJapaneseFont) {
        // Fallback: use Helvetica (won't render Japanese but at least won't crash)
        doc.setFont('Helvetica');
    }

    let y = MARGIN;

    // ===== Section 1: Proposal Data =====
    y = renderMarkdown(doc, markdown, y);

    // ===== Section 2: Images =====
    doc.addPage();
    y = MARGIN;
    y = addImages(doc, images, y);

    // ===== Section 3: Design Guide =====
    doc.addPage();
    y = MARGIN;
    y = renderMarkdown(doc, designGuideMarkdown, y);

    // Save
    const fileName = `${accountName || 'proposal'}_notebooklm.pdf`;
    doc.save(fileName);

    return fileName;
}
