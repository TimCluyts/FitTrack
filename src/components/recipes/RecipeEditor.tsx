import {useState} from 'react';
import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';
import {MacroInline} from '../MacroInline';
import {IngredientTable} from './IngredientTable';
import {useNutritionStore} from '../../store/nutritionStore';
import {calcMacros, calcRecipeTotalWeight, sumMacros} from '../../utils/macros';
import {toGrams} from '../../utils/serving';
import type {Recipe, RecipeIngredient} from '../../types/fitness';

interface RecipeEditorProps {
	initial?: Recipe;
	onSave: (name: string, ingredients: RecipeIngredient[]) => void;
	onCancel: () => void;
}

export function RecipeEditor({initial, onSave, onCancel}: RecipeEditorProps) {
	const {products} = useNutritionStore();
	const [name, setName] = useState(initial?.name ?? '');
	const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
		initial?.ingredients ?? []
	);

	const addIngredient = (productId: string, amount: string) => {
		const parsed = parseFloat(amount);
		const product = products.find(p => p.id === productId);
		setIngredients(prev => [
			...prev,
			{productId, amount: toGrams(parsed, product)}
		]);
	};

	const removeIngredient = (idx: number) =>
		setIngredients(prev => prev.filter((_, i) => i !== idx));

	const totals = sumMacros(
		ingredients.map(ing => {
			const p = products.find(pr => pr.id === ing.productId);
			return p
				? calcMacros(p, ing.amount)
				: {kcal: 0, protein: 0, fat: 0, carbs: 0};
		})
	);
	const totalWeight = calcRecipeTotalWeight({id: '', name: '', ingredients});

	const canSave = name.trim().length > 0 && ingredients.length > 0;

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
