import {useLogEntries, useWeightEntries, useWorkoutLogs, useRunLogs} from './useApi';

export function useHasReportData() {
	const {data: logEntries = []} = useLogEntries();
	const {data: weightEntries = []} = useWeightEntries();
	const {data: workoutLogs = []} = useWorkoutLogs();
	const {data: runLogs = []} = useRunLogs();
	return (
		logEntries.length > 0 ||
		weightEntries.length > 0 ||
		workoutLogs.length > 0 ||
		runLogs.length > 0
	);
}
