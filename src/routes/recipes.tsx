import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {useRecipes, useAddRecipe, useUpdateRecipe, useDeleteRecipe} from '../hooks/useApi';
import {RecipeEditor} from '../components/recipes/RecipeEditor';
import {RecipeCard} from '../components/recipes/RecipeCard';
import {Button} from '../components/ui/Button';
import {Card} from '../components/ui/Card';
import {PageHeader} from '../components/ui/PageHeader';
import type {RecipeIngredient} from '../types/fitness';

export const Route = createFileRoute('/recipes')({
	component: RecipesPage
});

function RecipesPage() {
	const {data: recipes = []} = useRecipes();
	const addRecipe = useAddRecipe();
	const updateRecipe = useUpdateRecipe();
	const deleteRecipe = useDeleteRecipe();
	const [editing, setEditing] = useState<'new' | string | null>(null);

	const handleSave = (name: string, ingredients: RecipeIngredient[]) => {
		if (editing === 'new') addRecipe.mutate({name, ingredients});
		else if (editing) updateRecipe.mutate({id: editing, data: {name, ingredients}});
		setEditing(null);
	};

	const editingRecipe =
		editing && editing !== 'new'
			? recipes.find(r => r.id === editing)
			: undefined;

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Recipes">
				{!editing && (
					<Button onClick={() => setEditing('new')}>
						+ New Recipe
					</Button>
				)}
			</PageHeader>

			{editing && (
				<RecipeEditor
					initial={editingRecipe}
					onSave={handleSave}
					onCancel={() => setEditing(null)}
				/>
			)}

			{recipes.length === 0 && !editing ? (
				<Card
					style={{
						textAlign: 'center',
						padding: '48px 24px',
						color: '#a0aec0'
					}}>
					No recipes yet. Create your first recipe above.
				</Card>
			) : (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '12px'
					}}>
					{[...recipes]
						.sort((a, b) => a.name.localeCompare(b.name))
						.map(recipe => (
							<RecipeCard
								key={recipe.id}
								recipe={recipe}
								dimmed={!!editing && editing !== recipe.id}
								onEdit={() => setEditing(recipe.id)}
								onDelete={() => {
									if (
										confirm(
											`Delete "${recipe.name}"? Log entries using this recipe will also be removed.`
										)
									)
										deleteRecipe.mutate(recipe.id);
								}}
							/>
						))}
				</div>
			)}
		</div>
	);
}
