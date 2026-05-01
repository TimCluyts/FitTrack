import {Button} from '../ui/Button';
import {Field} from '../ui/Field';
import {ServingInput} from '../ServingInput';
import {ProductCombobox} from '../ProductCombobox';
import {MealSelect} from './MealSelect';
import type {MealTime, Product} from '../../types/fitness';

interface ProductEntryFormProps {
	products: Product[];
	productId: string;
	onProductChange: (id: string) => void;
	amount: string;
	onAmountChange: (v: string) => void;
	activeProduct: Product | undefined;
	mealTime: MealTime;
	onMealChange: (v: MealTime) => void;
	onSubmit: () => void;
	canSubmit: boolean;
}

export function ProductEntryForm({
	products,
	productId,
	onProductChange,
	amount,
	onAmountChange,
	activeProduct,
	mealTime,
	onMealChange,
	onSubmit,
	canSubmit
}: ProductEntryFormProps) {
	if (!products.length) {
		return (
			<p style={{color: '#718096', fontSize: '14px', margin: 0}}>
				No products yet — go to <strong>Products</strong> to add some
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
				alignItems: 'flex-end'
			}}>
			<Field style={{flex: '2 1 200px'}}>
				<Field.Label>Product</Field.Label>
				<ProductCombobox
					products={products}
					value={productId}
					onChange={onProductChange}
				/>
			</Field>
			<ServingInput
				product={activeProduct}
				value={amount}
				onChange={onAmountChange}
				onEnter={onSubmit}
				style={{flex: '1 1 120px'}}
			/>
			<MealSelect value={mealTime} onChange={onMealChange} />
			<Button
				disabled={!canSubmit}
				onClick={onSubmit}
				style={{alignSelf: 'flex-end', flexShrink: 0}}>
				Add
			</Button>
		</div>
	);
}
