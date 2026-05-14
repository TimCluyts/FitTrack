import {createFileRoute} from '@tanstack/react-router';
import {useRecipeMode} from '../hooks/useRecipeMode';
import {RecipeEditor} from '../components/recipes/RecipeEditor';
import {QuickRecipeEditor} from '../components/recipes/QuickRecipeEditor';
import {RecipesListSection} from '../components/recipes/RecipesListSection';
import {Button} from '../components/ui/Button';
import {PageHeader} from '../components/ui/PageHeader';

export const Route = createFileRoute('/recipes')({
	component: RecipesPage
});

function RecipesPage() {
	const {editing, setEditing, editingRecipe, isQuickMode, handleSave, handleSaveQuick} = useRecipeMode();

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Recipes">
				{!editing && (
					<div style={{display: 'flex', gap: '8px'}}>
						<Button onClick={() => setEditing('new')}>+ New Recipe</Button>
						<Button variant="outline" onClick={() => setEditing('new-quick')}>
							+ Quick Recipe
						</Button>
					</div>
				)}
			</PageHeader>

			{editing && (
				isQuickMode ? (
					<QuickRecipeEditor
						initial={editingRecipe}
						onSave={handleSaveQuick}
						onCancel={() => setEditing(null)}
					/>
				) : (
					<RecipeEditor
						initial={editingRecipe}
						onSave={handleSave}
						onCancel={() => setEditing(null)}
					/>
				)
			)}

			<RecipesListSection editing={editing} onEdit={setEditing} />
		</div>
	);
}
