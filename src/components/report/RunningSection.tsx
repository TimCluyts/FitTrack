import {useMemo} from 'react';
import {useRunLogs} from '../../hooks/useApi';
import {RunDistanceCard} from './RunDistanceCard';
import {RunSpeedCard} from './RunSpeedCard';
import {RunHistoryCard} from './RunHistoryCard';

export function RunningSection() {
	const {data: runLogs = []} = useRunLogs();

	const runChartData = useMemo(
		() =>
			[...runLogs]
				.sort((a, b) => a.date.localeCompare(b.date))
				.slice(-30)
				.map(r => ({
					distanceKm: r.distanceKm,
					speedKmh: r.speedKmh ?? null,
					label: r.date.slice(5).replace('-', '/')
				})),
		[runLogs]
	);

	if (!runLogs.length) return null;

	return (
		<>
			<RunDistanceCard data={runChartData} firstRun={runLogs[0]} />
			{runChartData.some(r => r.speedKmh != null) && (
				<RunSpeedCard data={runChartData} />
			)}
			<RunHistoryCard runLogs={runLogs} />
		</>
	);
}
