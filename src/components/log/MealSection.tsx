import {Card} from '../ui/Card';
import {Button} from '../ui/Button';
import {DataTable} from '../ui/DataTable';
import {MacroInline} from '../MacroInline';
import {useNutritionStore} from '../../store/nutritionStore';
import {
	calcMacros,
	calcRecipeMacros,
	getEntryMacros,
	sumMacros
} from '../../utils/macros';
import {displayAmount} from '../../utils/serving';
import type {LogEntry, MacroTotals, Product, Recipe} from '../../types/fitness';

interface MealSectionProps {
	label: string;
	entries: LogEntry[];
	onDelete: (id: string) => void;
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

export function MealSection({label, entries, onDelete}: MealSectionProps) {
	const {products, recipes} = useNutritionStore();
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
				<span
					style={{
						fontWeight: 600,
						fontSize: '15px',
						color: '#2d6a4f'
					}}>
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
					/>
				))}
			</DataTable>
		</Card>
	);
}

function DeleteCell({
	id,
	onDelete
}: {
	id: string;
	onDelete: (id: string) => void;
}) {
	return (
		<DataTable.Cell align="right">
			<Button
				variant="ghost-danger"
				size="sm"
				onClick={() => onDelete(id)}
				style={{fontSize: '16px', padding: '2px 6px', lineHeight: 1}}
				title="Remove">
				×
			</Button>
		</DataTable.Cell>
	);
}

function EntryRow({
	entry,
	products,
	recipes,
	onDelete
}: {
	entry: LogEntry;
	products: Product[];
	recipes: Recipe[];
	onDelete: (id: string) => void;
}) {
	if (entry.recipeId) {
		const recipe = recipes.find(r => r.id === entry.recipeId);
		if (!recipe) return null;

		const m = calcRecipeMacros(recipe, products, entry.amount ?? 0);
		return (
			<DataTable.Row>
				<DataTable.Cell>
					<span
						style={{
							fontSize: '11px',
							background: '#e8f4ee',
							color: '#2d6a4f',
							borderRadius: '3px',
							padding: '1px 5px',
							marginRight: '6px'
						}}>
						recipe
					</span>
					{recipe.name}
				</DataTable.Cell>
				<DataTable.Cell align="right">
					{entry.amount ?? 0}g
				</DataTable.Cell>
				<MacroCells {...{...m}} />
				<DeleteCell id={entry.id} onDelete={onDelete} />
			</DataTable.Row>
		);
	}

	const product = products.find(p => p.id === entry.productId);
	if (!product) return null;
	const m = calcMacros(product, entry.amount ?? 0);
	return (
		<DataTable.Row>
			<DataTable.Cell>{product.name}</DataTable.Cell>
			<DataTable.Cell align="right">
				{displayAmount(entry.amount ?? 0, product)}
			</DataTable.Cell>
			<MacroCells {...{...m}} />
			<DeleteCell id={entry.id} onDelete={onDelete} />
		</DataTable.Row>
	);
}

function MacroCells(macros: {
	kcal: number;
	protein: number;
	fat: number;
	carbs: number;
}) {
	return (
		<>
			<DataTable.Cell align="right">{macros.kcal}</DataTable.Cell>
			<DataTable.Cell align="right">{macros.protein}g</DataTable.Cell>
			<DataTable.Cell align="right">{macros.fat}g</DataTable.Cell>
			<DataTable.Cell align="right">{macros.carbs}g</DataTable.Cell>
		</>
	);
}
