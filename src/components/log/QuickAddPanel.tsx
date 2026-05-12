import {Button} from '../ui/Button';
import {MEAL_TIMES, type MealTime, type Product} from '../../types/fitness';

interface QuickAddPanelProps {
	product: Product | null;
	amount: string;
	onAmountChange: (v: string) => void;
	mealTime: MealTime;
	onMealChange: (v: MealTime) => void;
	onAdd: () => void;
	onCancel: () => void;
}

export function QuickAddPanel({
	product,
	amount,
	onAmountChange,
	mealTime,
	onMealChange,
	onAdd,
	onCancel
}: QuickAddPanelProps) {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateRows: product ? '1fr' : '0fr',
				transition: 'grid-template-rows 0.2s ease'
			}}>
			<div style={{overflow: 'hidden'}}>
				<div
					style={{
						marginTop: '10px',
						background: 'linear-gradient(135deg, #f0f7f4, #e8f4ee)',
						border: '1px solid #b7d9c5',
						borderRadius: '10px',
						padding: '12px 14px'
					}}>
					<div
						style={{
							display: 'flex',
							gap: '8px',
							alignItems: 'center',
							flexWrap: 'wrap'
						}}>
						<span
							style={{
								fontSize: '13px',
								fontWeight: 600,
								color: '#1b4332',
								flexShrink: 0,
								minWidth: '80px'
							}}>
							{product?.name}
						</span>
						<input
							type="number"
							min="0.5"
							step={product?.servingSize ? '0.5' : '1'}
							placeholder={product?.servingSize ? `# ${product.servingLabel ?? 'serving'}` : 'grams'}
							value={amount}
							onChange={e => onAmountChange(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && onAdd()}
							style={{
								width: '110px',
								padding: '8px 10px',
								border: '1px solid #b7d9c5',
								borderRadius: '6px',
								fontSize: '14px',
								outline: 'none',
								fontFamily: 'inherit',
								background: 'white',
								flexShrink: 0
							}}
						/>
						<select
							value={mealTime}
							onChange={e => onMealChange(e.target.value as MealTime)}
							style={{
								flex: '1 1 120px',
								padding: '8px 10px',
								border: '1px solid #b7d9c5',
								borderRadius: '6px',
								fontSize: '14px',
								outline: 'none',
								fontFamily: 'inherit',
								background: 'white',
								cursor: 'pointer'
							}}>
							{MEAL_TIMES.map(m => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</select>
						<Button variant="secondary" onClick={onAdd} disabled={!amount}>
							+ Add
						</Button>
						<Button variant="outline" onClick={onCancel}>
							Cancel
						</Button>
					</div>
					{product?.servingSize ? (
						<div
							style={{
								fontSize: '11px',
								color: '#7aad94',
								marginTop: '5px',
								paddingLeft: '2px'
							}}>
							1 {product.servingLabel ?? 'serving'} = {product.servingSize}g
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
