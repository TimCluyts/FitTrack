import {useState} from 'react';
import {useProducts, useRecipes, useAddLogEntry} from './useApi';
import type {MealTime} from '../types/fitness';
import {toGrams} from '../utils/serving';
import {calcRecipeTotalWeight} from '../utils/macros';

export type CustomFields = {name: string; kcal: string; protein: string; fat: string; carbs: string};
const EMPTY_CUSTOM: CustomFields = {name: '', kcal: '', protein: '', fat: '', carbs: ''};

export function useAddEntry() {
	const [mode, setMode] = useState<'product' | 'recipe' | 'custom'>('product');
	const [productId, setProductId] = useState('');
	const [amount, setAmount] = useState('');
	const [recipeId, setRecipeId] = useState('');
	const [recipeAmount, setRecipeAmount] = useState('');
	const [mealTime, setMealTime] = useState<MealTime>('morning');
	const [customFields, setCustomFields] = useState<CustomFields>(EMPTY_CUSTOM);

	const {data: products = []} = useProducts();
	const {data: recipes = []} = useRecipes();
	const addLogEntryMutation = useAddLogEntry();

	const activeProduct = products.find(p => p.id === productId);
	const selectedRecipe = recipes.find(r => r.id === recipeId);
	const recipeWeight = selectedRecipe ? calcRecipeTotalWeight(selectedRecipe) : 0;

	const setCustomField = (k: keyof CustomFields, v: string) =>
		setCustomFields(prev => ({...prev, [k]: v}));

	const submit = (date: string): boolean => {
		if (mode === 'product') {
			const parsed = Number.parseFloat(amount);
			if (!productId || !parsed || parsed <= 0) return false;
			addLogEntryMutation.mutate({date, mealTime, productId, amount: toGrams(parsed, activeProduct)});
			setAmount('');
			return true;
		}
		if (mode === 'recipe') {
			const parsed = Number.parseFloat(recipeAmount);
			if (!recipeId || !parsed || parsed <= 0) return false;
			addLogEntryMutation.mutate({date, mealTime, recipeId, amount: parsed});
			setRecipeAmount('');
			return true;
		}
		// custom
		if (!customFields.name.trim()) return false;
		addLogEntryMutation.mutate({
			date,
			mealTime,
			customEntry: {
				name: customFields.name.trim(),
				kcal: Math.round(Number.parseFloat(customFields.kcal) || 0),
				protein: Math.round((Number.parseFloat(customFields.protein) || 0) * 10) / 10,
				fat: Math.round((Number.parseFloat(customFields.fat) || 0) * 10) / 10,
				carbs: Math.round((Number.parseFloat(customFields.carbs) || 0) * 10) / 10
			}
		});
		setCustomFields(EMPTY_CUSTOM);
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
		customFields,
		setCustomField,
		submit,
		products,
		recipes
	};
}
