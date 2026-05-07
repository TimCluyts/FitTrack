import {useState} from 'react';
import {useRoutines, useAddRoutine, useUpdateRoutine} from './useApi';
import {useActiveSessionStore} from '../store/activeSessionStore';
import type {RoutineExercise} from '../types/fitness';

export type TrainingMode =
	| {view: 'overview'}
	| {view: 'editRoutine'; routineId: string}
	| {view: 'logWorkout'; routineId: string};

export function useTrainingMode() {
	const [mode, setMode] = useState<TrainingMode>({view: 'overview'});
	const [showRunForm, setShowRunForm] = useState(false);
	const {data: routines = []} = useRoutines();
	const addRoutine = useAddRoutine();
	const updateRoutine = useUpdateRoutine();
	const {session, startSession, clearSession} = useActiveSessionStore();

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

	const handleStartWorkout = (routineId: string) => {
		const routine = routines.find(r => r.id === routineId);
		if (!routine) return;

		if (session && session.routineId !== routineId) {
			if (!globalThis.confirm(`You have an active "${session.routineName}" session. Discard it and start a new one?`)) return;
		}

		startSession({
			routineId,
			routineName: routine.name,
			date: new Date().toISOString().slice(0, 10),
			draft: routine.exercises.map(re => ({
				exerciseId: re.exerciseId,
				sets: Array.from({length: re.targetSets}, () => ({weight: '', reps: ''}))
			})),
			doneExerciseIds: []
		});
		setMode({view: 'logWorkout', routineId});
	};

	const handleResumeSession = () => {
		if (session) setMode({view: 'logWorkout', routineId: session.routineId});
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
		handleStartWorkout,
		handleResumeSession,
		session,
		clearSession,
		showRunForm,
		toggleRunForm,
		closeRunForm
	};
}
