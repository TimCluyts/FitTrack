import {useState} from 'react';
import {useProducts, useRecipes, useAddLogEntry} from './useApi';
import type {MealTime} from '../types/fitness';
import {toGrams} from '../utils/serving';
import {calcRecipeTotalWeight} from '../utils/macros';

export function useAddEntry() {
	const [mode, setMode] = useState<'product' | 'recipe'>('product');
	const [productId, setProductId] = useState('');
	const [amount, setAmount] = useState('');
	const [recipeId, setRecipeId] = useState('');
	const [recipeAmount, setRecipeAmount] = useState('');
	const [mealTime, setMealTime] = useState<MealTime>('morning');

	const {data: products = []} = useProducts();
	const {data: recipes = []} = useRecipes();
	const addLogEntryMutation = useAddLogEntry();

	const activeProduct = products.find(p => p.id === productId);
	const selectedRecipe = recipes.find(r => r.id === recipeId);
	const recipeWeight = selectedRecipe ? calcRecipeTotalWeight(selectedRecipe) : 0;

	const submit = (date: string): boolean => {
		if (mode === 'product') {
			const parsed = parseFloat(amount);
			if (!productId || !parsed || parsed <= 0) return false;
			addLogEntryMutation.mutate({date, mealTime, productId, amount: toGrams(parsed, activeProduct)});
			setAmount('');
			return true;
		}
		const parsed = parseFloat(recipeAmount);
		if (!recipeId || !parsed || parsed <= 0) return false;
		addLogEntryMutation.mutate({date, mealTime, recipeId, amount: parsed});
		setRecipeAmount('');
		return true;
	};

	return {
		mode, setMode,
		productId, setProductId,
		amount, setAmount,
		recipeId, setRecipeId,
		recipeAmount, setRecipeAmount,
		recipeWeight,
		mealTime, setMealTime,
		activeProduct,
		submit,
		products,
		recipes
	};
}
