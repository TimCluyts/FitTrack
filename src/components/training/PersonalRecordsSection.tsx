import {useMemo} from 'react';
import {useExercises, useWorkoutLogs} from '../../hooks/useApi';
import {WeightPRsCard} from './WeightPRsCard';
import {SECTION_LABEL} from './styles';

export function PersonalRecordsSection() {
	const {data: exercises = []} = useExercises();
	const {data: workoutLogs = []} = useWorkoutLogs();

	const weightPRs = useMemo(() => {
		const maxByExercise = new Map<string, number>();
		for (const log of workoutLogs) {
			for (const ex of log.exercises) {
				const curr = maxByExercise.get(ex.exerciseId) ?? 0;
				for (const set of ex.sets) {
					if (set.weight > curr) maxByExercise.set(ex.exerciseId, set.weight);
				}
			}
		}
		return exercises
			.flatMap(ex => {
				const weight = maxByExercise.get(ex.id);
				return weight != null ? [{name: ex.name, weight}] : [];
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
