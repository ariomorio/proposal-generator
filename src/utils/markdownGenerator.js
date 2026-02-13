/**
 * Markdown Generator — Converts form data into structured Markdown
 * for use as a NotebookLM data source.
 */
import { formatNumber, formatCurrency, calculateEstimatedSales } from './calculations';

/**
 * Generate the full proposal Markdown document
 * @param {object} formData - All form data
 * @param {object} chapters - Chapter toggle states
 * @returns {string} Markdown string
 */
export function generateProposalMarkdown(formData, chapters) {
    const sections = [];

    // Cover / Header (always included)
    sections.push(generateCoverSection(formData.cover));

    // Performance
    if (chapters.performance) {
        sections.push(generatePerformanceSection(formData.performance));
    }

    // Follower
    if (chapters.follower) {
        sections.push(generateFollowerSection(formData.follower));
    }

    // Case Studies
    if (chapters.caseStudies && formData.caseStudies?.length > 0) {
        sections.push(generateCaseStudiesSection(formData.caseStudies));
    }

    // Pricing
    if (chapters.pricing) {
        sections.push(generatePricingSection(formData.pricingPlans));
    }

    // Flow
    if (chapters.flow) {
        sections.push(generateFlowSection(formData.flow));
    }

    // Contact (always included)
    sections.push(generateContactSection(formData.contact));

    return sections.filter(Boolean).join('\n\n---\n\n');
}

function generateCoverSection(cover) {
    const { accountName, category, title, sns } = cover;
    const snsNames = [];
    if (sns?.instagram) snsNames.push('Instagram');
    if (sns?.tiktok) snsNames.push('TikTok');
    if (sns?.youtube) snsNames.push('YouTube');

    return `# ${accountName || '（アカウント名未入力）'} ${title || 'PRご提案資料'}

- **アカウント名**: ${accountName || '（未入力）'}
- **カテゴリ**: ${category || '（未入力）'}
- **SNSプラットフォーム**: ${snsNames.join(', ') || '（未選択）'}`;
}

function generatePerformanceSection(perf) {
    const { totalFollowers, kpis, followerHistory, appealText } = perf;
    let md = `## 01. アカウント概要と実績\n\n`;

    md += `### 基本情報\n`;
    md += `- **総フォロワー数**: ${totalFollowers ? formatNumber(totalFollowers) + '人' : '（未入力）'}\n`;

    // KPIs
    const validKpis = (kpis || []).filter(k => k.label || k.value);
    if (validKpis.length > 0) {
        md += `\n### 主要KPI\n`;
        validKpis.forEach(kpi => {
            md += `- **${kpi.label}**: ${kpi.value || '—'}\n`;
        });
    }

    // Follower History
    const validHistory = (followerHistory || []).filter(h => h.month && h.value);
    if (validHistory.length > 0) {
        md += `\n### フォロワー推移\n`;
        md += `| 期間 | フォロワー数 |\n`;
        md += `| --- | --- |\n`;
        validHistory.forEach(h => {
            md += `| ${h.month} | ${formatNumber(h.value)}人 |\n`;
        });
    }

    // Appeal Text
    if (appealText) {
        md += `\n### アピールポイント\n${appealText}\n`;
    }

    return md;
}

function generateFollowerSection(follower) {
    const { ageDistribution, genderMale, genderFemale, showRegion, regions, followerNote } = follower;
    let md = `## 02. フォロワー層について\n\n`;

    // Age Distribution
    const ageEntries = Object.entries(ageDistribution || {}).filter(([, v]) => v > 0);
    if (ageEntries.length > 0) {
        md += `### 年齢分布\n`;
        md += `| 年齢層 | 割合 |\n`;
        md += `| --- | --- |\n`;
        ageEntries.forEach(([label, value]) => {
            md += `| ${label}歳 | ${value}% |\n`;
        });
    }

    // Gender
    md += `\n### 性別比率\n`;
    md += `- **男性**: ${genderMale}%\n`;
    md += `- **女性**: ${genderFemale}%\n`;

    // Regions
    if (showRegion) {
        const validRegions = (regions || []).filter(r => r.name);
        if (validRegions.length > 0) {
            md += `\n### 地域分布\n`;
            md += `| 地域 | 割合 |\n`;
            md += `| --- | --- |\n`;
            validRegions.forEach(r => {
                md += `| ${r.name} | ${r.percentage}% |\n`;
            });
        }
    }

    if (followerNote) {
        md += `\n### 補足\n${followerNote}\n`;
    }

    return md;
}

function generateCaseStudiesSection(caseStudies) {
    let md = `## 03. PR実績ご紹介（インサイト）\n\n`;

    caseStudies.forEach((cs, i) => {
        const saves = Number(cs.saves) || 0;
        const rate = Number(cs.conversionRate) || 0.01;
        const groupSize = Number(cs.avgGroupSize) || 2;
        const spend = Number(cs.avgSpend) || 5500;
        const { estimatedGroups, estimatedVisitors, estimatedSales } = calculateEstimatedSales(saves, rate, groupSize, spend);

        md += `### 案件${i + 1}: ${cs.name || '（案件名未入力）'}\n\n`;
        md += `- **投稿日**: ${cs.date || '（未入力）'}\n`;
        md += `- **客単価**: ${formatCurrency(spend)}\n\n`;

        md += `#### インサイト数値\n`;
        md += `| 指標 | 数値 |\n`;
        md += `| --- | --- |\n`;
        if (cs.views) md += `| 再生数 | ${formatNumber(cs.views)} |\n`;
        if (cs.reach) md += `| リーチ数 | ${formatNumber(cs.reach)} |\n`;
        if (cs.comments) md += `| コメント数 | ${formatNumber(cs.comments)} |\n`;
        if (cs.saves) md += `| 保存数 | ${formatNumber(cs.saves)} |\n`;

        md += `\n#### 売上試算\n`;
        md += `- 計算方法: 「保存数」の1/100を「来客予定組数」として試算\n`;
        md += `- 来客予定組数: ${formatNumber(estimatedGroups)}組\n`;
        md += `- 計算式: ${formatNumber(estimatedGroups)}組 × ${groupSize}名 × ${formatCurrency(spend)}\n`;
        md += `- **見込売上: ${formatCurrency(estimatedSales)}**\n\n`;
    });

    return md;
}

function generatePricingSection(plans) {
    let md = `## 04. SNSプロモーション料金表\n\n`;

    if (!plans || plans.length === 0) {
        md += '（プラン未設定）\n';
        return md;
    }

    md += `| プラン名 | 料金 | 内容 |\n`;
    md += `| --- | --- | --- |\n`;
    plans.forEach(plan => {
        const features = (plan.features || []).filter(Boolean).join('、');
        md += `| ${plan.name} | ${formatCurrency(plan.price)} | ${features} |\n`;
    });

    const limitedOffer = plans.find(p => p.limitedOffer)?.limitedOffer;
    if (limitedOffer) {
        md += `\n> ⏰ **${limitedOffer}**\n`;
    }

    return md;
}

function generateFlowSection(flow) {
    const { steps, paymentMethods, note } = flow;
    let md = `## 05. 掲載までの流れとお支払い\n\n`;

    // Steps
    md += `### 掲載までの流れ\n`;
    (steps || []).filter(s => s.title).forEach((s, i) => {
        md += `${i + 1}. **${s.title}**`;
        if (s.description) md += ` — ${s.description}`;
        md += '\n';
    });

    // Payment
    if (paymentMethods?.length > 0) {
        md += `\n### お支払い方法\n`;
        paymentMethods.forEach((pm, i) => {
            md += `${i + 1}. **${pm.method}**: ${pm.note}\n`;
        });
    }

    if (note) {
        md += `\n> ${note}\n`;
    }

    return md;
}

function generateContactSection(contact) {
    const { email, snsHandle, businessName } = contact;
    let md = `## お問い合わせ\n\n`;
    md += `ご覧いただきありがとうございました。\n\n`;
    if (businessName) md += `- **事業者名**: ${businessName}\n`;
    if (snsHandle) md += `- **SNS**: ${snsHandle}\n`;
    md += `- **メール**: ${email || '（未入力）'}\n`;
    return md;
}
