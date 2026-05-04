import {useState} from 'react';
import {useRecipes, useAddRecipe, useUpdateRecipe} from './useApi';
import type {RecipeIngredient} from '../types/fitness';

export function useRecipeMode() {
	const [editing, setEditing] = useState<string | null>(null);
	const {data: recipes = []} = useRecipes();
	const addRecipe = useAddRecipe();
	const updateRecipe = useUpdateRecipe();

	const editingRecipe =
		editing && editing !== 'new'
			? recipes.find(r => r.id === editing)
			: undefined;

	const handleSave = (name: string, ingredients: RecipeIngredient[]) => {
		if (editing === 'new') addRecipe.mutate({name, ingredients});
		else if (editing) updateRecipe.mutate({id: editing, data: {name, ingredients}});
		setEditing(null);
	};

	return {editing, setEditing, editingRecipe, handleSave};
}
