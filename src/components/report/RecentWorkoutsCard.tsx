import {useState} from 'react';
import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {DataTable} from '../ui/DataTable';
import {CHART_TITLE} from './chartStyles';
import type {WorkoutLog} from '../../types/fitness';

const PAGE_SIZE = 4;

const COLUMNS = [
	{label: 'Date', align: 'left' as const},
	{label: 'Routine', align: 'left' as const},
	{label: 'Sets', align: 'right' as const},
	{label: 'Volume (kg)', align: 'right' as const}
];

interface RecentWorkoutsCardProps {
	workoutLogs: WorkoutLog[];
}

export function RecentWorkoutsCard({workoutLogs}: RecentWorkoutsCardProps) {
	const [limit, setLimit] = useState(PAGE_SIZE);
	const sorted = [...workoutLogs].sort((a, b) => b.date.localeCompare(a.date));
	const visible = sorted.slice(0, limit);
	const hasMore = sorted.length > limit;

	return (
		<Card>
			<div style={CHART_TITLE}>Recent workouts</div>
			<DataTable columns={COLUMNS} minWidth={400}>
				{visible.map(log => {
					const totalSets = log.exercises.reduce(
						(acc, ex) => acc + ex.sets.length,
						0
					);
					const totalVolume = log.exercises.reduce(
						(acc, ex) =>
							acc + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
						0
					);
					return (
						<DataTable.Row key={log.id}>
							<DataTable.Cell>{log.date}</DataTable.Cell>
							<DataTable.Cell>{log.routineName}</DataTable.Cell>
							<DataTable.Cell align="right">{totalSets}</DataTable.Cell>
							<DataTable.Cell align="right">
								{Math.round(totalVolume).toLocaleString()}
							</DataTable.Cell>
						</DataTable.Row>
					);
				})}
			</DataTable>
			{hasMore && (
				<div style={{textAlign: 'center', marginTop: '12px'}}>
					<Button variant="outline" size="sm" onClick={() => setLimit(l => l + PAGE_SIZE)}>
						Show more ({sorted.length - limit} remaining)
					</Button>
				</div>
			)}
		</Card>
	);
}
