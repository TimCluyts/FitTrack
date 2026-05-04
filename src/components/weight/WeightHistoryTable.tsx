import {useWeightEntries, useDeleteWeightEntry} from '../../hooks/useApi';
import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {DataTable} from '../ui/DataTable';

const COLUMNS = [
	{label: 'Date', align: 'left' as const},
	{label: 'Weight', align: 'right' as const},
	{label: 'Note', align: 'left' as const},
	{label: '', align: 'right' as const}
];

export function WeightHistoryTable() {
	const {data: entries = []} = useWeightEntries();
	const deleteWeightEntry = useDeleteWeightEntry();

	const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

	if (!sorted.length) {
		return (
			<Card
				style={{
					textAlign: 'center',
					padding: '48px 24px',
					color: '#a0aec0'
				}}>
				No weight entries yet. Log your first one above.
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
				History
			</div>
			<DataTable columns={COLUMNS} minWidth={320}>
				{[...sorted].reverse().map(entry => (
					<DataTable.Row key={entry.id}>
						<DataTable.Cell>{entry.date}</DataTable.Cell>
						<DataTable.Cell align="right">{entry.weight} kg</DataTable.Cell>
						<DataTable.Cell>{entry.note ?? '—'}</DataTable.Cell>
						<DataTable.Cell align="right">
							<Button
								variant="ghost-danger"
								size="sm"
								onClick={() => deleteWeightEntry.mutate(entry.id)}
								style={{fontSize: '16px', padding: '2px 6px', lineHeight: 1}}
								title="Remove">
								×
							</Button>
						</DataTable.Cell>
					</DataTable.Row>
				))}
			</DataTable>
		</Card>
	);
}
