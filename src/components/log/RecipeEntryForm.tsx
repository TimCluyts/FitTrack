import {Button} from '../ui/Button';
import {Field} from '../ui/Field';
import {RecipeCombobox} from '../RecipeCombobox';
import {MealSelect} from './MealSelect';
import type {MealTime, Recipe} from '../../types/fitness';

interface RecipeEntryFormProps {
	recipes: Recipe[];
	recipeId: string;
	onRecipeChange: (id: string) => void;
	recipeAmount: string;
	onRecipeAmountChange: (v: string) => void;
	recipeWeight: number;
	mealTime: MealTime;
	onMealChange: (v: MealTime) => void;
	onSubmit: () => void;
	canSubmit: boolean;
}

export function RecipeEntryForm({
	recipes,
	recipeId,
	onRecipeChange,
	recipeAmount,
	onRecipeAmountChange,
	recipeWeight,
	mealTime,
	onMealChange,
	onSubmit,
	canSubmit
}: RecipeEntryFormProps) {
	if (!recipes.length) {
		return (
			<p style={{color: '#718096', fontSize: '14px', margin: 0}}>
				No recipes yet — go to <strong>Recipes</strong> to create some
				first.
			</p>
		);
	}

	return (
		<div
			style={{
				display: 'flex',
				gap: '12px',
				flexWrap: 'wrap',
				alignItems: 'flex-start'
			}}>
			<Field style={{flex: '2 1 200px'}}>
				<Field.Label>Recipe</Field.Label>
				<RecipeCombobox
					recipes={recipes}
					value={recipeId}
					onChange={onRecipeChange}
				/>
			</Field>
			<Field style={{flex: '1 1 120px'}}>
				<Field.Label>Amount (g)</Field.Label>
				<Field.Input
					type="number"
					value={recipeAmount}
					min="1"
					step="10"
					placeholder={
						recipeWeight > 0 ? String(recipeWeight) : 'grams'
					}
					onChange={e => onRecipeAmountChange(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && onSubmit()}
				/>
				{recipeWeight > 0 && (
					<Field.Hint>Full recipe: {recipeWeight}g</Field.Hint>
				)}
			</Field>
			<MealSelect value={mealTime} onChange={onMealChange} />
			<Button
				disabled={!canSubmit}
				onClick={onSubmit}
				style={{alignSelf: 'center', flexShrink: 0}}>
				Add
			</Button>
		</div>
	);
}
