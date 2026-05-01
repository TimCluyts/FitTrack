import {Button} from '../ui/Button';
import {DataTable} from '../ui/DataTable';
import {AddIngredientRow} from './AddIngredientRow';
import {calcMacros} from '../../utils/macros';
import {displayAmount} from '../../utils/serving';
import {useNutritionStore} from '../../store/nutritionStore';
import type {RecipeIngredient} from '../../types/fitness';

interface IngredientTableProps {
	ingredients: RecipeIngredient[];
	onAdd: (productId: string, amount: string) => void;
	onRemove: (idx: number) => void;
}

const COLUMNS = [
	{label: 'Product', align: 'left' as const},
	{label: 'Amount', align: 'right' as const},
	{label: 'Kcal', align: 'right' as const},
	{label: 'Protein', align: 'right' as const},
	{label: 'Fat', align: 'right' as const},
	{label: 'Carbs', align: 'right' as const},
	{label: '', align: 'right' as const}
];

export function IngredientTable({ingredients, onAdd, onRemove}: IngredientTableProps) {
	const {products} = useNutritionStore();

	return (
		<DataTable columns={COLUMNS} minWidth={520}>
			{ingredients.map((ing, idx) => {
				const p = products.find(pr => pr.id === ing.productId);
				if (!p) return null;
				const m = calcMacros(p, ing.amount);
				return (
					<DataTable.Row key={idx}>
						<DataTable.Cell>{p.name}</DataTable.Cell>
						<DataTable.Cell align="right">
							{displayAmount(ing.amount, p)}
						</DataTable.Cell>
						<DataTable.Cell align="right">{m.kcal}</DataTable.Cell>
						<DataTable.Cell align="right">
							{m.protein}g
						</DataTable.Cell>
						<DataTable.Cell align="right">{m.fat}g</DataTable.Cell>
						<DataTable.Cell align="right">
							{m.carbs}g
						</DataTable.Cell>
						<DataTable.Cell align="right">
							<Button
								variant="ghost-danger"
								size="sm"
								onClick={() => onRemove(idx)}
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
				);
			})}
			<AddIngredientRow onAdd={onAdd} />
		</DataTable>
	);
}
