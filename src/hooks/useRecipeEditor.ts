import {useState} from 'react';
import {useNutritionStore} from '../store/nutritionStore';
import {calcMacros, calcRecipeTotalWeight, sumMacros} from '../utils/macros';
import {toGrams} from '../utils/serving';
import type {Recipe, RecipeIngredient} from '../types/fitness';

export function useRecipeEditor(initial?: Recipe) {
	const {products} = useNutritionStore();
	const [name, setName] = useState(initial?.name ?? '');
	const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
		initial?.ingredients ?? []
	);

	const addIngredient = (productId: string, amount: string) => {
		const parsed = parseFloat(amount);
		const product = products.find(p => p.id === productId);
		setIngredients(prev => [
			...prev,
			{productId, amount: toGrams(parsed, product)}
		]);
	};

	const removeIngredient = (idx: number) =>
		setIngredients(prev => prev.filter((_, i) => i !== idx));

	const totals = sumMacros(
		ingredients.map(ing => {
			const p = products.find(pr => pr.id === ing.productId);
			return p ? calcMacros(p, ing.amount) : {kcal: 0, protein: 0, fat: 0, carbs: 0};
		})
	);
	const totalWeight = calcRecipeTotalWeight({id: '', name: '', ingredients});
	const canSave = name.trim().length > 0 && ingredients.length > 0;

	return {
		name,
		setName,
		ingredients,
		addIngredient,
		removeIngredient,
		totals,
		totalWeight,
		canSave
	};
}
