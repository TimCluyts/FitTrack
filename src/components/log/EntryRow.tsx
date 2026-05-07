import {ProductEntryRow} from './ProductEntryRow';
import {RecipeEntryRow} from './RecipeEntryRow';
import type {LogEntry, Product, Recipe} from '../../types/fitness';

interface EntryRowProps {
	entry: LogEntry;
	products: Product[];
	recipes: Recipe[];
	onDelete: (id: string) => void;
	onUpdate: (id: string, amount: number) => void;
}

export function EntryRow({entry, products, recipes, onDelete, onUpdate}: EntryRowProps) {
	if (entry.recipeId) {
		return (
			<RecipeEntryRow
				entry={entry}
				products={products}
				recipes={recipes}
				onDelete={onDelete}
				onUpdate={onUpdate}
			/>
		);
	}
	return (
		<ProductEntryRow
			entry={entry}
			products={products}
			onDelete={onDelete}
			onUpdate={onUpdate}
		/>
	);
}
