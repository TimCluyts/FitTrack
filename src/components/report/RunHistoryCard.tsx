import {formatPace} from '../../utils/pace';
import {Card} from '../ui/Card';
import {DataTable} from '../ui/DataTable';
import {CHART_TITLE} from './chartStyles';
import type {RunLog} from '../../types/fitness';

const COLUMNS = [
	{label: 'Date', align: 'left' as const},
	{label: 'Distance', align: 'right' as const},
	{label: 'Duration', align: 'right' as const},
	{label: 'Pace', align: 'right' as const},
	{label: 'Speed', align: 'right' as const},
	{label: 'Kcal', align: 'right' as const},
	{label: 'Note', align: 'left' as const}
];

interface RunHistoryCardProps {
	runLogs: RunLog[];
}

export function RunHistoryCard({runLogs}: RunHistoryCardProps) {
	const sorted = [...runLogs]
		.sort((a, b) => a.date.localeCompare(b.date))
		.reverse();

	return (
		<Card>
			<div style={CHART_TITLE}>Run history</div>
			<DataTable columns={COLUMNS} minWidth={400}>
				{sorted.map(r => {
					const pace =
						r.durationMin != null && r.distanceKm > 0
							? r.durationMin / r.distanceKm
							: null;
					return (
						<DataTable.Row key={r.id}>
							<DataTable.Cell>{r.date}</DataTable.Cell>
							<DataTable.Cell align="right">{r.distanceKm} km</DataTable.Cell>
							<DataTable.Cell align="right">
								{r.durationMin != null ? `${r.durationMin} min` : '—'}
							</DataTable.Cell>
							<DataTable.Cell align="right">
								{pace != null ? formatPace(pace) : '—'}
							</DataTable.Cell>
							<DataTable.Cell align="right">
								{r.speedKmh != null ? `${r.speedKmh} km/h` : '—'}
							</DataTable.Cell>
							<DataTable.Cell align="right">
								{r.kcal != null ? `${r.kcal}` : '—'}
							</DataTable.Cell>
							<DataTable.Cell>{r.note ?? '—'}</DataTable.Cell>
						</DataTable.Row>
					);
				})}
			</DataTable>
		</Card>
	);
}
