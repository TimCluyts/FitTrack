import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {MacroInline} from '../MacroInline';
import {useProducts} from '../../hooks/useApi';
import {calcRecipeTotalMacros, calcRecipeTotalWeight} from '../../utils/macros';
import {displayAmount} from '../../utils/serving';
import type {Recipe} from '../../types/fitness';

interface RecipeCardProps {
	recipe: Recipe;
	dimmed?: boolean;
	onEdit: () => void;
	onDelete: () => void;
}

export function RecipeCard({recipe, dimmed, onEdit, onDelete}: RecipeCardProps) {
	const {data: products = []} = useProducts();
	const totalWeight = calcRecipeTotalWeight(recipe);
	const totals = calcRecipeTotalMacros(recipe, products);
	const per100g =
		totalWeight > 0
			? {
					kcal: Math.round((totals.kcal / totalWeight) * 100),
					protein: Math.round((totals.protein / totalWeight) * 1000) / 10,
					fat: Math.round((totals.fat / totalWeight) * 1000) / 10,
					carbs: Math.round((totals.carbs / totalWeight) * 1000) / 10
				}
			: null;

	return (
		<Card style={{opacity: dimmed ? 0.5 : 1}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					flexWrap: 'wrap',
					gap: '10px'
				}}>
				<div>
					<div
						style={{
							fontWeight: 600,
							fontSize: '16px',
							color: '#1b4332',
							marginBottom: '4px'
						}}>
						{recipe.name}
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '6px',
							flexWrap: 'wrap'
						}}>
						<span style={{fontSize: '13px', color: '#718096'}}>
							{recipe.ingredients.length} ingredient
							{recipe.ingredients.length !== 1 ? 's' : ''} ·{' '}
							{totalWeight}g total ·
						</span>
						<MacroInline {...totals} />
					</div>
					{per100g && (
						<div style={{fontSize: '12px', color: '#a0aec0', marginTop: '3px'}}>
							per 100g: {per100g.kcal} kcal · {per100g.protein}g prot ·{' '}
							{per100g.fat}g fat · {per100g.carbs}g carbs
						</div>
					)}
				</div>
				<div style={{display: 'flex', gap: '8px', flexShrink: 0}}>
					<Button variant="outline" size="sm" onClick={onEdit}>
						Edit
					</Button>
					<Button
						variant="outline"
						size="sm"
						style={{color: '#c53030', borderColor: '#fca5a5'}}
						onClick={onDelete}>
						Delete
					</Button>
				</div>
			</div>

			<div
				style={{
					marginTop: '10px',
					paddingTop: '10px',
					borderTop: '1px solid #f0f4f0',
					display: 'flex',
					flexWrap: 'wrap',
					gap: '6px'
				}}>
				{recipe.ingredients.map((ing, i) => {
					const p = products.find(pr => pr.id === ing.productId);
					if (!p) return null;
					return (
						<span
							key={i}
							style={{
								fontSize: '12px',
								background: '#f0f7f4',
								color: '#2d6a4f',
								borderRadius: '4px',
								padding: '3px 8px'
							}}>
							{p.name} — {displayAmount(ing.amount, p)}
						</span>
					);
				})}
			</div>
		</Card>
	);
}
