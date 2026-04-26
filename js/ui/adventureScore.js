// ============================================
// T.A.R.D.I.S. — Adventure Score Rules
// Centraliza a pontuação do Modo Aventura.
// ============================================

export const ADVENTURE_SCORE_RULES = Object.freeze({
    CORRECT_POINTS: 10,
    WRONG_PENALTY: 2.5
});

const normalizeScore = (value) => {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) return 0;
    return Number(numberValue.toFixed(1));
};

export const addCorrectPoints = (currentScore) => {
    return normalizeScore(currentScore + ADVENTURE_SCORE_RULES.CORRECT_POINTS);
};

export const applyWrongPenalty = (currentScore) => {
    return normalizeScore(currentScore - ADVENTURE_SCORE_RULES.WRONG_PENALTY);
};

export const getMaxAdventureScore = (totalQuestions) => {
    return totalQuestions * ADVENTURE_SCORE_RULES.CORRECT_POINTS;
};

export const getAdventureScorePercent = (score, totalQuestions) => {
    const maxScore = getMaxAdventureScore(totalQuestions);
    if (!maxScore) return 0;
    return Math.max(0, Math.round((score / maxScore) * 100));
};

export const getBadgeScoreUnits = (score) => {
    return score / ADVENTURE_SCORE_RULES.CORRECT_POINTS;
};

export const formatAdventureScore = (score) => {
    const normalized = normalizeScore(score);
    return normalized.toLocaleString('pt-BR', {
        minimumFractionDigits: Number.isInteger(normalized) ? 0 : 1,
        maximumFractionDigits: 1
    });
};

export const formatPenalty = () => {
    return ADVENTURE_SCORE_RULES.WRONG_PENALTY.toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
};
