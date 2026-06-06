import {useMemo, useState} from 'react';
import {useRunLogs, useDeleteRunLog} from '../../hooks/useApi';
import {calcPRDistance, calcPRSpeed, calcPRPace} from '../../utils/runStats';
import {RunLogCard} from './RunLogCard';
import {RunRecordsCard} from './RunRecordsCard';
import {Button} from '../ui/Button';
import {SECTION_LABEL} from './styles';

const PAGE_SIZE = 20;

export function RunHistorySection() {
	const {data: runLogs = []} = useRunLogs();
	const deleteRunLog = useDeleteRunLog();
	const [limit, setLimit] = useState(PAGE_SIZE);

	const sorted = useMemo(
		() => [...runLogs].sort((a, b) => b.date.localeCompare(a.date)),
		[runLogs]
	);

	const prDistance = useMemo(() => calcPRDistance(runLogs), [runLogs]);
	const prSpeed = useMemo(() => calcPRSpeed(runLogs), [runLogs]);
	const prPaceVal = useMemo(() => calcPRPace(runLogs), [runLogs]);

	const hasRunRecords = prDistance != null || prSpeed != null || prPaceVal != null;

	if (!sorted.length) return null;

	const visible = sorted.slice(0, limit);
	const hasMore = sorted.length > limit;

	return (
		<>
			<div style={SECTION_LABEL}>Run History</div>
			{visible.map(log => (
				<RunLogCard
					key={log.id}
					log={log}
					onDelete={() => deleteRunLog.mutate(log.id)}
					prDistance={prDistance}
					prSpeed={prSpeed}
					prPaceVal={prPaceVal}
				/>
			))}
			{hasMore && (
				<div style={{textAlign: 'center', marginTop: '4px'}}>
					<Button variant="outline" size="sm" onClick={() => setLimit(l => l + PAGE_SIZE)}>
						Show more ({sorted.length - limit} remaining)
					</Button>
				</div>
			)}
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
