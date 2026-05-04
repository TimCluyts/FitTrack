import {useRecipes, useDeleteRecipe} from '../../hooks/useApi';
import {RecipeCard} from './RecipeCard';
import {Card} from '../ui/Card';

interface RecipesListSectionProps {
	editing: string | null;
	onEdit: (id: string) => void;
}

export function RecipesListSection({editing, onEdit}: RecipesListSectionProps) {
	const {data: recipes = []} = useRecipes();
	const deleteRecipe = useDeleteRecipe();

	if (recipes.length === 0 && !editing) {
		return (
			<Card
				style={{
					textAlign: 'center',
					padding: '48px 24px',
					color: '#a0aec0'
				}}>
				No recipes yet. Create your first recipe above.
			</Card>
		);
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
			{[...recipes]
				.sort((a, b) => a.name.localeCompare(b.name))
				.map(recipe => (
					<RecipeCard
						key={recipe.id}
						recipe={recipe}
						dimmed={!!editing && editing !== recipe.id}
						onEdit={() => onEdit(recipe.id)}
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
	);
}
