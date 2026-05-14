import {useState} from 'react';
import type {Recipe, SimpleMacros} from '../types/fitness';

export type QuickRecipeFields = {name: string; kcal: string; protein: string; fat: string; carbs: string};
const EMPTY: QuickRecipeFields = {name: '', kcal: '', protein: '', fat: '', carbs: ''};

export function useQuickRecipeEditor(initial?: Recipe) {
	const [fields, setFields] = useState<QuickRecipeFields>({
		name: initial?.name ?? '',
		kcal: String(initial?.simpleMacros?.kcal ?? ''),
		protein: String(initial?.simpleMacros?.protein ?? ''),
		fat: String(initial?.simpleMacros?.fat ?? ''),
		carbs: String(initial?.simpleMacros?.carbs ?? '')
	});

	const setField = (k: keyof QuickRecipeFields, v: string) =>
		setFields(prev => ({...prev, [k]: v}));

	const reset = () => setFields(EMPTY);

	const canSave = fields.name.trim().length > 0;

	const build = (): {name: string; simpleMacros: SimpleMacros; ingredients: []} => ({
		name: fields.name.trim(),
		ingredients: [],
		simpleMacros: {
			kcal: Math.round(Number.parseFloat(fields.kcal) || 0),
			protein: Math.round((Number.parseFloat(fields.protein) || 0) * 10) / 10,
			fat: Math.round((Number.parseFloat(fields.fat) || 0) * 10) / 10,
			carbs: Math.round((Number.parseFloat(fields.carbs) || 0) * 10) / 10
		}
	});

	return {fields, setField, reset, canSave, build};
}
