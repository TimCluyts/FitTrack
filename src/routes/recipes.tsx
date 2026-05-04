import {createFileRoute} from '@tanstack/react-router';
import {useRecipeMode} from '../hooks/useRecipeMode';
import {RecipeEditor} from '../components/recipes/RecipeEditor';
import {RecipesListSection} from '../components/recipes/RecipesListSection';
import {Button} from '../components/ui/Button';
import {PageHeader} from '../components/ui/PageHeader';

export const Route = createFileRoute('/recipes')({
	component: RecipesPage
});

function RecipesPage() {
	const {editing, setEditing, editingRecipe, handleSave} = useRecipeMode();

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Recipes">
				{!editing && (
					<Button onClick={() => setEditing('new')}>+ New Recipe</Button>
				)}
			</PageHeader>

			{editing && (
				<RecipeEditor
					initial={editingRecipe}
					onSave={handleSave}
					onCancel={() => setEditing(null)}
				/>
			)}

			<RecipesListSection editing={editing} onEdit={setEditing} />
		</div>
	);
}
