import {useState} from 'react';
import {useGoals, useSetGoals} from './useApi';
import type {DailyGoals} from '../types/fitness';

export function useGoalsEditor() {
	const {data: goals} = useGoals();
	const setGoalsMutation = useSetGoals();
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState<DailyGoals>({});

	const open = () => {
		setDraft(goals ?? {});
		setEditing(true);
	};

	const save = () => {
		setGoalsMutation.mutate(draft);
		setEditing(false);
	};

	const cancel = () => setEditing(false);

	const setField = (key: keyof DailyGoals, value: string) =>
		setDraft(d => ({...d, [key]: value ? Number(value) : undefined}));

	return {goals, editing, draft, open, save, cancel, setField};
}
