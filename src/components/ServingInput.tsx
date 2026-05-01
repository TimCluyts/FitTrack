import type {CSSProperties} from 'react';
import type {Product} from '../types/fitness';
import {Field} from './ui/Field';

interface ServingInputProps {
	product: Product | undefined;
	value: string;
	onChange: (value: string) => void;
	onEnter?: () => void;
	style?: CSSProperties;
}

/**
 * Full labelled amount input — shows "Servings (1 = Xg)" or "Amount (g)" based on product.
 * Use in the log add-entry form.
 */
export function ServingInput({
	product,
	value,
	onChange,
	onEnter,
	style
}: ServingInputProps) {
	const hasServing = !!(product?.servingSize && product.servingSize > 0);
	const servingSize = product?.servingSize ?? 1;

	return (
		<Field style={style}>
			<Field.Label>
				{hasServing ? `Servings (1 = ${servingSize}g)` : 'Amount (g)'}
			</Field.Label>
			<Field.Input
				type="number"
				value={value}
				min="0.5"
				step={hasServing ? '0.5' : '1'}
				placeholder={hasServing ? '1' : '100'}
				onChange={e => onChange(e.target.value)}
				onKeyDown={e => e.key === 'Enter' && onEnter?.()}
			/>
		</Field>
	);
}

/**
 * Compact amount input without label — shows placeholder and serving hint below.
 * Use inside tables (e.g. ingredient editor).
 */
export function IngredientAmountInput({
	product,
	value,
	onChange,
	onEnter
}: Omit<ServingInputProps, 'style'>) {
	const hasServing = !!(product?.servingSize && product.servingSize > 0);
	const servingSize = product?.servingSize ?? 1;
	const servingLabel = product?.servingLabel ?? 'serving';

	return (
		<div>
			<Field.Input
				type="number"
				value={value}
				min="0.5"
				step={hasServing ? '0.5' : '1'}
				placeholder={hasServing ? `# ${servingLabel}` : 'grams'}
				onChange={e => onChange(e.target.value)}
				onKeyDown={e => e.key === 'Enter' && onEnter?.()}
			/>
			{hasServing && (
				<Field.Hint>
					1 {servingLabel} = {servingSize}g
				</Field.Hint>
			)}
		</div>
	);
}
