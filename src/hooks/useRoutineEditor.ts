import {useState} from 'react';
import type {Routine, RoutineExercise} from '../types/fitness';

export interface LocalExercise {
	exerciseId: string;
	targetSets: string;
	targetReps: string;
}

export function useRoutineEditor(initial?: Routine) {
	const [name, setName] = useState(initial?.name ?? '');
	const [exercises, setExercises] = useState<LocalExercise[]>(
		initial?.exercises.map(re => ({
			exerciseId: re.exerciseId,
			targetSets: String(re.targetSets),
			targetReps: re.targetReps ? String(re.targetReps) : ''
		})) ?? []
	);

	const addExercise = (
		exerciseId: string,
		targetSets: number,
		targetReps?: number
	) =>
		setExercises(prev => [
			...prev,
			{
				exerciseId,
				targetSets: String(targetSets),
				targetReps: targetReps ? String(targetReps) : ''
			}
		]);

	const removeExercise = (idx: number) =>
		setExercises(prev => prev.filter((_, i) => i !== idx));

	const buildRoutineExercises = (): RoutineExercise[] =>
		exercises.map(le => ({
			exerciseId: le.exerciseId,
			targetSets: parseInt(le.targetSets, 10),
			targetReps: le.targetReps ? parseInt(le.targetReps, 10) : undefined
		}));

	const canSave = name.trim().length > 0 && exercises.length > 0;

	return {name, setName, exercises, addExercise, removeExercise, buildRoutineExercises, canSave};
}
