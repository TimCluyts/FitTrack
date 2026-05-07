import {DataTable} from '../ui/DataTable';
import {calcRecipeMacros} from '../../utils/macros';
import {AmountCell} from './AmountCell';
import {MacroCells} from './MacroCells';
import {DeleteCell} from './DeleteCell';
import type {LogEntry, Product, Recipe} from '../../types/fitness';

interface RecipeEntryRowProps {
	entry: LogEntry;
	products: Product[];
	recipes: Recipe[];
	onDelete: (id: string) => void;
	onUpdate: (id: string, amount: number) => void;
}

export function RecipeEntryRow({entry, products, recipes, onDelete, onUpdate}: RecipeEntryRowProps) {
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
			<AmountCell
				display={`${entry.amount ?? 0}g`}
				amount={entry.amount ?? 0}
				onSave={v => onUpdate(entry.id, v)}
			/>
			<MacroCells {...m} />
			<DeleteCell id={entry.id} onDelete={onDelete} />
		</DataTable.Row>
	);
}
