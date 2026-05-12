import type {DailyGoals} from '../../types/fitness';

export type MacroKey = 'protein' | 'fat' | 'carbs';

export interface MacroDayPoint {
	label: string;
	protein: number;
	fat: number;
	carbs: number;
	goalProtein?: number;
	goalFat?: number;
	goalCarbs?: number;
}

export const MACROS = [
	{
		key: 'protein' as MacroKey,
		label: 'Protein',
		color: '#48bb78',
		goalKey: 'protein' as keyof DailyGoals,
		goalPrefix: '≥',
		chartGoalKey: 'goalProtein' as const
	},
	{
		key: 'fat' as MacroKey,
		label: 'Fat',
		color: '#ed8936',
		goalKey: 'fat' as keyof DailyGoals,
		goalPrefix: '≤',
		chartGoalKey: 'goalFat' as const
	},
	{
		key: 'carbs' as MacroKey,
		label: 'Carbs',
		color: '#4299e1',
		goalKey: 'carbs' as keyof DailyGoals,
		goalPrefix: '≤',
		chartGoalKey: 'goalCarbs' as const
	}
] as const;
