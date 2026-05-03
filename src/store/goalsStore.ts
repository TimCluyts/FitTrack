import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export interface DailyGoals {
	kcalMin?: number;
	kcalMax?: number;
	protein?: number; // minimum target
	fat?: number;     // maximum target
	carbs?: number;   // maximum target
}

interface GoalsState {
	goals: Record<string, DailyGoals>;
	setGoals: (userId: string, goals: DailyGoals) => void;
}

export const useGoalsStore = create<GoalsState>()(
	persist(
		set => ({
			goals: {},
			setGoals: (userId, goals) =>
				set(s => ({goals: {...s.goals, [userId]: goals}}))
		}),
		{name: 'daily-goals'}
	)
);
