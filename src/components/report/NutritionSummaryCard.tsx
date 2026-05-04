import {Card} from '../ui/Card';
import {DataTable} from '../ui/DataTable';
import {CHART_TITLE} from './chartStyles';

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
	return (
		<Card>
			<div style={CHART_TITLE}>Day-by-day summary</div>
			<DataTable columns={COLUMNS} minWidth={400}>
				{[...days].reverse().map(d => (
					<DataTable.Row key={d.date}>
						<DataTable.Cell>{d.date}</DataTable.Cell>
						<DataTable.Cell align="right">{d.kcal}</DataTable.Cell>
						<DataTable.Cell align="right">{d.protein}g</DataTable.Cell>
						<DataTable.Cell align="right">{d.fat}g</DataTable.Cell>
						<DataTable.Cell align="right">{d.carbs}g</DataTable.Cell>
					</DataTable.Row>
				))}
			</DataTable>
		</Card>
	);
}
