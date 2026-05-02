import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {Exercise, Routine, WorkoutLog} from '../types/fitness';

function getInitialKey(): string {
	try {
		const userId = JSON.parse(
			localStorage.getItem('user-prefs') ?? '{}'
		)?.state?.activeUserId;
		return userId ? `training-data-${userId}` : 'training-data-__none';
	} catch {
		return 'training-data-__none';
	}
}

interface TrainingState {
	exercises: Exercise[];
	routines: Routine[];
	workoutLogs: WorkoutLog[];
	findOrCreateExercise: (name: string) => string;
	deleteExercise: (id: string) => void;
	addRoutine: (routine: Omit<Routine, 'id'>) => void;
	updateRoutine: (id: string, updates: Partial<Omit<Routine, 'id'>>) => void;
	deleteRoutine: (id: string) => void;
	addWorkoutLog: (log: Omit<WorkoutLog, 'id'>) => void;
	deleteWorkoutLog: (id: string) => void;
	importData: (data: {
		exercises: Exercise[];
		routines: Routine[];
		workoutLogs: WorkoutLog[];
	}) => void;
}

export const useTrainingStore = create<TrainingState>()(
	persist(
		(set, get) => ({
			exercises: [],
			routines: [],
			workoutLogs: [],

			findOrCreateExercise: (name: string): string => {
				const trimmed = name.trim();
				const existing = get().exercises.find(
					e => e.name.toLowerCase() === trimmed.toLowerCase()
				);
				if (existing) return existing.id;
				const id = crypto.randomUUID();
				set(state => ({
					exercises: [...state.exercises, {id, name: trimmed}]
				}));
				return id;
			},

			deleteExercise: id =>
				set(state => ({
					exercises: state.exercises.filter(e => e.id !== id),
					routines: state.routines.map(r => ({
						...r,
						exercises: r.exercises.filter(
							re => re.exerciseId !== id
						)
					}))
				})),

			addRoutine: routine =>
				set(state => ({
					routines: [
						...state.routines,
						{...routine, id: crypto.randomUUID()}
					]
				})),

			updateRoutine: (id, updates) =>
				set(state => ({
					routines: state.routines.map(r =>
						r.id === id ? {...r, ...updates} : r
					)
				})),

			deleteRoutine: id =>
				set(state => ({
					routines: state.routines.filter(r => r.id !== id)
				})),

			addWorkoutLog: log =>
				set(state => ({
					workoutLogs: [
						...state.workoutLogs,
						{...log, id: crypto.randomUUID()}
					]
				})),

			deleteWorkoutLog: id =>
				set(state => ({
					workoutLogs: state.workoutLogs.filter(l => l.id !== id)
				})),

			importData: data =>
				set({
					exercises: data.exercises,
					routines: data.routines,
					workoutLogs: data.workoutLogs
				})
		}),
		{name: getInitialKey()}
	)
);
