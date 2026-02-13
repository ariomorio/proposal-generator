// Validation rules for proposal generator

export function validateCover(data) {
    const errors = {};
    if (!data.accountName?.trim()) errors.accountName = 'アカウント名は必須です';
    if (!data.category?.trim()) errors.category = 'カテゴリは必須です';
    if (!data.title?.trim()) errors.title = '資料タイトルは必須です';
    if (!data.coverImage) errors.coverImage = '表紙画像は必須です';
    return errors;
}

export function validatePerformance(data) {
    const errors = {};
    if (!data.totalFollowers) errors.totalFollowers = '総フォロワー数は必須です';
    if (!data.kpis || data.kpis.length === 0) errors.kpis = 'KPI数値を入力してください';
    if (!data.followerHistory || data.followerHistory.length < 2) {
        errors.followerHistory = 'フォロワー推移データを2つ以上入力してください';
    }
    return errors;
}

export function validateFollower(data) {
    const errors = {};
    if (!data.ageDistribution || Object.keys(data.ageDistribution).length === 0) {
        errors.ageDistribution = '年齢分布は必須です';
    }
    if (data.genderMale == null || data.genderFemale == null) {
        errors.gender = '性別比率は必須です';
    }
    return errors;
}

export function validateCaseStudy(caseStudy) {
    const errors = {};
    if (!caseStudy.name?.trim()) errors.name = '案件名は必須です';
    if (!caseStudy.date) errors.date = '投稿日は必須です';
    if (!caseStudy.views) errors.views = '再生数は必須です';
    if (!caseStudy.thumbnail) errors.thumbnail = 'サムネ画像は必須です';
    if (!caseStudy.avgSpend) errors.avgSpend = '客単価は必須です';
    if (!caseStudy.conversionRate) errors.conversionRate = '売上計算係数は必須です';
    return errors;
}

export function validatePricing(plan) {
    const errors = {};
    if (!plan.name?.trim()) errors.name = 'プラン名は必須です';
    if (!plan.price) errors.price = '価格は必須です';
    if (!plan.features || plan.features.length === 0) errors.features = '内容は必須です';
    return errors;
}

export function validateContact(data) {
    const errors = {};
    if (!data.email?.trim()) errors.email = 'メールアドレスは必須です';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = '有効なメールアドレスを入力してください';
    }
    return errors;
}

/**
 * Validate all form data for PDF generation readiness
 */
export function validateAll(formData, chapters) {
    const errors = {};

    // Cover is always required
    const coverErrors = validateCover(formData.cover);
    if (Object.keys(coverErrors).length) errors.cover = coverErrors;

    // Contact is always required
    const contactErrors = validateContact(formData.contact);
    if (Object.keys(contactErrors).length) errors.contact = contactErrors;

    // Conditional validations based on chapter toggles
    if (chapters.performance) {
        const perfErrors = validatePerformance(formData.performance);
        if (Object.keys(perfErrors).length) errors.performance = perfErrors;
    }

    if (chapters.follower) {
        const followerErrors = validateFollower(formData.follower);
        if (Object.keys(followerErrors).length) errors.follower = followerErrors;
    }

    if (chapters.caseStudies && formData.caseStudies?.length > 0) {
        const csErrors = [];
        formData.caseStudies.forEach((cs, i) => {
            const e = validateCaseStudy(cs);
            if (Object.keys(e).length) csErrors[i] = e;
        });
        if (csErrors.length) errors.caseStudies = csErrors;
    }

    if (chapters.pricing && formData.pricingPlans?.length > 0) {
        const pErrors = [];
        formData.pricingPlans.forEach((p, i) => {
            const e = validatePricing(p);
            if (Object.keys(e).length) pErrors[i] = e;
        });
        if (pErrors.length) errors.pricingPlans = pErrors;
    }

    return errors;
}
