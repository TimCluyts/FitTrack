import {Card} from '../ui/Card';
import {DataTable} from '../ui/DataTable';
import {MacroInline} from '../MacroInline';
import {useProducts, useRecipes} from '../../hooks/useApi';
import {getEntryMacros, sumMacros} from '../../utils/macros';
import {EntryRow} from './EntryRow';
import type {LogEntry, MacroTotals} from '../../types/fitness';

interface MealSectionProps {
	label: string;
	entries: LogEntry[];
	onDelete: (id: string) => void;
	onUpdate: (id: string, amount: number) => void;
}

const COLUMNS = [
	{label: 'Item', align: 'left' as const},
	{label: 'Amount', align: 'right' as const},
	{label: 'Kcal', align: 'right' as const},
	{label: 'Protein', align: 'right' as const},
	{label: 'Fat', align: 'right' as const},
	{label: 'Carbs', align: 'right' as const},
	{label: '', align: 'right' as const}
];

export function MealSection({label, entries, onDelete, onUpdate}: MealSectionProps) {
	const {data: products = []} = useProducts();
	const {data: recipes = []} = useRecipes();
	const macros = entries
		.map(e => getEntryMacros(e, products, recipes))
		.filter((m): m is MacroTotals => m !== null);
	const totals = sumMacros(macros);

	return (
		<Card>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'baseline',
					marginBottom: '12px',
					flexWrap: 'wrap',
					gap: '8px'
				}}>
				<span style={{fontWeight: 600, fontSize: '15px', color: '#2d6a4f'}}>
					{label}
				</span>
				<MacroInline {...totals} />
			</div>
			<DataTable columns={COLUMNS} minWidth={520}>
				{entries.map(entry => (
					<EntryRow
						key={entry.id}
						entry={entry}
						products={products}
						recipes={recipes}
						onDelete={onDelete}
						onUpdate={onUpdate}
					/>
				))}
			</DataTable>
		</Card>
	);
}
