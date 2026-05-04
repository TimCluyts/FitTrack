import {useState} from 'react';
import {useRoutines, useAddRoutine, useUpdateRoutine} from './useApi';
import type {RoutineExercise} from '../types/fitness';

export type TrainingMode =
	| {view: 'overview'}
	| {view: 'editRoutine'; routineId: string | 'new'}
	| {view: 'logWorkout'; routineId: string};

export function useTrainingMode() {
	const [mode, setMode] = useState<TrainingMode>({view: 'overview'});
	const [showRunForm, setShowRunForm] = useState(false);
	const {data: routines = []} = useRoutines();
	const addRoutine = useAddRoutine();
	const updateRoutine = useUpdateRoutine();

	const editingRoutine =
		mode.view === 'editRoutine' && mode.routineId !== 'new'
			? routines.find(r => r.id === mode.routineId)
			: undefined;

	const loggingRoutine =
		mode.view === 'logWorkout'
			? routines.find(r => r.id === mode.routineId)
			: undefined;

	const handleSaveRoutine = (name: string, exercises: RoutineExercise[]) => {
		if (mode.view !== 'editRoutine') return;
		if (mode.routineId === 'new') {
			addRoutine.mutate({name, exercises});
		} else {
			updateRoutine.mutate({id: mode.routineId, data: {name, exercises}});
		}
		setMode({view: 'overview'});
	};

	const toggleRunForm = () => {
		setShowRunForm(v => !v);
		setMode({view: 'overview'});
	};

	const closeRunForm = () => setShowRunForm(false);

	return {
		mode,
		setMode,
		routines,
		editingRoutine,
		loggingRoutine,
		handleSaveRoutine,
		showRunForm,
		toggleRunForm,
		closeRunForm
	};
}
