import {Activity} from 'react';
import {useAddEntry} from '../../hooks/useAddEntry';
import {Card} from '../ui/Card';
import {ModeToggle} from '../ui/ModeToggle';
import {ProductEntryForm} from './ProductEntryForm';
import {RecipeEntryForm} from './RecipeEntryForm';
import {CustomEntryForm} from './CustomEntryForm';

const ADD_MODES = [
	{value: 'product' as const, label: 'Product'},
	{value: 'recipe' as const, label: 'Recipe'},
	{value: 'custom' as const, label: 'Custom'}
] as const;

export function AddEntryCard({date}: Readonly<{date: string}>) {
	const {
		mode,
		setMode,
		productId,
		setProductId,
		amount,
		setAmount,
		recipeId,
		setRecipeId,
		recipeAmount,
		setRecipeAmount,
		recipeWeight,
		mealTime,
		setMealTime,
		activeProduct,
		customFields,
		setCustomField,
		submit,
		products,
		recipes
	} = useAddEntry();

	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '15px',
					marginBottom: '12px',
					color: '#1b4332'
				}}>
				Add Entry
			</div>
			<ModeToggle options={ADD_MODES} value={mode} onChange={setMode} />
			<div style={{marginTop: '14px'}}>
				<Activity mode={mode === 'product' ? 'visible' : 'hidden'}>
					<ProductEntryForm
						products={products}
						productId={productId}
						onProductChange={setProductId}
						amount={amount}
						onAmountChange={setAmount}
						activeProduct={activeProduct}
						mealTime={mealTime}
						onMealChange={setMealTime}
						onSubmit={() => submit(date)}
						canSubmit={!!productId && !!amount}
					/>
				</Activity>
				<Activity mode={mode === 'recipe' ? 'visible' : 'hidden'}>
					<RecipeEntryForm
						recipes={recipes}
						recipeId={recipeId}
						onRecipeChange={setRecipeId}
						recipeAmount={recipeAmount}
						onRecipeAmountChange={setRecipeAmount}
						recipeWeight={recipeWeight}
						mealTime={mealTime}
						onMealChange={setMealTime}
						onSubmit={() => submit(date)}
						canSubmit={!!recipeId && !!recipeAmount}
					/>
				</Activity>
				<Activity mode={mode === 'custom' ? 'visible' : 'hidden'}>
					<CustomEntryForm
						fields={customFields}
						onFieldChange={setCustomField}
						mealTime={mealTime}
						onMealChange={setMealTime}
						onSubmit={() => submit(date)}
						canSubmit={!!customFields.name.trim()}
					/>
				</Activity>
			</div>
		</Card>
	);
}
