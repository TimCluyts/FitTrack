import type {GoalPeriod} from '../types/fitness';

export function activeGoalForDate(periods: GoalPeriod[], date: string): GoalPeriod | undefined {
	return [...periods]
		.sort((a, b) => b.from.localeCompare(a.from))
		.find(p => p.from <= date);
}

export function currentActiveGoal(periods: GoalPeriod[]): GoalPeriod | undefined {
	const today = new Date().toISOString().slice(0, 10);
	return activeGoalForDate(periods, today);
}

export function goalSummary(p: GoalPeriod): string {
	const parts: string[] = [];
	if (p.kcalMin != null || p.kcalMax != null)
		parts.push(`${p.kcalMin ?? '?'}–${p.kcalMax ?? '?'} kcal`);
	if (p.protein != null) parts.push(`≥${p.protein}g prot`);
	if (p.fat != null) parts.push(`≤${p.fat}g fat`);
	if (p.carbs != null) parts.push(`≤${p.carbs}g carbs`);
	return parts.length ? parts.join(' · ') : 'No values set';
}
