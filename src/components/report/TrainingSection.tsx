import {useExercises, useWorkoutLogs} from '../../hooks/useApi';
import {RecentWorkoutsCard} from './RecentWorkoutsCard';
import {ExerciseProgressionCard} from './ExerciseProgressionCard';

export function TrainingSection() {
	const {data: exercises = []} = useExercises();
	const {data: workoutLogs = []} = useWorkoutLogs();

	if (!workoutLogs.length) return null;

	return (
		<>
			<RecentWorkoutsCard workoutLogs={workoutLogs} />
			{exercises.length > 0 && (
				<ExerciseProgressionCard exercises={exercises} workoutLogs={workoutLogs} />
			)}
		</>
	);
}
