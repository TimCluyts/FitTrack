import {useMemo, useState} from 'react';
import {useExercises, useWorkoutLogs, useDeleteWorkoutLog} from '../../hooks/useApi';
import {WorkoutLogCard} from './WorkoutLogCard';
import {Button} from '../ui/Button';
import {SECTION_LABEL} from './styles';

const PAGE_SIZE = 4;

export function WorkoutHistorySection() {
	const {data: exercises = []} = useExercises();
	const {data: workoutLogs = []} = useWorkoutLogs();
	const deleteWorkoutLog = useDeleteWorkoutLog();
	const [limit, setLimit] = useState(PAGE_SIZE);

	const sorted = useMemo(
		() => [...workoutLogs].sort((a, b) => b.date.localeCompare(a.date)),
		[workoutLogs]
	);

	if (!sorted.length) return null;

	const visible = sorted.slice(0, limit);
	const hasMore = sorted.length > limit;

	return (
		<>
			<div style={SECTION_LABEL}>Workout History</div>
			{visible.map(log => (
				<WorkoutLogCard
					key={log.id}
					log={log}
					exercises={exercises}
					onDelete={() => deleteWorkoutLog.mutate(log.id)}
				/>
			))}
			{hasMore && (
				<div style={{textAlign: 'center', marginTop: '4px'}}>
					<Button variant="outline" size="sm" onClick={() => setLimit(l => l + PAGE_SIZE)}>
						Show more ({sorted.length - limit} remaining)
					</Button>
				</div>
			)}
		</>
	);
}
