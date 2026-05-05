import {useMemo} from 'react';
import {useRunLogs, useDeleteRunLog} from '../../hooks/useApi';
import {calcPRDistance, calcPRSpeed, calcPRPace} from '../../utils/runStats';
import {RunLogCard} from './RunLogCard';
import {RunRecordsCard} from './RunRecordsCard';
import {SECTION_LABEL} from './styles';

export function RunHistorySection() {
	const {data: runLogs = []} = useRunLogs();
	const deleteRunLog = useDeleteRunLog();

	const sorted = useMemo(
		() => [...runLogs].sort((a, b) => b.date.localeCompare(a.date)),
		[runLogs]
	);

	const prDistance = useMemo(() => calcPRDistance(runLogs), [runLogs]);
	const prSpeed = useMemo(() => calcPRSpeed(runLogs), [runLogs]);
	const prPaceVal = useMemo(() => calcPRPace(runLogs), [runLogs]);

	const hasRunRecords = prDistance != null || prSpeed != null || prPaceVal != null;

	if (!sorted.length) return null;

	return (
		<>
			<div style={SECTION_LABEL}>Run History</div>
			{sorted.slice(0, 20).map(log => (
				<RunLogCard
					key={log.id}
					log={log}
					onDelete={() => deleteRunLog.mutate(log.id)}
					prDistance={prDistance}
					prSpeed={prSpeed}
					prPaceVal={prPaceVal}
				/>
			))}
			{hasRunRecords && (
				<RunRecordsCard
					prDistance={prDistance}
					prSpeed={prSpeed}
					prPaceVal={prPaceVal}
				/>
			)}
		</>
	);
}
