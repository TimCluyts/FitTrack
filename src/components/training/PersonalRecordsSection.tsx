import {useMemo} from 'react';
import {useExercises, useWorkoutLogs} from '../../hooks/useApi';
import {WeightPRsCard, type PR} from './WeightPRsCard';
import {SECTION_LABEL} from './styles';

function estimatedOneRepMax(weight: number, reps: number): number {
	return weight * (1 + reps / 30);
}

export function PersonalRecordsSection() {
	const {data: exercises = []} = useExercises();
	const {data: workoutLogs = []} = useWorkoutLogs();

	const weightPRs = useMemo(() => {
		const bestByExercise = new Map<string, Omit<PR, 'name'>>();
		const sortedLogs = [...workoutLogs].sort((a, b) => a.date.localeCompare(b.date));
		for (const log of sortedLogs) {
			for (const ex of log.exercises) {
				for (const set of ex.sets) {
					const oneRepMax = estimatedOneRepMax(set.weight, set.reps);
					const curr = bestByExercise.get(ex.exerciseId);
					if (!curr || oneRepMax > curr.oneRepMax) {
						bestByExercise.set(ex.exerciseId, {
							exerciseId: ex.exerciseId,
							weight: set.weight,
							reps: set.reps,
							oneRepMax,
							date: log.date
						});
					}
				}
			}
		}
		return exercises
			.flatMap(ex => {
				const pr = bestByExercise.get(ex.id);
				return pr ? [{...pr, name: ex.name}] : [];
			})
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [exercises, workoutLogs]);

	if (!weightPRs.length) return null;

	return (
		<>
			<div style={SECTION_LABEL}>Personal Records</div>
			<WeightPRsCard prs={weightPRs} />
		</>
	);
}
