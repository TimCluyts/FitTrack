import {useMemo, useState} from 'react';
import {useExercises, useWorkoutLogs, useAddWorkoutLog} from './useApi';
import type {Routine, WorkoutExercise, WorkoutLog, WorkoutSet} from '../types/fitness';

export interface DraftSet {
	weight: string;
	reps: string;
}

export interface DraftExercise {
	exerciseId: string;
	sets: DraftSet[];
}

export function useWorkoutLogger(routine: Routine) {
	const {data: exercises = []} = useExercises();
	const {data: workoutLogs = []} = useWorkoutLogs();
	const addWorkoutLog = useAddWorkoutLog();

	const [date, setDate] = useState(() =>
		new Date().toISOString().slice(0, 10)
	);
	const [draft, setDraft] = useState<DraftExercise[]>(() =>
		routine.exercises.map(re => ({
			exerciseId: re.exerciseId,
			sets: Array.from({length: re.targetSets}, () => ({
				weight: '',
				reps: ''
			}))
		}))
	);

	// Single-pass index: exerciseId → logs sorted by date desc.
	// All per-exercise lookups use this instead of re-filtering workoutLogs.
	const logsByExercise = useMemo(() => {
		const map = new Map<string, WorkoutLog[]>();
		for (const log of workoutLogs) {
			for (const ex of log.exercises) {
				const bucket = map.get(ex.exerciseId) ?? [];
				bucket.push(log);
				map.set(ex.exerciseId, bucket);
			}
		}
		for (const bucket of map.values()) {
			bucket.sort((a, b) => b.date.localeCompare(a.date));
		}
		return map;
	}, [workoutLogs]);

	const updateSet = (
		exIdx: number,
		setIdx: number,
		field: 'weight' | 'reps',
		value: string
	) =>
		setDraft(prev =>
			prev.map((ex, i) =>
				i === exIdx
					? {
							...ex,
							sets: ex.sets.map((s, j) =>
								j === setIdx ? {...s, [field]: value} : s
							)
						}
					: ex
			)
		);

	const addSet = (exIdx: number) =>
		setDraft(prev =>
			prev.map((ex, i) =>
				i === exIdx
					? {...ex, sets: [...ex.sets, {weight: '', reps: ''}]}
					: ex
			)
		);

	const removeSet = (exIdx: number, setIdx: number) =>
		setDraft(prev =>
			prev.map((ex, i) =>
				i === exIdx
					? {...ex, sets: ex.sets.filter((_, j) => j !== setIdx)}
					: ex
			)
		);

	const exerciseName = (id: string) =>
		exercises.find(e => e.id === id)?.name ?? 'Unknown';

	const lastSets = (id: string): WorkoutSet[] | null => {
		const logs = logsByExercise.get(id);
		if (!logs?.length) return null;
		return logs[0]?.exercises.find(e => e.exerciseId === id)?.sets ?? null;
	};

	const exercisePR = (exerciseId: string): number | null => {
		const logs = logsByExercise.get(exerciseId);
		if (!logs) return null;
		let max: number | null = null;
		for (const log of logs) {
			const ex = log.exercises.find(e => e.exerciseId === exerciseId);
			if (!ex) continue;
			for (const set of ex.sets) {
				if (max === null || set.weight > max) max = set.weight;
			}
		}
		return max;
	};

	// Returns the last used weight if in the most recent session all sets hit
	// targetReps with the same weight — signal to increase load.
	const progressionHint = (exerciseId: string): number | null => {
		const routineEx = routine.exercises.find(
			re => re.exerciseId === exerciseId
		);
		if (!routineEx?.targetReps) return null;
		const targetReps = routineEx.targetReps;

		const lastLog = logsByExercise.get(exerciseId)?.[0];
		if (!lastLog) return null;

		const ex = lastLog.exercises.find(e => e.exerciseId === exerciseId);
		if (!ex || ex.sets.length === 0) return null;
		if (!ex.sets.every(s => s.reps >= targetReps)) return null;
		const weights = new Set(ex.sets.map(s => s.weight));
		if (weights.size !== 1) return null;

		return ex.sets[0]?.weight ?? null;
	};

	const canSave = draft.some(de =>
		de.sets.some(s => s.weight !== '' && s.reps !== '')
	);

	const save = (): boolean => {
		const workoutExercises: WorkoutExercise[] = draft
			.map(de => ({
				exerciseId: de.exerciseId,
				sets: de.sets
					.filter(s => s.weight !== '' && s.reps !== '')
					.map(s => ({
						weight: parseFloat(s.weight),
						reps: parseInt(s.reps, 10)
					}))
					.filter(s => s.weight > 0 && s.reps > 0)
			}))
			.filter(we => we.sets.length > 0);

		if (!workoutExercises.length) return false;

		addWorkoutLog.mutate({
			date,
			routineId: routine.id,
			routineName: routine.name,
			exercises: workoutExercises
		});
		return true;
	};

	return {
		date,
		setDate,
		draft,
		updateSet,
		addSet,
		removeSet,
		exerciseName,
		lastSets,
		exercisePR,
		progressionHint,
		canSave,
		save
	};
}
