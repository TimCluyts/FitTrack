import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';
import {MacroInline} from '../MacroInline';
import {IngredientTable} from './IngredientTable';
import {useRecipeEditor} from '../../hooks/useRecipeEditor';
import type {Recipe, RecipeIngredient} from '../../types/fitness';

interface RecipeEditorProps {
	initial?: Recipe;
	onSave: (name: string, ingredients: RecipeIngredient[]) => void;
	onCancel: () => void;
}

export function RecipeEditor({initial, onSave, onCancel}: RecipeEditorProps) {
	const {
		name,
		setName,
		ingredients,
		addIngredient,
		removeIngredient,
		totals,
		totalWeight,
		canSave
	} = useRecipeEditor(initial);

	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '15px',
					color: '#1b4332',
					marginBottom: '16px'
				}}>
				{initial ? 'Edit Recipe' : 'New Recipe'}
			</div>

			<Field style={{marginBottom: '16px', maxWidth: '380px'}}>
				<Field.Label>Recipe name *</Field.Label>
				<Field.Input
					type="text"
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder="e.g. Pasta Bolognese"
					autoFocus
				/>
			</Field>

			<div
				style={{
					fontWeight: 600,
					fontSize: '13px',
					color: '#2d6a4f',
					textTransform: 'uppercase',
					letterSpacing: '0.04em',
					marginBottom: '10px'
				}}>
				Ingredients
			</div>

			<IngredientTable
				ingredients={ingredients}
				onAdd={addIngredient}
				onRemove={removeIngredient}
			/>

			{ingredients.length > 0 && (
				<div
					style={{
						marginTop: '14px',
						padding: '12px 16px',
						background: '#f0f7f4',
						borderRadius: '6px',
						display: 'flex',
						alignItems: 'center',
						gap: '12px',
						flexWrap: 'wrap'
					}}>
					<span
						style={{
							fontSize: '11px',
							fontWeight: 700,
							color: '#2d6a4f',
							textTransform: 'uppercase',
							letterSpacing: '0.05em'
						}}>
						Recipe total
					</span>
					<span style={{fontSize: '13px', color: '#2d6a4f'}}>
						{totalWeight}g
					</span>
					<MacroInline {...totals} />
				</div>
			)}

			<div style={{marginTop: '16px', display: 'flex', gap: '8px'}}>
				<Button
					disabled={!canSave}
					onClick={() => onSave(name.trim(), ingredients)}>
					Save Recipe
				</Button>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</Card>
	);
}
