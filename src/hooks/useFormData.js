import { useState, useCallback } from 'react';

const defaultChapters = {
    cover: true,       // always on
    contents: true,
    performance: true,
    follower: true,
    caseStudies: true,
    pricing: true,
    flow: true,
    contact: true,     // always on
};

const defaultFormData = {
    cover: {
        accountName: '',
        category: '',
        title: 'PRご提案資料',
        coverImage: null,
        coverImagePreview: null,
        sns: { instagram: true, tiktok: true, youtube: true },
    },
    performance: {
        totalFollowers: '',
        kpis: [
            { label: '100万再生', value: '' },
            { label: '動画本数', value: '' },
        ],
        followerHistory: [
            { month: '2025年1月', value: '' },
            { month: '2025年3月', value: '' },
            { month: '2025年5月', value: '' },
            { month: '2025年7月', value: '' },
            { month: '2025年9月', value: '' },
            { month: '2025年11月', value: '' },
            { month: '2026年1月', value: '' },
        ],
        appealText: '',
    },
    follower: {
        ageDistribution: {
            '13-17': 0,
            '18-24': 0,
            '25-34': 0,
            '35-44': 0,
            '45-54': 0,
            '55-64': 0,
            '65+': 0,
        },
        genderMale: 58.5,
        genderFemale: 41.5,
        showRegion: false,
        regions: [
            { name: '', percentage: 0 },
            { name: '', percentage: 0 },
            { name: '', percentage: 0 },
            { name: '', percentage: 0 },
            { name: '', percentage: 0 },
        ],
        followerNote: '',
    },
    caseStudies: [],
    pricingPlans: [
        {
            name: 'ライトプラン',
            price: 50000,
            features: ['基本の認知拡大', 'ブランディング', '構成/撮影/編集/運用', 'ストーリー(2枚)', 'スレッズ(1回)'],
            platforms: ['instagram'],
            limitedOffer: '',
        },
    ],
    flow: {
        steps: [
            { title: '料金の確認', description: '' },
            { title: '取材日決め', description: '' },
            { title: '取材・撮影', description: '' },
            { title: '投稿作成', description: '3〜7日' },
            { title: '内容確認', description: '下書き提出' },
            { title: '掲載', description: '' },
        ],
        paymentMethods: [
            { method: '', note: '' },
            { method: '', note: '' },
        ],
        note: '',
    },
    contact: {
        email: '',
        snsHandle: '',
        businessName: '',
    },
};

export function useFormData() {
    const [chapters, setChapters] = useState(defaultChapters);
    const [formData, setFormData] = useState(defaultFormData);

    const toggleChapter = useCallback((key) => {
        if (key === 'cover' || key === 'contact') return; // can't toggle these
        setChapters(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const updateFormSection = useCallback((section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: typeof data === 'function' ? data(prev[section]) : data,
        }));
    }, []);

    const resetAll = useCallback(() => {
        setChapters(defaultChapters);
        setFormData(defaultFormData);
    }, []);

    return {
        chapters,
        formData,
        toggleChapter,
        updateFormSection,
        resetAll,
    };
}
