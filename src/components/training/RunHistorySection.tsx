import {useMemo} from 'react';
import {useRunLogs, useDeleteRunLog} from '../../hooks/useApi';
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

	const {prDistance, prSpeed, prPaceVal} = useMemo(() => {
		let prDistance: number | null = null;
		let prSpeed: number | null = null;
		let prPaceVal: number | null = null;
		for (const r of runLogs) {
			if (prDistance === null || r.distanceKm > prDistance) prDistance = r.distanceKm;
			if (r.speedKmh != null && (prSpeed === null || r.speedKmh > prSpeed))
				prSpeed = r.speedKmh;
			if (r.durationMin != null && r.distanceKm > 0) {
				const pace = r.durationMin / r.distanceKm;
				if (prPaceVal === null || pace < prPaceVal) prPaceVal = pace;
			}
		}
		return {prDistance, prSpeed, prPaceVal};
	}, [runLogs]);

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
