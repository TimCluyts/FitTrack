import type {Product, LogEntry, MacroTotals, Recipe} from '../types/fitness';

export const calcMacros = (product: Product, amount: number): MacroTotals => ({
	kcal: Math.round((product.kcal * amount) / 100),
	protein: Math.round((product.protein * amount) / 10) / 10,
	fat: Math.round((product.fat * amount) / 10) / 10,
	carbs: Math.round((product.carbs * amount) / 10) / 10
});

export const sumMacros = (entries: MacroTotals[]): MacroTotals =>
	entries.reduce(
		(acc, m) => ({
			kcal: acc.kcal + m.kcal,
			protein: Math.round((acc.protein + m.protein) * 10) / 10,
			fat: Math.round((acc.fat + m.fat) * 10) / 10,
			carbs: Math.round((acc.carbs + m.carbs) * 10) / 10
		}),
		{kcal: 0, protein: 0, fat: 0, carbs: 0}
	);

/** Sum of all ingredient weights in grams. */
export const calcRecipeTotalWeight = (recipe: Recipe): number =>
	recipe.ingredients.reduce((sum, ing) => sum + ing.amount, 0);

/** Full recipe macros (all ingredients combined). For simple recipes returns the per-100g values directly. */
export const calcRecipeTotalMacros = (recipe: Recipe, products: Product[]): MacroTotals => {
	if (recipe.simpleMacros) return {...recipe.simpleMacros};
	return sumMacros(
		recipe.ingredients.map(ing => {
			const product = products.find(p => p.id === ing.productId);
			return product
				? calcMacros(product, ing.amount)
				: {kcal: 0, protein: 0, fat: 0, carbs: 0};
		})
	);
};

/**
 * Macros for a given amount (grams) consumed from the recipe.
 * Simple recipes scale linearly from per-100g values.
 * Ingredient-based recipes scale proportionally from total weight.
 */
export const calcRecipeMacros = (
	recipe: Recipe,
	products: Product[],
	amountGrams: number
): MacroTotals => {
	if (recipe.simpleMacros) {
		const {kcal, protein, fat, carbs} = recipe.simpleMacros;
		return {
			kcal: Math.round(kcal * amountGrams / 100),
			protein: Math.round(protein * amountGrams / 10) / 10,
			fat: Math.round(fat * amountGrams / 10) / 10,
			carbs: Math.round(carbs * amountGrams / 10) / 10
		};
	}
	const totalWeight = calcRecipeTotalWeight(recipe);
	if (totalWeight === 0 || amountGrams === 0) return {kcal: 0, protein: 0, fat: 0, carbs: 0};
	const total = calcRecipeTotalMacros(recipe, products);
	const ratio = amountGrams / totalWeight;
	return {
		kcal: Math.round(total.kcal * ratio),
		protein: Math.round(total.protein * ratio * 10) / 10,
		fat: Math.round(total.fat * ratio * 10) / 10,
		carbs: Math.round(total.carbs * ratio * 10) / 10
	};
};

type MacroResolver = {
	matches: (entry: LogEntry) => boolean;
	resolve: (entry: LogEntry, products: Product[], recipes: Recipe[]) => MacroTotals | null;
};

const MACRO_RESOLVERS: MacroResolver[] = [
	{
		matches: e => !!e.customEntry,
		resolve: e => {
			const {kcal, protein, fat, carbs} = e.customEntry!;
			return {kcal, protein, fat, carbs};
		}
	},
	{
		matches: e => !!e.recipeId,
		resolve: (e, products, recipes) => {
			const recipe = recipes.find(r => r.id === e.recipeId);
			return recipe ? calcRecipeMacros(recipe, products, e.amount ?? 0) : null;
		}
	},
	{
		matches: e => !!e.productId,
		resolve: (e, products) => {
			const product = products.find(p => p.id === e.productId);
			return product ? calcMacros(product, e.amount ?? 0) : null;
		}
	}
];

export const getEntryMacros = (
	entry: LogEntry,
	products: Product[],
	recipes: Recipe[] = []
): MacroTotals | null =>
	MACRO_RESOLVERS.find(r => r.matches(entry))?.resolve(entry, products, recipes) ?? null;
