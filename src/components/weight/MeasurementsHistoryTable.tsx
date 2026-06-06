import {useState} from 'react';
import {useMeasurementEntries, useDeleteMeasurementEntry} from '../../hooks/useApi';
import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {DataTable} from '../ui/DataTable';

const PAGE_SIZE = 20;

const COLUMNS = [
	{label: 'Date', align: 'left' as const},
	{label: 'Waist', align: 'right' as const},
	{label: 'Chest', align: 'right' as const},
	{label: 'Note', align: 'left' as const},
	{label: '', align: 'right' as const}
];

export function MeasurementsHistoryTable() {
	const {data: entries = []} = useMeasurementEntries();
	const deleteMeasurementEntry = useDeleteMeasurementEntry();
	const [limit, setLimit] = useState(PAGE_SIZE);

	const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
	const visible = sorted.slice(0, limit);
	const hasMore = sorted.length > limit;

	if (!sorted.length) {
		return (
			<Card
				style={{
					textAlign: 'center',
					padding: '48px 24px',
					color: '#a0aec0'
				}}>
				No measurement entries yet. Log your first one above.
			</Card>
		);
	}

	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '15px',
					color: '#1b4332',
					marginBottom: '16px'
				}}>
				Measurement History
			</div>
			<DataTable columns={COLUMNS} minWidth={360}>
				{visible.map(entry => (
					<DataTable.Row key={entry.id}>
						<DataTable.Cell>{entry.date}</DataTable.Cell>
						<DataTable.Cell align="right">
							{entry.waistCm != null ? `${entry.waistCm} cm` : '—'}
						</DataTable.Cell>
						<DataTable.Cell align="right">
							{entry.chestCm != null ? `${entry.chestCm} cm` : '—'}
						</DataTable.Cell>
						<DataTable.Cell>{entry.note ?? '—'}</DataTable.Cell>
						<DataTable.Cell align="right">
							<Button
								variant="ghost-danger"
								size="sm"
								onClick={() => deleteMeasurementEntry.mutate(entry.id)}
								style={{fontSize: '16px', padding: '2px 6px', lineHeight: 1}}
								title="Remove">
								×
							</Button>
						</DataTable.Cell>
					</DataTable.Row>
				))}
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
