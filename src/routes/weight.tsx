import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from 'recharts';
import {useWeightEntries, useAddWeightEntry, useDeleteWeightEntry} from '../hooks/useApi';
import {Button} from '../components/ui/Button';
import {Card} from '../components/ui/Card';
import {DataTable} from '../components/ui/DataTable';
import {Field} from '../components/ui/Field';
import {PageHeader} from '../components/ui/PageHeader';

export const Route = createFileRoute('/weight')({
	component: WeightPage
});

const today = () => new Date().toISOString().slice(0, 10);

const AXIS_TICK = {fontSize: 11, fill: '#718096'} as const;
const TOOLTIP_CS = {
	fontSize: '13px',
	borderRadius: '6px',
	border: '1px solid #e2e8f0'
} as const;
const TABLE_COLS = [
	{label: 'Date', align: 'left' as const},
	{label: 'Weight', align: 'right' as const},
	{label: 'Note', align: 'left' as const},
	{label: '', align: 'right' as const}
];

function WeightPage() {
	const {data: weightEntries = []} = useWeightEntries();
	const addWeightEntry = useAddWeightEntry();
	const deleteWeightEntry = useDeleteWeightEntry();
	const [date, setDate] = useState(today);
	const [weight, setWeight] = useState('');
	const [note, setNote] = useState('');

	const handleAdd = () => {
		const kg = parseFloat(weight);
		if (!kg || kg <= 0) return;
		addWeightEntry.mutate({date, weight: kg, note: note.trim() || undefined});
		setWeight('');
		setNote('');
	};

	const sorted = [...weightEntries].sort((a, b) =>
		a.date.localeCompare(b.date)
	);
	const chartData = sorted.slice(-60).map(e => ({
		weight: e.weight,
		label: e.date.slice(5).replace('-', '/')
	}));

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Weight" />

			<Card>
				<div
					style={{
						fontWeight: 600,
						fontSize: '15px',
						color: '#1b4332',
						marginBottom: '16px'
					}}>
					Log Weight
				</div>
				<div
					style={{
						display: 'flex',
						gap: '12px',
						flexWrap: 'wrap',
						alignItems: 'flex-end'
					}}>
					<Field>
						<Field.Label>Date</Field.Label>
						<Field.Input
							type="date"
							value={date}
							onChange={e => setDate(e.target.value)}
						/>
					</Field>
					<Field>
						<Field.Label>Weight (kg)</Field.Label>
						<Field.Input
							type="number"
							value={weight}
							placeholder="e.g. 75.5"
							step="0.1"
							min="0"
							autoFocus
							onChange={e => setWeight(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && handleAdd()}
						/>
					</Field>
					<Field style={{flex: '2 1 200px'}}>
						<Field.Label>Note (optional)</Field.Label>
						<Field.Input
							type="text"
							value={note}
							placeholder="e.g. morning, fasted"
							onChange={e => setNote(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && handleAdd()}
						/>
					</Field>
					<Button
						disabled={!weight}
						onClick={handleAdd}
						style={{marginBottom: '1px'}}>
						Save
					</Button>
				</div>
			</Card>

			{chartData.length > 1 && (
				<Card>
					<div
						style={{
							fontWeight: 600,
							fontSize: '15px',
							color: '#1b4332',
							marginBottom: '16px'
						}}>
						Weight over time
					</div>
					<ResponsiveContainer width="100%" height={220}>
						<LineChart
							data={chartData}
							margin={{top: 4, right: 12, left: 0, bottom: 4}}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e8f0e9"
							/>
							<XAxis dataKey="label" tick={AXIS_TICK} />
							<YAxis
								tick={AXIS_TICK}
								width={48}
								domain={['auto', 'auto']}
							/>
							<Tooltip
								contentStyle={TOOLTIP_CS}
								formatter={v => [`${v} kg`, 'Weight']}
							/>
							<Line
								type="monotone"
								dataKey="weight"
								stroke="#2d6a4f"
								strokeWidth={2}
								dot={{r: 3, fill: '#2d6a4f'}}
								activeDot={{r: 5}}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Card>
			)}

			{sorted.length > 0 ? (
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
					<DataTable columns={TABLE_COLS} minWidth={320}>
						{[...sorted].reverse().map(entry => (
							<DataTable.Row key={entry.id}>
								<DataTable.Cell>{entry.date}</DataTable.Cell>
								<DataTable.Cell align="right">
									{entry.weight} kg
								</DataTable.Cell>
								<DataTable.Cell>
									{entry.note ?? '—'}
								</DataTable.Cell>
								<DataTable.Cell align="right">
									<Button
										variant="ghost-danger"
										size="sm"
										onClick={() =>
											deleteWeightEntry.mutate(entry.id)
										}
										style={{
											fontSize: '16px',
											padding: '2px 6px',
											lineHeight: 1
										}}
										title="Remove">
										×
									</Button>
								</DataTable.Cell>
							</DataTable.Row>
						))}
					</DataTable>
				</Card>
			) : (
				<Card
					style={{
						textAlign: 'center',
						padding: '48px 24px',
						color: '#a0aec0'
					}}>
					No weight entries yet. Log your first one above.
				</Card>
			)}
		</div>
	);
}
