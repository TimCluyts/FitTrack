import type {ComponentType} from 'react';
import {CustomEntryRow} from './CustomEntryRow';
import {RecipeEntryRow} from './RecipeEntryRow';
import {ProductEntryRow} from './ProductEntryRow';
import type {LogEntry, Product, Recipe} from '../../types/fitness';

export interface EntryRowProps {
	entry: LogEntry;
	products: Product[];
	recipes: Recipe[];
	onDelete: (id: string) => void;
	onUpdate: (id: string, amount: number) => void;
}

type RegistryEntry = {
	matches: (entry: LogEntry) => boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: ComponentType<any>;
};

export const ENTRY_ROW_REGISTRY: RegistryEntry[] = [
	{matches: e => !!e.customEntry, component: CustomEntryRow},
	{matches: e => !!e.recipeId, component: RecipeEntryRow},
	{matches: () => true, component: ProductEntryRow}
];
