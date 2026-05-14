import {useState} from 'react';
import {useRecipes, useAddRecipe, useUpdateRecipe} from './useApi';
import type {RecipeIngredient, SimpleMacros} from '../types/fitness';

export function useRecipeMode() {
	const [editing, setEditing] = useState<string | null>(null);
	const {data: recipes = []} = useRecipes();
	const addRecipe = useAddRecipe();
	const updateRecipe = useUpdateRecipe();

	const editingRecipe =
		editing && editing !== 'new' && editing !== 'new-quick'
			? recipes.find(r => r.id === editing)
			: undefined;

	const isQuickMode =
		editing === 'new-quick' ||
		(!!editingRecipe && !!editingRecipe.simpleMacros);

	const handleSave = (name: string, ingredients: RecipeIngredient[]) => {
		if (editing === 'new') addRecipe.mutate({name, ingredients});
		else if (editing) updateRecipe.mutate({id: editing, data: {name, ingredients}});
		setEditing(null);
	};

	const handleSaveQuick = (name: string, simpleMacros: SimpleMacros) => {
		if (editing === 'new-quick') addRecipe.mutate({name, ingredients: [], simpleMacros});
		else if (editing) updateRecipe.mutate({id: editing, data: {name, ingredients: [], simpleMacros}});
		setEditing(null);
	};

	return {editing, setEditing, editingRecipe, isQuickMode, handleSave, handleSaveQuick};
}
