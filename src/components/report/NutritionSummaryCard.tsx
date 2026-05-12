import {useState} from 'react';
import {Card} from '../ui/Card';
import {DataTable} from '../ui/DataTable';
import {CHART_TITLE} from './chartStyles';

const DEFAULT_ROWS = 10;

interface DayData {
	date: string;
	kcal: number;
	protein: number;
	fat: number;
	carbs: number;
}

const COLUMNS = [
	{label: 'Date', align: 'left' as const},
	{label: 'Kcal', align: 'right' as const},
	{label: 'Protein', align: 'right' as const},
	{label: 'Fat', align: 'right' as const},
	{label: 'Carbs', align: 'right' as const}
];

interface NutritionSummaryCardProps {
	days: DayData[];
}

export function NutritionSummaryCard({days}: NutritionSummaryCardProps) {
	const [expanded, setExpanded] = useState(false);
	const reversed = [...days].reverse();
	const visible = expanded ? reversed : reversed.slice(0, DEFAULT_ROWS);
	const hiddenCount = reversed.length - DEFAULT_ROWS;

	return (
		<Card>
			<div style={CHART_TITLE}>Day-by-day summary</div>
			<DataTable columns={COLUMNS} minWidth={400}>
				{visible.map(d => (
					<DataTable.Row key={d.date}>
						<DataTable.Cell>{d.date}</DataTable.Cell>
						<DataTable.Cell align="right">{d.kcal}</DataTable.Cell>
						<DataTable.Cell align="right">{d.protein}g</DataTable.Cell>
						<DataTable.Cell align="right">{d.fat}g</DataTable.Cell>
						<DataTable.Cell align="right">{d.carbs}g</DataTable.Cell>
					</DataTable.Row>
				))}
			</DataTable>
			{hiddenCount > 0 && (
				<button
					onClick={() => setExpanded(e => !e)}
					style={{
						marginTop: '12px',
						background: 'none',
						border: '1px solid #b7d9c5',
						borderRadius: '6px',
						color: '#2d6a4f',
						fontSize: '13px',
						padding: '6px 14px',
						cursor: 'pointer',
						fontFamily: 'inherit',
						display: 'block',
						width: '100%'
					}}>
					{expanded ? 'Show less' : `Show ${hiddenCount} more`}
				</button>
			)}
		</Card>
	);
}
