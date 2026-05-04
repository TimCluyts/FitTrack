import {useMemo} from 'react';
import {useExercises, useWorkoutLogs, useDeleteWorkoutLog} from '../../hooks/useApi';
import {WorkoutLogCard} from './WorkoutLogCard';
import {SECTION_LABEL} from './styles';

export function WorkoutHistorySection() {
	const {data: exercises = []} = useExercises();
	const {data: workoutLogs = []} = useWorkoutLogs();
	const deleteWorkoutLog = useDeleteWorkoutLog();

	const sorted = useMemo(
		() => [...workoutLogs].sort((a, b) => b.date.localeCompare(a.date)),
		[workoutLogs]
	);

	if (!sorted.length) return null;

	return (
		<>
			<div style={SECTION_LABEL}>Workout History</div>
			{sorted.slice(0, 20).map(log => (
				<WorkoutLogCard
					key={log.id}
					log={log}
					exercises={exercises}
					onDelete={() => deleteWorkoutLog.mutate(log.id)}
				/>
			))}
		</>
	);
}
