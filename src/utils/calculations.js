// Calculation utilities for proposal generator

/**
 * Calculate estimated sales from case study data
 * @param {number} savedCount - Number of saves/bookmarks
 * @param {number} conversionRate - Conversion rate (default: 1/100)
 * @param {number} avgGroupSize - Average group size (default: 2)
 * @param {number} avgSpend - Average spend per person
 * @returns {object} Calculation breakdown
 */
export function calculateEstimatedSales(savedCount, conversionRate = 0.01, avgGroupSize = 2, avgSpend = 5500) {
    const estimatedGroups = Math.round(savedCount * conversionRate);
    const estimatedVisitors = estimatedGroups * avgGroupSize;
    const estimatedSales = estimatedVisitors * avgSpend;

    return {
        estimatedGroups,
        estimatedVisitors,
        estimatedSales,
    };
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
    if (num == null || isNaN(num)) return '0';
    return Number(num).toLocaleString('ja-JP');
}

/**
 * Format currency (JPY)
 */
export function formatCurrency(num) {
    if (num == null || isNaN(num)) return '¥0';
    return '¥' + Number(num).toLocaleString('ja-JP');
}

/**
 * Calculate "other" percentage for region distribution
 */
export function calculateOtherRegion(regions) {
    const total = regions.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0);
    return Math.max(0, 100 - total);
}
