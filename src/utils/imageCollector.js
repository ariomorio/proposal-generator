/**
 * Image Collector — Extracts uploaded images from form data
 * for separate download and NotebookLM upload.
 */

/**
 * Collect all uploaded images from the form data
 * @param {object} formData - All form data
 * @param {object} chapters - Chapter toggle states
 * @returns {Array<{label: string, fileName: string, dataUrl: string}>}
 */
export function collectImages(formData, chapters) {
    const images = [];
    const accountName = formData.cover?.accountName || 'account';
    const safeName = accountName.replace(/[^a-zA-Z0-9\u3000-\u9FFF]/g, '_');

    // Cover image
    if (formData.cover?.coverImagePreview) {
        images.push({
            label: `カバー画像 — ${accountName}`,
            fileName: `${safeName}_cover.${getExtFromDataUrl(formData.cover.coverImagePreview)}`,
            dataUrl: formData.cover.coverImagePreview,
        });
    }

    // Case study thumbnails
    if (chapters.caseStudies && formData.caseStudies?.length > 0) {
        formData.caseStudies.forEach((cs, i) => {
            if (cs.thumbnailPreview) {
                const csName = cs.name || `case_${i + 1}`;
                images.push({
                    label: `PR事例${i + 1} — ${csName}`,
                    fileName: `${safeName}_case_${i + 1}.${getExtFromDataUrl(cs.thumbnailPreview)}`,
                    dataUrl: cs.thumbnailPreview,
                });
            }
        });
    }

    return images;
}

/**
 * Get file extension from data URL
 */
function getExtFromDataUrl(dataUrl) {
    if (!dataUrl) return 'jpg';
    const match = dataUrl.match(/^data:image\/(\w+)/);
    if (!match) return 'jpg';
    const type = match[1];
    if (type === 'jpeg') return 'jpg';
    return type;
}

/**
 * Generate image reference text for the Markdown
 * @param {Array} images - collected images
 * @returns {string} Markdown text describing images
 */
export function generateImageReferences(images) {
    if (!images || images.length === 0) return '';

    let md = `## 添付画像一覧\n\n`;
    md += `以下の画像ファイルが別途添付されています。スライド作成時に使用してください。\n\n`;
    md += `| # | ファイル名 | 説明 | 用途 |\n`;
    md += `| --- | --- | --- | --- |\n`;

    images.forEach((img, i) => {
        const usage = img.fileName.includes('cover') ? '表紙スライドのプロフィール写真' : `PR実績スライドのサムネイル`;
        md += `| ${i + 1} | ${img.fileName} | ${img.label} | ${usage} |\n`;
    });

    return md;
}
