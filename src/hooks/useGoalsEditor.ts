import {useState} from 'react';
import {useGoals, useAddGoalPeriod, useDeleteGoalPeriod} from './useApi';
import {currentActiveGoal} from '../utils/goalPeriods';
import type {DailyGoals} from '../types/fitness';

function today(): string {
	return new Date().toISOString().slice(0, 10);
}

export function useGoalsEditor() {
	const {data: periods = []} = useGoals();
	const addGoalPeriod = useAddGoalPeriod();
	const deleteGoalPeriod = useDeleteGoalPeriod();

	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState<DailyGoals>({});
	const [from, setFrom] = useState(today());

	const open = () => {
		const current = currentActiveGoal(periods);
		setDraft(
			current
				? {
						kcalMin: current.kcalMin,
						kcalMax: current.kcalMax,
						protein: current.protein,
						fat: current.fat,
						carbs: current.carbs
					}
				: {}
		);
		setFrom(today());
		setEditing(true);
	};

	const save = () => {
		addGoalPeriod.mutate({from, ...draft});
		setEditing(false);
	};

	const cancel = () => setEditing(false);

	const setField = (key: keyof DailyGoals, value: string) =>
		setDraft(d => ({...d, [key]: value ? Number(value) : undefined}));

	const deletePeriod = (id: string) => deleteGoalPeriod.mutate(id);

	return {periods, editing, draft, from, setFrom, open, save, cancel, setField, deletePeriod};
}
